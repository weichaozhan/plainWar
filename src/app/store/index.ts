import { combineReducers, createStore, } from 'redux';

import mainProcess from './reducers/test';

const rootRedeucer = combineReducers({
  mainProcess
});

export default createStore(rootRedeucer);