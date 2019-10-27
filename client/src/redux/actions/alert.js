// Global imports
import uuid from 'uuid';

// Import action types
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => {
    const id = uuid.v4();

    return {
        type: SET_ALERT,
        payload: {
            id,
            alertType,
            msg,
            timeout
        }
    };
};

export const removeAlert = id => {
    return {
        type: REMOVE_ALERT,
        payload: {
            id
        }
    };
};
