import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDocs, collection, addDoc, deleteDoc, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

async function fetchAllDocuments() {
  const collectionRef = collection(db, "reportedAccounts"); // Replace with your collection name
  try {
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach(doc => {
      const accountData = doc.data();
      const profileBase64Image = accountData.profileImage;
      const container = document.getElementById("card-container");

      // Create a new card element
      const newCard = document.createElement("div");
      newCard.classList.add("report-card");
      newCard.setAttribute("id", doc.id);

      // Add HTML content for the new card
      newCard.innerHTML = `
        <div class="card-header">
          <img src= "${profileBase64Image}" alt="Profile Picture" class="profile-pic" />
          <div class="card-info">
            <h4>User ID: ${accountData.Username}</h4>
            <h3>Name: ${accountData.Name}</h3>
            <p>Account Link: <a href="${accountData.profileLink}" target="_blank">View Profile</a></p>
          </div>
        </div>
        <div class="card-body">
          <p><strong>Followers:</strong> ${accountData.Followers}</p>
          <p><strong>Following:</strong> ${accountData.Following}</p>
          <p><strong>Social Media Site:</strong> ${accountData.Platform}</p>
          <p><strong>Status:</strong><span id="status-${doc.id}"> ${accountData.status || 'N/A'} </span></p>
        </div>
        <div class="card-footer">
          <div class="tags">
            <span class="tag tag-blue">Impersonation</span>
            <span class="tag tag-cyan">Twitter</span>
            <span class="tag tag-red">Suspicious</span>
          </div>
          <div class="actions">
            <button class="btn btn-green" id="update-btn-${doc.id}">Update</button>
            <button class="btn btn-yellow" data-id="${doc.id}" data-account='${JSON.stringify(accountData)}'>Done Investigation</button>
            <div id="dropdown-options-${doc.id}" class="dropdown-options" style="display: none;">
              <ul>
                <li class="status-option" data-status="Pending" data-id="${doc.id}">Pending</li>
                <li class="status-option" data-status="Under Investigation" data-id="${doc.id}">Under Investigation</li>
                <li class="status-option" data-status="Resolved" data-id="${doc.id}">Resolved</li>
              </ul>
            </div>
          </div>
        </div>
      `;

      // Append the new card to the container
      container.appendChild(newCard);

      // Add event listener for the 'Update' button
      const updateBtn = document.getElementById(`update-btn-${doc.id}`);
      console.log(`Trying to attach event listener to: update-btn-${doc.id}`, updateBtn); // Debug log
      if (updateBtn) {
        updateBtn.addEventListener('click', function() {
          toggleDropdown(doc.id); // Now using the function properly
        });
      } else {
        console.log(`update-btn-${doc.id} not found.`);
      }

      // Optionally add event listeners for other buttons or actions
      const doneInvestigationBtn = newCard.querySelector(".btn-yellow");
      doneInvestigationBtn.addEventListener("click", async (e) => {
        const docId = e.target.getAttribute("data-id");
        const accountData = JSON.parse(e.target.getAttribute("data-account"));
        await doneInvestigation(docId, accountData);
      });

      const workStatus = newCard.querySelector(`#status-${doc.id}`);
      // Change the color based on the status
      if (accountData.status === "Pending") {
        workStatus.style.color = "red";
      } else if (accountData.status === "Under Investigation") {
        workStatus.style.color = "yellow";
      } else if (accountData.status === "Resolved") {
        workStatus.style.color = "green";
      }

      // Add event listeners for status options in the dropdown
      const statusOptions = newCard.querySelectorAll('.status-option');
      statusOptions.forEach(option => {
        option.addEventListener('click', async (e) => {
          const newStatus = e.target.getAttribute('data-status');
          const docId = e.target.getAttribute('data-id');
          await updateStatus(docId, newStatus); // Call the updateStatus function
        });
      });
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

// Function to toggle the visibility of the dropdown menu
function toggleDropdown(docId) {
  const dropdown = document.getElementById(`dropdown-options-${docId}`);
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Function to update the status in Firestore
async function updateStatus(docId, status) {
  try {
    const dropdown = document.getElementById(`dropdown-options-${docId}`);
    dropdown.style.display = 'none'; // Hide the dropdown after selection

    // Get the reference to the document
    const docRef = doc(db, "reportedAccounts", docId);

    // Update the status field in Firestore
    await updateDoc(docRef, {
      status: status,
    });

    // Update the displayed status on the page
    const statusDisplay = document.getElementById(`status-${docId}`);
    if (statusDisplay) {
      statusDisplay.textContent = status;
      
    }

    alert("Status updated successfully.");
  } catch (error) {
    console.error("Error updating status:", error);
  }
}




// Function called when "Done Investigation" button is clicked
// Function called when "Done Investigation" button is clicked
async function doneInvestigation(docId, accountData) {
  // Ask the user for the status
  const status = prompt("Enter the investigation status (fake or not fake):");
  
  // Validate the input
  if (status !== "fake" && status !== "not fake") {
    alert("Invalid status. Please enter 'fake' or 'not fake'.");
    return;
  }

  try {
    // Move the data to the 'history' collection with the new status
    await addDoc(collection(db, "history"), {
      ...accountData,
      status: status,  // Store the status
      date: new Date().toLocaleDateString(),
      timestamp: serverTimestamp(),
    });

    // Update the status in the 'reportedAccounts' collection
    await updateDoc(doc(db, "reportedAccounts", docId), {
      status: status,  // Update the status in the original document
    });

    // Remove the card from the reported accounts page
    const card = document.getElementById(docId);
    if (card) {
      card.remove();
    }

    // Optionally, delete the document from the 'reportedAccounts' collection (if needed)
    await deleteDoc(doc(db, "reportedAccounts", docId));

    alert("Investigation marked as done and history updated.");
  } catch (error) {
    console.error("Error moving document to history:", error);
  }
}


fetchAllDocuments();


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
document.getElementById("cyberhistory").addEventListener('click', function () {
  window.location = "cyberhistory"
})



