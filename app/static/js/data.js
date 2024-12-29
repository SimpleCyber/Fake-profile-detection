// Path to the JSON file (dynamic based on user input)
let username;

document.getElementById('btnStart').addEventListener('click', () => {
    username = document.getElementById('socialUsername').value;
    
    // Construct the dynamic file path
    const jsonFilePath = `/${username}/${username}_profile/profile_data.json`;

    // Call the fetch_data function with retry logic
    fetch_data(jsonFilePath);
});

// Define global variables
let Username, Name, Bio, Followers, Following, NumberOfPosts, Verified, AccountPrivacy,Socialmediasite;

function fetch_data(jsonFilePath, retryCount = 15, retryInterval = 10000) {
    // Fetch the data
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Assign the JSON data to global variables
            ({
                Username,
                Name,
                Bio,
                Followers,
                Following,
                NumberOfPosts,
                Verified,
                AccountPrivacy,
                Socialmediasite,
            } = data);


            const img = `./${username}/${username}_profile/profile_pic.jpg`;



            

            let risk = 54; // As per your requirement

            let rows = document.querySelectorAll('table tbody tr');

            let maxPercentage = 0;
            let typeOfAccount = '';

            rows.forEach(row => {
                let type = row.cells[0].textContent.trim();  // Account type
                let percentageText = row.cells[1].textContent.trim();  // Percentage
                let percentage = parseInt(percentageText.replace('%', '').trim());

                if (percentage > maxPercentage) {
                    maxPercentage = percentage;
                    typeOfAccount = type;
                }
            });

            console.log("Risk Percentage: 🌿🌿🌿🌿🌿🌿🌿 " + risk + "%");
            console.log("Type of Account with greatest percentage: 🌿🌿🌿🌿🌿🌿🌿 " + typeOfAccount);




            // Log to verify
            console.log("Username:", Username);
            console.log("Name:", Name);
            console.log("Bio:", Bio);
            console.log("Followers:", Followers);
            console.log("Following:", Following);
            console.log("Number of Posts:", NumberOfPosts);
            console.log("Verified:", Verified);
            console.log("Account Privacy:", AccountPrivacy);
            console.log(img);
            console.log(Socialmediasite);
        })
        .catch(error => {
            console.error(`Error fetching the JSON file: ${error.message}`);
            
            if (retryCount > 0) {
                console.log(`Retrying... Attempts left: ${retryCount}`);
                setTimeout(() => fetch_data(jsonFilePath, retryCount - 1, retryInterval), retryInterval);
            } else {
                console.error("Max retry attempts reached. Could not fetch the JSON file.");
            }
        });
}




// /fetch the open ai data remain
// let riskpercentage =51
// if (riskpercentage > 50) {
//     btn.classList.remove('none');
//   } else {
//     btn.classList.add('none');
//   }
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

function convertImageToBase64(imgUrl) {
    return new Promise((resolve, reject) => {
      // Fetch the image
      fetch(imgUrl)
        .then(response => response.blob()) // Convert to Blob
        .then(blob => {
          // Create a FileReader instance
          const reader = new FileReader();
          
          // When the image is loaded as base64
          reader.onloadend = () => {
            resolve(reader.result); // This is the Base64 string
          };
          
          // Read the Blob as Data URL (Base64)
          reader.readAsDataURL(blob);
        })
        .catch(error => reject(error)); // Handle fetch errors
    });
  }


document.getElementById("btnreport").addEventListener('click' ,async(e) =>{
    e.preventDefault();
    const imgUrl = `./${username}/${username}_profile/profile_pic.jpg`;
    try {
          const base64Image = await convertImageToBase64(imgUrl);
          await addDoc(collection(db, "reportedAccounts"), {
            
            Username : Username ,
            Name : Name,
            Bio : Bio,
            Followers : Followers,
            Following : Following,
            NumberOfPosts : NumberOfPosts,
            Verified : Verified,
            AccountPrivacy: AccountPrivacy,
            timestamp: serverTimestamp(),
            status: "Pending",
            profileImage: base64Image,
          });
          alert("Account reported successfully!");
      } catch (error) {
        console.error("Error reporting account:", error);
        alert("Failed to report the account.");
      }


      


});








