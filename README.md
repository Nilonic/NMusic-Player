# NMusic Player - README

<!--
if you can see this, hey!
you're probably looking at the source code (or raw file)
that's cool, i'm just gonna say this:
i'm most likely gonna change the discord client id randomly
so if the RPC name changes, don't worry, it'll probably go back soon

also, if you are cloning this, how's it going? i'll make a community server for this if y'all want to
-->

[![Dependabot Updates](https://github.com/Nilonic/NMusic-Player/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/Nilonic/NMusic-Player/actions/workflows/dependabot/dependabot-updates)[![CodeQL](https://github.com/Nilonic/NMusic-Player/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/Nilonic/NMusic-Player/actions/workflows/github-code-scanning/codeql)

<!--CodeQL is on-push, Dependabot is daily-->

# NOTICE: ARCHIVED! see [here](https://github.com/Nilonic/NMusicPlayerV2) for new version

## Overview

NMusic Player is a lightweight and very minimalistic music player developed using Electron, designed with simplicity and functionality in mind. One of the standout features of NMusic Player is its Discord Rich Presence (RPC) integration, allowing users to display their currently playing music on their Discord profile. This project focuses on basic playback capabilities for .mp3 files and is primarily a side project complementing a larger development endeavor.

also: made to be hackable (soon&#8482;)

## Features

### Current Features

1. **Discord RPC Integration**
   - NMusic Player supports Discord Rich Presence, enabling you to share your current music track with friends and server members on Discord.

2. **MP3/FLAC Playback**
   - The application supports the playback of .mp3 and .flac files, providing a straightforward way to listen to your music library. playlists work, but you'll have to select each file individually

3. **Default dark mode**
   - Yup, we default to dark mode. it can be changed in the config menu (or the .env file)

### Planned Features

- **Plugins**
   - i don't have anything to say here. just know we'll be adding plugin support

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
<!--
can't really hide much in a public repo, can we?
in all seriousness tho. i'll figure out how to make extensions work, no matter how much it hurts
i mean, how hard could it be? (last words)
 - Nilon
-->
## Usage

1. **Launching the Player**
   - Run the application using `npm start`. This will open the NMusic Player window.

2. **Playing Music**
   - Add your .mp3 files to the player by dragging and dropping them over the "choose files" button, or using the file selection dialog.
3. **Discord RPC**
   - Once music is playing, your current track information will be automatically displayed on your Discord profile, enhancing your listening experience and sharing it with friends. [examples](examples/rpc/)
   - RPC can be disabled in the .env file, by setting "RPC_ENABLED" to 0

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
