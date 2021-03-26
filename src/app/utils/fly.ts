import { flySize } from './constant';

export interface IFly {
  position: [number, number];
    img: HTMLImageElement;
}
export const flyInit = (canvasW: number, canvasH: number): IFly => {
  const halfCanvasW = canvasW / 2 - flySize[0] / 2;
  const halfCanvasH = canvasH - flySize[1] - 10;
  const img = new Image();
  img.src = `${APP_STATIC_PROTOCAL}${APP_STATIC_PATH}/fight.png`;

  return {
    position: [halfCanvasW, halfCanvasH],
    img: img
  };
};

export const paintFightFly = (function() {
  let imgLoaded = false;

  return (ctx: CanvasRenderingContext2D, fly: IFly) => {
    ctx.beginPath();
    ctx.moveTo(...fly.position);

    const paintImg = () => {
      ctx.drawImage(fly.img, ...fly.position, flySize[0], flySize[1]);
      ctx.closePath();
    };

    imgLoaded = fly.img.complete;

    if (imgLoaded) {
      paintImg();
    }
    
    fly.img.onload = () => {
      paintImg();
      imgLoaded = true;
    }
  }
})();
export const getFightFlyPath = (fly: IFly) => {
  const path1 = new Path2D();
  const [xBegin, yBegin] = fly.position;
  
  path1.moveTo(xBegin, yBegin);
  path1.lineTo(xBegin + flySize[0], yBegin);
  path1.lineTo(xBegin + flySize[0], yBegin + flySize[1]);
  path1.lineTo(xBegin, yBegin + flySize[1]);
  path1.lineTo(xBegin, yBegin);

  return path1;
};
