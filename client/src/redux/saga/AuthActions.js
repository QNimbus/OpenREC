// Import Redux Saga methods
import { takeEvery, call, put, all } from 'redux-saga/effects';

// Global imports
import axios from 'axios';

// Import actions & action types
import { REGISTER, LOGIN, LOAD_USER } from '../actions/types';
import {
    registerSuccess,
    registerFail,
    loginSuccess,
    loginFail,
    userLoaded,
    authError,
    setAlert,
    loadUser
} from '../actions';

// Import utility method
import setAuthToken from '../../utils/setAuthToken';

function* registerSaga({ payload }) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ ...payload });

    try {
        const res = yield call(axios.post, '/api/users', body, config);
        yield put(registerSuccess(res.data.token));
        yield put(loadUser());
        yield put(setAlert('User registered', 'success'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
        }
        yield put(registerFail());
    }
}

function* loginSaga({ payload }) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ ...payload });

    try {
        const res = yield call(axios.post, '/api/auth', body, config);
        yield put(loginSuccess(res.data.token));
        yield put(loadUser());
        yield put(setAlert('Login success', 'success'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            yield all(errors.map(error => put(setAlert(error.msg, 'danger'))));
        }
        yield put(loginFail());
    }
}

function* loadUserSaga() {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = yield call(axios.get, '/api/auth');
        yield put(userLoaded(res.data));
    } catch (err) {
        yield put(authError());
    }
}

export default function* watchAction() {
    yield all([takeEvery(REGISTER, registerSaga), takeEvery(LOGIN, loginSaga), takeEvery(LOAD_USER, loadUserSaga)]);
}
