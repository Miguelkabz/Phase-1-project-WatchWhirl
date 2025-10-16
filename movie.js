const API_URL = "https://api.themoviedb.org/3";
const API_KEY = "60b1492de30a836cec7e69c34d6302f4";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

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

// ===== Modes =====
const modes = {
  light: { '--bg-color':'#fff1f0','--text-color':'#d84315','--button-bg':'#ff7043','--button-hover':'#f4511e','--accent-color':'#ff7043','--app-box-shadow':'0 4px 10px rgba(0,0,0,0.1)','--result-bg':'#f3f3f3','--result-hover':'#e2e2e2','--poster-shadow':'rgba(0,0,0,0.2)' },
  dark: { '--bg-color':'#1a001a','--text-color':'#e600ff','--button-bg':'#9b00ff','--button-hover':'#7d00cc','--accent-color':'#e600ff','--app-box-shadow':'0 0 20px #e600ff','--result-bg':'#2a002a','--result-hover':'#3a003a','--poster-shadow':'rgba(230,0,255,0.5)' },
  neon: { '--bg-color':'#000000','--text-color':'#39ff14','--button-bg':'#ff00ff','--button-hover':'#00ffff','--accent-color':'#39ff14','--app-box-shadow':'0 0 30px #39ff14','--result-bg':'#111111','--result-hover':'#222222','--poster-shadow':'#39ff14' },
  pastel: { '--bg-color':'#fdf6f0','--text-color':'#6a1b9a','--button-bg':'#f8bbd0','--button-hover':'#f48fb1','--accent-color':'#f8bbd0','--app-box-shadow':'0 4px 10px rgba(106,27,154,0.3)','--result-bg':'#f3e5f5','--result-hover':'#e1bee7','--poster-shadow':'rgba(106,27,154,0.3)' },
  ocean: { '--bg-color':'#e0f7fa','--text-color':'#006064','--button-bg':'#00acc1','--button-hover':'#00838f','--accent-color':'#00acc1','--app-box-shadow':'0 4px 10px rgba(0,172,193,0.3)','--result-bg':'#b2ebf2','--result-hover':'#80deea','--poster-shadow':'rgba(0,172,193,0.3)' }
};

// Apply a mode
function applyMode(modeName) {
  const root = document.documentElement;
  const mode = modes[modeName];
  for (const prop in mode) {
    root.style.setProperty(prop, mode[prop]);
  }
  localStorage.setItem('selectedMode', modeName);
}

// Load saved mode on page load
const savedMode = localStorage.getItem('selectedMode') || 'light';
applyMode(savedMode);
modeSelector.value = savedMode;

// Mode dropdown event
modeSelector.addEventListener('change', () => applyMode(modeSelector.value));

// Optional: keep dark toggle in sync
darkToggle.addEventListener('change', () => {
  if (darkToggle.checked) {
    applyMode('dark');
    modeSelector.value = 'dark';
  } else {
    applyMode('light');
    modeSelector.value = 'light';
  }
});


/* DARK MODE SETUP */
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

/* FETCH RANDOM POPULAR MOVIE */
async function getRandomMovie() {
  try {
    showLoading(true);
    errorMessage.textContent = "";

    const page = Math.floor(Math.random() * 10) + 1;
    const response = await axios.get(`${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
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

/* SEARCH MOVIES */
async function searchMovie(query) {
  try {
    showLoading(true);
    errorMessage.textContent = "";
    resultsList.innerHTML = "";
    searchResults.classList.add("hidden");

    const response = await axios.get(`${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
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

/* DISPLAY MOVIE DETAILS */
function displayMovie(movie) {
  movieTitle.textContent = movie.title;
  movieOverview.textContent = movie.overview || "No overview available.";
  moviePoster.src = movie.poster_path
    ? `${IMG_PATH}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";
  moviePoster.alt = movie.title;

  movieDisplay.classList.remove("hidden");
}

/* SHOW/HIDE LOADING */
function showLoading(show) {
  loadingSpinner.classList.toggle("hidden", !show);
}

/* EVENTS */
pickMovieBtn.addEventListener("click", getRandomMovie);
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMovie(query);
    searchInput.value = "";
  }
});

/* INITIAL RANDOM MOVIE */
getRandomMovie();
