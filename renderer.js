const { ipcRenderer, contextBridge } = require('electron');

function updatePresence(song_name, artist, paused, time_remaining) {
    const presence = {
        details: song_name,
        state: artist, // Using "artist" instead of "state"
    };

    if (typeof time_remaining === 'number') {
        presence.endTimestamp = Date.now() + time_remaining * 1000;
    }

    if (paused) {
        presence.largeImageText = "Paused";
    }

    ipcRenderer.send('update-presence', presence);
}

contextBridge.exposeInMainWorld("rpc", {
    updatePresence: (details, artist, paused, time_remaining) => {
        updatePresence(details, artist, paused, time_remaining);
    },
    createListener: (listener_name, callback) => {
        ipcRenderer.on(listener_name, (event, ...args) => callback(...args));
    }
});

contextBridge.exposeInMainWorld("ipc", {
    requestConfig: () => {
        ipcRenderer.send("get-config");
    },
    updateConfig: (key, value) => {
        const newConfig = {
            [key]: value
        };
        ipcRenderer.send("update-config", newConfig);
    },
    openDevtools: () => {
        ipcRenderer.send("open-dev");
    },
    log: (...data) => {
        ipcRenderer.send("log", data);
    },
    openGit: () => {
        ipcRenderer.send('open-git');
    }
});
