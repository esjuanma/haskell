const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

// creates the default window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 200,
        frame: false,
        alwaysOnTop: false
    });

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.setFullScreen(false);
    mainWindow.on('closed', () => app.quit());
    
    return mainWindow;
}

const updatePlease = () => {
    if(autoUpdater.checkForUpdatesAndNotify) {
        mainWindow.webContents.send('state-change', 'Checking for update and then notify');
        setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 1000);
    } else {
        mainWindow.webContents.send('state-change', 'Just checking for updates');
        setTimeout(() => autoUpdater.checkForUpdates(), 1000);
    }
};

// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function () {
    createWindow();

    mainWindow.webContents.send('state-change', 'ready');
    
    setTimeout(() => {
        mainWindow.webContents.send('state-change', 'Timedout!');
        
        // Shows feed URL
        mainWindow.webContents.send('feed-url-ready', autoUpdater.getFeedURL());

        setTimeout(updatePlease, 1000);
    }, 3000);
});


autoUpdater.on('-1', (info) => {
    mainWindow.webContents.send('state-change', '-1 ok');
});

autoUpdater.on('0', (info) => {
    mainWindow.webContents.send('state-change', '0 ok');
});

autoUpdater.on('1', (info) => {
    mainWindow.webContents.send('state-change', '1 ok');
});

autoUpdater.on('2', (info) => {
    mainWindow.webContents.send('state-change', '2 ok');
});

autoUpdater.on('downloaded', (info) => {
    mainWindow.webContents.send('state-change', 'downloaded');
});






autoUpdater.on('doCheckForUpdates-starting', (ifo) => {
    mainWindow.webContents.send('state-change', 'doCheckForUpdates-starting');
});


autoUpdater.on('doCheckForUpdates-bluebird', () => {
    mainWindow.webContents.send('state-change', 'doCheckForUpdates-bluebird');
});


autoUpdater.on('getUpdateInfo', () => {
    mainWindow.webContents.send('state-change', 'getUpdateInfo');
});



autoUpdater.on('checking-for-update', (info) => {
    mainWindow.webContents.send('state-change', 'Checking for update..');
});

autoUpdater.on('checkForUpdatesPromise-done', (info) => {
    mainWindow.webContents.send('state-change', 'checkForUpdatesPromise done!');
});

autoUpdater.on('checkForUpdatesPromise-then', (info) => {
    mainWindow.webContents.send('state-change', 'checkForUpdatesPromise then!');
});
autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('state-change', 'Update available!');
});
autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('state-change', 'Update not available.');
});
autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('state-change', 'Update downloaded');
});
ipcMain.on('quitAndInstall', (event, arg) => {
    autoUpdater.quitAndInstall();
    mainWindow.webContents.send('state-change', 'Quiting and installing..');
});

ipcMain.on('checkFor', (event, arg) => {
    updatePlease();
    mainWindow.webContents.send('state-change', 'OK dude');
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
