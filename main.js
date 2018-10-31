const path = require('path');
const url = require('url');
const {app, BrowserWindow, ipcMain} = require('electron');
const parser1 = require('./src/index.js');
const parser2 = require('./src2/index.js');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './app.html'),
      protocol: 'file:',
      slashes: true
  }));
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('did-finish-load', async () => {
    await parser1(mainWindow.webContents, '(обычный)');
    await parser2(mainWindow.webContents, '(повышенный)');
  });

  ipcMain.on('FINISH', function (event, target) {
    event.sender.send('FINISH_DATA', target);
  });

  mainWindow.on('closed', () => {
      mainWindow = null;
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(mainWindow === null) {
        createWindow();
    }
});
