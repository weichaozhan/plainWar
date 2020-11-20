import { hot } from 'react-hot-loader';
import React, { FC } from 'react';
import { Layout, Button } from 'antd';

import 'antd/dist/antd.css';

import styles from './index.module.scss';

const {
  Sider,
  Content
} = Layout;

const App: FC = () => {
  return <Layout>
    <Sider>
      Sider
    </Sider>

    <Content className={styles['app-content']} >
      Content
      <Button type="primary" >
        Button
      </Button>
    </Content>
  </Layout>;
};

export default hot(module)(App);