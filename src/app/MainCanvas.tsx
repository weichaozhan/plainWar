import React, { Component } from 'react';

import styles from './index.module.scss';

interface IProps {
  bgColor: string;
  imgPath?: string;
  [props: string]: any;
}

interface IState {
  canvasCtx: null | undefined | CanvasRenderingContext2D;
  [props: string]: any;
}

class MainCanvas extends Component<IProps, IState> {
  canvasEle: HTMLCanvasElement = null;
  
  constructor(props: any) {
    super(props);

    this.state = {
      canvasCtx: null
    };
  }

  refCreate = (element: HTMLCanvasElement) => {
    this.canvasEle = element;
  };
  
  componentDidMount() {
    const context = this.canvasEle.getContext('2d');
    this.setState({
      canvasCtx: context
    });
  }

  componentDidUpdate() {
    this.setImgBg();
  }

  setImgBg() {
    const { imgPath } = this.props;
    const { canvasCtx } = this.state;

    const img = new Image();

    img.onload = () => {
      canvasCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    };

    img.src = imgPath;
  }

  render() {
    const { bgColor } = this.props;

    return <canvas ref={this.refCreate} className={styles['main-canvas']} style={{ background: bgColor }} />;
  }
}

export default MainCanvas;
