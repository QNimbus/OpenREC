// Global imports
const EventSource = require('eventsource');
const EventEmitter = require('events');
const Schedule = require('node-schedule');
const request = require('request-promise-native');
const uuid = require('uuid/v4');
const defaults = require('lodash.defaults');

// Local imports
const config = require('config');
const { EventLog, EventLogFilter } = require('../models/EventLog');

// Constants
const TWENTY_FOUR_HOURS = 24 * 3600 * 1000;

class OpenHABRecorder extends EventEmitter {
  constructor(host = 'localhost', port = 8080) {
    super();

    ({ port: this.port, host: this.host } = { host, port });
    this.url = `http://${host}:${port}`;
    this.connected = false;
    this.recording = false;
    this.initialized = false;

    this.items = {};
    this.groups = {};
    this.jobs = {};
    this.eventLogListeners = {};
    this.eventSource = undefined;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    if (this.isConnected()) {
      this.dispose();
    }

    try {
      // Get all items from OpenHAB
      const items = await request({
        url: `${this.url}/rest/items`,
        method: 'GET',
        json: true,
        headers: { 'User-Agent': 'node.js' }
      });

      items.forEach(item => {
        if (item.hasOwnProperty('members')) {
          this.groups[item.name] = item;
        } else {
          this.items[item.name] = item;
        }
      });

      this.connect();

      this.initialized = true;
    } catch (err) {
      console.error(err.message);
    }
  }

  connect() {
    // Setup EventSource
    this.eventSource = new EventSource(`${this.url}/rest/events`, {});

    this.eventSource.onopen = this.sseOpen.bind(this);
    this.eventSource.onerror = this.sseError.bind(this);
  }

  disconnect() {
    if (this.eventSource) {
      ['onerror', 'onmessage', 'onopen'].forEach(eventHandler => {
        this.eventSource[eventHandler] = null;
      });
      this.eventSource.close();
    }
    this.eventLogListeners = {};
    this.connected = false;
    this.recording = false;
  }

  async dispose() {
    this.removeAllListeners();
    this.disconnect();
  }

  // Recorder methods

  async startRecording(id, options = {}) {
    let eventLog;
    try {
      eventLog = await EventLog.findById(id).populate('filters');
    } catch (error) {
      throw new Error(`Invalid eventlog ID: ${id}`);
    }

    if (!eventLog) {
      throw new Error(`Eventlog not found: ${id}`);
    }

    if (await this.isPlaying()) {
      throw new Error(`Playback in progress`);
    }

    if (eventLog.recording) {
      throw new Error(`Eventlog is already recording`);
    }

    options = defaults(options, {
      autoStopRecording: true,
      duration: TWENTY_FOUR_HOURS
    });

    if (this.isConnected()) {
      if (!(await this.isRecording())) {
        this.eventSource.onmessage = this.sseMessage.bind(this);
      }

      // Schedule end of recording
      if (options.autoStopRecording) {
        const id = uuid();
        const scheduleStop = new Date(Date.now() + options.duration);
        const job = createJob(
          scheduleStop,
          timestamp => {
            // Emit 'JOB_UPDATED' event
            this.emit('JOB_UPDATED', { id, ...this.getJobData(this.jobs[id]) });
            this.stopRecording.call(this, eventLog.id);
          },
          `Stop recording`
        );

        // Add job to pending jobs array
        if (job) {
          this.jobs[id] = { eventLog: eventLog.id, ...job };

          // Emit 'JOB_ADDED' event
          this.emit('JOB_ADDED', { id, ...this.getJobData(this.jobs[id]) });
        }
      }

      // Remove previously recorded events
      await eventLog.removeEvents();

      // Attach eventlog listener
      this.eventLogListeners[eventLog.name] = eventLog.logEvent.bind(eventLog);

      // Modify model
      eventLog.recording = true;
      eventLog.start = Date.now();
      eventLog.end = null;

      // Save model
      await eventLog.save();

      // Emit event
      this.emit('EVENTLOG_UPDATED', eventLog);
    } else {
      throw new Error(`OpenREC is not connected to OpenHAB REST API`);
    }
    return eventLog;
  }

