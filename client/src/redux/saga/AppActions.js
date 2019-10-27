// Import Redux Saga methods
import { take, put } from 'redux-saga/effects';

// Import action types
import { getEventlogs, getFilters, getJobs } from '../actions';
import { GET_ALL } from '../actions/types';

export default function* watchAction() {
  while (true) {
    yield take(GET_ALL);
    yield put(getEventlogs());
    yield put(getFilters());
    yield put(getJobs());
  }
}
