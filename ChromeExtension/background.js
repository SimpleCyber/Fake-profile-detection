chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "hrefDetected") {
    chrome.storage.local.set({ detectedHref: message.href }, () => {
      console.log("Detected href saved:", message.href);
    });
    chrome.action.openPopup();
  }
});
