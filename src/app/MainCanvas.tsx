import React, { Component } from 'react';

import styles from './index.module.scss';

import { flySize, enemiesMoveSpeed, boomSize } from './utils/constant';
import { TEnemies, flyInit, getFightFlyPath, paintFightFly, paintEnemy, addEnemyLoop, updateEnemy, checkFightFlyEnemyImpact, paintBoom } from './utils/tools';
interface IProps {
  bgColor: string;
  // imgPath?: string;
  onGameOver: (...rest: any[]) => any;
  avoidSuccess: (...rest: any[]) => any;
}

interface IState {
  canvasCtx: null | undefined | CanvasRenderingContext2D;
  [props: string]: any;
}

class MainCanvas extends Component<IProps, IState> {
  canvasH = 0;
  canvasW = 0;
  canvasEle: HTMLCanvasElement = null;
  isPointInFightfly = false;
  fightflyAnim: number = null;
  enemies: TEnemies = new Map();

  isGameOver = false;

  fly: ReturnType<typeof flyInit> = null;

  enemiesAnimTimer: number = null;
  
  constructor(props: any) {
    super(props);

    this.state = {
      canvasCtx: null
    };
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
      this.paintPlane();
      this.moveEnemies();
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.enemiesAnimTimer);
  }

  restGame() {
    const { canvasW, canvasH } = this;

    this.state.canvasCtx.clearRect(0, 0, canvasW, canvasH);

    cancelAnimationFrame(this.enemiesAnimTimer);
    cancelAnimationFrame(this.fightflyAnim);

    this.isGameOver = false;

    this.fly = flyInit(canvasW, canvasH);
    this.enemies.clear();
    
    this.paintPlane();
    this.moveEnemies();
  }

  moveEnemies() {
    const { state, fly, enemies, canvasW, canvasH } = this;

    addEnemyLoop(enemies, canvasW);

    const { canvasCtx } = state;

    canvasCtx.clearRect(0, 0, canvasW, canvasH);

    paintFightFly(canvasCtx, fly);
    
    for (const enemyMap of enemies.entries()) {
      const enemy = enemyMap[1];
      
      paintEnemy(canvasCtx, enemy);

      // Impact checking: plane with enemy
      this.isGameOver = this.isGameOver ? true : checkFightFlyEnemyImpact(fly, enemy);

      if (enemy.firstPoint[1] >= canvasH) {
        enemies.delete(enemyMap[0]);
        this.props.avoidSuccess?.();
      } else {
        enemies.set(enemyMap[0], updateEnemy(enemy, 0, enemiesMoveSpeed));
      }
    }

    if (!this.isGameOver) {
      this.enemiesAnimTimer = requestAnimationFrame(() => {
        this.moveEnemies();
      });
    } else {
      // Game over: boom!
      const { position } = fly;
      cancelAnimationFrame(this.fightflyAnim);
      paintBoom(canvasCtx, [position[0] - boomSize[0] / 4, position[1] - boomSize[1] / 4]);
      this.props.onGameOver();
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
    
    return  canvasCtx.isPointInPath(path, mouse.x, mouse.y);
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
      const { movementX, movementY } = e;
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
