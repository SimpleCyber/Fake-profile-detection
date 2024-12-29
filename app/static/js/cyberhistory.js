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

async function fetchHistoryData() {
  const historyRef = collection(db, "history");
  const querySnapshot = await getDocs(historyRef);
  const tableBody = document.getElementById("history-data");

  querySnapshot.forEach(doc => {
    const accountData = doc.data();
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${accountData.date}</td>
      <td>${accountData.Username}</td>
      <td><a href="https://${accountData.profileLink}" target="_blank">${accountData.profileLink}</a></td>
      <td>${accountData.status}</td>
      <td>${accountData.platform}</td>
    `;
    tableBody.appendChild(row);
  });
}

fetchHistoryData();

  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
  }

  //toggle button
  document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
  
    // Load the saved theme from localStorage and apply it
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
      themeToggle.checked = true;
      
    }
  
    // Toggle theme when the switch is clicked
    themeToggle.addEventListener("change", () => {
      document.body.classList.toggle("light-theme");
      const isLightMode = document.body.classList.contains("light-theme");
      localStorage.setItem("theme", isLightMode ? "light" : "dark");
    });
  });
  document.getElementById("cyberreport").addEventListener('click', function () {
    window.location = "cyberreport"
  })
  document.getElementById("cyber").addEventListener('click', function () {
    window.location = "cyber"
  })