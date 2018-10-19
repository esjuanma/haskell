const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
let mainWindow;

// creates the default window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        frame: false,
        alwaysOnTop: true
    });

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.setFullScreen(false);
    mainWindow.on('closed', () => app.quit());
    
    return mainWindow;
}

// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function () {
    createWindow();

    if(autoUpdater.checkForUpdatesAndNotify) {
        mainWindow.webContents.send('state-change', 'Checking for update and then notify');
        autoUpdater.checkForUpdatesAndNotify();
    } else {
        mainWindow.webContents.send('state-change', 'No update and notify');
        autoUpdater.checkForUpdates();
    }

    // Shows feed URL
    mainWindow.webContents.send('feed-url-ready', autoUpdater.getFeedURL());
});

autoUpdater.on('checking-for-update', (info) => {
    mainWindow.webContents.send('state-change', 'Checking for update..');
});
autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('state-change', 'Update available!');
});
autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('state-change', 'Update not available.');
});
// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('state-change', 'Update downloaded');
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on('quitAndInstall', (event, arg) => {
    autoUpdater.quitAndInstall();
    mainWindow.webContents.send('state-change', 'Quiting and installing..');
});

// https..
app.commandLine.appendSwitch('ignore-certificate-errors');

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
