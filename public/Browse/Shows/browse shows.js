let allShows = [{}];
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
        const response = await fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', options);
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

window.redirectToMovie = function redirectToMovie(showID) {
    window.location.href = `../../Show/Show.html?ShowID=${showID}`;
}

async function drawShows(shows, element="#movies-area") {
    let moviesArea = document.querySelector(element);
    let html = ``;

    for(let show of shows) {
        let img = `https://image.tmdb.org/t/p/original${show.poster_path}`;
        if(show.poster_path === "N/A" || !show.poster_path) {
            img = "../../assets/no-poster-found.png";
        }

        html += `
                <a onclick="redirectToMovie('${show.id}')" class="movie" href="#">  
                    <div class="card">
                        <img src=${img} alt="${show.name}" style="width:100%">
                        <div class="container">
                            <h4><b>${show.name}</b></h4>
                            <p>${show.first_air_date.split("-")[0]}</p>
                        </div>
                    </div>
                </a>
            `;
    }
    moviesArea.innerHTML = html;
}

async function getShowsFromPage(page) {
    let arr = [];
    if(!allShows[page]){ // if the page is not already fetched
        if(sort || genre) {
            let response = await fetch(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&with_genres=${genre}&page=${page}&sort_by=${sort}`, options);
            let TMDBData = await response.json();
            console.log(TMDBData);
            allShows[page] = TMDBData.results;
        }
        else {
            let response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=${page}`, options);
            let TMDBData = await response.json();
            console.log(TMDBData);
            allShows[page] = TMDBData.results;
        }

    }

    drawShows(allShows[page]);

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

window.nextPage = function nextPage() {
    document.querySelector("#movies-area").innerHTML = `
            <div style="margin-right: auto; margin-left: auto; font-size: 20px">
                Loading . . .
            </div>

`;
    currentPage++;
    getShowsFromPage(currentPage);
}
window.prevPage = function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getShowsFromPage(currentPage);
    }
}

console.log("here");
getShowsFromPage(currentPage);
