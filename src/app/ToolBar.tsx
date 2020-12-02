import React, { FC } from 'react';
import { Button, Tooltip, Upload } from 'antd';
import { BgColorsOutlined, UploadOutlined } from '@ant-design/icons';
import ColorPicker from 'rc-color-picker';

import 'rc-color-picker/assets/index.css'
import styles from './index.module.scss';

import { canvasProps } from './constant';

interface IProps {
  defaultColor?: any;
  onChangeImgFile?: (imgPath: string) => any;
  onChangeBGColor: (color: string) => any;
}

const { Panel } = ColorPicker;

const ToolBar: FC<IProps> = ({
  defaultColor,
  onChangeBGColor,
  onChangeImgFile
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
    
    <Upload
      showUploadList={false}
      action={file => new Promise((...rest) => {
        onChangeImgFile?.(URL.createObjectURL(file));
        rest[1]();
      })}
    >
      <Button  type="primary" icon={<UploadOutlined />} >上传</Button>
    </Upload>
  </div>
};

export default ToolBar;
