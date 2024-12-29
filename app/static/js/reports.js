import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuNvUaahEA1efQ2S3Wg_-yzesWIIZsrcg",
  authDomain: "fake-social-media-detect-ae562.firebaseapp.com",
  projectId: "fake-social-media-detect-ae562",
  storageBucket: "fake-social-media-detect-ae562.firebasestorage.app",
  messagingSenderId: "984530461675",
  appId: "1:984530461675:web:f7213840d97c9bf868efae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Function to fetch and display data in a table

const tableBody = document.querySelector("#dataTable tbody");
  
async function fetchAndDisplayData() {
    try {
      // Fetch data from both collections
      const reportedAccountsSnapshot = await getDocs(collection(db, "reportedAccounts"));
      const historySnapshot = await getDocs(collection(db, "history"));
  
      const combinedData = [];
  
      // Process reportedAccounts data
      reportedAccountsSnapshot.forEach(doc => {
        const data = doc.data();
        combinedData.push({ ...data, source: "Reported Accounts" });
      });
  
      // Process history data
      historySnapshot.forEach(doc => {
        const data = doc.data();
        combinedData.push({ ...data, source: "History" });
      });
  
      // Generate table rows
      combinedData.forEach(record => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${record.date || "N/A"}</td>
          <td>${record.Username || "N/A"}</td>
          <td><a href="https://${record.link}" target="_blank">${record.link || "No Link"}</a></td>
          <td>${record.status || "N/A"}</td>
          <td>${record.platform || "N/A"}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
fetchAndDisplayData();


//change theme
changeTheme();

let noOfPosts;



function changeTheme() {
    if (localStorage.getItem("ModeColor") == "dark") {
        document.documentElement.style.setProperty('--light', "#2f3046")
        document.documentElement.style.setProperty('--dark', "#14152a")
        document.documentElement.style.setProperty('--material', "#1ABC9C")
        document.documentElement.style.setProperty('--text', "#ffffff")
        document.documentElement.style.setProperty('--darkText', "#ffffff")
        document.documentElement.style.setProperty('--primary-bg1', "#2C2C3E")

        document.getElementById("modeColor").className = "fa-solid fa-sun";
    }
    else {
        document.documentElement.style.setProperty('--light', "#F8F9FA")
        document.documentElement.style.setProperty('--dark', "#2C3E50")
        document.documentElement.style.setProperty('--material', "#1ABC9C")
        document.documentElement.style.setProperty('--text', "#ECF0F1")
        document.documentElement.style.setProperty('--darkText', "black")
        document.documentElement.style.setProperty('--primary-bg1', "#f7fefe")
        


        document.getElementById("modeColor").className = "fa-solid fa-moon";
    }

}

document.getElementById("modeColor").addEventListener('click', function () {
  changeMode();
})

function changeMode() {

  if (localStorage.getItem("ModeColor") == "light") {
      localStorage.setItem("ModeColor", "dark")
      document.getElementById("modeColor").className = "fa-solid fa-sun";
  }
  else {
      localStorage.setItem("ModeColor", "light")
      document.getElementById("modeColor").className = "fa-solid fa-moon";
  }

  changeTheme();
}


document.getElementById("homeIcon").addEventListener('click', function () {
  window.location = "/"
})