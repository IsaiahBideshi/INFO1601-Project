let allMovies = [{}];
let currentPage = 1;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkZWEwYWE0NWI0YjQ4NzUwNDBlOTFlYTMyNDMzZiIsIm5iZiI6MTc0MzM1NjI1Ny4wMzQsInN1YiI6IjY3ZTk4MTYxNzAwYTZhOTRjNmU1NjFhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZfUp1LrNIcQ2Q0pIZSYP5P1YgMaksjF50ckc6qoaiBg'
    }
};

function drawMovies(movies){
    let moviesArea = document.querySelector("#movies-area");
    let html = ``;
    for(let movie of movies) {
        if (!movie.poster_path) continue;
        html += `
                <a class="movie" href="#">
                    <div class="card">
                        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" style="width:100%">
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
    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, options)
    let data = await response.json();

    allMovies[page] = data.results;

    console.log(allMovies);
    drawMovies(data.results);

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
    currentPage++;
    getMoviesFromPage(currentPage);
}
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getMoviesFromPage(currentPage);
    }
}

getMoviesFromPage(currentPage);