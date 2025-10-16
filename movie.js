//TMDb API Configuration
const API_URL = "https://api.themoviedb.org/3";
const API_KEY = "YOUR_API_KEY"; // replace with your own key if approved
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API = `${API_URL}/search/movie?api_key=${API_KEY}&query=`;
const RANDOM_API = `${API_URL}/movie/popular?api_key=${API_KEY}&page=`;

// DOM Elements
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

// DARK MODE (persistent)
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkToggle.checked = true;
}

darkToggle.addEventListener("change", () => {
  const theme = darkToggle.checked ? "dark" : "light";
  document.body.classList.toggle("dark-mode", darkToggle.checked);
  localStorage.setItem("theme", theme);
});

// RANDOM POPULAR MOVIE
async function getRandomMovie() {
  try {
    showLoading(true);
    errorMessage.textContent = "";

    const page = Math.floor(Math.random() * 10) + 1;
    const response = await axios.get(`${RANDOM_API}${page}`);
    const movies = response.data.results;

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      displayMovie(randomMovie);
    } else {
      showError("No movies found.");
    }
  } catch {
    showError("Error fetching movie. Please try again.");
  } finally {
    showLoading(false);
  }
}

// SEARCH MOVIES
async function searchMovie(query) {
  try {
    showLoading(true);
    errorMessage.textContent = "";
    searchResults.style.display = "none";
    resultsList.innerHTML = "";

    const response = await axios.get(`${SEARCH_API}${encodeURIComponent(query)}`);
    const results = response.data.results;

    if (results.length === 0) {
      showError("No movies found for your search.");
      return;
    }

    searchResults.style.display = "block";
    results.forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = movie.title;
      li.classList.add("result-item");
      li.addEventListener("click", () => displayMovie(movie));
      resultsList.appendChild(li);
    });
  } catch {
    showError("Search failed. Try again.");
  } finally {
    showLoading(false);
  }
}

// DISPLAY MOVIE DETAILS
function displayMovie(movie) {
  movieTitle.textContent = movie.title;
  movieOverview.textContent = movie.overview || "No overview available.";
  moviePoster.src = movie.poster_path
    ? `${IMG_PATH}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";
  moviePoster.alt = movie.title;

  movieDisplay.classList.add("animate__fadeIn");
  setTimeout(() => movieDisplay.classList.remove("animate__fadeIn"), 1000);
}

// LOADING HANDLER
function showLoading(show) {
  loadingSpinner.style.display = show ? "block" : "none";
}

// ERROR HANDLER
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("animate__shakeX");
  setTimeout(() => errorMessage.classList.remove("animate__shakeX"), 1000);
}

// EVENT LISTENERS
pickMovieBtn.addEventListener("click", getRandomMovie);
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMovie(query);
    searchInput.value = "";
  }
});
