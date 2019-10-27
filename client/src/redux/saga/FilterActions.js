// Global imports
import axios from 'axios';

// Import Redux Saga methods
import { put, call, all, takeLeading } from 'redux-saga/effects';

// Import actions & action types
import { GET_FILTERS } from '../actions/types';
import { filtersLoaded, filterError } from '../actions';

export function* getFiltersSaga() {
    try {
        const res = yield call(axios.get, '/api/filters');
        yield put(filtersLoaded(res.data));
    } catch (err) {
        yield put(filterError({ msg: err.response.statusText, status: err.response.status }));
    }
}

export default function* watchAction() {
    yield all([takeLeading(GET_FILTERS, getFiltersSaga)]);
}
