// Import action types
import { GET_FILTERS, FILTERS_LOADED, FILTER_ERROR, FILTER_UPDATED, FILTER_ADDED, FILTER_REMOVED } from '../actions/types';

// Import reducer utility
import { createReducer, arrayToObject } from './utils';

// Initial state

const initialState = {
  filters: null,
  loading: true,
  error: {}
};

// Filter reducer methods

function getFilters(state, action) {
  return { ...state, loading: true, error: {} };
}

function filtersLoaded(state, action) {
  const { payload } = action;
  const filters = arrayToObject(payload, 'id');
  return { ...state, filters, loading: false, error: {} };
}

function filterUpdated(state, action) {
  const { payload } = action;
  return { ...state, filters: { ...state.filters, [payload.id]: { ...payload, filter: payload.filter ? payload.filter : [] } } };
}

function filterAdded(state, action) {
  const { payload } = action;
  return { ...state, filters: { ...state.filters, [payload.id]: { ...payload, filter: payload.filter ? payload.filter : [] } } };
}

function filterRemoved(state, action) {
  const { payload } = action;
  const { [payload.id]: removedItem, ...newFilters } = state.filters;
  return { ...state, filters: { ...newFilters } };
}

function filterError(state, action) {
  const { payload } = action;
  return { ...state, error: payload };
}

// Export reducer

export default createReducer(initialState, {
  [GET_FILTERS]: getFilters,
  [FILTERS_LOADED]: filtersLoaded,
  [FILTER_UPDATED]: filterUpdated,
  [FILTER_ADDED]: filterAdded,
  [FILTER_REMOVED]: filterRemoved,
  [FILTER_ERROR]: filterError
});
