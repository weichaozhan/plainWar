import React, { Component } from 'react';

import styles from './index.module.scss';

interface IProps {
  [props: string]: any;
}

interface IState {
  [props: string]: any;
}

class MainCanvas extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {

    };
  }

  render() {
    return <canvas className={styles['main-canvas']} />;
  }
}

export default MainCanvas;