  async stopRecording(id) {
    let eventLog;
    try {
      eventLog = await EventLog.findById(id)
        .populate('events')
        .populate('filters');
    } catch (error) {
      throw new Error(`Invalid eventlog ID: ${id}`);
    }

    if (!eventLog) {
      throw new Error(`Eventlog not found: ${id}`);
    }

    if (!eventLog.recording) {
      throw new Error(`Eventlog is not recording`);
    }

    if (this.isConnected()) {
      // Remove eventlog listener
      delete this.eventLogListeners[eventLog.name];

      // Modify model
      eventLog.recording = false;
      eventLog.end = Date.now();

      // Save model
      await eventLog.save();

      // Emit event
      this.emit('EVENTLOG_UPDATED', eventLog);

      // Cancel & remove remaining jobs
      Object.entries(this.jobs).forEach(([id, job]) => {
        if (job && job.eventLog === eventLog.id) {
          this.emit('JOB_REMOVED', { id, ...this.getJobData(job) });
          job.cancel();

          // Remove jobs repository for eventlog
          delete this.jobs[id];
        }
      });

      if (!(await this.isRecording())) {
        this.eventSource.onmessage = null;
      }
    } else {
      throw new Error(`OpenREC is not connected to OpenHAB REST API`);
    }
    return eventLog;
  }

  async startPlayback(id, options = {}) {
    let playback = false;
    let eventLog;
    try {
      eventLog = await EventLog.findById(id)
        .populate('events')
        .populate('filters');
    } catch (error) {
      throw new Error(`Invalid eventlog ID: ${id}`);
    }

    if (!eventLog) {
      throw new Error(`Eventlog not found: ${id}`);
    }

    if (await this.isRecording()) {
      throw new Error(`Recording in progress`);
    }

    if (await this.isPlaying()) {
      throw new Error(`Playback in progress`);
    }

    options = defaults(options, {
      immediate: true,
      offset: 5000,
      daily: false
    });

    if (this.isConnected()) {
      const events = eventLog.events;
      const now = Date.now();
      const midnight = new Date().setHours(0, 0, 0, 0);
      const start = eventLog.start;
      const baseTimestamp = !options.immediate ? midnight : now;
      const offsetFromMidnight = !options.immediate ? new Date(start).setHours(0, 0, 0, 0) : new Date(start);
      const scheduleStop = new Date(baseTimestamp + (start - offsetFromMidnight) + options.offset + eventLog.getDuration());

      events.forEach(async event => {
        const id = uuid();
        const scheduleTime = new Date(baseTimestamp + (event.recordedAt - offsetFromMidnight) + options.offset);
        const job = createJob(
          scheduleTime,
          timestamp => {
            // Emit 'JOB_UPDATED' event
            this.emit('JOB_UPDATED', { id, ...this.getJobData(this.jobs[id]) });
            executeTask.call(null, timestamp, event);
          },
          `${event.item}:${event.payload.value}`,
          options.daily
        );

        // Add job to pending jobs array
        if (job) {
          this.jobs[id] = { eventLog: eventLog.id, ...job };

          // Emit 'JOB_ADDED' event
          this.emit('JOB_ADDED', { id, ...this.getJobData(this.jobs[id]) });

          // Set eventlog playback state to 'true'
          playback = true;
        }
      });

      if (playback) {
        // Modify model
        eventLog.playback = true;

        // Save model
        await eventLog.save();

        // Emit 'EVENTLOG_UPDATED' event
        this.emit('EVENTLOG_UPDATED', eventLog);

        // Schedule end of playback
        if (!options.daily) {
          const id = uuid();
          const job = createJob(
            scheduleStop,
            timestamp => {
              // Emit 'JOB_UPDATED' event
              this.emit('JOB_UPDATED', { id, ...this.getJobData(this.jobs[id]) });
              this.stopPlayback.call(this, eventLog.id);
            },
            `Stop playback`
          );

          // Add job to pending jobs array
          if (job) {
            this.jobs[id] = { eventLog: eventLog.id, ...job };

            // Emit 'JOB_ADDED' event
            this.emit('JOB_ADDED', { id, ...this.getJobData(this.jobs[id]) });
          }
        }
      }
    } else {
      throw new Error(`OpenREC is not connected to OpenHAB REST API`);
    }
    return eventLog;
  }

