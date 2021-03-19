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

const flyInit = (canvasW: number, canvasH: number): {
  firstPoint: [number, number];
  secondPoint: [number, number];
  thirdPoint: [number, number];
} => {
  const halfCanvasH = canvasH / 2;
  const halfCanvasW = canvasW / 2;

  return {
    firstPoint: [halfCanvasW, halfCanvasH],
    secondPoint: [halfCanvasW - 10, halfCanvasH + 10],
    thirdPoint: [halfCanvasW + 10, halfCanvasH + 10],
  };
};

const getTriangleShape = (ctx: CanvasRenderingContext2D | Path2D, fly: ReturnType<typeof flyInit>) => {
  ctx.moveTo(...fly.firstPoint);
  ctx.lineTo(...fly.secondPoint);
  ctx.lineTo(...fly.thirdPoint);
  ctx.lineTo(...fly.firstPoint);
};
const paintTriangle = (ctx: CanvasRenderingContext2D, fly: ReturnType<typeof flyInit>) => {
  ctx.beginPath();
  getTriangleShape(ctx, fly);
  ctx.fill();
};
const getTrianglePath = (fly: ReturnType<typeof flyInit>) => {
  const path1 = new Path2D();
  getTriangleShape(path1, fly);
  return path1;
};

class MainCanvas extends Component<IProps, IState> {
  canvasH = 0;
  canvasW = 0;
  canvasEle: HTMLCanvasElement = null;

  fly: ReturnType<typeof flyInit> = null;
  
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
    const width = this.canvasEle.clientWidth;
    const height = this.canvasEle.clientHeight;

    this.canvasEle.width = width;
    this.canvasEle.height = height;

    this.canvasW = width;
    this.canvasH = height;

    this.fly = flyInit(this.canvasW, this.canvasH);

    const context = this.canvasEle.getContext('2d');

    this.setState({
      canvasCtx: context
    }, () => {
      this.paintPlane();
    });
  }

  isMouseInGraph(mouse: MouseEvent){
      const { canvasCtx } = this.state;
      
      canvasCtx.beginPath();

      const path = getTrianglePath(this.fly);
      const isPointInPath = canvasCtx.isPointInPath(path, mouse.x, mouse.y);
      
      console.log('isPointInPath', isPointInPath, mouse.x, mouse.y, this.fly);
      return  isPointInPath;
  }

  paintPlane() {
    const ctx = this.state.canvasCtx;
    const { fly } = this;

    paintTriangle(ctx, fly);
  }

  render() {
    const { bgColor } = this.props;

    return <canvas ref={this.refCreate} onMouseDown={(e) => this.isMouseInGraph(e.nativeEvent)} className={styles['main-canvas']} style={{ background: bgColor }} />;
  }
}

export default MainCanvas;
