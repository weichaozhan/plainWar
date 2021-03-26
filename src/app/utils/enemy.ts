import { getEnemyTimeout } from './tools';

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