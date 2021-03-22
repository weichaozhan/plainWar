import fightImg from '../assets/fight.png';
import boomImg from '../assets/boom.png';
import { flySize, boomSize, enemyAddTimeout } from './constant';

export const flyInit = (canvasW: number, canvasH: number): {
  position: [number, number];
  img: HTMLImageElement;
} => {
  const halfCanvasW = canvasW / 2 - flySize[0] / 2;
  const halfCanvasH = canvasH - flySize[1] - 10;
  const img = new Image();
  img.src = fightImg;

  return {
    position: [halfCanvasW, halfCanvasH],
    img: img
  };
};

export const paintFightFly = (function() {
  let imgLoaded = false;

  return (ctx: CanvasRenderingContext2D, fly: ReturnType<typeof flyInit>) => {
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
export const getFightFlyPath = (fly: ReturnType<typeof flyInit>) => {
  const path1 = new Path2D();
  const [xBegin, yBegin] = fly.position;
  
  path1.moveTo(xBegin, yBegin);
  path1.lineTo(xBegin + flySize[0], yBegin);
  path1.lineTo(xBegin + flySize[0], yBegin + flySize[1]);
  path1.lineTo(xBegin, yBegin + flySize[1]);
  path1.lineTo(xBegin, yBegin);

  return path1;
};

export interface IEnemy {
  firstPoint: [number, number];
  secondPoint: [number, number];
  thirdPoint: [number, number];
}
export type TEnemies = Map<symbol, IEnemy>;
export const addEnemy = (function() {
  let enemyCount = 0;

  return (enemiesGroup: TEnemies, canvasWith: number) => {
    const width = 20;
    const height = 40
    
    let firstPointX = Math.floor(Math.random() * canvasWith);
    if (firstPointX < width) {
      firstPointX = width;
    } else if (firstPointX > canvasWith - width) {
      firstPointX = canvasWith - width;
    }
    
    enemiesGroup.set(Symbol(`enemyCount_${++enemyCount}`), {
      firstPoint: [firstPointX, 0],
      secondPoint: [firstPointX + width, 0],
      thirdPoint: [firstPointX + width / 2, height],
    });
  };
})();
export const addEnemyLoop = (function() {
  let timePre: number = null;

  return (enemiesGroup: TEnemies, canvasWith: number) => {
    const timeNow = Date.now();

    if (timePre === null) {
      addEnemy(enemiesGroup, canvasWith);
      timePre = timeNow;
    } else if (timeNow - timePre > enemyAddTimeout) {
      addEnemy(enemiesGroup, canvasWith);
      timePre = timeNow;
    }
  }
})();

export const updateEnemy = (enemy: IEnemy, xStep: number, yStep: number): IEnemy => {
  const { firstPoint, secondPoint, thirdPoint } = enemy;

  return {
    firstPoint: [firstPoint[0] + xStep, firstPoint[1] + yStep],
    secondPoint: [secondPoint[0] + xStep, secondPoint[1] + yStep],
    thirdPoint: [thirdPoint[0] + xStep, thirdPoint[1] + yStep]
  };
}
export const paintEnemy = (ctx: CanvasRenderingContext2D, enemy: IEnemy) => {
  ctx.beginPath();
  ctx.moveTo(...enemy.firstPoint);
  ctx.lineTo(...enemy.secondPoint);
  ctx.lineTo(...enemy.thirdPoint);
  ctx.lineTo(...enemy.firstPoint);

  ctx.fillStyle = 'gray';

  ctx.fill();

  ctx.closePath();
};
export const paintEnemiesFrame: (params: {
  ctx: CanvasRenderingContext2D;
  enemies: TEnemies;
  canvasH: number;
  deleteCB?: (...rest: any[]) => any;
}) => void = ({
  ctx,
  enemies,
  canvasH,
  deleteCB
}) => {
  const step = 1;
  for (const enemyMap of enemies.entries()) {
    const enemy = enemyMap[1];
    
    paintEnemy(ctx, enemy);

    if (enemy.firstPoint[1] >= canvasH) {
      enemies.delete(enemyMap[0]);
      deleteCB?.();
    } else {
      enemies.set(enemyMap[0], updateEnemy(enemy, 0, step));
    }
  }
};

export const checkFightFlyEnemyImpact = (fly: ReturnType<typeof flyInit>, enemy: IEnemy) => {
  const enemyLeft = enemy.firstPoint[0];
  const enemyRight = enemy.secondPoint[0];
  const enemyTop = enemy.firstPoint[1];
  const enemyBottom = enemy.thirdPoint[1];

  const flyPosition = fly.position;
  const xOffset = 20;
  const yOffset = 20;
  
  const flyLeft = flyPosition[0] + xOffset;
  const flyTop = flyPosition[1] + yOffset;
  const flyRight = flyPosition[0] + flySize[0] - xOffset;
  const flyBottom = flyPosition[1] + flySize[1] - yOffset;

  return !(
    enemyRight < flyLeft
    || enemyLeft > flyRight
    || enemyTop > flyBottom
    || enemyBottom < flyTop
  );
};

export const paintBoom = (function() {
  const boom = new Image();

  let imgLoaded = false;

  boom.src = boomImg;

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
