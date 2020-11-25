import { app, BrowserWindow } from 'electron';
import path from 'path';

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
  mainWindow && mainWindow.removeAllListeners();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.resolve(__dirname, iconPath),
    title: '测试',
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true
    }
  });

  mainWindow.setMenu(menuTemplate);
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
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
