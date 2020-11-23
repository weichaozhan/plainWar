export const CHANGE_TEST = 'CHANGE_TEST';

export const changeTest = (test: string): Store.ITestAction => {
  return {
    type: CHANGE_TEST,
    test,
  };
};