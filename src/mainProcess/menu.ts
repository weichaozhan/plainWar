import { Menu } from 'electron';

const NODE_ENV = process.env.NODE_ENV;
const template: Electron.MenuItemConstructorOptions[] = [
  // {
  //   label: '前进'
  // },
  // {
  //   label: '后退'
  // },
];

// if (NODE_ENV === 'development') {
// }
template.push({
  role: 'reload',
  accelerator: 'f5'
}, {
  label: '',
  role: 'toggleDevTools',
  accelerator: 'f12'
});

export default Menu.buildFromTemplate(template);
