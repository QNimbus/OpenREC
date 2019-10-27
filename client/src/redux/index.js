// React imports
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

// Local imports
import rootReducer from './reducers';
import apiSaga from './saga/api';

const saga = createSagaMiddleware();

const store =
    process.env.NODE_ENV === 'development'
        ? createStore(rootReducer, composeWithDevTools(applyMiddleware(saga)))
        : createStore(rootReducer, applyMiddleware(saga));

window.store = store;

saga.run(apiSaga);

export default store;
