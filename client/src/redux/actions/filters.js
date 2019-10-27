// Import action types
import { GET_FILTERS, ADD_FILTER, FILTERS_LOADED, FILTER_ERROR, REMOVE_FILTER, FILTER_UPDATED, FILTER_ADDED, FILTER_REMOVED } from './types';

export const getFilters = () => ({
    type: GET_FILTERS
});

export const addFilter = (name, description, filters) => ({
    type: ADD_FILTER,
    payload: {
        name,
        description,
        filters
    }
});

export const removeFilter = name => ({
    type: REMOVE_FILTER,
    payload: {
        name
    }
});

export const filtersLoaded = payload => ({
    type: FILTERS_LOADED,
    payload
});

export const filterUpdated = payload => ({
    type: FILTER_UPDATED,
    payload
});

export const filterAdded = payload => ({
    type: FILTER_ADDED,
    payload
});

export const filterRemoved = payload => ({
    type: FILTER_REMOVED,
    payload
});

export const filterError = payload => ({
    type: FILTER_ERROR,
    payload
});
