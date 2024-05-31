# NMusic Player - README

## Overview

NMusic Player is a lightweight music player application developed using Electron, designed with simplicity and functionality in mind. One of the standout features of NMusic Player is its Discord Rich Presence (RPC) integration, allowing users to display their currently playing music on their Discord profile. This project focuses on basic playback capabilities for .mp3 files and is primarily a side project complementing a larger development endeavor.

## Features

### Current Features

1. **Discord RPC Integration**
   - NMusic Player supports Discord Rich Presence, enabling you to share your current music track with friends and server members on Discord.

2. **MP3 Playback**
   - The application supports the playback of .mp3 files, providing a straightforward way to listen to your music library. right now it only supports playing a single file, and no playlist, but we're working on that... slowly

### Planned Features

- **Playlists**
   - yup. playlists. they won't be good, but they'll work

## Installation

To use NMusic Player, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Nilonic/NMusic-Player.git
   cd nmusic-player
   ```

2. **Install Dependencies**
   Ensure you have Node.js and npm installed, then run:
   ```bash
   npm install
   ```

3. **Start the Application**
   ```bash
   npm start
   ```

## Usage

1. **Launching the Player**
   - Run the application using `npm start`. This will open the NMusic Player window.

2. **Playing Music**
   - Add your .mp3 files to the player by dragging and dropping them into the application window or using the file selection dialog. yet again, right now it only supports playing a single file, and no playlist, but we're working on that... slowly

3. **Discord RPC**
   - Once music is playing, your current track information will be automatically displayed on your Discord profile, enhancing your listening experience and sharing it with friends. [examples](examples/rpc/)

## Contributing

While there are no planned features for this project, contributions are still welcome. If you have ideas or improvements, please:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-idea`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-idea`).
5. Create a new Pull Request.

## Feedback and Support

If you have any questions, encounter issues, or have feature requests, feel free to open an issue on the GitHub repository. Your feedback is valuable and appreciated.

## License

NMusic Player is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for using NMusic Player! Enjoy your music and stay connected with your friends on Discord.