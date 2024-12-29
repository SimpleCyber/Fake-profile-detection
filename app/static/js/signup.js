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

document.getElementById("resetP2").addEventListener('click', function () {
    window.location = "login"
})

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isPasswordValid(password) {
    return password.length > 6
}

document.getElementById('emailLogin').addEventListener('click', async () => {
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;
    let accType = document.getElementById('selAccType').value;

    if (isEmailValid(email) && isPasswordValid(password)) {


        try {
            // Create User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
        
            // Save User Role in Firestore
            await setDoc(doc(db, "users", user.uid), {
              email: email,
              password: password,
              role: accType,
            });
        
            alert("Signup successful! You can now log in.");
            window.location.href = 'login';
          } catch (error) {
            alert(`Signup failed: ${error.message}`);
          }
        } else {
            if (!isEmailValid(email)) {
                alert('Kindly Enter Valid Email Id ⚠️');
            } else {
                alert('Password Length Should be more than 6 ⚠️');
            }
        }
    });


document.getElementById('googleLogin').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;
    let accType = document.getElementById('selAccType').value;

    if (isEmailValid(email) && isPasswordValid(password)) {

        try {
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;

            alert('User Signed up Successfully ✅');

            await firebase.database().ref('users/' + user.uid).set({
                email: email,
                password: password,
                role: accType
            });

            window.location.href = 'login';
        } catch (error) {
            console.error(error);

            // Handle specific errors if needed
            if (error.code === 'auth/popup-closed-by-user') {
                // User closed the Google sign-in popup
                console.log('Google sign-in popup closed by user.');
            }
        }
    } else {
        if (!isEmailValid(email)) {
            alert('Kindly Enter Valid Email Id you are signing with Google ⚠️');
        } else {
            alert('Password Length Should be more than 6 ⚠️');
        }
    }
});





