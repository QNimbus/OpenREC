// Redux imports
import { combineReducers } from 'redux';

// Reducer imports
import alert from './alert';
import auth from './auth';
import eventlog from './eventlog';
import filter from './filter';
import job from './job';

// Import action types
import { REGISTER_FAIL, LOGIN_FAIL, LOGOUT, AUTH_ERROR } from '../actions/types';

// Create root reducer

const appReducer = combineReducers({
  alert,
  auth,
  eventlog,
  filter,
  job
});

const rootReducer = (state, action) => {
  // Reset state when logging out, or when auth failure occurs
  if ([REGISTER_FAIL, LOGIN_FAIL, LOGOUT, AUTH_ERROR].includes(action.type)) {
    state = { alert: [...state.alert] };
  }
  return appReducer(state, action);
};

export default rootReducer;
