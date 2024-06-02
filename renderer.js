const { ipcRenderer, contextBridge } = require('electron');

// Example function to update Discord Rich Presence
function updatePresence(song_name, artist, paused, time_remaining) {
    const presence = {
        details: song_name,
        state: artist, // Using "artist" instead of "state"
    };

    // Add time remaining if it's provided
    if (typeof time_remaining === 'number') {
        presence.endTimestamp = Date.now() + time_remaining * 1000; // time_remaining is in seconds
    }

    // If paused, set largeImageText to "Paused"
    if (paused) {
        presence.largeImageText = "Paused";
    }

    // Send presence data to main process via IPC
    ipcRenderer.send('update-presence', presence);
}

contextBridge.exposeInMainWorld("rpc", {
    updatePresence: (details, artist, paused, time_remaining) => {
        updatePresence(details, artist, paused, time_remaining)
    },
    createListener: (listener_name, callback) => {
        ipcRenderer.on(listener_name, (event, ...args) => callback(...args));
    }
})
contextBridge.exposeInMainWorld("ipc", {
    requestConfig: () => {
        ipcRenderer.send("get-config")
    },
    updateConfig: (key, value) => {
        const newConfig = {
            [key]: value
        }
        ipcRenderer.send("update-config", newConfig)
    },
    openDevtools: () => {
        ipcRenderer.send("open-dev");
    }
})