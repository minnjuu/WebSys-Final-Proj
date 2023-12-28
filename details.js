const apiKey = '569b146fafa5ac11afca0a031989f2d5';

function getMovieDetails() {
    const queryParams = new URLSearchParams(window.location.search);
    const movieId = queryParams.get('movieId');

    if (!movieId) {
        console.error('Movie ID not provided.');
        return;
    }

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
    const similarMoviesUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`;


    Promise.all([fetch(url), fetch(similarMoviesUrl)])
        .then(([movieResponse, similarMoviesResponse]) => {
            return Promise.all([movieResponse.json(), similarMoviesResponse.json()]);
        })
        .then(([movie, similarMovies]) => {
            displayMovieDetails(movie);
            displaySimilarMovies(similarMovies.results);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displaySimilarMovies(similarMovies) {
    const similarMoviesContainer = document.createElement('div');
    similarMoviesContainer.classList.add('similar-movies-container');

    const heading = document.createElement('h2');
    heading.textContent = 'Similar Movies';

    const similarMoviesList = document.createElement('div');
    similarMoviesList.classList.add('similar-movies-list');

    similarMovies.forEach(similarMovie => {
        const similarMovieCard = createMovieCard(similarMovie);
        similarMoviesList.appendChild(similarMovieCard);
    });

    similarMoviesContainer.appendChild(heading);
    similarMoviesContainer.appendChild(similarMoviesList);

    document.getElementById('movieDetails').appendChild(similarMoviesContainer);
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


function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movieDetails');
    movieDetailsContainer.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const releaseDate = document.createElement('p');
    releaseDate.innerHTML = `<strong>Release Date:</strong> ${movie.release_date}`;

    const rating = document.createElement('p');
    rating.innerHTML = `<strong>Rating:</strong> ${movie.vote_average}`;


    const genre = document.createElement('p');
    genre.innerHTML = `<strong>Genre:</strong> ${movie.genres.map(genre => genre.name).join(', ')}`;


    const story = document.createElement('p');
    story.textContent = movie.overview;

    const posterPath = movie.poster_path;
    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'placeholder_image_url.jpg';

    const posterImage = document.createElement('img');
    posterImage.src = posterUrl;
    posterImage.alt = movie.title;

    movieDetailsContainer.appendChild(title);
    movieDetailsContainer.appendChild(posterImage);
    movieDetailsContainer.appendChild(releaseDate);
    movieDetailsContainer.appendChild(rating);
    movieDetailsContainer.appendChild(genre);
    movieDetailsContainer.appendChild(story);
}

function navigateToMovieDetailsPage(movieId) {

    window.location.href = `movie-details.html?movieId=${movieId}`;
}

window.onload = getMovieDetails;