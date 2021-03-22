import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import path from 'path';

import { windowState, windowResizeState } from './constants';
import StorageNode from './mainProcess/storage';
import runTray from './mainProcess/tray';
import menuTemplate from './mainProcess/menu';
import iconPath from './assets/shortDomain.png';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const NODE_ENV = process.env.NODE_ENV;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;
const createWindow = (): void => {
  mainWindow?.removeAllListeners();

  let mainWindowState: BrowserWindowConstructorOptions = StorageNode.getValue(windowState);

  if (!mainWindowState) {
    mainWindowState = {
      height: 600,
      width: 800
    }
    StorageNode.setValue(windowState, mainWindowState);
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, iconPath),
    title: '测试',
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true
    },
    resizable: false,
    ...mainWindowState
  });

  mainWindow.setMenu(menuTemplate);
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const mainWinResizeState = StorageNode.getValue(windowResizeState) ?? {};

  if (mainWinResizeState?.maximize) {
    mainWindow.maximize();
  }

  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('resized', () => {
    const winBounds = mainWindow.getBounds();
    const newState = {
      ...mainWindowState,
      height: winBounds.height,
      width: winBounds.width
    };

    StorageNode.setValue(windowState, newState);
  });
  mainWindow.on('maximize', () => {
    const oldResizeState = StorageNode.getValue(windowResizeState) ?? {};
    StorageNode.setValue(windowResizeState, {
      ...oldResizeState,
      maximize: true
    });
  });
  mainWindow.on('unmaximize', () => {
    const oldResizeState = StorageNode.getValue(windowResizeState) ?? {};
    StorageNode.setValue(windowResizeState, {
      ...oldResizeState,
      maximize: false
    });
  });

  // Open the DevTools.
  if (NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

const gotTheLock = app.requestSingleInstanceLock();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (!gotTheLock) {
    app.quit();
  } else {
    createWindow();
  }
});

app.whenReady().then(() => {
  runTray(mainWindow, app);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
