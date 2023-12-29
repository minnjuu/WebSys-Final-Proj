
const apiKey = '569b146fafa5ac11afca0a031989f2d5';
let currentPage = 1;
let selectedGenre = '';

function fetchUpcomingMovies(page = 1) {
    currentPage = page;

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${currentPage}&with_genres=${selectedGenre}`;
    
    fetchMovies(url, displayMovies, 'upcomingMoviesList');
}

function createPageButtons(totalPages) {
    const paginationContainer = document.getElementById('pages');
    paginationContainer.innerHTML = '';

    // Previous Page
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&#8592;';
    prevButton.addEventListener('click', () => navigatePage(-1));
    paginationContainer.appendChild(prevButton);

    // Next Page
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&#8594;'; 
    nextButton.addEventListener('click', () => navigatePage(1));
    paginationContainer.appendChild(nextButton);

    function navigatePage(direction) {
        const newPage = currentPage + direction;


        if (newPage >= 1 && newPage <= totalPages) {
            fetchUpcomingMovies(newPage);
        }
    }
}


function fetchMovies(url, callback, containerId = 'moviesList') {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            callback(data.results, containerId);
            const totalPages = data.total_pages;
            createPageButtons(totalPages);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayMovies(movies, containerId = 'moviesList') {
    const moviesListContainer = document.getElementById(containerId);
    moviesListContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesListContainer.appendChild(movieCard);
    });
}

function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const posterPath = movie.poster_path;
    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'placeholder_image_url.jpg';

    const posterImage = document.createElement('img');
    posterImage.src = posterUrl;
    posterImage.alt = movie.title;

    movieCard.appendChild(posterImage);
    movieCard.appendChild(title);

    
    movieCard.addEventListener('click', () => navigateToMovieDetailsPage(movie.id));

    return movieCard;
}

function searchMovies() {
    const searchQuery = document.getElementById('searchInput').value;
    document.getElementById('upcomingMoviesList').style.display = 'none';
    document.getElementById('pages').style.display = 'none';
    document.getElementById('h2').innerHTML = `Search Result for ${searchQuery}`;

    let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`;

    fetchMovies(apiUrl, displayMovies);
    document.getElementById('genreFilter').value = '';
   
}
    
function applyGenreFilter() {
    selectedGenre = document.getElementById('genreFilter').value;
    fetchUpcomingMovies();
}



function navigateToMovieDetailsPage(movieId) {
    
    window.location.href = `movie-details.html?movieId=${movieId}`;
}

function initialize() {
    fetchUpcomingMovies();
    applyGenreFilter();
    document.getElementById('searchButton').addEventListener('click', searchMovies);
}

function goBack() {
    console.log('Going back...');
    document.getElementById('moviesList').style.display = 'none';
    document.getElementById('upcomingMoviesList').style.display = 'flex';
    document.getElementById('h2').innerHTML = `Upcoming Movies`;
    fetchUpcomingMovies();
}

function goForward() {
    window.history.forward();
}

document.getElementById('backButton').addEventListener('click', goBack);

document.getElementById('forwardButton').addEventListener('click', goForward);

window.onload = initialize;