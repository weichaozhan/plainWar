import { flySize, enemiesMoveSpeed, maxEnemiesMoveSpeed, enemyAddTimeout, minEnemyAddTimeout, bulletAddTimeout, minBulletAddTimeout, enemiesMoveSpeedStep, enemyAddTimeoutStep, enemyDivisor, bulletAddTimeoutStep, bulletDivisor } from './constant';
import { IFly } from './fly';
import { IEnemy } from './enemy';

export const getEnemySpeed = (score: number) => {
  const newSpeed = enemiesMoveSpeed + enemiesMoveSpeedStep * Math.floor(score / enemyDivisor);
  return newSpeed > maxEnemiesMoveSpeed ? maxEnemiesMoveSpeed : newSpeed;
};

export const getEnemyTimeout = (score: number) => {
  const newTimeout = enemyAddTimeout - enemyAddTimeoutStep * Math.floor(score / enemyDivisor);
  return newTimeout < minEnemyAddTimeout ? minEnemyAddTimeout : newTimeout;
};

export const getBulletsTimeout = (score: number) => {
  const newTimeout = bulletAddTimeout - bulletAddTimeoutStep * Math.floor(score / bulletDivisor);
  return newTimeout < minBulletAddTimeout ? minBulletAddTimeout : newTimeout;
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
