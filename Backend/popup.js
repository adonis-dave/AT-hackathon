const checkButton = document.getElementById('check-button');
const phoneNumberInput = document.getElementById('phone-number-input');
const cookieInfoContainer = document.getElementById('cookie-info');
const modeToggle = document.getElementById('mode-toggle');
const blockToggle = document.getElementById('block-toggle');
const redirectToggle = document.getElementById('redirect-toggle');
const popupToggle = document.getElementById('popup-toggle'); // New toggle for popup blocking
const fetchTermsButton = document.getElementById('fetch-terms-button');
const urlInput = document.getElementById('url-input');

// --- Ad Blocking Logic ---
const adDomains = ['dns@adguard.com'];

document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setMode(isDarkMode);
    modeToggle.checked = isDarkMode;

    const isBlockingEnabled = localStorage.getItem('blockAds') === 'true';
    blockToggle.checked = isBlockingEnabled;

    const isRedirectPreventionEnabled = localStorage.getItem('preventRedirect') === 'true';
    redirectToggle.checked = isRedirectPreventionEnabled;

    const isPopupBlockingEnabled = localStorage.getItem('blockPopups') === 'true';
    popupToggle.checked = isPopupBlockingEnabled; 

    if (isBlockingEnabled) {
        blockAdsAndCookies();
    }
    if (isRedirectPreventionEnabled) {
        preventRedirection();
    }
    if (isPopupBlockingEnabled) {
        blockPopups();
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        if (blockAdsCheckbox.checked && adDomains.some(domain => details.url.includes(domain))) {
            console.log('Ad blocked:', details.url);
            return { cancel: true };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

// --- Redirect Prevention Logic ---
const redirectThreshold = 3; 
const redirectHistory = {};

chrome.webRequest.onBeforeRedirect.addListener(
    details => {
        if (preventRedirectsCheckbox.checked) {
            if (!redirectHistory[details.tabId]) {
                redirectHistory[details.tabId] = [];
            }
            redirectHistory[details.tabId].push(details.url);

            if (redirectHistory[details.tabId].length > redirectThreshold) {
                console.warn('Potential redirect chain detected, blocking:', details.url);
                delete redirectHistory[details.tabId]; 
                return { cancel: true };
            }
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.webRequest.onCompleted.addListener(
    details => {
        if (redirectHistory[details.tabId]) {
            delete redirectHistory[details.tabId];
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
    details => {
        if (redirectHistory[details.tabId]) {
            delete redirectHistory[details.tabId];
        }
    },
    { urls: ["<all_urls>"] }
);

modeToggle.addEventListener('change', () => {
    const isDarkMode = modeToggle.checked;
    setMode(isDarkMode);
});
function setMode(isDarkMode) {
    if (isDarkMode) {
        document.body.style.backgroundColor = '#333';
        document.body.style.color = '#fff';
        // Additional styles for dark mode
    } else {
        document.body.style.backgroundColor = '#f9f9f9';
        document.body.style.color = '#333';
        // Additional styles for light mode
    }
    localStorage.setItem('darkMode', isDarkMode); // Save preference
}

// Toggle ad and cookie blocking
blockToggle.addEventListener('change', () => {
    const isBlockingEnabled = blockToggle.checked;
    localStorage.setItem('blockAds', isBlockingEnabled); // Save preference
    if (isBlockingEnabled) {
        alert('Ad and cookie blocking is enabled.');
        blockAdsAndCookies();
    } else {
        alert('Ad and cookie blocking is disabled.');
        allowAdsAndCookies();
    }
});

// Toggle redirection prevention
redirectToggle.addEventListener('change', () => {
    const isRedirectPreventionEnabled = redirectToggle.checked;
    localStorage.setItem('preventRedirect', isRedirectPreventionEnabled); // Save preference
    if (isRedirectPreventionEnabled) {
        alert('Redirection prevention is enabled.');
        preventRedirection();
    } else {
        alert('Redirection prevention is disabled.');
        allowRedirection();
    }
});

// Toggle popup blocking
popupToggle.addEventListener('change', () => {
    const isPopupBlockingEnabled = popupToggle.checked;
    localStorage.setItem('blockPopups', isPopupBlockingEnabled); // Save preference
    if (isPopupBlockingEnabled) {
        alert('Popup blocking is enabled.');
        blockPopups();
    } else {
        alert('Popup blocking is disabled.');
        allowPopups();
    }
});

checkButton.addEventListener('click', () => {
    const url = urlInput.value; // Get the URL from the input field
    if (!url) {
        alert('Please enter a valid URL.');
        return;
    }

    // Fetch terms of service and privacy policy
    fetchTermsAndPolicies(url).then(terms => {
        const risks = analyzeTermsForRisks(terms);
        if (risks.length > 0) {
            termsFeedbackContainer.textContent = 'Risks detected: ' + risks.join(', ');
        } else {
            termsFeedbackContainer.textContent = 'No significant risks detected.';
        }
    }).catch(error => {
        termsFeedbackContainer.textContent = 'Error fetching terms: ' + error.message;
    });
});

// Function to fetch terms of service and privacy policy from the given URL
async function fetchTermsAndPolicies(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const html = await response.text();
    const terms = extractTextFromHTML(html);
    return terms;
}

// Function to extract text from HTML (specifically <p> tags)
function extractTextFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    return Array.from(paragraphs).map(p => p.innerText).join(' ');
}
function analyzeTermsForRisks(terms) {
    const detectedRisks = [];
    const riskKeywords = [
        "security breach", "data breach", "unauthorized access", "vulnerability", "cyberattack",
        "data manipulation", "information alteration", "deceptive practices", "misleading information", "false advertising"
    ];
    const owaspKeywords = {
        "Broken Access Control": ["access control", "privilege escalation", "idor", "insecure direct object references"],
        "Cryptographic Failures": ["cryptographic", "encryption", "hashing", "ssl", "tls", "key management"],
        "Injection (SQL, XSS, Command)": ["injection", "sql injection", "xss", "cross-site scripting", "command injection"],
        "Insecure Design": ["insecure design", "threat modeling", "security by design"],
        "Security Misconfiguration": ["misconfiguration", "default password", "unnecessary services", "http headers"],
        "Vulnerable and Outdated Components": ["vulnerable component", "outdated software", "patch management", "zero-day"],
        "Identification and Authentication Failures": ["authentication", "session management", "password policy", "multi-factor authentication"],
        "Software and Data Integrity Failures": ["data integrity", "code integrity", "ci/cd security", "supply chain security"],
        "Security Logging and Monitoring Failures": ["logging", "monitoring", "intrusion detection", "security logs", "siem"],
        "Server-Side Request Forgery (SSRF)": ["ssrf", "server-side request forgery"],
        "Insecure Direct Object References (IDOR)": ["idor", "insecure direct object references"],
        "Cross-Site Request Forgery (CSRF)": ["csrf", "cross-site request forgery", "session riding"],
        "File Upload Vulnerabilities": ["file upload", "unrestricted file upload", "file extension"],
        "Denial of Service (DoS) and Distributed Denial of Service (DDoS)": ["dos", "ddos", "denial of service"],
        "Man-in-the-Middle (MitM) Attacks": ["man-in-the-middle", "mitm", "eavesdropping", "packet sniffing"],
        "Clickjacking": ["clickjacking", "ui redress"],
        "HTML Injection": ["html injection", "cross-site scripting"],
        "XML External Entity (XXE) Attacks": ["xxe", "xml external entity"],
        "Insecure Deserialization": ["deserialization", "object deserialization"],
        "Directory Traversal (Path Traversal)": ["directory traversal", "path traversal"],
        "Business Logic Vulnerabilities": ["business logic", "flaws", "vulnerabilities"],
        "Information Disclosure": ["information disclosure", "data leakage", "exposed data"],
        "Subdomain Takeover": ["subdomain takeover", "dangling dns"],
        "Cookie Security Issues": ["cookie security", "session hijacking", "secure cookie", "httponly"],
        "Web Shells": ["web shell", "backdoor"],
        "Race Conditions": ["race condition", "concurrency"],
        "Server-Side Template Injection (SSTI)": ["ssti", "server-side template injection"],
        "Web Cache Poisoning": ["web cache poisoning", "cache pollution"],
        "HTTP Response Splitting": ["http response splitting", "header injection"],
        "Mobile Web Security Risks": ["mobile web security", "app security"]
    };
    
    riskFeedbackContainer.innerHTML = '';
    let foundRisks = false;

    for (const [keyword, feedback] of Object.entries(riskKeywords)) {
        if (terms.toLowerCase().includes(keyword.toLowerCase())) {
            const riskDetail = document.createElement('div');
            riskDetail.textContent = `Potential Risk Found: "${keyword}" - ${feedback}`;
            riskFeedbackContainer.appendChild(riskDetail);
            foundRisks = true;
        }
    }

    if (!foundRisks) {
        riskFeedbackContainer.textContent = 'No specific high-risk terms immediately identified.';
    }
}

fetchTermsButton.addEventListener('click', () => {
    const url = urlInput.value;
    if (!url) {
        alert('Please enter a URL for the terms and conditions.');
        return;
    }

    fetch(url)
        .then(response => response.text())
        .then(data => {
            analyzeTermsAndConditions(data);
        })
        .catch(error => {
            console.error('Error fetching terms and conditions:', error);
            alert('Failed to fetch terms and conditions. Please check the URL and your connection.');
        });
});

checkButton.addEventListener('click', () => {
    const phoneNumber = phoneNumberInput.value;
    if (!phoneNumber) {
        alert('Please enter a phone number to receive the report.');
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabId = tabs[0].id;
        const currentUrl = tabs[0].url;

        chrome.cookies.getAll({ url: currentUrl }, (cookies) => {
            if (cookies.length > 0) {
                displayCookies(cookies);
            } else {
                cookieInfoContainer.textContent = 'No cookies found for this site.';
            }
        });

        fetch('http://your_server_address:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: currentUrl, phoneNumber: phoneNumber, cookies: cookies }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                console.log('Server response:', data.sms_response);
            } else {
                alert(data.message);
                console.error('Server error:', data.error);
            }
        })
        .catch(error => {
            alert('Failed to communicate with the server. Please check your connection.');
            console.error('Fetch error:', error);
        });

        if (blockCookiesCheckbox.checked) {
            cookies.forEach(cookie => {
                chrome.cookies.remove({
                    url: currentUrl,
                    name: cookie.name
                }, (removedCookie) => {
                    if (removedCookie) {
                        console.log(`Blocked cookie: ${removedCookie.name}`);
                    }
                });
            });
        }
    });
});
// Function to block ads and cookies
function blockAdsAndCookies() {
    // Logic to block ads and cookies
    console.log("Ads and cookies are being blocked.");
    // Example: Use content scripts or modify requests to block ads and cookies
}

// Function to allow ads and cookies
function allowAdsAndCookies() {
    // Logic to allow ads and cookies
    console.log("Ads and cookies are allowed.");
}

// Function to prevent redirection
function preventRedirection() {
    // Logic to prevent redirection
    console.log("Redirection is being prevented.");
    // Example: Use webRequest API to block redirection
}

// Function to allow redirection
function allowRedirection() {
    // Logic to allow redirection
    console.log("Redirection is allowed.");
}

// Function to block popups
function blockPopups() {
    // Logic to block popups
    console.log("Popups are being blocked.");
    // Example: Use webRequest API to block popups
}

// Function to allow popups
function allowPopups() {
    // Logic to allow popups
    console.log("Popups are allowed.");
}

function displayCookies(cookies) {
    cookieInfoContainer.innerHTML = '<strong>Cookies found on this site:</strong><br>';
    cookies.forEach(cookie => {
        const cookieDiv = document.createElement('div');
        cookieDiv.textContent = `${cookie.name}=${cookie.value}`;
        cookieInfoContainer.appendChild(cookieDiv);
    });
}
