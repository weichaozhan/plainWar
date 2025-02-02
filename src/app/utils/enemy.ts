import { getEnemyTimeout } from './tools';

export interface IEnemy {
  firstPoint: [number, number];
  secondPoint: [number, number];
  thirdPoint: [number, number];
}
export type TEnemies = Map<symbol, IEnemy>;

const enemyW = 20;
const enemyH = 40;
export const addEnemy = (function() {
  let enemyCount = 0;

  return (enemiesGroup: TEnemies, canvasWith: number) => {
    const width = enemyW;
    const height = enemyH;
    
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

  return (enemiesGroup: TEnemies, canvasWith: number, score = 0) => {
    const timeNow = Date.now();

    if (timePre === null) {
      addEnemy(enemiesGroup, canvasWith);
      timePre = timeNow;
    } else if (timeNow - timePre > getEnemyTimeout(score)) {
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

const enemyFireFrame = 200;
const halfEnemyFireFrame = enemyFireFrame / 2;
const paintEnemyFire = (function() {
  let dateNow = Date.now();

  return (ctx: CanvasRenderingContext2D, enemy: IEnemy) => {
    const current = Date.now();
    const delta = current - dateNow;

    ctx.beginPath();
    
    // Enemy fire
    const fireW = 6;
    const fireH = 10;
    ctx.moveTo(enemy.firstPoint[0] + enemyW / 2 - fireW / 2, enemy.firstPoint[1] - 2);
    ctx.lineTo(enemy.firstPoint[0] + enemyW / 2 + fireW / 2, enemy.firstPoint[1] - 2);
    
    if (delta < halfEnemyFireFrame) {
      ctx.lineTo(enemy.firstPoint[0] + enemyW / 2, enemy.firstPoint[1] - 2 - fireH);
    } else {
      ctx.lineTo(enemy.firstPoint[0] + enemyW / 2, enemy.firstPoint[1] - 2 - (fireH * 2 / 3));
    }

    if (delta >= enemyFireFrame) {
      dateNow = current;
    }
    
    ctx.lineTo(enemy.firstPoint[0] + enemyW / 2 - fireW / 2, enemy.firstPoint[1] - 2);
    
    ctx.fillStyle = '#a9a9a9';
    ctx.fill(); 

    ctx.closePath();
  };
})();
export const paintEnemy = (ctx: CanvasRenderingContext2D, enemy: IEnemy) => {
  // Enemy main
  ctx.beginPath();
  
  ctx.moveTo(...enemy.firstPoint);
  ctx.lineTo(...enemy.secondPoint);
  ctx.lineTo(...enemy.thirdPoint);
  ctx.lineTo(...enemy.firstPoint);
  ctx.fillStyle = '#f15307';
  
  ctx.fill();
  ctx.closePath();

  paintEnemyFire(ctx, enemy);
};