// Import action types
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// Import reducer utility
import { createReducer } from './utils';

// Initial state

const initialState = [];

// Alert reducer methods

function setAlert(state, action) {
    const { payload } = action;
    return [...state, payload];
}

function removeAlert(state, action) {
    const { payload } = action;
    return state.filter(alert => alert.id !== payload.id);
}

// Export reducer

export default createReducer(initialState, {
    [SET_ALERT]: setAlert,
    [REMOVE_ALERT]: removeAlert
});
