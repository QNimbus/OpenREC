// Global imports
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  recordedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  item: {
    type: String,
    required: true
  },
  payload: {
    type: Object,
    required: true
  },
  eventLog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventLog'
  }
});

const eventLogFilter = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      dropDups: true,
      required: true
    },
    description: {
      type: String,
      unique: false,
      dropDups: false,
      required: false
    },
    filter: {
      type: {
        all: {
          type: Boolean,
          default: false
        },
        groups: {
          type: [String],
          default: []
        },
        items: {
          type: [String],
          default: []
        },
        types: {
          type: [String],
          default: []
        }
      }
    }
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const eventLogSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      dropDups: true,
      required: true
    },
    description: {
      type: String,
      unique: false,
      dropDups: false,
      required: false
    },
    recording: {
      type: Boolean,
      required: true,
      default: false
    },
    playback: {
      type: Boolean,
      required: true,
      default: false
    },
    start: {
      type: Date
    },
    end: {
      type: Date
    },
    filters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventLogFilter'
      }
    ]
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

eventLogSchema.virtual('duration').get(function() {
  return this.getDuration();
});

eventLogSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'eventLog'
});

eventLogSchema.methods.getDuration = function() {
  if (this.start && this.end && !this.recording) {
    return this.end - this.start;
  } else {
    return undefined;
  }
};

eventLogSchema.methods.removeEvents = async function() {
  const eventLog = this.id;
  return await Event.deleteMany({ eventLog });
};

eventLogSchema.methods.logEvent = async function(data) {
  if (this.recording) {
    const { item, payload } = data;

    if (
      this.filters.length === 0 ||
      this.filters.some(({ filter }) => {
        if (filter.all) {
          return (
            (filter.groups && filter.groups.length > 0 ? filter.groups.every(group => item.groupNames.includes(group)) : true) &&
            (filter.types && filter.types.length > 0 ? filter.types.includes(item.type) : true) &&
            (filter.items && filter.items.length > 0 ? filter.items.includes(item.name) : true)
          );
        } else {
          return (
            (filter.groups && filter.groups.length > 0 ? filter.groups.some(group => item.groupNames.includes(group)) : true) ||
            (filter.types && filter.types.length > 0 ? filter.types.includes(item.type) : true) ||
            (filter.items && filter.items.length > 0 ? filter.items.includes(item.name) : true)
          );
        }
      })
    ) {
      const event = new Event({ item: item.name, payload, eventLog: this.id });
      event.save();
    }
  }
};

const Event = mongoose.model('Event', eventSchema, 'Event');
const EventLog = mongoose.model('EventLog', eventLogSchema, 'EventLog');
const EventLogFilter = mongoose.model('EventLogFilter', eventLogFilter, 'EventLogFilter');

module.exports = { EventLog, EventLogFilter };
