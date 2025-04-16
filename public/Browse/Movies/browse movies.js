let allMovies = [{}];
let selectedMovie = {};
let currentPage = 1;
let OMDB_API_Key = "c3424a43";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let genre = urlParams.get("genre");
let sort = urlParams.get("sort");


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkZWEwYWE0NWI0YjQ4NzUwNDBlOTFlYTMyNDMzZiIsIm5iZiI6MTc0MzM1NjI1Ny4wMzQsInN1YiI6IjY3ZTk4MTYxNzAwYTZhOTRjNmU1NjFhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZfUp1LrNIcQ2Q0pIZSYP5P1YgMaksjF50ckc6qoaiBg',
    }
};

async function populateGenres(genre) {
    const genreSelect = document.getElementById("genre");
    try {
        const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options);
        const data = await response.json();

        // Add genres to the dropdown
        data.genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await populateGenres(); // Ensure genres are loaded first
        getMoviesFromPage(currentPage); // Then load movies
    } catch (error) {
        console.error("Error initializing the page:", error);
    }
});

function redirectToMovie(movieID) {
    window.location.href = `../../Movie/Movie.html`;
}

async function drawMovies(movies){
    let moviesArea = document.querySelector("#movies-area");
    let html = ``;

    for(let movie of movies) {
        if(movie.poster_path === "N/A") continue;

        html += `
                <a onclick="redirectToMovie('${movie.id}')" class="movie" href="#">  
                    <div class="card">
                        <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}" style="width:100%">
                        <div class="container">
                            <h4><b>${movie.title}</b></h4>
                            <p>${movie.release_date.split("-")[0]}</p>
                        </div>
                    </div>
                </a>
            `;
    }
    moviesArea.innerHTML = html;
}

async function getMoviesFromPage(page) {
    if (!allMovies[page]){ // if the page is not already fetched
        if(sort || genre) {
            console.log("!sort && !genre");
            let response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sort}&with_genres=${genre}`, options);
            let TMDBData = await response.json();
            allMovies[page] = TMDBData.results;
        }
        else {
            let response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, options);
            let TMDBData = await response.json();
            allMovies[page] = TMDBData.results;
        }
    }

    console.log(allMovies[page]);
    drawMovies(allMovies[page]);

    // Change both pages buttons to current page number
    document.querySelector(".bottom").innerHTML = `
            <button class="page-button prev-page" onclick="prevPage()">Previous</button>
            <button class="page-button current-page">${page}</button>
            <button class="page-button next-page" onclick="nextPage()">Next</button>`;
    document.querySelector(".top").innerHTML = `
            <button class="page-button prev-page" onclick="prevPage()">Previous</button>
            <button class="page-button current-page">${page}</button>
            <button class="page-button next-page" onclick="nextPage()">Next</button>`;
}
 
function nextPage() {
    document.querySelector("#movies-area").innerHTML = `
            <div style="margin-right: auto; margin-left: auto; font-size: 20px">
                Loading . . .
            </div>
    `;
    currentPage++;
    getMoviesFromPage(currentPage);
}
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getMoviesFromPage(currentPage);
    }
}

