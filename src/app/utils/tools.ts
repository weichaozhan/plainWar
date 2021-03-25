import { flySize, enemyAddTimeout } from './constant';

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

export const checkFightFlyEnemyImpact = (fly: IFly, enemy: IEnemy) => {
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

export const getLeaderboardStr = () => {
  const preLeaderboardStr = localStorage.getItem('leaderboard') ?? JSON.stringify([]);
  return JSON.parse(preLeaderboardStr);
};

export const setLeaderboardStr = (leaderboard: number[]) => {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
};
