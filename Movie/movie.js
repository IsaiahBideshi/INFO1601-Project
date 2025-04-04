const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let movieID = urlParams.get("MovieID");

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkZWEwYWE0NWI0YjQ4NzUwNDBlOTFlYTMyNDMzZiIsIm5iZiI6MTc0MzM1NjI1Ny4wMzQsInN1YiI6IjY3ZTk4MTYxNzAwYTZhOTRjNmU1NjFhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZfUp1LrNIcQ2Q0pIZSYP5P1YgMaksjF50ckc6qoaiBg'
    }
};
async function getMovieDetails() {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options);
    let m = await response.json();

    console.log(m);
    // console.log(m.imdb_id);

    let imdbResponse = await fetch(`http://www.omdbapi.com/?apikey=c3424a43&i=${m.imdb_id}`);
    let OMDBData = await imdbResponse.json();
    console.log(OMDBData);
    let imdbRating = OMDBData.imdbRating;


    let movieDetails = document.querySelector("#movie-area");
    let html = `
        <div id="movie-details">
            <img style="width: 20%" " src="https://image.tmdb.org/t/p/original${m.poster_path}" alt="${m.title}">
            <div id="details-area">
                <h1>${m.title}</h1>
                <b>Year: </b> ${m.release_date.split("-")[0]}<br>
                <b>Genre: </b> ${OMDBData.Genre}<br>
                <div id="rating">
                    <b>Ratings: </b> ${imdbRating} <img style="width: 30px;"src="imdb.png">
                    <br>
                </div>
                
                <b>Director: </b> ${OMDBData.Director}<br>
                <b>Cast: </b> ${OMDBData.Actors}<br>
                <b>Plot: </b> ${m.overview} <br>
            </div>
        </div>
    `;
    movieDetails.innerHTML = html;
}

getMovieDetails();