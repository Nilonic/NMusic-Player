document.addEventListener('DOMContentLoaded', () => {
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
        audio.play();
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
            audio.play();
            playPauseButton.textContent = 'Pause'; // Update play/pause button text
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
    const status = isPaused ? 'paused' : 'playing';
    window.rpc.updatePresence(songName, status, isPaused, timeRemaining);
}