  async stopPlayback(id) {
    let eventLog;
    try {
      eventLog = await EventLog.findById(id)
        .populate('events')
        .populate('filters');
    } catch (error) {
      throw new Error(`Invalid eventlog ID: ${id}`);
    }

    if (!eventLog) {
      throw new Error(`Eventlog not found: ${id}`);
    }

    if (!eventLog.playback) {
      throw new Error(`Eventlog is not playing back`);
    }

    if (this.isConnected()) {
      // Cancel & remove remaining jobs
      Object.entries(this.jobs).forEach(([id, job]) => {
        if (job.eventLog === eventLog.id) {
          this.emit('JOB_REMOVED', { id, ...this.getJobData(job) });
          job.cancel();

          // Remove jobs repository for eventlog
          delete this.jobs[id];
        }
      });

      // Modify model
      eventLog.playback = false;

      // Save model
      await eventLog.save();

      // Emit event
      this.emit('EVENTLOG_UPDATED', eventLog);
    } else {
      throw new Error(`OpenREC is not connected to OpenHAB REST API`);
    }
    return eventLog;
  }

  async removeEventLog(id) {
    let eventLog;
    try {
      eventLog = await EventLog.findById(id);
    } catch (error) {
      throw new Error(`Invalid eventlog ID: ${id}`);
    }

    if (!eventLog) {
      throw new Error(`Eventlog not found: ${id}`);
    }

    if (!eventLog.recording) {
      // Remove previously recorded events
      await eventLog.removeEvents();

      // Delete model
      await eventLog.remove();

      // Emit event
      this.emit('EVENTLOG_REMOVED', eventLog);
    } else {
      throw new Error(`Eventlog is currently recording`);
    }
    return eventLog;
  }

  async removeEventLogFilter(id) {
    let eventLogFilter;
    try {
      EventLogFilter = await EventLogFilter.findById(id);
    } catch (error) {
      throw new Error(`Invalid eventlog filter ID: ${id}`);
    }

    if (!eventLogFilter) {
      throw new Error(`Eventlog filter not found: ${id}`);
    }

    // Delete model
    await eventLogFilter.remove();

    return eventLogFilter;
  }

  async createEventLog(name, description = '', filters = []) {
    let eventLog = await EventLog.findOne({ name });

    if (eventLog) {
      throw new Error(`Eventlog already exists: ${name}`);
    }

    eventLog = new EventLog({ name, description });
    for (const filterName of filters) {
      const filter = await EventLogFilter.findOne({ name: filterName });
      if (filter) {
        eventLog.filters.push(filter);
      }
    }

    // Save new model
    await eventLog.save();

    // Emit event
    await eventLog.populate('filters').execPopulate();
    this.emit('EVENTLOG_ADDED', eventLog);

    return eventLog;
  }

  async updateEventLog(id, name = null, description = null, filters = null) {
    let eventLog;
    try {
      eventLog = await EventLog.findById(id);
    } catch (error) {
      throw new Error(`Invalid eventlog ID: ${id}`);
    }

    if (!eventLog) {
      throw new Error(`Eventlog not found: ${id}`);
    }

    eventLog.name = name !== null ? name : eventLog.name;
    eventLog.description = description !== null ? description : eventLog.description;
    eventLog.filters = filters !== null ? [] : eventLog.filters;

    if (filters !== null) {
      for (const id of filters) {
        const filter = await EventLogFilter.findById(id);
        if (filter) {
          eventLog.filters.push(filter);
        }
      }
    }

    // Save new model
    await eventLog.save();

    // Emit event
    await eventLog
      .populate('events')
      .populate('filters')
      .execPopulate();
    this.emit('EVENTLOG_UPDATED', eventLog);

    return eventLog;
  }

  async createEventLogFilter(name, description = '', filter = {}) {
    let eventLogFilter = await EventLogFilter.findOne({ name });

    if (eventLogFilter) {
      throw new Error(`Eventlog filter already exists: ${name}`);
    }

    eventLogFilter = new EventLogFilter({ name, description, filter });

    // Save new model
    await eventLogFilter.save();

    return eventLogFilter;
  }

