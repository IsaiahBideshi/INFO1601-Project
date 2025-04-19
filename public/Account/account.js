import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkZWEwYWE0NWI0YjQ4NzUwNDBlOTFlYTMyNDMzZiIsIm5iZiI6MTc0MzM1NjI1Ny4wMzQsInN1YiI6IjY3ZTk4MTYxNzAwYTZhOTRjNmU1NjFhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZfUp1LrNIcQ2Q0pIZSYP5P1YgMaksjF50ckc6qoaiBg'
    }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
let movieReviews;
let showReviews;

window.deleteReview = async function (reviewId, type) {
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    const user = auth.currentUser;
    if (!user) return alert("User not authenticated.");

    const reviewRef = doc(db, "Users", user.uid, "reviews", reviewId);
    try {
        await deleteDoc(reviewRef);
        document.getElementById(reviewId).remove();
    //     remove review from array
        if (type === "Movie") {
            movieReviews = movieReviews.filter(review => review.id !== reviewId);
            if (movieReviews.length === 0) {
                document.getElementById("movies-list").innerHTML = `
                No reviews found.
            `;
            }
        } else if (type === "Show") {
            showReviews = showReviews.filter(review => review.id !== reviewId);
            if (showReviews.length === 0) {
                document.getElementById("shows-list").innerHTML = `
                No reviews found.
            `;
            }
        }
        console.log("Review deleted successfully");
    } catch (error) {
        console.error("Error deleting review:", error);
    }
}

onAuthStateChanged(auth, async (user) => {
    console.log(user.uid);
    const reviewsRef = collection(db, "Users", user.uid, "reviews");
    const reviewsDoc = await getDocs(reviewsRef);
    movieReviews = [];
    showReviews = [];

    reviewsDoc.forEach((docSnap) => {
        const data = docSnap.data();
        data.id = docSnap.id;
        if (data.type === "Movie")
            movieReviews.push(data);
        else if (data.type === "Show")
            showReviews.push(data);
    });
    console.log(movieReviews);

    const userDataRef = doc(db, "Users", user.uid);
    const userDataDoc = await getDoc(userDataRef);
    const userData = userDataDoc.data();
    console.log(userData, movieReviews);

    document.getElementById("reviews-tab").addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("reviews-info").style.display = "block";
        document.getElementById("account-info").style.display = "none";

        document.getElementById("reviews-tab").style.width = "10em";

        document.getElementById("account-tab").style.width = "fit-content";

    })
    document.getElementById("account-tab").addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("reviews-info").style.display = "none";
        document.getElementById("account-info").style.display = "block";

        document.getElementById("account-tab").style.width = "10em";

        document.getElementById("reviews-tab").style.width = "fit-content";
    })

    document.getElementById("email").innerText = userData.email;
    document.getElementById("name").innerText = userData.displayName;

    // censor password
    let censoredPassword = "";
    let censor = true;
    for (const userData1 of userData.password)
        censoredPassword += "*";
    document.getElementById("password").innerText = censoredPassword;
    // view pass button
    document.getElementById("view-pass").addEventListener("click", () => {
        if (censor) {
            document.getElementById("password").innerText = userData.password;
            document.getElementById("view-pass").innerHTML = "&#128275;";
            censor = !censor;
        }
        else {
            document.getElementById("password").innerText = censoredPassword;
            document.getElementById("view-pass").innerHTML = "&#128274;";
            censor = !censor;
        }
    });


    if (movieReviews.length === 0) {
        document.getElementById("movies-list").innerHTML = `
                No reviews found.
        `;
    }
    else {
        let html = ``;
        let reviewsContainer = document.getElementById("movies-list");
        for(let review of movieReviews) {
            console.log(review.id);
            review.movieID.replace("\"", "");
            let response = await fetch(`https://api.themoviedb.org/3/movie/${review.movieID}?language=en-US`, options);
            let movieData = await response.json();
            console.log(movieData);

            let img = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
            if(movieData.poster_path === "N/A" || !movieData.poster_path) {
                img = "../assets/no-poster-found.png";
            }

            html += `
                <div  id="${review.id}" class="review">
						<details>
							<summary>
							    <img style="max-width: 5em" src=${img} alt="poster">
							    <span id="summary-details">
							        <b style="font-size: x-large">${movieData.title}</b>
							        <span style="font-size: small" id="date">${movieData.release_date.split("-")[0]}</span>`
                if (review.hearted)
                    html += `<span>&#10084;</span>`;

                    html +=`</span>
                            </summary>
                            <div class="review-content">
                                <span style="font-size: large; font-weight: bold">Rating:</span>
                                    ${review.rating}/10 <br>
                                <span style="font-size: large; font-weight: bold">Review:</span>
                                ${review.reviewText} <br>
                                
                                <span style="font-size: large; font-weight: bold">Date Watched:</span>
                                ${review.reviewDate} <br>
                                
                                <span style="font-size: large; font-weight: bold">Rewatched:</span>
                                ${review.rewatched ? "Yes" : "No"}<br>
                                <div id="buttons">
                                    <button onclick="deleteReview('${review.id}')" id="delete-review" class="delete-btn">Delete</button>
                                </div>
                            </div>
						</details>
					</div>
            `;
        }
        reviewsContainer.innerHTML = html;
    }

    if (showReviews.length === 0) {
        document.getElementById("shows-list").innerHTML = `
                No reviews found.
        `;
    }
    else {
        let html = ``;
        const reviewsContainer = document.getElementById("shows-list");
        for(let review of showReviews) {
            review.movieID.replace("\"", "");
            let response = await fetch(`https://api.themoviedb.org/3/tv/${review.movieID}language=en-US`, options);
            let movieData = await response.json();
            console.log(movieData);

            let img = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
            if(movieData.poster_path === "N/A" || !movieData.poster_path) {
                img = "../assets/no-poster-found.png";
            }

            html += `
                <div id="${review.id}" class="review">
						<details>
							<summary id="${review.id}">
							    <img style="max-width: 5em" src=${img} alt="poster">
							    <span id="summary-details">
							        <b style="font-size: x-large">${movieData.name}</b>
							        <span style="font-size: small" id="date">${movieData.first_air_date.split("-")[0]}</span>`
            if (review.hearted)
                html += `<span>&#10084;</span>`;

            html +=`</span>
                            </summary>
                            <div class="review-content">
                                <span style="font-size: large; font-weight: bold">Rating:</span>
                                    ${review.rating}/10 <br>
                                <span style="font-size: large; font-weight: bold">Review:</span>
                                ${review.reviewText} <br>
                                
                                <span style="font-size: large; font-weight: bold">Date Watched:</span>
                                ${review.reviewDate} <br>
                                
                                <span style="font-size: large; font-weight: bold">Rewatched:</span>
                                ${review.rewatched ? "Yes" : "No"}<br>
                                <div id="buttons">
                                    <button onclick="deleteReview('${review.id}')" id="delete-review" class="delete-btn">Delete</button>
                                </div>
                            </div>
						</details>
					</div>
            `;
        }
        reviewsContainer.innerHTML = html;
    }

});
