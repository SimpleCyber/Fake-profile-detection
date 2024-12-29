let username;
let impersonation;
let hate;
let spam;
let extremist;
let risk;
let reason;
let conclusion;

document.getElementById("find-anchors").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab },
        files: ["content.js"],
      },
      async (results) => {
        const anchors = results[0].result || [];
        const resultsDiv1 = document.getElementById("results1");
        const resultsDiv = document.getElementById("results");

        if (anchors.length > 0) {
          const firstAnchor = anchors[0];
          username = firstAnchor.href.slice(1, -1); // Extract the username

          resultsDiv1.innerHTML = `
            <div>
              <strong>Instagram:</strong>
              <pre>${firstAnchor.html}</pre>
              <p><strong>Href:</strong> ${username}</p>
            </div>
          `;

          console.log("Fetching info for username:", username);

          try {
            // Call your Flask API
            const response = await fetch(
              "https://fetch-insta.vercel.app/instagram",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username }),
              }
            );

            if (!response.ok) {
              throw new Error(
                "Failed to fetch user info. Please check the username."
              );
            }

            // Store user data
            const data = await response.json();
            const profileInfo = data.result.ProfileInfo;
            const captions = data.result.Captions;
            const captionsString = Array.isArray(captions)
              ? captions.map(caption => JSON.stringify(caption)).join(" ")
              : JSON.stringify(captions); 

            const commandInput = JSON.stringify(profileInfo) + " " + captionsString;

            resultsDiv.innerHTML = "";

            let details = [
              `<p><strong>Name:</strong> ${profileInfo.Name || "N/A"}</p>`,
              `<p><strong>Bio:</strong> ${profileInfo.Bio || "N/A"}</p>`,
              `<p><strong>Verified:</strong> ${profileInfo.Verified || "N/A"}</p>`,
              `<p><strong>Privacy:</strong> ${profileInfo.AccountPrivacy || "N/A"}</p>`,
              `<p><strong>Number of Posts:</strong> ${profileInfo.NumberOfPosts || "N/A"}</p>`,
              `<p><strong>Followers:</strong> ${profileInfo.Followers || "N/A"}</p>`,
              `<p><strong>Following:</strong> ${profileInfo.Following || "N/A"}</p>`,
            ];

            details.forEach((detail, index) => {
              setTimeout(() => {
                resultsDiv.innerHTML += detail;
              }, index * 500); 
            });

            console.log("commandInput : ", commandInput);

            // Await the result from the OpenAI API call
            const fraudResultResponse = await getResultFromCommand(commandInput);
            console.log("fraudResultResponse : ", fraudResultResponse);

            if (fraudResultResponse && fraudResultResponse.result) {
              const fraudResult = fraudResultResponse.result;

              // Parse HTML content of the fraud result and extract details
              const doc = new DOMParser().parseFromString(fraudResult, "text/html");

              impersonation = doc.querySelector(".Impersonate")?.textContent || "N/A";
              hate = doc.querySelector(".hate")?.textContent || "N/A";
              spam = doc.querySelector(".Spam")?.textContent || "N/A";
              extremist = doc.querySelector(".Extremist")?.textContent || "N/A";
              risk = doc.querySelector(".risk")?.textContent || "N/A";

              const reasonElement = Array.from(doc.querySelectorAll("strong")).find((el) => el.textContent.includes("Reason:"));
              reason = reasonElement?.nextElementSibling?.textContent.trim() || "N/A";

              const conclusionElement = Array.from(doc.querySelectorAll("strong")).find((el) => el.textContent.includes("Conclusion:"));
              conclusion = conclusionElement?.nextElementSibling?.textContent.trim() || "N/A";

              // Display the fraud detection result
              const profileContainer = document.getElementById("profile-container");
              profileContainer.innerHTML = `
                <p><strong>Impersonation:</strong> ${impersonation}</p>
                <p><strong>Hate:</strong> ${hate}</p>
                <p><strong>Spam:</strong> ${spam}</p>
                <p><strong>Extremist:</strong> ${extremist}</p>
                <p><strong>Risk:</strong> ${risk}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p><strong>Conclusion:</strong> ${conclusion}</p>
              `;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          resultsDiv1.innerHTML = "<p>No matching anchor tags found.</p>";
          console.log("No anchors found.");
        }
      }
    );
  });
});

async function getResultFromCommand(userCommand) {
  userCommand ="i am satyam"
  try {
    // Make API request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userCommand },
        ],
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorDetails}`);
    }

    // Parse and return the response content
    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    // You can return a user-friendly message or the raw error
    return `Error: ${error.message}`;
  }
}





// Ensure you have your OpenAI API key
const OPENAI_API_KEY = "";  // Replace with your OpenAI API key
const MODEL = "gpt-4";

// System prompt definition
const systemPrompt1 = `
    You are an AI model that detects the given profile as fake or not based on the number of followers, following, bio, verified or not, username trying to impersonate some famous user names, from the post's caption events in real-time or in the past if the data, number of posts etc. You will be provided with the input of users' social media profile information and posts, and your goal is to respond with a structured solution in this format:
    <div class="final_output">
        <h3> Fake post detection:</h3>
        <table>
            <tr>
                <td>Fake or propaganda information</td>
                <td><span class="propaganda">(percentage out of 100)</span></td>
            </tr>
            <tr>
                <td>Extremist</td>
                <td><span class="Extremist">(percentage out of 100)</span></td>
            </tr>
            <tr>
                <td>Spam message</td>
                <td><span class="Spam">(percentage out of 100)</span></td>
            </tr>
            <tr>
                <td>Violent or hate speech or toxic</td>
                <td><span class="hate">(percentage out of 100)</span></td>
            </tr>
            <tr>
                <td>Impersonate account</td>
                <td><span class="Impersonate">(percentage out of 100)</span></td>
            </tr>
            <tr>
                <td>Incomplete profile</td>
                <td><span class="Incomplete">(percentage out of 100)</span></td>
            </tr>
        </table>
        <li>Percentage of risk: <span class="risk">(percentage out of 100)</span></li>
        <strong>Reason:</strong>
            If the profile belongs to any of these 6 categories then why just in 10-20 words.
        <strong>Conclusion: </strong>
            Just one precise summary point.
    </div>
`;

const systemPrompt = `hii gpt , how are u`



document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.querySelector(".theme-label");

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem("theme") || "light";

  // Set initial theme
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
    themeLabel.textContent = "";
  }

  // Toggle theme on switch change
  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      themeLabel.textContent = "";
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      themeLabel.textContent = "";
    }
  });

  // Existing find-anchors functionality (if you had any)
  const findAnchorsButton = document.getElementById("find-anchors");
  if (findAnchorsButton) {
    findAnchorsButton.addEventListener("click", function () {
      // Your existing find anchors logic here
    });
  }
});