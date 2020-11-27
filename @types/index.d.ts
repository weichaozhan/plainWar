declare namespace TestNameSpace {
  type TString = string;
}

declare module 'rc-color-picker' {
  interface IColorPickerProps {
    onChange?: (colors: any) => any;
    [props: string]: any;
  }

  interface IPanel {
    onChange?: (colors: any) => any;
    [props: string]: any;
  }

  class Panel extends React.Component<IPanel, any> {
    
  }

  export default class ColorPicker extends React.Component<IColorPickerProps, any> {
    static Panel = Panel;
  }
};
