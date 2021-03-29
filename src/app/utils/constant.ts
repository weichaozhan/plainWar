export const boomSize: [number, number] = [80, 80];
export const flySize: [number, number] = [38, 50];

export const fireFrameMax = 20;

export const fireMaxSize = 10;
export const fireMaxXStep = 14;
export const fireMaxYStep = flySize[1] - 10;

export const fireMinSize = 6;
export const fireMinXStep = fireMaxXStep + (fireMaxSize - fireMinSize) / 2;
export const fireMinYStep = flySize[1] - 10;

// Enemy
export const enemiesMoveSpeed = 1;
export const maxEnemiesMoveSpeed = 6;
export const enemyAddTimeout = 1500;
export const minEnemyAddTimeout = 200;
// Enemy Step
export const enemyAddTimeoutStep = 60;
export const enemiesMoveSpeedStep = 0.1;
export const enemyDivisor = 6;

// Bullet
export const bulletSize: [number, number] = [4, 8];
export const bulletAddTimeout = 500;
export const minBulletAddTimeout = 60;
export const bulletMoveSpeed = 10;
// Bullet Step
export const bulletAddTimeoutStep = 20;
export const bulletDivisor = 10;
