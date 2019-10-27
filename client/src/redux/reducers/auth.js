// Import action types
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    USER_LOADED,
    AUTH_ERROR,
    LOAD_USER
} from '../actions/types';

// Import reducer utility
import { createReducer } from './utils';

// Initial state

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null
};

// Auth reducer methods
function loadUser(state, action) {
    return {
        ...state,
        isAuthenticated: false,
        loading: true,
        user: null
    };
}

function userLoaded(state, action) {
    const { payload } = action;
    return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
    };
}

function login(state, action) {
    const { payload } = action;
    localStorage.setItem('token', payload.token);
    return {
        ...state,
        ...payload,
        isAuthenticated: true
    };
}

function logout(state, action) {
    localStorage.removeItem('token');
    return {
        ...state,
        token: null,
        loading: false,
        isAuthenticated: false
    };
}

// Export reducer

export default createReducer(initialState, {
    [LOAD_USER]: loadUser,
    [USER_LOADED]: userLoaded,
    [LOGIN_SUCCESS]: login,
    [REGISTER_SUCCESS]: login,
    [AUTH_ERROR]: logout,
    [LOGIN_FAIL]: logout,
    [REGISTER_FAIL]: logout,
    [LOGOUT]: logout
});
