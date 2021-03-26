import { flySize, bulletSize } from './constant';
import { getBulletsTimeout } from './tools';
import { IFly } from './fly';
import { IEnemy } from './enemy';

export interface IBullet {
  position: [number, number];
}
export type TBullets = Map<symbol, IBullet>;

export const addBullet = (function() {
  let bulletCount = 0;

  return (enemiesGroup: TBullets, fly: IFly) => {
    const { position } = fly;
    
    enemiesGroup.set(Symbol(`enemyCount_${++bulletCount}`), {
      position: [position[0] + flySize[0] / 2 - bulletSize[0] / 2, position[1] - bulletSize[1] - 6]
    });
  };
})();
export const addBulletLoop = (function() {
  let timePre: number = null;

  return (enemiesGroup: TBullets, fly: IFly, score = 0) => {
    const timeNow = Date.now();

    if (timePre === null) {
      addBullet(enemiesGroup, fly);
      timePre = timeNow;
    } else if (timeNow - timePre > getBulletsTimeout(score)) {
      addBullet(enemiesGroup, fly);
      timePre = timeNow;
    }
  }
})();

export const updateBullet = (bullet: IBullet, step: number): IBullet => {
  const { position } = bullet;

  return {
    position: [position[0], position[1] - step]
  };
}
export const paintBullet = (ctx: CanvasRenderingContext2D, bullet: IBullet) => {
  const triangleH = bulletSize[1] * (1/4);
  const rectH = bulletSize[1] * (3/4);
  const position: IBullet['position'] = [bullet.position[0], bullet.position[1] + triangleH];
  
  ctx.beginPath();
  ctx.moveTo(...position);

  ctx.lineTo(position[0] + bulletSize[0] / 2, position[1] - triangleH);
  ctx.lineTo(position[0] + bulletSize[0], position[1]);
  ctx.lineTo(...position);

  ctx.rect(...position, bulletSize[0], rectH);

  ctx.fillStyle = 'orange';
  ctx.fill();

  ctx.closePath();
};

export const checkBulletEnemyImpact = (bullet: IBullet, enemy: IEnemy) => {
  const enemyLeft = enemy.firstPoint[0];
  const enemyRight = enemy.secondPoint[0];
  const enemyTop = enemy.firstPoint[1];
  const enemyBottom = enemy.thirdPoint[1];

  const bulletPosition = bullet.position;
  
  const bulletLeft = bulletPosition[0];
  const bulletTop = bulletPosition[1];
  const bulletRight = bulletLeft + bulletSize[0];
  const bulletBottom = bulletTop + bulletSize[1];

  return !(
    enemyRight < bulletLeft
    || enemyLeft > bulletRight
    || enemyTop > bulletBottom
    || enemyBottom < bulletTop
  );
};
