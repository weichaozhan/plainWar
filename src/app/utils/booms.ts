import { boomSize } from './constant';

export interface IBoom {
  position: [number, number];
  frameTimes: number;
}

export type TBooms = Map<symbol, IBoom>;

export const createBoom = (function() {
  let boomCount = 0;
  
  return (position: IBoom['position']): [symbol, IBoom] => {
    return [
      Symbol(`boomCount_${++boomCount}`),
      {
        position,
        frameTimes: 0
      }
    ];
  };
})();

export const paintBoom = (function() {
  const boom = new Image();

  let imgLoaded = false;

  boom.src = `${APP_STATIC_PROTOCAL}${APP_STATIC_PATH}/boom.png`;

  return (ctx: CanvasRenderingContext2D, position: [number, number]) => {
    const boomX = position[0];
    const boomY = position[1];
    
    ctx.beginPath();
    ctx.moveTo(boomX, boomY);
    
    const paintImg = () => {
      ctx.drawImage(boom, boomX, boomY, boomSize[0], boomSize[1]);
      ctx.closePath();
    };

    imgLoaded = boom.complete;
    
    if (imgLoaded) {
      paintImg();
    }
    
    boom.onload = () => {
      paintImg();
      imgLoaded = true;
    }
  }
})();

const boomMaxFrameCount = 24;
export const paintBoomsFrame = (ctx: CanvasRenderingContext2D, booms: TBooms) => {
  for (const boomMap of booms.entries()) {
    const key = boomMap[0];
    const boom = boomMap[1];

    if (boom.frameTimes > boomMaxFrameCount) {
    
      booms.delete(key);
    
    } else {
      ctx.globalAlpha = 1 - boom.frameTimes / boomMaxFrameCount;
      paintBoom(ctx, boom.position);
      ctx.globalAlpha = 1;
      booms.set(key, {
        ...boom,
        frameTimes: boom.frameTimes + 1
      });
    }
  }
}
