let allMovies = [{}];
let allShows = [{}];

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkZWEwYWE0NWI0YjQ4NzUwNDBlOTFlYTMyNDMzZiIsIm5iZiI6MTc0MzM1NjI1Ny4wMzQsInN1YiI6IjY3ZTk4MTYxNzAwYTZhOTRjNmU1NjFhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZfUp1LrNIcQ2Q0pIZSYP5P1YgMaksjF50ckc6qoaiBg'
    }
};

let currentMoviePage = 1;
let currentShowPage = 1;

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('query');

document.querySelector("#search-query").innerHTML = searchQuery;

function redirectToMovie(movieID){
    window.location.href = `../../Movie/Movie.html?MovieID=${movieID}`;
}
function redirectToShow(showID){
    window.location.href = `../../Show/Show.html?ShowID=${showID}`;
}

function drawData(data, element, type) {
    let area = document.querySelector(element);
    let html = ``;

    for(let movie of data) {
        let img = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        if(movie.poster_path === "N/A" || !movie.poster_path) {
            img = "../assets/no-poster-found.png";
        }

        if (type === "movie" && movie.release_date) {
            html += `
                    <a onclick="window.location.href = '../../public/Movie/Movie.html?MovieID=${movie.id}'" class="movie" href="#">  
                        <div class="card">
                            <img src=${img} alt="${movie.title}" style="width:100%">
                            <div class="container">
                                <h4><b>${movie.title}</b></h4>
                                <p>${movie.release_date.split("-")[0]}</p>
                            </div>
                        </div>
                    </a>
            `;
        } else if (type === "tv" && movie.first_air_date) {
            html += `
                <a onclick="window.location.href = '../../public/Show/Show.html?ShowID=${movie.id}'" class="movie" href="#">  
                    <div class="card">
                        <img src=${img} alt="${movie.name}" style="width:100%">
                        <div class="container">
                            <h4><b>${movie.name}</b></h4>
                            <p>${movie.first_air_date.split("-")[0]}</p>
                        </div>
                    </div>
                </a>
            `;
        }
        else continue;
    }
    area.innerHTML = html;
}

async function getData(page, type){
    let response = await fetch(`https://api.themoviedb.org/3/search/${type}?query=${searchQuery}&include_adult=false&language=en-US&page=${page}`, options);
    let TMDBData = await response.json();

    if (TMDBData.results.length === 0) {
        getData(page-1, type);
        if (type === "movie") {
            currentMoviePage--;
        }
        else if (type === "tv") {
            currentShowPage--;
        }
    }

    if (type === "movie") {
        allMovies[page] = TMDBData.results;
        console.log(allMovies[page]);
        drawData(allMovies[page], "#movies-area", type);
        document.querySelector(".movies").innerHTML = `
            <button class="page-button prev-page" onclick="prevPageMovie()">Previous</button>
            <button class="page-button current-page">${page}</button>
            <button class="page-button next-page" onclick="nextPageMovie()">Next</button>`;
    }
    else if (type === "tv") {
        allShows[page] = TMDBData.results;
        console.log(allShows[page]);
        drawData(allShows[page], "#shows-area", type);
        document.querySelector(".shows").innerHTML = `
            <button class="page-button prev-page" onclick="prevPageShow()">Previous</button>
            <button class="page-button current-page">${page}</button>
            <button class="page-button next-page" onclick="nextPageShow()">Next</button>`;
    }

    console.log(type);

}


window.nextPageMovie = function nextPageMovie() {
    document.querySelector("#movies-area").innerHTML = `
            <div style="margin-right: auto; margin-left: auto; font-size: 20px">
                Loading . . .
            </div>
    `;
    currentMoviePage++;
    getData(currentMoviePage, "movie");
}
window.prevPageMovie = function prevPageMovie() {
    if (currentMoviePage > 1) {
        currentMoviePage--;
        getData(currentMoviePage, "movie");
    }
}



window.nextPageShow = function nextPageShow() {
    document.querySelector("#shows-area").innerHTML = `
            <div style="margin-right: auto; margin-left: auto; font-size: 20px">
                Loading . . .
            </div>
    `;
    currentShowPage++;
    getData(currentShowPage, "tv");
}
window.prevPageShow = function prevPageShow() {
    if (currentShowPage > 1) {
        currentShowPage--;
        getData(currentShowPage, "tv");
    }
}

getData(currentMoviePage, "movie");
getData(currentShowPage, "tv");
