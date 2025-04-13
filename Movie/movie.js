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

async function addReview(){
    console.log("Adding review " + movieID);

    let movieData = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options);
    movieData = await movieData.json();
    console.log(movieData);

    let reviewModal = document.querySelector("#reviewModal");
    let reviewContent = document.querySelector(".review-content");
    reviewModal.style.display = "block";
    reviewModal.style.overflow = "hidden";
    reviewContent.style.display = "block";

    reviewContent.innerHTML = `
        <span onclick="document.querySelector('#reviewModal').style.display = 'none';" class="close">&times;</span>
        <h1>Add Your Review</h1>
        
        <span id="movie-name">
            <b> ${movieData.title} </b> <span id="date">${movieData.release_date.split("-")[0]}</span>
        </span>
        
        <div>
            <img style="width: 20%; border-radius: 5px" src="https://image.tmdb.org/t/p/original${movieData.poster_path}" alt="">
        </div>

        <textarea id="reviewText" placeholder="Write your review here..." rows="8" style="min-width: 100%; max-width: 100%; margin-top: 10px; overflow: auto;resize: none"></textarea>
        
        <div style="margin-top: 10px;">
            <label for="reviewDate"><b>Date Watched:</b></label>
            <input type="date" id="reviewDate" style="margin-left: 10px;">
        </div>

        <div style="margin-top: 10px;">
            <label for="rewatched"><b>Rewatched:</b></label>
            <input type="checkbox" id="rewatched" style="margin-left: 10px;">
        </div>

        <div style="margin-top: 10px;">
            <label for="ratingDropdown"><b>Rating:</b></label>
            <select id="ratingDropdown" style="margin-left: 10px;">
                ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
            </select>
            /10
        </div>
        
        <div style="margin-top: 0;">
            <button id="heartButton" style="background: none; border: none; cursor: pointer; font-size: 24px; color: gray;padding-left: 0">
                &#10084;
            </button>
            <span>Did you like the movie?</span>
        </div>
        

        <button id="submitReviewButton" style="margin-top: 20px;">Save</button>
    `;

    // Add event listener for the heart button
    const heartButton = document.getElementById("heartButton");
    let isHearted = false;
    heartButton.addEventListener("click", () => {
        heartButton.style.color = heartButton.style.color === "red" ? "gray" : "red";
        isHearted = !isHearted;
    });
}

async function getMovieDetails() {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options);
    let TMDBData = await response.json();

    response = await fetch(`http://www.omdbapi.com/?apikey=c3424a43&i=${TMDBData.imdb_id}`);

    let OMDBData = await response.json();

    console.log(TMDBData);
    console.log(OMDBData);

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

    let movieDetails = document.querySelector("#movie-area");
    let html = `
        <div id="movie-details">
            <img style="width: 15em;height: 25em" src="https://image.tmdb.org/t/p/original${TMDBData.poster_path}" alt="${TMDBData.title}">
            <div id="details-area">
                <h1>${TMDBData.title}</h1>
                <b>Release Date: </b> ${TMDBData.release_date}<br>
                <b>Genre: </b> ${OMDBData.Genre}<br>
                <div id="rating">
                    <b>Ratings: </b> ${OMDBData.imdbRating} <img style="width: 30px"src="imdb.png">
                    <br>
                </div>
                
                <b>Created By: </b> ${director}<br>
                <b>Cast: </b> ${OMDBData.Actors}<br>
                <b>Plot: </b> ${TMDBData.overview} <br>
                <a id="reviewButton" onclick="addReview()" href="#">Add a review</a>
            </div>
        </div>
    `;
    movieDetails.innerHTML = html;
}

getMovieDetails();