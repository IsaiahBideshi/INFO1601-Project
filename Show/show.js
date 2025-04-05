const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let showID = urlParams.get("ShowID");

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkZWEwYWE0NWI0YjQ4NzUwNDBlOTFlYTMyNDMzZiIsIm5iZiI6MTc0MzM1NjI1Ny4wMzQsInN1YiI6IjY3ZTk4MTYxNzAwYTZhOTRjNmU1NjFhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZfUp1LrNIcQ2Q0pIZSYP5P1YgMaksjF50ckc6qoaiBg'
    }
};
async function getMovieDetails() {
    let response = await fetch(`https://api.themoviedb.org/3/tv/${showID}?language=en-US`, options);
    let TMDBData = await response.json();

    console.log(`Searching for "${TMDBData.name}" year "${TMDBData.first_air_date.split("-")[0]}"`);
    response = await fetch(`http://www.omdbapi.com/?apikey=c3424a43&t=${TMDBData.name}`);
    let OMDBData = await response.json();

    console.log(OMDBData);
    console.log(TMDBData);

    let director = "";
    try{
        for (let i = 0; i < TMDBData.created_by.length; i++) {
            director += TMDBData.created_by[i].name + ", ";
        }
        director = director.slice(0, -2);
        if (director.length === 0) {
            director = OMDBData.Director;
        }
    }catch(err){
        console.log(err)
        director = OMDBData.Director;
    }

    console.log(director);

    let genres = "";
    for (let i = 0; i < TMDBData.genres.length; i++) {
        genres += TMDBData.genres[i].name + ", ";
    }
    genres = genres.slice(0, -2);


    let movieDetails = document.querySelector("#movie-area");
    let html = `
        <div id="movie-details">
            <img style="width: 15em;height: 25em" src="https://image.tmdb.org/t/p/original${TMDBData.poster_path}" alt="${TMDBData.title}">
            <div id="details-area">
                <h1>${TMDBData.name}</h1>
                <b>Year: </b> ${TMDBData.first_air_date.split("-")[0]}<br>
                <b>Genre: </b> ${genres}<br>
                <div id="rating">
                    <b>Ratings: </b> ${OMDBData.imdbRating} <img style="width: 30px"src="imdb.png">
                    <br>
                </div>
           
                <b>Created By: </b> ${director}<br>
                <b>Cast: </b> ${OMDBData.Actors} <br>
                <b>Plot: </b> ${TMDBData.overview} <br>
            </div>
        </div>
    `;
    movieDetails.innerHTML = html;
}

getMovieDetails();