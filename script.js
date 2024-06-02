let doRpc = true;

document.addEventListener('DOMContentLoaded', () => {
    window.ipc.requestConfig() // request configuration, handler outside of AEL will deal with it
    const audio = document.getElementById('audio');
    const fileSelector = document.getElementById('file-selector');
    const currentTrackElement = document.getElementById('current-track');
    const progress = document.getElementById('progress');
    const playPauseButton = document.getElementById('play-pause');
    const loopButton = document.getElementById('loop');
    const volumeControl = document.getElementById('volume');
    const playlistTableBody = document.querySelector('#playlist-table tbody');
    let currentTrackIndex = 0;
    let tracks = [];
    let updateInterval;

    // Function to load audio files
    fileSelector.addEventListener('change', (event) => {
        const files = event.target.files;
        tracks = Array.from(files);
        currentTrackIndex = 0; // Reset track index
        populatePlaylist(); // Populate playlist first
        loadTrack(currentTrackIndex);
    });

    // Function to load and play the track
    function loadTrack(index) {
        clearInterval(updateInterval); // Clear previous interval
        const track = tracks[index];
        if (!track) return;
        const url = URL.createObjectURL(track);
        
        audio.src = url;
        audio.load(); // Ensure the audio element loads the new source
        audio.play().then(() => {
            playPauseButton.textContent = 'Pause'; // Update play/pause button text
            updateTrackName(track.name);
            updatePlaylistHighlight(index);
            audio.onloadedmetadata = () => {
                progress.max = audio.duration;
                updateInterval = setInterval(() => {
                    progress.value = audio.currentTime;
                    updateRPC(track.name, audio.paused, (audio.duration - audio.currentTime));
                }, 1000); // Update every second
            };
        }).catch(error => {
            console.error('Error playing the audio:', error);
        });
    }

    // Function to update the current track name
    function updateTrackName(filename) {
        const name = filename.replace(/\.[^/.]+$/, "");
        currentTrackElement.textContent = name;
    }

    // Function to populate the playlist table
    function populatePlaylist() {
        playlistTableBody.innerHTML = ''; // Clear existing playlist
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
            playlistTableBody.appendChild(row);
        });
    }

    // Function to highlight the current track in the playlist
    function updatePlaylistHighlight(index) {
        document.querySelectorAll('.playlist-track').forEach((row) => {
            row.classList.remove('current-track');
        });
        const currentTrackRow = document.querySelector(`.playlist-track[data-index="${index}"]`);
        if (currentTrackRow) {
            currentTrackRow.classList.add('current-track');
        }
    }

    // Function to toggle loop
    function toggleLoop() {
        audio.loop = !audio.loop;
        loopButton.textContent = audio.loop ? 'Loop: On' : 'Loop: Off'; // Update loop button text
    }

    // Function to toggle play/pause
    function togglePlayPause() {
        if (audio.paused) {
            audio.play().then(() => {
                playPauseButton.textContent = 'Pause'; // Update play/pause button text
            }).catch(error => {
                console.error('Error playing the audio:', error);
            });
        } else {
            audio.pause();
            playPauseButton.textContent = 'Play'; // Update play/pause button text
        }
    }

    document.getElementById("play-pause").addEventListener("click", () => {
        togglePlayPause();
    });

    document.getElementById("loop").addEventListener("click", () => {
        toggleLoop();
    });

    // Event listener for track end
    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
    });

    // Update progress bar
    progress.addEventListener('input', () => {
        audio.currentTime = progress.value;
    });

    // Update volume
    volumeControl.addEventListener('input', () => {
        audio.volume = volumeControl.value;
    });

    // Initial state of loop button
    loopButton.textContent = audio.loop ? 'Loop: On' : 'Loop: Off'; // Set initial loop button text
});

// Function to update RPC
function updateRPC(songName, isPaused, timeRemaining) {
    if(doRpc){
        const status = isPaused ? 'paused' : 'playing';
        window.rpc.updatePresence(songName, status, isPaused, timeRemaining);
    }
}

// Create a listener
window.rpc.createListener('presence-updated', (message) => {
    console.log('Presence updated:', message);
});

window.rpc.createListener('config-return', (message) => {
    console.log('Got Config!');
    if (message["isDarkmode"] == 1){
        document.body.setAttribute("class", "dark")
    }
    if (message["isRpcEnabled"] == 0){
        doRpc = false
    }
    if (message["windowTitle"] != undefined && message["windowTitle"].trim() != ""){
        document.title = message["windowTitle"]
    }
});


document.addEventListener("DOMContentLoaded", () => {
    //alert(shadowdoRPC)
    const configButton = document.getElementById("config-menu");

    const devtoolButton = document.getElementById("devtools")

    configButton.addEventListener("click", () => {
        // Check if modal already exists
        let modal = document.getElementById("config-modal");
        if (!modal) {
            // Create modal
            modal = document.createElement("div");
            modal.id = "config-modal";
            modal.className = "modal";

            // Create modal content
            const modalContent = document.createElement("div");
            modalContent.className = "modal-content";
            
            // Create dark mode toggle
            const darkModeToggle = document.createElement("button");
            darkModeToggle.id = "dark-mode-toggle";
            darkModeToggle.textContent = "Toggle Dark Mode";
            darkModeToggle.addEventListener("click", () => {
                if(document.body.classList.toggle("dark")){ //Returns true if token is now present, and false otherwise.
                    window.ipc.updateConfig("IS_DARK", 1)
                }
                else{
                    window.ipc.updateConfig("IS_DARK", 0)
                }
            });

            // Create change window title input and button
            const titleInput = document.createElement("input");
            titleInput.id = "title-input";
            titleInput.type = "text";
            titleInput.placeholder = "Enter new window title";

            const titleButton = document.createElement("button");
            titleButton.id = "title-button";
            titleButton.textContent = "Change Title";
            titleButton.addEventListener("click", () => {
                const newTitle = titleInput.value;
                if (newTitle) {
                    document.title = newTitle;
                    window.ipc.updateConfig("WINDOW_TITLE", newTitle);
                }
                else{
                    document.title = "NMusic Player"
                    window.ipc.updateConfig("WINDOW_TITLE", "NMusic Player");
                }
            });

            // Append elements to modal content
            modalContent.appendChild(darkModeToggle);
            modalContent.appendChild(document.createElement("br")); // Line break for better layout
//            modalContent.appendChild(rpcToggle);
//            modalContent.appendChild(document.createElement("br")); // Line break for better layout
            modalContent.appendChild(titleInput);
            modalContent.appendChild(titleButton);

            // Append modal content to modal
            modal.appendChild(modalContent);

            // Append modal to body
            document.body.appendChild(modal);
        }

        // Show modal
        modal.classList.add("active");

        // Hide modal on click outside of content
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    devtoolButton.addEventListener("click", () => {
        window.ipc.openDevtools();
    })
});
