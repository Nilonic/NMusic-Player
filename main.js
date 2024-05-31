const { app, BrowserWindow, ipcMain } = require('electron');
const DiscordRPC = require('discord-rpc');
const path = require("path");

// Discord RPC setup
const clientId = '1245899434676588594';
DiscordRPC.register(clientId)

// Electron window setup
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'renderer.js') // Path to your preload script
        }
    });

    mainWindow.loadFile('index.html');


    // When the window is closed, dereference the window object
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

// IPC listener for updating presence
ipcMain.on('update-presence', (event, presence) => {
    // Update Discord Rich Presence
    rpc.setActivity(presence)
        .catch(error => {
            console.error('Error updating presence:', error);
        });
});


rpc.login({ clientId: clientId }).catch(console.error);