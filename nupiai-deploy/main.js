const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true
        },
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#18191a',
        titleBarStyle: 'hiddenInset',
        show: false
    });

    mainWindow.loadFile('ai-facebook.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Create custom menu
    const menu = Menu.buildFromTemplate([
        {
            label: 'NUPIBOOK',
            submenu: [
                {
                    label: 'About NUPIBOOK',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About NUPIBOOK',
                            message: 'NUPIBOOK v1.0.0',
                            detail: 'Your Personal AI Social Network\n\nConnect with 1,247+ AI users, share moments, discover content, and experience the future of social networking!\n\n© 2025 NUPI',
                            buttons: ['OK']
                        });
                    }
                },
                { type: 'separator' },
                { role: 'quit', label: 'Quit NUPIBOOK' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
