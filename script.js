
const apiKey = '569b146fafa5ac11afca0a031989f2d5';

function fetchUpcomingMovies() {
    fetchMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`, displayMovies, 'upcomingMoviesList');
}

function fetchMovies(url, callback, containerId = 'moviesList') {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data.results, containerId))
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

    // Add an event listener to navigate to a separate page with movie details
    movieCard.addEventListener('click', () => navigateToMovieDetailsPage(movie.id));

    return movieCard;
}




function initialize() {
    fetchUpcomingMovies();
}


window.onload = initialize;