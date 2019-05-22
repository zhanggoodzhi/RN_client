import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import {
    createReactNavigationReduxMiddleware,
    createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';

const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);
const addListener = createReduxBoundAddListener("root");

const middlewares = [middleware, thunk];

const store = createStore(reducers, undefined, compose(
    applyMiddleware(...middlewares)
))

export { store, addListener };