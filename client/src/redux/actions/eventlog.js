// Import action types
import {
  GET_EVENTLOGS,
  ADD_EVENTLOG,
  EVENTLOGS_LOADED,
  EVENTLOG_ERROR,
  REMOVE_EVENTLOG,
  STARTRECORD_EVENTLOG,
  STOPRECORD_EVENTLOG,
  STARTPLAYBACK_EVENTLOG,
  STOPPLAYBACK_EVENTLOG,
  EVENTLOG_UPDATED,
  EVENTLOG_ADDED,
  EVENTLOG_REMOVED
} from './types';

export const getEventlogs = () => ({
  type: GET_EVENTLOGS
});

export const addEventlog = (name, description) => ({
  type: ADD_EVENTLOG,
  payload: {
    name,
    description
  }
});

export const removeEventlog = id => ({
  type: REMOVE_EVENTLOG,
  payload: {
    id
  }
});

export const eventlogsLoaded = payload => ({
  type: EVENTLOGS_LOADED,
  payload
});

export const startRecordEventlog = (id, autoStopRecording, duration) => ({
  type: STARTRECORD_EVENTLOG,
  payload: {
    id,
    autoStopRecording,
    duration
  }
});

export const stopRecordEventlog = id => ({
  type: STOPRECORD_EVENTLOG,
  payload: {
    id
  }
});

export const startPlaybackEventlog = (id, immediate, offset, daily) => ({
  type: STARTPLAYBACK_EVENTLOG,
  payload: {
    id,
    immediate,
    offset,
    daily
  }
});

export const stopPlaybackEventlog = id => ({
  type: STOPPLAYBACK_EVENTLOG,
  payload: {
    id
  }
});

export const eventlogUpdated = payload => ({
  type: EVENTLOG_UPDATED,
  payload
});

export const eventlogAdded = payload => ({
  type: EVENTLOG_ADDED,
  payload
});

export const eventlogRemoved = payload => ({
  type: EVENTLOG_REMOVED,
  payload
});

export const eventlogError = payload => ({
  type: EVENTLOG_ERROR,
  payload
});
