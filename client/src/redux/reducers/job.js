// Import action types
import { GET_JOBS, JOBS_LOADED, JOB_ADDED, JOB_REMOVED, JOB_UPDATED } from '../actions/types';

// Import reducer utility
import { createReducer } from './utils';

// Initial state

const initialState = {
  jobs: {},
  loading: true,
  error: {}
};

// Jobs reducer methods

function getJobs(state, action) {
  return { ...state, loading: true, error: {} };
}

function jobsLoaded(state, action) {
  const { payload } = action;
  return { ...state, jobs: payload, loading: false, error: {} };
}

function jobAdded(state, action) {
  const { payload } = action;
  return { ...state, jobs: { ...state.jobs, [payload.id]: payload } };
}

function jobRemoved(state, action) {
  const { payload } = action;
  const { [payload.id]: removedItem, ...newJobs } = state.jobs;
  return { ...state, jobs: { ...newJobs } };
}

function jobUpdated(state, action) {
  const { payload } = action;
  return { ...state, jobs: { ...state.jobs, [payload.id]: payload } };
}

// Export reducer

export default createReducer(initialState, {
  [GET_JOBS]: getJobs,
  [JOBS_LOADED]: jobsLoaded,
  [JOB_ADDED]: jobAdded,
  [JOB_REMOVED]: jobRemoved,
  [JOB_UPDATED]: jobUpdated
});
