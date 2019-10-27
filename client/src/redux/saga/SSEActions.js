// Import EventSource
import EventSource from 'eventsource';

// Import Redux Saga methods
import { eventChannel } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';

// Import actions & action types
import { EVENTLOG_UPDATED, EVENTLOG_ADDED, EVENTLOG_REMOVED, JOB_ADDED, JOB_REMOVED, JOB_UPDATED } from '../actions/types';
import { eventlogUpdated, eventlogAdded, eventlogRemoved, jobAdded, jobRemoved, jobUpdated } from '../actions';

function createSSEChannel(eventsource) {
  return eventChannel(emit => {
    const onmessage = message => {
      emit(JSON.parse(message.data));
    };

    const onopen = message => {
      //
    };

    const onerror = error => {
      emit(new Error(error));
    };

    const unsubscribe = () => {
      eventsource.close();
    };

    eventsource.onmessage = onmessage;
    eventsource.onerror = onerror;
    eventsource.onopen = onopen;

    return unsubscribe;
  });
}

export default function* listenForEvents() {
  const eventsourceChannel = yield call(createSSEChannel, new EventSource('http://localhost:5000/api/events', {}));

  while (true) {
    try {
      const payload = yield take(eventsourceChannel);
      switch (payload.type) {
        case EVENTLOG_UPDATED: {
          yield put(eventlogUpdated(payload.data));
          break;
        }
        case EVENTLOG_ADDED: {
          yield put(eventlogAdded(payload.data));
          break;
        }
        case EVENTLOG_REMOVED: {
          yield put(eventlogRemoved(payload.data));
          break;
        }
        case JOB_ADDED: {
          yield put(jobAdded(payload.data));
          break;
        }
        case JOB_REMOVED: {
          yield put(jobRemoved(payload.data));
          break;
        }
        case JOB_UPDATED: {
          yield put(jobUpdated(payload.data));
          break;
        }
        default: {
          // Do nothing
        }
      }
    } catch (error) {
      console.error(error);
      eventsourceChannel.close();
    }
  }
}
