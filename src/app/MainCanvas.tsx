import React, { Component } from 'react';

import styles from './index.module.scss';

interface IProps {
  bgColor: string;
  [props: string]: any;
}

interface IState {
  [props: string]: any;
}

class MainCanvas extends Component<IProps, IState> {
  canvasEle: HTMLCanvasElement = null;
  
  constructor(props: any) {
    super(props);

    this.state = {

    };
  }

  refCreate = (element: HTMLCanvasElement) => {
    this.canvasEle = element;
  };
  
  componentDidMount() {
    const context = this.canvasEle.getContext('2d');
    console.log('context', context);
  }

  render() {
    const { bgColor } = this.props;

    return <canvas ref={this.refCreate} className={styles['main-canvas']} style={{ background: bgColor }} />;
  }
}

export default MainCanvas;
