import { /* applyMiddleware, */ createStore } from 'redux';
import reducer from './reducer'

// const middleware = applyMiddleware(promiseMiddleware);

const store = createStore(reducer);
// window.store = store;  // available from console

export default store;