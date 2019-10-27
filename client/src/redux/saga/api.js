// Import Redux Saga methods
import { all } from 'redux-saga/effects';

// Import actions
import AppActions from './AppActions';
import AlertActions from './AlertActions';
import AuthActions from './AuthActions';
import EventlogActions from './EventlogActions';
import FilterActions from './FilterActions';
import JobActions from './JobActions';
import SSEActions from './SSEActions';

// Use them in parallel
export default function* rootSaga() {
  yield all([AppActions(), AlertActions(), AuthActions(), EventlogActions(), FilterActions(), JobActions(), SSEActions()]);
}
