// Import action types
import { GET_JOBS, JOBS_LOADED, JOB_ADDED, JOB_REMOVED, JOB_UPDATED, JOB_ERROR } from './types';

export const getJobs = () => ({
  type: GET_JOBS
});

export const jobAdded = payload => ({
  type: JOB_ADDED,
  payload
});

export const jobsLoaded = payload => ({
  type: JOBS_LOADED,
  payload
});

export const jobRemoved = payload => ({
  type: JOB_REMOVED,
  payload
});

export const jobUpdated = payload => ({
  type: JOB_UPDATED,
  payload
});

export const jobError = payload => ({
  type: JOB_ERROR,
  payload
});
