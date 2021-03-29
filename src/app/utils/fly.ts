import { flySize, fireMaxXStep, fireMaxYStep, fireMaxSize, fireFrameMax, fireWidth } from './constant';

export interface IFly {
  position: [number, number];
  img: HTMLImageElement;
  firePos: [number, number];
  fireSize: number;
  fireFrameCount: number;
}
export const flyInit = (canvasW: number, canvasH: number): IFly => {
  const halfCanvasW = canvasW / 2 - flySize[0] / 2;
  const halfCanvasH = canvasH - flySize[1] - fireMaxSize;
  const img = new Image();
  img.src = `${APP_STATIC_PROTOCAL}${APP_STATIC_PATH}/fight.png`;

  return {
    position: [halfCanvasW, halfCanvasH],
    img: img,
    firePos: [halfCanvasW + fireMaxXStep, halfCanvasH + fireMaxYStep],
    fireSize: fireMaxSize,
    fireFrameCount: fireFrameMax
  };
};

export const paintFightFly = (function() {
  let imgLoaded = false;

  return (ctx: CanvasRenderingContext2D, fly: IFly) => {
    ctx.beginPath();
    ctx.moveTo(...fly.position);

    const paintImg = () => {
      const { position } = fly;
      
      const [flyX, flyY] = position;
      ctx.drawImage(fly.img, flyX, flyY, flySize[0], flySize[1]);      

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

export const paintFire = (ctx: CanvasRenderingContext2D, fly: IFly) => {
  const { firePos, fireSize } = fly;
  const [fireX, fireY] = firePos;

  const halfFireWidth = fireWidth / 2;

  ctx.moveTo(fireX, fireY);
  ctx.lineTo(fireX + fireWidth, fireY);
  ctx.lineTo(fireX + halfFireWidth, fireY + fireSize);
  ctx.moveTo(fireX, fireY);
  ctx.fillStyle = 'red';
  ctx.fill();
};

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
