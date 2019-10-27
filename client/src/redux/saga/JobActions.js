// Global imports
import axios from 'axios';

// Import Redux Saga methods
import { put, call, all, takeLeading } from 'redux-saga/effects';

// Import actions & action types
import { GET_JOBS } from '../actions/types';
import { jobsLoaded, jobError } from '../actions';

export function* getJobsSaga() {
  try {
    const res = yield call(axios.get, '/api/jobs');
    yield put(jobsLoaded(res.data));
  } catch (err) {
    yield put(jobError({ msg: err.response.statusText, status: err.response.status }));
  }
}

export default function* watchAction() {
  yield all([takeLeading(GET_JOBS, getJobsSaga)]);
}
