import path from 'path';
import { App, BrowserWindow, Menu, Tray } from 'electron';

import iconPath from '../assets/shortDomain.png';

import { appTitle } from '../constants';

export let tray: Tray = null;

const focusWindow = (mainWindow: BrowserWindow) => {
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
  mainWindow.focus();
};
const buildMenu = (mainWindow: BrowserWindow, app: App) => {
  return Menu.buildFromTemplate([
    {
      label: '打开',
      type: 'normal',
      click: async () => {
        focusWindow(mainWindow);
      }
    },
    {
      label: '退出',
      type: 'normal',
      click: async () => {
        app.exit();
      }
    }
  ]);
}

export default function (mainWindow: BrowserWindow, app: App) {
  const contextMenu = buildMenu(mainWindow, app);
  tray = new Tray(path.resolve(__dirname, iconPath));
  
  tray.setToolTip(appTitle);
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    focusWindow(mainWindow);
  });
}