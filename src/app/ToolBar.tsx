import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import ColorPicker from 'rc-color-picker';

import 'rc-color-picker/assets/index.css'
import styles from './index.module.scss';

import { canvasProps } from './constant';

interface IProps {
  defaultColor?: any;
  onChangeBGColor: (color: string) => any;
}

const { Panel } = ColorPicker;

const ToolBar: FC<IProps> = ({
  defaultColor,
  onChangeBGColor
}) => {
  return <div className={styles.toolbar} >
    <Tooltip
      color="#fff"
      title={<div>
        <Panel
          defaultColor={defaultColor ?? '#fff'}
          color="#36c"
          enableAlpha={false}
          mode="HSB"
          onChange={(color: any) => {
            onChangeBGColor(color.color);
            localStorage.setItem(canvasProps.canvasBgColor, color.color);
          }}
        />
      </div>}
      trigger="click"
      placement="right"
    >
      <Button title="背景" type="primary" icon={<BgColorsOutlined />} />
    </Tooltip>
  </div>
};

export default ToolBar;
