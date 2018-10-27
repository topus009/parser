const {app, BrowserWindow, ipcMain} = require('electron');
const parser = require('./src/index.js');

let win;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  });
  let contents = win.webContents;
  contents.openDevTools();
  win.on('closed', function() {
    win = null;
  });
  contents.executeJavaScript(parser).then(res => {
    console.log({res});
  });
});

// ipcMain.on('query', function (event, value) {
//   console.log(value);
// });
