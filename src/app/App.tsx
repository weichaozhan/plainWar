// import { hot, setConfig } from 'react-hot-loader';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Provider } from 'react-redux';

import MainCanvas from './MainCanvas';
import ToolBar from './ToolBar';

import './styles/index.css';
import 'antd/dist/antd.css';

import store from './store/index';

import { canvasProps, colors } from './constant';

// const NODE_ENV = process.env.NODE_ENV;
const canvasBgColor = localStorage.getItem(canvasProps.canvasBgColor) || colors.black;

const App: FC = () => {
  const [bgClor, setBgColor] = useState(canvasBgColor);
  const [imgPath, setImgPath]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState(undefined);
  
  return <Provider store={store} >
    <ToolBar
      defaultColor={canvasBgColor}
      onChangeImgFile={imgPath => {
        setImgPath(imgPath);
      }}
      onChangeBGColor={(color: string) => {
        setBgColor(color);
      }}
    />
    <MainCanvas bgColor={bgClor} imgPath={imgPath} />
  </Provider> ;
};

// if (NODE_ENV === 'development') {
//   setConfig({
//     reloadHooks: false
//   });
// }

// export default NODE_ENV === 'development' ? hot(module)(App) : App;
export default App;