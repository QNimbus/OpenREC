// Import Redux Saga methods
import { takeEvery, call, put } from 'redux-saga/effects';
import { removeAlert } from '../actions';

// Import action types
import { SET_ALERT } from '../actions/types';

// Helper method
const delay = ms =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });

function* workerSaga({ payload }) {
    const { timeout } = payload;

    yield call(delay, timeout ? timeout : 5000);
    yield put(removeAlert(payload.id));
}

export default function* watchAction() {
    yield takeEvery(SET_ALERT, workerSaga);
}
