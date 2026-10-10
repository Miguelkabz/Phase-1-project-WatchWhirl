# WatchWhirl 🎬

WatchWhirl is a movie-discovery web app built with JavaScript and the TMDB API. It gives users a place to explore films and search for titles.

## Features

- Search for movies by title.
- Browse movie listings and discover films.
- View movie information returned by TMDB.
- Responsive interface for desktop and mobile screens.

> Feature descriptions should match the current implementation. If a feature is unfinished, update this list before presenting the project as complete.

## Tech stack

- JavaScript
- HTML and CSS
- TMDB API
- Vite (development server)

## Run locally

### Requirements
- Node.js 18 or newer
- npm

### Setup

```bash
git clone https://github.com/Miguelkabz/Phase-1-project-WatchWhirl.git
cd Phase-1-project-WatchWhirl
npm install
```

Create a `.env` file in the project root and add your TMDB API key using the variable name expected by the application. For example, if the code reads `VITE_TMDB_API_KEY`:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Then start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal.

## API access

WatchWhirl uses the [TMDB API](https://developer.themoviedb.org/docs). Obtain your own API key from TMDB and keep private credentials out of Git. Vite variables prefixed with `VITE_` are exposed to client-side code, so they should not be treated as secrets.

## Project links

- Source code: https://github.com/Miguelkabz/Phase-1-project-WatchWhirl
- TMDB: https://www.themoviedb.org/

## Author

**Miguel Gicheru**  
GitHub: https://github.com/Miguelkabz

## Next improvements

- Add screenshots or a short demo GIF.
- Add a deployed demo link when available.
- Document any implemented filters, favourites, or movie-detail views.
- Add clear loading, empty-search, and API-error states where needed.
