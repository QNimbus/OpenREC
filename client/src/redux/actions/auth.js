// Import action types
import { REGISTER, REGISTER_SUCCESS, REGISTER_FAIL, LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, LOAD_USER, USER_LOADED, AUTH_ERROR } from './types';

export const register = (name, email, password) => {
    return {
        type: REGISTER,
        payload: {
            name,
            email,
            password
        }
    };
};

export const registerSuccess = token => ({
    type: REGISTER_SUCCESS,
    payload: {
        token
    }
});

export const registerFail = () => ({
    type: REGISTER_FAIL
});

export const login = (email, password) => {
    return {
        type: LOGIN,
        payload: {
            email,
            password
        }
    };
};

export const loginSuccess = token => ({
    type: LOGIN_SUCCESS,
    payload: {
        token
    }
});

export const loginFail = () => ({
    type: LOGIN_FAIL
});

export const logout = () => ({
    type: LOGOUT
});

export const loadUser = () => ({
    type: LOAD_USER
});

export const userLoaded = payload => {
    return {
        type: USER_LOADED,
        payload
    };
};

export const authError = () => ({
    type: AUTH_ERROR
});
