import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app); // Ensure Firestore is initialized

window.logout = function logout() {
    signOut(auth).then(() => {
        console.log("User logged out");
        let accountArea = document.getElementById("account-area");
        accountArea.innerHTML = `
                    <ul style="">
                        <li><a href="/Log%20In/login.html">Login</a></li>
                        <li><a href="/Sign%20Up/signup.html">SignUp</a></li>
                    </ul>
        `;
    });
};

window.goToAcc = function goToAcc() {
    window.location.href = `${window.location.origin}/Account/Account.html`;
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
                        <img style="width: 1.5em; min-height: 1.5em" src="/assets/account-icon.png" alt="Account Icon">
                        <div class="dropdown-content">
                            <a href="#" onclick="goToAcc()">Account</a>
                            <a id="logout-btn" href="#" onclick="logout()">Log Out</a>
                        </div>
                    </div>
        `;
    } else {
        // No user is logged in
        let accountArea = document.getElementById("account-area");
        accountArea.innerHTML = `
                    <ul style="">
                        <li><a href="/Log%20In/login.html">Login</a></li>
                        <li><a href="/Sign%20Up/signup.html">SignUp</a></li>
                    </ul>
        `;

        console.log("No user is logged in. Redirecting to login page...");
        window.location.href = `${window.location.origin}/Log%20In/login.html`;
    }
});