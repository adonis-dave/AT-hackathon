chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "blockCookies") {
      const url = request.url;
      chrome.cookies.getAll({ url: url }, (cookies) => {
          if (cookies && cookies.length > 0) {
              cookies.forEach(cookie => {
                  const cookieUrl = cookie.secure ? 'https://' : 'http://';
                  chrome.cookies.remove({
                      url: cookieUrl + cookie.domain + cookie.path, // Improved URL for deletion
                      name: cookie.name
                  }, (removed) => {
                      if (removed) {
                          console.log(`Cookie ${cookie.name} removed from ${cookieUrl + cookie.domain + cookie.path}`);
                      } else {
                          console.error(`Failed to remove cookie ${cookie.name} from ${cookieUrl + cookie.domain + cookie.path}`);
                      }
                  });
              });
              sendResponse({ success: true, message: "All cookies blocked for this site." });
          } else {
              sendResponse({ success: true, message: "No cookies found for this site." });
          }
      });
      return true;
  }

  if (request.action === "checkPermissions") {
      const permissions = [
          "activeTab",
          "scripting",
          "cookies"
      ];

      const riskAssessment = permissions.map(permission => {
          switch (permission) {
              case "scripting":
                  return { permission, risk: "High" };
              case "cookies":
                  return { permission, risk: "Medium" };
              case "activeTab":
                  return { permission, risk: "Low" };
              default:
                  return { permission, risk: "Unknown" };
          }
      });

      const risks = riskAssessment.filter(item => item.risk !== "Low" && item.risk !== "Unknown");

      if (risks.length > 0) {
          const riskMessages = risks.map(item => `${item.permission}: ${item.risk}`).join(", ");
          sendResponse({ success: true, message: "This extension requests permissions that may pose risks: " + riskMessages });
      } else {
          sendResponse({ success: true, message: "No significant risks detected with the requested permissions." });
      }
      return true;
  }

  if (request.action === "sendSMS") {
      const phoneNumber = request.phoneNumber;
      const message = request.message;
      
    // IMPORTANT:  Replace with your actual Africastalking API credentials.
    const username = "sandbox";  //  Replace with your username
    const apiKey = "atsk_2f29ebf5598af64197aeee20ffc6becd1b06e3c25afc9eb3519dbf9b7da6574e39db4e33";        //  Replace with your API key

    const url = "https://api.africastalking.com/version1/messaging"; // Corrected URL
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "apikey": apiKey,
    };
    const body = new URLSearchParams({
      username: username,
      to: phoneNumber,
      message: message,
    }).toString();

    fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("SMS sent:", data);
        sendResponse({ success: true, data: data }); // Send response
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
        sendResponse({ success: false, error: error.message });
      });
    //  Important:  Return true to indicate that the response will be sent asynchronously.
    return true;
  }
});
