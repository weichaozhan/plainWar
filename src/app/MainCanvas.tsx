import React, { Component } from 'react';

import styles from './index.module.scss';

import { flySize, enemiesMoveSpeed, boomSize, bulletMoveSpeed } from './utils/constant';
import { setLeaderboardStr, getLeaderboardStr, checkFightFlyEnemyImpact } from './utils/tools';
import { flyInit, IFly, getFightFlyPath, paintFightFly } from './utils/fly';
import { TEnemies, paintEnemy, addEnemyLoop, updateEnemy } from './utils/enemy';
import { addBulletLoop, paintBullet, TBullets, updateBullet, checkBulletEnemyImpact } from './utils/bullets';
import { paintBoom, createBoom, paintBoomsFrame, TBooms } from './utils/booms';

interface IProps {
  bgColor: string;
  score: number;
  // imgPath?: string;
  onGameOver: (...rest: any[]) => any;
  destroySuccess: (...rest: any[]) => any;
  escepedEnemy: (...rest: any[]) => any;
}

interface IState {
  canvasCtx: null | undefined | CanvasRenderingContext2D;
  [props: string]: any;
}

class MainCanvas extends Component<IProps, IState> {
  canvasH = 0;
  canvasW = 0;

  ratioX = 1;
  ratioY = 1;
  
  canvasEle: HTMLCanvasElement = null;
  isPointInFightfly = false;
  fightflyAnim: number = null;
  enemies: TEnemies = new Map();
  bullets: TBullets = new Map();
  booms: TBooms = new Map();

  isGameOver = false;

  fly: IFly = null;

  enemiesAnimTimer: number = null;
  
  constructor(props: any) {
    super(props);

    this.state = {
      canvasCtx: null
    };

    this.setRatio = this.setRatio.bind(this);
  }

  refCreate = (element: HTMLCanvasElement) => {
    this.canvasEle = element;
  };
  
  componentDidMount() {
    this.resizeCanvas();

    this.fly = flyInit(this.canvasW, this.canvasH);

    const context = this.canvasEle.getContext('2d');

    this.setState({
      canvasCtx: context
    }, () => {
      window.addEventListener('resize', this.setRatio);
      
      this.paintPlane();
      this.paintOneFrame();
    });
  }
  
  componentWillUnmount() {
    cancelAnimationFrame(this.enemiesAnimTimer);
    window.removeEventListener('resize', this.setRatio);
  }
  
  setRatio() {
    this.ratioX = this.canvasW / this.canvasEle.clientWidth;
    this.ratioY = this.canvasH / this.canvasEle.clientHeight;
  }

  restGame() {
    try {
      const { canvasW, canvasH } = this;
  
      this.state.canvasCtx.clearRect(0, 0, canvasW, canvasH);
  
      cancelAnimationFrame(this.enemiesAnimTimer);
      cancelAnimationFrame(this.fightflyAnim);
  
      this.isGameOver = false;
      this.isPointInFightfly = false;
  
      this.fly = flyInit(canvasW, canvasH);
      this.enemies.clear();
      this.bullets.clear();
      this.booms.clear();
      
      this.paintPlane();
      this.paintOneFrame();
    } catch(err) {
      console.log('err', err);
    }
  }

  paintOneFrame() {
    const { state, fly, enemies, canvasW, canvasH, bullets, booms } = this;

    addEnemyLoop(enemies, canvasW);
    addBulletLoop(bullets, fly);

    const { canvasCtx } = state;

    canvasCtx.clearRect(0, 0, canvasW, canvasH);

    paintFightFly(canvasCtx, fly);
    
    this.paintEnemies();

    this.paintBullets();

    paintBoomsFrame(canvasCtx, booms);

    if (!this.isGameOver) {
      this.enemiesAnimTimer = requestAnimationFrame(() => {
        this.paintOneFrame();
      });
    } else {
      // Game over: boom!
      const { position } = fly;
      cancelAnimationFrame(this.fightflyAnim);
      paintBoom(canvasCtx, [position[0] - boomSize[0] / 4, position[1] - boomSize[1] / 4]);

      const preLeaderboard = getLeaderboardStr();
      preLeaderboard.push(this.props.score);
      setLeaderboardStr(preLeaderboard.sort((pre: number, now: number) => now - pre).slice(0, 6));
      this.props.onGameOver();
    }
  }

