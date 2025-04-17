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

window.addReview = async function addReview() {
    console.log("Adding review " + showID);

    let showData = await fetch(`https://api.themoviedb.org/3/tv/${showID}?language=en-US`, options);
    showData = await showData.json();
    console.log(showData);

    let reviewModal = document.querySelector("#reviewModal");
    let reviewContent = document.querySelector(".review-content");
    reviewModal.style.display = "block";
    reviewModal.style.overflow = "hidden";
    reviewContent.style.display = "block";

    let img = `https://image.tmdb.org/t/p/original${showData.poster_path}`;
    if(showData.poster_path === "N/A" || !showData.poster_path) {
        img = "../assets/no-poster-found.png";
    }

    reviewContent.innerHTML = `
        <span onclick="document.querySelector('#reviewModal').style.display = 'none';" class="close">&times;</span>
        <h1>Add Your Review</h1>

        <span id="movie-name">
            <b> ${showData.name} </b> <span id="date">${showData.first_air_date.split("-")[0]}</span>
        </span>
        
        <div>
            <img style="width: 20%; border-radius: 5px" src=${img} alt="">
        </div>
        
        <textarea id="reviewText" placeholder="Write your review here..." rows="8" style="min-width: 100%; max-width: 100%; margin-top: 10px; overflow: auto;"></textarea>
        
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
        <div style="margin-top: 0; align-items: center; justify-content: center; flex-direction: column;">
            <span>Did you like the movie?</span>
            <button id="heartButton" style="background: none; border: none; cursor: pointer; font-size: 30px; color: gray; padding-left: 0;">
                &#10084;
            </button>
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
    let response = await fetch(`https://api.themoviedb.org/3/tv/${showID}?language=en-US`, options);
    let TMDBData = await response.json();

    console.log(`Searching for "${TMDBData.name}" year "${TMDBData.first_air_date.split("-")[0]}"`);
    response = await fetch(`http://www.omdbapi.com/?apikey=c3424a43&t=${TMDBData.name}`);
    let OMDBData = await response.json();

    console.log(OMDBData);
    console.log(TMDBData);

    if (OMDBData.Response === "False") {
        console.log("OMDB API Error: ", OMDBData.Error);
        OMDBData = {
            Genre: "N/A",
            imdbRating: "N/A",
            Director: "N/A",
            Actors: "N/A",
            Plot: "N/A"
        };
    }

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
    let img = `https://image.tmdb.org/t/p/original${TMDBData.poster_path}`;
    if(TMDBData.poster_path === "N/A" || !TMDBData.poster_path) {
        img = "../assets/no-poster-found.png";
    }
    let html = `
        <div id="movie-details">
            <img style="width: 15em;height: 25em" src=${img} alt="${TMDBData.title}">
            <div id="details-area">
                <h1>${TMDBData.name}</h1>
                <b>Starting Airing: </b> ${TMDBData.first_air_date}<br>
                <b>Genre: </b> ${genres}<br>
                <div id="rating">
                    <b>Ratings: </b> ${OMDBData.imdbRating} <img style="width: 30px"src="imdb.png">
                    <br>
                </div>
           
                <b>Created By: </b> ${director}<br>
                <b>Cast: </b> ${OMDBData.Actors} <br>
                <b>Plot: </b> ${TMDBData.overview} <br>
                <a id="reviewButton" onclick="addReview()" href="#"">Add a review</a>
            </div>
        </div>
    `;
    movieDetails.innerHTML = html;
}

getMovieDetails();


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import firebaseConfig from "/public/firebaseConfig.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.showAcc = function showAcc(){
    let accountArea = document.querySelector(".dropdown-content");
    accountArea.style.display = "block";
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        console.log("User is logged in:", user);
        console.log("User ID:", user.uid);
        console.log("User Email:", user.email);
        let accountArea = document.getElementById("account-area");
        accountArea.innerHTML = `
                    <div class="dropdown">
                        <img style="width: 1.5em; min-height: 1.5em" src="../assets/account-icon.png" alt="Account Icon">
                        <div class="dropdown-content">
                            <a href="#">Account</a>
                            <a href="#">Log Out</a>
                        </div>
                    </div>
        `;

        // Access user-specific data or allow access to the page
    } else {
        // No user is logged in
        console.log("No user is logged in. Redirecting to login page...");
        window.location.href = "../Log%20In/login.html"; // Redirect to login page
    }
});