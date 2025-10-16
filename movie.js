// 🎬 TMDb API Configuration
const API_URL = "https://api.themoviedb.org/3";
const API_KEY = "YOUR_API_KEY"; // replace with your own if approved to use one
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API = `${API_URL}/search/movie?api_key=${API_KEY}&query=`;
const RANDOM_API = `${API_URL}/movie/popular?api_key=${API_KEY}&page=`;

const movieDisplay = document.getElementById("movie-display");
const movieTitle = document.getElementById("movie-title");
const moviePoster = document.getElementById("movie-poster");
const movieOverview = document.getElementById("movie-overview");
const errorMessage = document.getElementById("error-message");
const loadingSpinner = document.getElementById("loading-spinner");
const resultsList = document.getElementById("results-list");
const searchResults = document.getElementById("search-results");

const pickMovieBtn = document.getElementById("pick-movie");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const darkToggle = document.getElementById("dark-toggle");

// 🌙 DARK MODE SETUP (with memory)
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkToggle.checked = true;
}

darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});
