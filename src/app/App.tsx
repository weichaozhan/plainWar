import { hot, setConfig } from 'react-hot-loader';
import React, { FC } from 'react';
import { Provider } from 'react-redux';

import MainCanvas from './MainCanvas';

import './styles/index.css';
import 'antd/dist/antd.css';

import store from './store/index';

const NODE_ENV = process.env.NODE_ENV;

const App: FC = () => {  
  return <Provider store={store} >
    <MainCanvas/>
  </Provider> ;
};

if (NODE_ENV === 'development') {
  setConfig({
    reloadHooks: false
  });
}

export default NODE_ENV === 'development' ? hot(module)(App) : App;