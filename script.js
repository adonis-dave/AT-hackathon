document.addEventListener("DOMContentLoaded", function () {
  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      app: "Social Media App",
      title: "Camera Access Granted",
      description:
        "This app has been granted permission to access your camera at any time, even when the app is not in use.",
      timestamp: "2 hours ago",
      severity: "high",
      type: "permission",
      icon: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    },
    {
      id: 2,
      app: "Weather App",
      title: "Location Tracking Active",
      description:
        "This app is continuously tracking your location in the background and may share this data with third parties.",
      timestamp: "1 day ago",
      severity: "medium",
      type: "privacy",
      icon: '<path d="M20 9v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M14.7 9 16 7.6a2.2 2.2 0 1 0-3.12-3.12L12 5.3l-.88-.88A2.2 2.2 0 0 0 8 7.6L9.3 9"/><path d="M12 9v3"/>',
    },
    {
      id: 3,
      app: "Shopping App",
      title: "Data Sharing Agreement Updated",
      description:
        "The app has updated its terms to include sharing your purchase history with marketing partners.",
      timestamp: "3 days ago",
      severity: "medium",
      type: "terms",
      icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    },
    {
      id: 4,
      app: "Fitness Tracker",
      title: "Health Data Collection",
      description:
        "This app is collecting sensitive health metrics and storing them on external servers.",
      timestamp: "1 week ago",
      severity: "high",
      type: "privacy",
      icon: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    },
    {
      id: 5,
      app: "News App",
      title: "Microphone Access",
      description:
        "This app has permission to access your microphone, which was granted during initial setup.",
      timestamp: "2 weeks ago",
      severity: "low",
      type: "permission",
      icon: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    },
  ];

  // Update stats
  function updateStats() {
    document.getElementById("total-count").textContent = notifications.length;

    const highCount = notifications.filter((n) => n.severity === "high").length;
    document.getElementById("high-count").textContent = highCount;
    document.getElementById("high-badge").textContent = highCount;

    const permissionCount = notifications.filter(
      (n) => n.type === "permission"
    ).length;
    document.getElementById("permission-count").textContent = permissionCount;

    const privacyCount = notifications.filter(
      (n) => n.type === "privacy"
    ).length;
    document.getElementById("privacy-count").textContent = privacyCount;

    const termsCount = notifications.filter((n) => n.type === "terms").length;
    document.getElementById("terms-count").textContent = termsCount;
  }

  // Create notification card
  function createNotificationCard(notification) {
    const template = document.getElementById("notification-template");
    const clone = document.importNode(template.content, true);

    // Set icon
    const iconElement = clone.querySelector(".notification-icon svg");
    iconElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    iconElement.setAttribute("width", "18");
    iconElement.setAttribute("height", "18");
    iconElement.setAttribute("viewBox", "0 0 24 24");
    iconElement.setAttribute("fill", "none");
    iconElement.setAttribute("stroke", "currentColor");
    iconElement.setAttribute("stroke-width", "2");
    iconElement.setAttribute("stroke-linecap", "round");
    iconElement.setAttribute("stroke-linejoin", "round");
    iconElement.innerHTML = notification.icon;

    // Set icon container class based on severity
    clone
      .querySelector(".notification-icon")
      .classList.add(notification.severity);

    // Set title and description
    clone.querySelector(".notification-title").textContent = notification.title;
    clone.querySelector(".notification-description").textContent =
      notification.description;

    // Set meta info
    clone.querySelector(
      ".notification-meta"
    ).textContent = `${notification.app} • ${notification.timestamp}`;

    // Set severity badge
    const severityBadge = clone.querySelector(".notification-title-row .badge");
    severityBadge.textContent =
      notification.severity === "high"
        ? "High Priority"
        : notification.severity === "medium"
        ? "Medium"
        : "Low";

    if (notification.severity === "high") {
      severityBadge.classList.add("badge-red");
    } else if (notification.severity === "medium") {
      severityBadge.classList.add("badge-yellow");
    } else {
      severityBadge.classList.add("badge-outline");
    }

    // Set type badge
    const typeBadge = clone.querySelector(".type-badge");
    typeBadge.textContent = notification.type;

    if (notification.type === "permission") {
      typeBadge.classList.add("badge-outline");
    } else if (notification.type === "privacy") {
      // Default badge style
    } else {
      typeBadge.classList.add("badge-outline");
    }

    return clone;
  }

  // Render notifications
  function renderNotifications(filteredNotifications = notifications) {
    // Clear all notification containers
    document.querySelectorAll(".notifications-list").forEach((container) => {
      container.innerHTML = "";
    });

    // Render all notifications
    const allContainer = document.getElementById("all-notifications");
    filteredNotifications.forEach((notification) => {
      allContainer.appendChild(createNotificationCard(notification));
    });

    // Render high priority notifications
    const highContainer = document.getElementById("high-notifications");
    filteredNotifications
      .filter((notification) => notification.severity === "high")
      .forEach((notification) => {
        highContainer.appendChild(createNotificationCard(notification));
      });

    // Render permission notifications
    const permissionsContainer = document.getElementById(
      "permissions-notifications"
    );
    filteredNotifications
      .filter((notification) => notification.type === "permission")
      .forEach((notification) => {
        permissionsContainer.appendChild(createNotificationCard(notification));
      });

    // Render privacy notifications
    const privacyContainer = document.getElementById("privacy-notifications");
    filteredNotifications
      .filter((notification) => notification.type === "privacy")
      .forEach((notification) => {
        privacyContainer.appendChild(createNotificationCard(notification));
      });

    // Render terms notifications
    const termsContainer = document.getElementById("terms-notifications");
    filteredNotifications
      .filter((notification) => notification.type === "terms")
      .forEach((notification) => {
        termsContainer.appendChild(createNotificationCard(notification));
      });
  }

  // Tab switching
  function setupTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        tab.classList.add("active");

        // Hide all tab content
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active");
        });

        // Show selected tab content
        const tabId = tab.getAttribute("data-tab");
        document.getElementById(`${tabId}-tab`).classList.add("active");
      });
    });
  }

  // Search functionality
  function setupSearch() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filteredNotifications = notifications.filter(
        (notification) =>
          notification.app.toLowerCase().includes(query) ||
          notification.title.toLowerCase().includes(query) ||
          notification.description.toLowerCase().includes(query)
      );
      renderNotifications(filteredNotifications);
    });
  }

  // Added theme toggle functionality
  function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Set initial theme based on saved preference or system preference
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.body.classList.add("dark");
      updateThemeIcon(true);
    }

    // Toggle theme when button is clicked
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcon(isDark);
    });

    // Update theme icon based on current theme
    function updateThemeIcon(isDark) {
      if (isDark) {
        // Moon icon for dark mode
        themeIcon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/>';
      } else {
        // Sun icon for light mode
        themeIcon.innerHTML =
          '<circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/>';
      }
    }
  }

  // Initialize
  updateStats();
  renderNotifications();
  setupTabs();
  setupSearch();
  setupThemeToggle(); // Added theme toggle initialization
});
