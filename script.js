document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    window.ipc.requestConfig();

    const elements = getDOMElements();
    let currentTrackIndex = 0;
    let tracks = [];
    let updateInterval;
    let doRpc = false;

    setEventListeners();

    function getDOMElements() {
        return {
            audio: document.getElementById('audio'),
            fileSelector: document.getElementById('file-selector'),
            fileSelectorBtn: document.getElementById('file-selector-btn'),
            currentTrackElement: document.getElementById('current-track'),
            progress: document.getElementById('progress'),
            playPauseButton: document.getElementById('play-pause'),
            loopButton: document.getElementById('loop'),
            volumeControl: document.getElementById('volume'),
            playlistTableBody: document.querySelector('#playlist-table tbody'),
            git: document.getElementById("git"),
            skipButton: document.getElementById("skip"),
            backButton: document.getElementById("back")
        };
    }

    function setEventListeners() {
        elements.fileSelectorBtn.addEventListener('click', () => elements.fileSelector.click());
        elements.skipButton.addEventListener("click", nextTrack);
        elements.backButton.addEventListener("click", previousTrack);
        elements.fileSelector.addEventListener('change', handleFileSelection);
        elements.playPauseButton.addEventListener("click", togglePlayPause);
        elements.loopButton.addEventListener("click", toggleLoop);
        elements.audio.addEventListener('ended', nextTrack);
        elements.progress.addEventListener('input', updateProgress);
        elements.volumeControl.addEventListener('input', updateVolume);
        elements.git.addEventListener("click", () => window.ipc.openGit());

        window.rpc.createListener('presence-updated', handlePresenceUpdate);
        window.rpc.createListener('config-return', handleConfigReturn);

        const configButton = document.getElementById("config-menu");
        const devtoolButton = document.getElementById("devtools");

        configButton.addEventListener("click", showConfigModal);
        devtoolButton.addEventListener("click", () => window.ipc.openDevtools());
    }

    function handleFileSelection(event) {
        const files = event.target.files;
        tracks = Array.from(files);
        if (tracks.length > 0) {
            currentTrackIndex = 0;
            populatePlaylist();
            loadTrack(currentTrackIndex);
        } else {
            console.log("No files chosen");
        }
    }

    function loadTrack(index) {
        clearInterval(updateInterval);

        const track = tracks[index];
        if (!track) return;

        const url = URL.createObjectURL(track);
        elements.audio.src = url;
        elements.audio.load();
        elements.audio.play().then(() => {
            elements.playPauseButton.textContent = 'Pause';
            updateTrackName(track.name);
            highlightCurrentTrack(index);

            elements.audio.onloadedmetadata = () => {
                elements.progress.max = elements.audio.duration;
                updateInterval = setInterval(() => {
                    elements.progress.value = elements.audio.currentTime;
                    if (doRpc) {
                        updateRPC(track.name, elements.audio.paused, elements.audio.duration - elements.audio.currentTime);
                    }
                }, 1000);
            };
        }).catch(error => {
            console.error('Error playing the audio:', error);
        });
    }

    function updateTrackName(filename) {
        const name = filename.replace(/\.[^/.]+$/, "");
        elements.currentTrackElement.textContent = name;
    }

    function populatePlaylist() {
        elements.playlistTableBody.innerHTML = '';
        tracks.forEach((track, index) => {
            const row = document.createElement('tr');
            row.classList.add('playlist-track');
            row.dataset.index = index;
            const cell = document.createElement('td');
            cell.textContent = track.name.replace(/\.[^/.]+$/, "");
            row.appendChild(cell);
            row.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
            });
            elements.playlistTableBody.appendChild(row);
        });
    }

    function highlightCurrentTrack(index) {
        document.querySelectorAll('.playlist-track').forEach(row => row.classList.remove('current-track'));
        const currentTrackRow = document.querySelector(`.playlist-track[data-index="${index}"]`);
        if (currentTrackRow) {
            currentTrackRow.classList.add('current-track');
        }
    }

    function toggleLoop() {
        elements.audio.loop = !elements.audio.loop;
        elements.loopButton.textContent = elements.audio.loop ? 'Loop: On' : 'Loop: Off';
    }

    function togglePlayPause() {
        if (elements.audio.paused) {
            elements.audio.play().then(() => {
                elements.playPauseButton.textContent = 'Pause';
            }).catch(error => {
                console.error('Error playing the audio:', error);
            });
        } else {
            elements.audio.pause();
            elements.playPauseButton.textContent = 'Play';
        }
    }

    function updateProgress() {
        elements.audio.currentTime = elements.progress.value;
    }

    function updateVolume() {
        elements.audio.volume = elements.volumeControl.value;
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
    }

    function previousTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
    }

    function updateRPC(songName, isPaused, timeRemaining) {
        const status = isPaused ? 'paused' : 'playing';
        window.rpc.updatePresence(songName, status, isPaused, timeRemaining);
    }

    function handlePresenceUpdate(message) {
        console.log('Presence updated:', message);
    }

    function handleConfigReturn(message) {
        console.log('Got Config!');
        if (message.isDarkmode == 1) {
            document.body.classList.add("dark");
        }
        doRpc = message.isRpcEnabled !== 0;
        if (message.windowTitle) {
            document.title = message.windowTitle.trim() || "NMusic Player";
        }
    }

    function showConfigModal() {
        let modal = document.getElementById("config-modal");
        if (!modal) {
            modal = createConfigModal();
            document.body.appendChild(modal);
        }
        modal.classList.add("active");
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("active");
            }
        });
    }

    function createConfigModal() {
        const modal = document.createElement("div");
        modal.id = "config-modal";
        modal.className = "modal";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        const darkModeToggle = document.createElement("button");
        darkModeToggle.id = "dark-mode-toggle";
        darkModeToggle.textContent = "Toggle Dark Mode";
        darkModeToggle.addEventListener("click", () => {
            if (document.body.classList.toggle("dark")) {
                window.ipc.updateConfig("IS_DARK", 1);
            } else {
                window.ipc.updateConfig("IS_DARK", 0);
            }
        });

        const titleInput = document.createElement("input");
        titleInput.id = "title-input";
        titleInput.type = "text";
        titleInput.placeholder = "Enter new window title";

        const titleButton = document.createElement("button");
        titleButton.id = "title-button";
        titleButton.textContent = "Change Title";
        titleButton.addEventListener("click", () => {
            const newTitle = titleInput.value.trim();
            if (newTitle) {
                document.title = newTitle;
                window.ipc.updateConfig("WINDOW_TITLE", newTitle);
            } else {
                document.title = "NMusic Player";
                window.ipc.updateConfig("WINDOW_TITLE", "NMusic Player");
            }
        });

        modalContent.appendChild(darkModeToggle);
        modalContent.appendChild(document.createElement("br"));
        modalContent.appendChild(titleInput);
        modalContent.appendChild(titleButton);
        modal.appendChild(modalContent);

        return modal;
    }
}
