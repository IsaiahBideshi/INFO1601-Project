import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { firebaseConfig } from "../firebaseConfig.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessageBox = document.getElementById("errorMessage");

    try {
        // Attempt to log in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Login successful:", user);

        const db = getFirestore(app);

        console.log("Login successful:", user);

        const userDocRef = doc(db, "Users", user.uid);

        await setDoc(userDocRef, {
            displayName: user.displayName,
            email: user.email,
            password: password // Avoid storing plain text passwords in production
        });

        // Redirect to the home page
        window.location.href = "../index.html";
    } catch (error) {
        // Handle errors
        console.error("Login error:", error);
        errorMessageBox.style.display = "block";

        if (error.code === "auth/user-not-found") {
            errorMessageBox.textContent = "User not found. Please check your email.";
        } else if (error.code === "auth/wrong-password") {
            errorMessageBox.textContent = "Incorrect password. Please try again.";
        } else if (error.code === "auth/invalid-login-credentials") {
            errorMessageBox.textContent = "Invalid login credentials. Please try again.";
        } else {
            errorMessageBox.textContent = "An error occurred. Please try again later.";
        }
    }
});

window.signInWithGoogle = async function signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log("Google login successful:", user.email, user.displayName, user.uid);
            const db = getFirestore(app);

            const userDocRef = doc(db, "Users", user.uid);

             await setDoc(userDocRef, {
                displayName: user.displayName,
                email: user.email,
                password: "Signed in with Google"
            });

            window.location.href = "../index.html"; // Redirect to the home page
        })
        .catch((error) => {
            console.error("Google login error:", error);
        });
}