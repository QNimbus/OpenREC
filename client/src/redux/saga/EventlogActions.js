// Global imports
import axios from 'axios';

// Import Redux Saga methods
import { put, call, all, takeLatest, takeLeading } from 'redux-saga/effects';

// Import actions & action types
import {
  GET_EVENTLOGS,
  ADD_EVENTLOG,
  REMOVE_EVENTLOG,
  STARTRECORD_EVENTLOG,
  STOPRECORD_EVENTLOG,
  STARTPLAYBACK_EVENTLOG,
  STOPPLAYBACK_EVENTLOG
} from '../actions/types';
import { setAlert, eventlogsLoaded, eventlogError } from '../actions';

function* getEventlogsSaga() {
  try {
    const res = yield call(axios.get, '/api/eventlogs');
    yield put(eventlogsLoaded(res.data));
  } catch (err) {
    yield put(eventlogError({ msg: err.response.statusText, status: err.response.status }));
  }
}
function* addEventlogSaga({ payload }) {
  const body = JSON.stringify({ ...payload });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    yield call(axios.post, '/api/eventlogs', body, config);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
    }
    yield put(eventlogError({ msg: err.response.statusText, status: err.response.status }));
  }
}

function* startRecordEventlogSaga({ payload }) {
  const body = JSON.stringify({ ...payload });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    yield call(axios.post, '/api/eventlogs/startRecording', body, config);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
    }
    yield put(eventlogError({ msg: err.response.statusText, status: err.response.status }));
  }
}

function* stopRecordEventlogSaga({ payload }) {
  const body = JSON.stringify({ ...payload });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    yield call(axios.post, '/api/eventlogs/stopRecording', body, config);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
    }
    yield put(eventlogError({ msg: err.response.statusText, status: err.response.status }));
  }
}

function* startPlaybackEventlogSaga({ payload }) {
  const body = JSON.stringify({ ...payload });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    yield call(axios.post, '/api/eventlogs/play', body, config);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
    }
    yield put(eventlogError({ msg: err.response.statusText, status: err.response.status }));
  }
}

function* stopPlaybackEventlogSaga({ payload }) {
  const body = JSON.stringify({ ...payload });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    yield call(axios.post, '/api/eventlogs/stop', body, config);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
    }
    yield put(eventlogError({ msg: err.response.statusText, status: err.response.status }));
  }
}

// function* eventlogUpdatedSaga({ payload }) {

// }

function* removeEventlogSaga({ payload }) {
  const body = JSON.stringify({ ...payload });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  };

  try {
    yield call(axios.delete, '/api/eventlogs', config);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
    }
    yield put(eventlogError({ msg: err.response.statusText, status: err.response.status }));
  }
}

export default function* watchAction() {
  yield all([
    takeLeading(GET_EVENTLOGS, getEventlogsSaga),
    takeLeading(STARTRECORD_EVENTLOG, startRecordEventlogSaga),
    takeLeading(STOPRECORD_EVENTLOG, stopRecordEventlogSaga),
    takeLatest(ADD_EVENTLOG, addEventlogSaga),
    takeLatest(REMOVE_EVENTLOG, removeEventlogSaga),
    takeLatest(STARTPLAYBACK_EVENTLOG, startPlaybackEventlogSaga),
    takeLatest(STOPPLAYBACK_EVENTLOG, stopPlaybackEventlogSaga)
  ]);
}
