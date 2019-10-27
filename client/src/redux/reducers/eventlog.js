// Import action types
import { GET_EVENTLOGS, EVENTLOGS_LOADED, EVENTLOG_ERROR, EVENTLOG_UPDATED, EVENTLOG_ADDED, EVENTLOG_REMOVED } from '../actions/types';

// Import reducer utility
import { createReducer, arrayToObject } from './utils';

// Initial state

const initialState = {
  eventlogs: null,
  loading: true,
  error: {}
};

// Eventlog reducer methods

function getEventlogs(state, action) {
  return { ...state, loading: true, error: {} };
}

function eventlogsLoaded(state, action) {
  const { payload } = action;
  const eventlogs = arrayToObject(payload, 'id');
  return { ...state, eventlogs, loading: false, error: {} };
}

function eventlogUpdated(state, action) {
  const { payload } = action;
  return {
    ...state,
    eventlogs: {
      ...state.eventlogs,
      [payload.id]: {
        ...payload,
        // jobs: payload.jobs ? payload.jobs : [],
        filters: payload.filters ? payload.filters : [],
        events: payload.events ? payload.events : []
      }
    }
  };
}

function eventlogAdded(state, action) {
  const { payload } = action;
  return {
    ...state,
    eventlogs: {
      ...state.eventlogs,
      [payload.id]: {
        ...payload,
        // jobs: payload.jobs ? payload.jobs : [],
        filters: payload.filters ? payload.filters : [],
        events: payload.events ? payload.events : []
      }
    }
  };
}

function eventlogRemoved(state, action) {
  const { payload } = action;
  const { [payload.id]: removedItem, ...newEventlogs } = state.eventlogs;
  return { ...state, eventlogs: { ...newEventlogs } };
}

function eventlogError(state, action) {
  const { payload } = action;
  return { ...state, error: payload };
}

// Export reducer

export default createReducer(initialState, {
  [GET_EVENTLOGS]: getEventlogs,
  [EVENTLOGS_LOADED]: eventlogsLoaded,
  [EVENTLOG_UPDATED]: eventlogUpdated,
  [EVENTLOG_ADDED]: eventlogAdded,
  [EVENTLOG_REMOVED]: eventlogRemoved,
  [EVENTLOG_ERROR]: eventlogError
});
