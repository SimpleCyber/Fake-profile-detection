// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchUserDetails') {
      const { platform, username } = request;
      const apiUrl = `https://socialmediadeatils.onrender.com/${platform}/${username}`;
      
      console.log(`Fetching from: ${apiUrl}`);
      
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('API response:', data);
          sendResponse({ success: true, data });
        })
        .catch(error => {
          console.error('Fetch error:', error);
          sendResponse({ success: false, error: error.message });
        });
      
      // Return true to indicate we'll respond asynchronously
      return true;
    }
  });