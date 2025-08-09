# SingSearch: Find Your Song

SingSearch is a web application that helps users identify songs by singing or providing a snippet of lyrics. It leverages APIs like AudD and Genius to find song matches and display lyrics.

## Features

- **Microphone Input**: Tap the microphone button to record a 15-second audio snippet for song identification.
- **Lyric Search**: Paste a snippet of lyrics to search for matching songs.
- **Song Metadata**: Displays song title, artist, album, release date, and confidence score.
- **Lyrics Display**: Shows the lyrics of the identified song.
- **External Links**: Provides links to external sources like Genius, Spotify, or Deezer for more information.

## How It Works

1. **Audio Identification**: Records audio using the browser's microphone and sends it to the AudD API for song identification.
2. **Lyric Search**: Queries the Genius API for song matches based on the provided lyrics.
3. **Fallback Mechanism**: If the primary API fails, it falls back to alternative methods like transcription and text-based search.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd songs-to-lyrics
   ```
3. Install dependencies (if applicable):
   ```bash
   npm install
   ```
4. Start a local server to serve the `index.html` file. For example, using Python:
   ```bash
   python3 -m http.server
   ```
5. Open the application in your browser:
   ```
   http://localhost:8000
   ```

## API Endpoints

- `/api/audd`: Proxy endpoint for AudD API to identify songs from audio.
- `/api/genius-search`: Searches for songs on Genius based on lyrics.
- `/api/audd-lyrics`: Fetches lyrics from AudD API.
- `/api/transcribe`: Transcribes audio to text for fallback search.

## File Structure

- `index.html`: Main HTML file containing the application UI and logic.
- `netlify.toml`: Configuration file for deploying the app on Netlify.
- `package.json`: Contains metadata and dependencies for the project.
- `sample.mp3`: Sample audio file for testing.

## Deployment

This project can be deployed on platforms like Netlify. Ensure the API endpoints are properly configured in the deployment environment.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [AudD API](https://audd.io/)
- [Genius API](https://genius.com/)

## Live Demo

You can access the live version of SingSearch here:
[https://fantastic-pie-0de387.netlify.app/](https://fantastic-pie-0de387.netlify.app/)

---

Enjoy finding your favorite songs with SingSearch!