  async updateEventLogFilter(id, name = null, description = null, filter = null) {
    let eventLogFilter;

    try {
      eventLogFilter = await EventLogFilter.findById(id);
    } catch (error) {
      throw new Error(`Invalid filter ID: ${id}`);
    }

    if (!eventLogFilter) {
      throw new Error(`Eventlog filter not found: ${id}`);
    }

    eventLogFilter.name = name !== null ? name : eventLogFilter.name;
    eventLogFilter.description = description !== null ? description : eventLogFilter.description;
    eventLogFilter.filter = filter !== null ? filter : eventLogFilter.filter;

    // Save new model
    await eventLogFilter.save();

    return eventLogFilter;
  }

  async getEventLogFilters() {
    const eventLogFilters = await EventLogFilter.find();

    return eventLogFilters;
  }

  async getEventLogs() {
    const eventLogs = await EventLog.find()
      .populate('events')
      .populate('filters');

    // return eventLogs.map(eventLog => {
    //   return { jobs: this.getJobs(eventLog.id), ...eventLog.toObject() };
    // });
    return eventLogs;
  }

  async getEventLog(id) {
    let eventLog;
    try {
      eventLog = await EventLog.findById(id);
    } catch (error) {
      throw new Error(`Invalid eventlog ID: ${id}`);
    }

    if (!eventLog) {
      throw new Error(`Eventlog not found: ${id}`);
    }

    return eventLog;
  }

  // Helper methods

  getJobData = job => ({ name: job.name, eventLog: job.eventLog, nextInvocation: job.nextInvocation(), pendingInvocations: job.pendingInvocations().length });

  // SSE Methods

  sseOpen(event) {
    this.connected = true;

    this.emit('connected');
  }

  sseMessage(message) {
    const data = JSON.parse(message.data, (key, value) => {
      if (key === 'payload') {
        return JSON.parse(value);
      } else {
        return value;
      }
    });
    const { 2: itemName } = data.topic.split('/');

    switch (data.type) {
      case 'ItemStateChangedEvent': {
        const item = this.items[itemName];

        Object.values(this.eventLogListeners).map(listener => listener({ item, payload: data.payload }));
        break;
      }
      default: {
        // Ignore other events
      }
    }
  }

  sseError(error) {
    console.error(`SSE Error: `, error);
  }

  // Instance methods/accessors

  isConnected() {
    return this.connected;
  }

  async getStatus() {
    return { connected: this.isConnected(), recording: await this.isRecording(), playback: await this.isPlaying() };
  }

  async isRecording() {
    const eventLogs = await EventLog.find({ recording: true });
    return eventLogs.length > 0;
  }

  async isPlaying() {
    const eventLogs = await EventLog.find({ playback: true });
    return eventLogs.length > 0;
  }

  getItems() {
    return Object.keys(this.items);
  }

  getGroups() {
    return Object.keys(this.groups);
  }

  getJobs = eventLog => {
    let jobs = {};

    Object.entries(this.jobs).forEach(([id, job]) => {
      if (!eventLog || job.eventLog === eventLog) {
        jobs[id] = { id, ...this.getJobData(job) };
      }
    });

    return jobs;
  };
}

const getRecurrenceProperties = (timestamp, daily = false) => {
  const recurrence = {
    hour: timestamp.getHours(),
    minute: timestamp.getMinutes(),
    second: timestamp.getSeconds()
  };

  !daily && (recurrence.date = timestamp.getDate()) && (recurrence.month = timestamp.getMonth()) && (recurrence.year = timestamp.getFullYear());

  return recurrence;
};

const createJob = (timestamp, task, taskName = '', daily = false) => Schedule.scheduleJob(taskName, getRecurrenceProperties(timestamp, daily), task);

const executeTask = async (timestamp, event) => {
  // Debug log for executing task
  console.debug(`${timestamp} :: ${event.item} -> ${event.payload.value}`);

  return request({
    url: `http://rancher.home.besqua.red:18080/rest/items/${event.item}`,
    method: 'POST',
    headers: { 'User-Agent': 'node.js', 'Content-Type': 'text/plain', Accept: 'application/json' },
    body: event.payload.value
  });
};

module.exports = new OpenHABRecorder(config.get('openHABHost'), config.get('openHABPort'));
