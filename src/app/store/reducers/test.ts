import {
  CHANGE_TEST,
} from '../actions/test';

const initialState: Store.ITestStore = {
  test: 'test',
};

const testReducer = (state: Store.ITestStore = initialState, action: Store.ITestAction): Store.ITestStore => {
  switch (action.type) {
    case CHANGE_TEST:
      return {
        ...state,
        test: action.test,
      };

    default:
      return state;
  }
};

export default testReducer;