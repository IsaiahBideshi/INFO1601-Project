import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import firebaseConfig from "../firebaseConfig.js";

console.log("hello");

const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.getElementById('success-btn').addEventListener('click', function() {
    window.location.href = '../Log%20In/login.html'; // Redirect to the login page
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const retypePassword = document.getElementById('retype_password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (password !== retypePassword) {
        errorMessage.textContent = 'Passwords do not match.';
        errorMessage.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';

    // Call the createUser function
    createUser(username, email, password);
});

function createUser(username, email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            updateProfile(user, {
                displayName: username
            });
            console.log(userCredential.user);
            document.getElementById('success').style.display = 'block';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);

            let errorMessageBox = document.querySelector("#errorMessage");
            if (errorCode === 'auth/email-already-in-use') {
                errorMessageBox.textContent = "Email Already In Use";
                errorMessageBox.style.display = 'block';
            }
        });
}