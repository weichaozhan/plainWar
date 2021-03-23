// import { hot, setConfig } from 'react-hot-loader';
import React, {
  // Dispatch,
  // SetStateAction,
  useState,
  FC,
  useRef,
} from 'react';
import { Provider } from 'react-redux';

import styles from './index.module.scss';

import MainCanvas from './MainCanvas';
// import ToolBar from './ToolBar';

import './styles/index.css';
import 'antd/dist/antd.css';

import store from './store/index';

import { canvasProps, colors } from './constant';

// const NODE_ENV = process.env.NODE_ENV;
const canvasBgColor = localStorage.getItem(canvasProps.canvasBgColor) || colors.black;

const App: FC = () => {
  const mainCanvas = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameover, setIsGameOver] = useState(false);
  // const [bgClor, setBgColor] = useState(canvasBgColor);
  // const [imgPath, setImgPath]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState(undefined);

  return <Provider store={store} >
    {/* <ToolBar
      defaultColor={canvasBgColor}
      onChangeBGColor={(color: string) => {
        setBgColor(color);
      }}
    /> */}
    <MainCanvas
      ref={mainCanvas}
      score={score}
      bgColor={canvasBgColor}
      onGameOver={() => {
        setIsGameOver(true);
      }}
      destroySuccess={() => {
        setScore(score + 1);
      }}
      escepedEnemy={
        () => {
          setScore(score - 1);
        } 
      }
      // imgPath={imgPath}
    />
    <h1 className={styles['score']} >
      Score: {score}
    </h1>

    <div className={`${styles['gameover-wrapper']} ${isGameover ? styles['gameover-wrapper-show'] : ''}`} >
      <div>
        <h3>
          GAME OVER !
        </h3>
        
        <button onClick={() => {
          setScore(0);
          setIsGameOver(false);
          setTimeout(() => {
            mainCanvas.current.restGame();
          });
        }} >
          Restart
        </button>
      </div>
    </div>
  </Provider> ;
};

// if (NODE_ENV === 'development') {
//   setConfig({
//     reloadHooks: false
//   });
// }

// export default NODE_ENV === 'development' ? hot(module)(App) : App;
export default App;