import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAlleLqg4df7xgFSfcXAvMnOpffRWmJMzo",
    authDomain: "thrivesphere-2f1e0.firebaseapp.com",
    projectId: "thrivesphere-2f1e0",
    storageBucket: "thrivesphere-2f1e0.appspot.com",
    messagingSenderId: "453767812123",
    appId: "1:453767812123:web:ddfb8191d0a12cf4c6d4be",
    measurementId: "G-CQDKZYVJ51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is logged in:", user.uid); // Debugging
        fetchUserProfile(user.uid);
    } else {
        console.warn("User is not logged in. Redirecting...");
        window.location.href = "/ThriveSphere/html/login.html"; // Redirect to login
    }
});

// Fetch user profile from Firestore
async function fetchUserProfile(uid) {
    try {
        console.log("Fetching user profile for UID:", uid); // Debugging

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            console.log("User data fetched:", data); // Debugging

            document.getElementById("displayFullname").textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById("displayUsername").textContent = `@${data.username}`;
            document.getElementById("joinedDate").textContent = new Date(data.joinedDate.seconds * 1000).toDateString();
            document.getElementById("email").value = data.email || "";
            document.getElementById("phone").value = data.phone || "";
            document.getElementById("firstname").value = data.firstName || "";
            document.getElementById("lastname").value = data.lastName || "";
            document.getElementById("username").value = data.username || "";

            // If therapist, display extra fields
            if (data.role === "therapist") {
                document.getElementById("yearsExperience").value = data.yearsExperience || "";
                document.getElementById("sessionCost").value = data.sessionCost || "";
                document.querySelectorAll(".therapistOptions").forEach(el => el.style.display = "block");
            }

            // Load Profile Image
            if (data.profileImage) {
                document.getElementById("profileImage").src = data.profileImage;
                document.getElementById("profileImageMob").src = data.profileImage;
            } else {
                document.getElementById("profileImage").src = "/ThriveSphere/public/images/default-profile.png";
                document.getElementById("profileImageMob").src = "/ThriveSphere/public/images/default-profile.png";
            }

        } else {
            console.warn("No user data found in Firestore!");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Handle Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("User logged out successfully.");
        window.location.href = "/ThriveSphere/html/login.html";
    }).catch((error) => {
        console.error("Logout failed:", error);
    });
});
