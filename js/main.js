// DOM Elements
const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
const mobileNav = document.getElementById("mobile-nav")
const themeToggle = document.getElementById("theme-toggle")
const currentYearElements = document.querySelectorAll("#current-year")
const userButton = document.querySelector(".user-button")

// Initialize the theme
function initTheme() {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  mobileMenuToggle.classList.toggle("active")
  mobileNav.classList.toggle("active")
}

// Toggle theme
function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark")
    localStorage.setItem("theme", "light")
  } else {
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme", "dark")
  }
}

// Set current year in footer
function setCurrentYear() {
  const currentYear = new Date().getFullYear()
  currentYearElements.forEach((element) => {
    element.textContent = currentYear
  })
}

// Toggle user dropdown
function toggleUserDropdown() {
  if (userButton) {
    userButton.classList.toggle("active")
  }
}

// Check if user is logged in
function checkAuthStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const userButton = document.querySelector(".user-button")

  if (currentUser && userButton) {
    // Create user dropdown
    const userDropdown = document.createElement("div")
    userDropdown.className = "user-dropdown"

    // Determine if we should show profile picture or initials
    let avatarContent
    if (currentUser.picture) {
      avatarContent = `<img src="${currentUser.picture}" alt="${currentUser.firstName}" class="user-avatar-img">`
    } else {
      avatarContent = `<span>${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}</span>`
    }

    // Add verified badge if user is Google verified
    const verifiedBadge = currentUser.isGoogleVerified
      ? `<div class="verified-badge" title="Google Verified">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>`
      : ""

    userDropdown.innerHTML = `
      <div class="user-avatar">
        ${avatarContent}
        ${verifiedBadge}
      </div>
      <div class="user-menu">
        <div class="user-menu-header">
          <div class="user-name">${currentUser.firstName} ${currentUser.lastName}</div>
          <div class="user-email">${currentUser.email}</div>
        </div>
        <ul class="user-menu-items">
          <li class="user-menu-item">
            <a href="profile.html" class="user-menu-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              My Profile
            </a>
          </li>
          <li class="user-menu-item">
            <a href="orders.html" class="user-menu-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              My Orders
            </a>
          </li>
          <li class="user-menu-item">
            <a href="#" class="user-menu-link logout" id="logout-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </a>
          </li>
        </ul>
      </div>
    `

    // Replace user button with dropdown
    userButton.parentNode.replaceChild(userDropdown, userButton)

    // Add event listener to toggle dropdown
    const userAvatar = document.querySelector(".user-avatar")
    if (userAvatar) {
      userAvatar.addEventListener("click", function () {
        this.parentElement.classList.toggle("active")
      })
    }

    // Add event listener to logout button
    const logoutButton = document.getElementById("logout-button")
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault()
        localStorage.removeItem("currentUser")
        window.location.href = "login.html"
      })
    }
  }
}

// Tab functionality
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")

      // Remove active class from all buttons and contents
      document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      document.getElementById(tabId)?.classList.add("active")
    })
  })
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  setCurrentYear()
  checkAuthStatus()

  // Event listeners
  mobileMenuToggle?.addEventListener("click", toggleMobileMenu)
  themeToggle?.addEventListener("click", toggleTheme)
  userButton?.addEventListener("click", toggleUserDropdown)

  // Initialize tabs if they exist
  initTabs()

  // Add animation classes to elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".food-card, .step-card, .quick-link-card, .animate-fade-in, .animate-slide-up, .animate-slide-down, .animate-slide-left, .animate-slide-right, .animate-scale",
    )

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.2

      if (elementPosition < screenPosition) {
        element.style.opacity = "1"

        if (
          element.classList.contains("animate-slide-up") ||
          element.classList.contains("food-card") ||
          element.classList.contains("step-card") ||
          element.classList.contains("quick-link-card")
        ) {
          element.style.transform = "translateY(0)"
        } else if (element.classList.contains("animate-slide-down")) {
          element.style.transform = "translateY(0)"
        } else if (element.classList.contains("animate-slide-left")) {
          element.style.transform = "translateX(0)"
        } else if (element.classList.contains("animate-slide-right")) {
          element.style.transform = "translateX(0)"
        } else if (element.classList.contains("animate-scale")) {
          element.style.transform = "scale(1)"
        }
      }
    })
  }

  // Initial check for elements in view
  animateOnScroll()

  // Listen for scroll events
  window.addEventListener("scroll", animateOnScroll)
})