  paintEnemies() {
    const { state, enemies, bullets, fly, canvasH } = this;
    const { canvasCtx } = state;

    for (const enemyMap of enemies.entries()) {
      let isEnemyDestroied = false;
      const enemy = enemyMap[1];
      
      paintEnemy(canvasCtx, enemy);

      // Impact checking: plane with enemy
      this.isGameOver = this.isGameOver ? true : (checkFightFlyEnemyImpact(fly, enemy) || this.props.score < 0);

      for (const bulletMap of bullets.entries()) {
        const bullet = bulletMap[1];

        isEnemyDestroied = isEnemyDestroied ? true : checkBulletEnemyImpact(bullet, enemy);

        if (isEnemyDestroied) {
          bullets.delete(bulletMap[0]);
        }
      }

      if (enemy.firstPoint[1] >= canvasH || isEnemyDestroied) {
        if (isEnemyDestroied) {
          if (isEnemyDestroied) {
            const newBoom = createBoom([enemy.firstPoint[0] - boomSize[0]/2, enemy.firstPoint[1]]);
            this.booms.set(newBoom[0], newBoom[1]);
          }
          this.props.destroySuccess?.();
        }
        if (enemy.firstPoint[1] >= canvasH) {
          this.props.escepedEnemy?.();
        }
        enemies.delete(enemyMap[0]);
      } else {
        enemies.set(enemyMap[0], updateEnemy(enemy, 0, enemiesMoveSpeed));
      }
    }
  }

  paintBullets() {
    const { state, bullets } = this;
    const { canvasCtx } = state;

    for (const bulletMap of bullets.entries()) {
      const bullet = bulletMap[1];
      paintBullet(canvasCtx, bullet);

      if (bullet.position[1] <= 0) {
        bullets.delete(bulletMap[0]);
      } else {
        bullets.set(bulletMap[0], updateBullet(bullet, bulletMoveSpeed));
      }
    }
  }

  resizeCanvas() {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    this.canvasEle.width = width;
    this.canvasEle.height = height;

    this.canvasW = width;
    this.canvasH = height;
  }

  isMouseInFightfly(mouse: MouseEvent){
    const { canvasCtx } = this.state;
    
    canvasCtx.beginPath();

    const path = getFightFlyPath(this.fly);
    return  canvasCtx.isPointInPath(path, mouse.x * this.ratioX, mouse.y * this.ratioY);
  }

  paintPlane() {
    const ctx = this.state.canvasCtx;
    const { fly } = this;

    paintFightFly(ctx, fly);
  }

  moveFightFly(e: MouseEvent) {
    const [xStart, yStart] = this.fly.position;
    const [flyW, flyH] = flySize;
    const maxX = this.canvasW - flyW;
    const maxY = this.canvasH - flyH;
    
    if (
      this.isPointInFightfly
      && !this.isGameOver
      // boundry
      && xStart >= 0 && yStart >= 0
      && xStart <= maxX
      && yStart <= maxY
    ) {
      let { movementX, movementY } = e;
      movementX *= this.ratioX;
      movementY *= this.ratioY

      let newX = xStart + movementX;
      let newY = yStart + movementY;

      if (newX < 0) {
        newX = 0;
      } else if (newX > maxX) {
        newX = maxX;
      }

      if (newY < 0) {
        newY = 0;
      } else if (newY > maxY) {
        newY = maxY
      }

      this.fly.position = [newX, newY];

      const { canvasCtx } = this.state;
      const moveFightFly = () => {
        const xy: [number, number] = [xStart, yStart];
        canvasCtx.clearRect(...xy, flySize[0], flySize[1]);
        
        this.fightflyAnim = requestAnimationFrame(() => {          
          paintFightFly(canvasCtx, this.fly);
          this.fightflyAnim = null;
        });
      }
      if (this.fightflyAnim) {
        cancelAnimationFrame(this.fightflyAnim);
        moveFightFly();
      } else {
        moveFightFly();
      }
    }
  }

  render() {
    const { bgColor } = this.props;

    return <canvas
      ref={this.refCreate}
      onMouseDown={(e) => {
        this.isPointInFightfly = this.isMouseInFightfly(e.nativeEvent);
      }}
      onMouseMove={(e) => this.moveFightFly(e.nativeEvent)}
      onMouseUp={() => {
        this.isPointInFightfly = false;
      }}
      onMouseOut={() => {
        this.isPointInFightfly = false;
      }}
      className={styles['main-canvas']}
      style={{ background: bgColor }}
    />;
  }
}

export default MainCanvas;
