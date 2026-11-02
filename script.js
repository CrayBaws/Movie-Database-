// --------------------
// DOM ELEMENTS
// --------------------
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const moviesGrid = document.querySelector("#moviesGrid");
const resultsInfo = document.querySelector("#resultsInfo");

const prevPageBtn = document.querySelector("#prevPage");
const nextPageBtn = document.querySelector("#nextPage");

// --------------------
// STATE
// --------------------
let currentQuery = "";
let currentPage = 1;
let currentResults = [];

// --------------------
// FALLBACK POSTER
// --------------------
const fallbackPoster = "./assets/Designer.png";

// --------------------
// FETCH MOVIES
// --------------------
async function fetchMovies(query, page = 1) {
  currentQuery = query;
  currentPage = page;

  resultsInfo.innerHTML = `<span>Showing:</span> ${query}`;

  moviesGrid.innerHTML = `
    <div class="loading">
      <div class="loading__spinner"></div>
      <p>Loading movies...</p>
    </div>
  `;

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=7121848d&s=${encodeURIComponent(query)}&page=${page}`
    );

    const data = await res.json();

    if (data.Search) {
      currentResults = data.Search;
      renderMovies(currentResults);
    } else {
      currentResults = [];
      moviesGrid.innerHTML = `<p>No results found.</p>`;
    }
  } catch (err) {
    console.error("Error fetching movies:", err);
    moviesGrid.innerHTML = `<p>Error fetching data.</p>`;
  }
}

// --------------------
// RENDER MOVIES
// --------------------
function renderMovies(list) {
  moviesGrid.innerHTML = list
    .map((movie) => {
      const poster =
        movie.Poster && movie.Poster !== "N/A"
          ? movie.Poster
          : fallbackPoster;

      return `
        <div class="movie-card">
          <img
            class="movie-card__img"
            src="${poster}"
            alt="${movie.Title}"
            onerror="this.onerror=null; this.src='${fallbackPoster}';"
          >

          <h2 class="movie-card__title">${movie.Title}</h2>
          <p class="movie-card__year">${movie.Year}</p>
        </div>
      `;
    })
    .join("");
}

// --------------------
// SORT RESULTS
// --------------------
function sortResults() {
  const sorted = [...currentResults];

  switch (sortSelect.value) {
    case "a-z":
      sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      break;

    case "z-a":
      sorted.sort((a, b) => b.Title.localeCompare(a.Title));
      break;

    case "newest":
      sorted.sort((a, b) => Number(b.Year) - Number(a.Year));
      break;

    case "oldest":
      sorted.sort((a, b) => Number(a.Year) - Number(b.Year));
      break;

    default:
      break;
  }

  renderMovies(sorted);
}

// --------------------
// EVENT LISTENERS
// --------------------
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (query) {
    fetchMovies(query, 1);
  }
});

sortSelect.addEventListener("change", sortResults);

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    fetchMovies(currentQuery, currentPage - 1);
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentQuery) {
    fetchMovies(currentQuery, currentPage + 1);
  }
});

// --------------------
// INITIAL LOAD
// --------------------
fetchMovies("Lord of the Rings", 1);