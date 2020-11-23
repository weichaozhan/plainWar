declare namespace Store {
  interface ITestAction {
    type: string;
    test: string;
  }
  interface ITestStore {
    test: string;
  }
}