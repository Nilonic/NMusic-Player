const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const DiscordRPC = require('discord-rpc');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const clientId = process.env.DISCORD_CLIENT_ID;
DiscordRPC.register(clientId);

let mainWindow;
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'renderer.js'),
            enableRemoteModule: false,
            nodeIntegration: false,
            sandbox: true
        }
    });

    mainWindow.title = "NMusic Player";

    mainWindow.loadFile('index.html');

    // Hide the menu bar
    Menu.setApplicationMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function setupIpcMain() {
    ipcMain.on('update-presence', (event, presence) => {
        if (process.env.RPC_ENABLED == 1) {
            rpc.setActivity(presence)
                .then(() => {
                    mainWindow.webContents.send('presence-updated', 'success!');
                })
                .catch(error => {
                    mainWindow.webContents.send('presence-updated', `Error! ${error}`);
                });
        }
    });

    ipcMain.on('open-git', () => {
        shell.openExternal('https://github.com/Nilonic/NMusic-Player');
    });

    ipcMain.on('get-config', (event) => {
        // building the config
        const config = {
            isDarkmode: process.env.IS_DARK,
            isRpcEnabled: process.env.RPC_ENABLED,
            windowTitle: process.env.WINDOW_TITLE,
        }
        // send it to listener (and prey they listen)
        mainWindow.webContents.send('config-return', config)
    });

    ipcMain.on('update-config', (event, data) => {
        // data is expected to be an object with a single key-value pair
        const key = Object.keys(data)[0];
        const value = data[key];
        console.log(`${key}: ${value}`);

        switch (key) {
            case "IS_DARK":
                process.env.IS_DARK = value;
                break;
            case "RPC_ENABLED":
                process.env.RPC_ENABLED = value;
                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    message: "toggle won't take effect until next restart, sorry!",
                    title: "RPC has been toggled!"
                });
                break;
            case "WINDOW_TITLE":
                process.env.WINDOW_TITLE = value;
                break;
            default:
                dialog.showMessageBox(mainWindow, {
                    type: 'warning',
                    message: "key wasn't found in .env file!",
                    title: "Warning"
                });
                break;
        }

        // Construct the changedConfig object
        const changedConfig = {
            [key]: value
        };

        // Send the changed config back to the renderer process
        mainWindow.webContents.send('config-updated', changedConfig);
    });

    ipcMain.on("open-dev", () => {
        mainWindow.webContents.openDevTools();
    });

    ipcMain.on("log", (event, data) => {
        console.log(...data);
    });
}

function initializeRpc() {
    if (process.env.RPC_ENABLED == 1) {
        rpc.login({ clientId: clientId })
            .then(() => {
                rpc.setActivity({
                    details: 'No Song Loaded',
                    state: 'Null and Void',
                    startTimestamp: new Date().getTime()
                });
                setupIpcMain(); // Set up IPC listeners after RPC is initialized
            })
            .catch(error => {
                console.error('Error logging into Discord:', error);
            });
    } else {
        setupIpcMain(); // Set up IPC listeners without RPC
    }
}

app.on('ready', () => {
    console.log(process.env.RPC_ENABLED == 1 ? "we'll be using RPC" : "we won't be using RPC");
    try {
        createWindow();
        initializeRpc();
    } catch (error) {
        console.error('Error during app startup:', error);
    }
});

app.on('window-all-closed', () => {
    rpc.destroy();
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

const fs = require('fs');
app.on('before-quit', async () => {
    // Serialize environment variables and save to .env file
    const envString = `
# == internal config. do not modify unless you know what you're doing ==
DISCORD_CLIENT_ID=${process.env.DISCORD_CLIENT_ID}

# == user config ==
IS_DARK=${process.env.IS_DARK || ''}
RPC_ENABLED=${process.env.RPC_ENABLED || ''}
WINDOW_TITLE=${process.env.WINDOW_TITLE || ''}
`;

    // Write environment variables to .env file
    fs.writeFileSync('.env', envString.trim(), 'utf-8');
});
