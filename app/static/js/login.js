

function changeTheme() {
    if (localStorage.getItem("ModeColor") == "dark") {
        document.documentElement.style.setProperty('--light', "#2f3046")
        document.documentElement.style.setProperty('--dark', "#14152a")
        document.documentElement.style.setProperty('--material', "#3a3fc5")
        document.documentElement.style.setProperty('--text', "#ffffff")
        document.documentElement.style.setProperty('--lightText', "#ffffff")

    }
    else {
        document.documentElement.style.setProperty('--light', "#DCF2F1")
        document.documentElement.style.setProperty('--dark', "#7FC7D9")
        document.documentElement.style.setProperty('--material', "#0F1035")
        document.documentElement.style.setProperty('--text', "black")
        document.documentElement.style.setProperty('--lightText', "#ffffff")

    }

}

changeTheme()
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBuNvUaahEA1efQ2S3Wg_-yzesWIIZsrcg",
    authDomain: "fake-social-media-detect-ae562.firebaseapp.com",
    projectId: "fake-social-media-detect-ae562",
    storageBucket: "fake-social-media-detect-ae562.firebasestorage.app",
    messagingSenderId: "984530461675",
    appId: "1:984530461675:web:f7213840d97c9bf868efae"
  
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("resetP2").addEventListener('click',function(){
    window.location="signup"
})

document.getElementById('emailLogin').addEventListener('click', async () => {

    let email = document.getElementById('userEmail').value
    let password = document.getElementById('userPassword').value

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            // Redirect Based on Role
            if (role === "individual") {
                window.location = "/";
            } else if (role === "business") {
                window.location = "/cyber";
            } else {
                alert("Unknown role. Please contact support.");
            }
        } else {
            alert("User data not found.");
        }
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
});

document.getElementById('googleLogin').addEventListener('click', async () => {
    try {
        var provider = new firebase.auth.GoogleAuthProvider();
        var result = await firebase.auth().signInWithPopup(provider);

        // Get the user's UID (User ID)
        let userId = result.user.uid;

        // Store the user ID in local storage
        localStorage.setItem('currentUserId', userId);

        alert('Google Sign-in Successful ✅');

        window.location.href = '/';
    } catch (error) {
        console.error('Google Sign-in error:', error.message);
    }
});

document.getElementById("bb").addEventListener('click',function(){
    window.location="/"
})
document.getElementById("cc").addEventListener('click',function(){
    window.location="multipledata"
})