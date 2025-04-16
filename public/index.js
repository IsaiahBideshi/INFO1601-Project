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
                        <img style="width: 1.5em" src="./assets/account-icon.png" alt="Account Icon">
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