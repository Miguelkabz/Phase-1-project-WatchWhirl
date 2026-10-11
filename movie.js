const API_URL = "/api/tmdb";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

const movieDisplay = document.getElementById("movie-display");
const movieTitle = document.getElementById("movie-title");
const moviePoster = document.getElementById("movie-poster");
const movieOverview = document.getElementById("movie-overview");
const movieRating = document.getElementById("movie-rating");
const movieGenres = document.getElementById("movie-genres");
const errorMessage = document.getElementById("error-message");
const loadingSpinner = document.getElementById("loading-spinner");
const resultsList = document.getElementById("results-list");
const searchResults = document.getElementById("search-results");

const pickMovieBtn = document.getElementById("pick-movie");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const darkToggle = document.getElementById("dark-toggle");

// ====== DARK MODE SETUP ======
function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme on page load
if (localStorage.getItem("theme") === "dark") {
  setDarkMode(true);
  darkToggle.checked = true;
}

// Toggle event
darkToggle.addEventListener("change", () => {
  setDarkMode(darkToggle.checked);
});

// ====== FETCH RANDOM POPULAR MOVIE ======
async function getRandomMovie() {
  try {
    showLoading(true);
    errorMessage.textContent = "";

    const page = Math.floor(Math.random() * 10) + 1;
    const response = await axios.get(
  `${API_URL}?action=popular&page=${page}`
);
    const movies = response.data.results;

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      displayMovie(randomMovie);
    } else {
      errorMessage.textContent = "No movies found.";
    }
  } catch (error) {
    errorMessage.textContent = "Error fetching movie. Please try again.";
  } finally {
    showLoading(false);
  }
}

// ====== SEARCH MOVIES ======
async function searchMovie(query) {
  try {
    showLoading(true);
    errorMessage.textContent = "";
    resultsList.innerHTML = "";
    searchResults.classList.add("hidden");
    
const response = await axios.get(
`/api/tmdb?action=search&query=${encodeURIComponent(query)}`
);

    const results = response.data.results;

    if (results.length === 0) {
      errorMessage.textContent = "No movies found for your search.";
      return;
    }

    searchResults.classList.remove("hidden");
    results.forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = movie.title;
      li.classList.add("result-item");
      li.addEventListener("click", () => displayMovie(movie));
      resultsList.appendChild(li);
    });
  } catch (error) {
    errorMessage.textContent = "Search failed. Try again.";
  } finally {
    showLoading(false);
  }
}

// ====== FETCH GENRES LIST ======
let genresMap = {};
async function fetchGenres() {
  try {
    const response = await axios.get(
  `${API_URL}?action=genres`
);
    response.data.genres.forEach((genre) => {
      genresMap[genre.id] = genre.name;
    });
  } catch (error) {
    console.error("Failed to fetch genres", error);
  }
}

// ====== DISPLAY MOVIE DETAILS ======
function displayMovie(movie) {
  movieTitle.textContent = movie.title;
  movieOverview.textContent = movie.overview || "No overview available.";

  // Rating
  movieRating.textContent = movie.vote_average
    ? `Rating: ${movie.vote_average} ⭐`
    : "Rating: N/A";

  // Genres
  if (movie.genre_ids && movie.genre_ids.length > 0) {
    const genreNames = movie.genre_ids.map((id) => genresMap[id]).filter(Boolean);
    movieGenres.textContent = genreNames.length ? `Genres: ${genreNames.join(", ")}` : "";
  } else {
    movieGenres.textContent = "";
  }

  // Poster
  moviePoster.src = movie.poster_path
    ? `${IMG_PATH}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";
  moviePoster.alt = movie.title;

  movieDisplay.classList.remove("hidden");
}

// ====== SHOW/HIDE LOADING ======
function showLoading(show) {
  loadingSpinner.classList.toggle("hidden", !show);
}

// ====== EVENTS ======
pickMovieBtn.addEventListener("click", getRandomMovie);
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMovie(query);
    searchInput.value = "";
  }
});

// ====== INITIAL SETUP ======
fetchGenres().then(() => getRandomMovie());
