document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const resetForm = document.getElementById("reset-form")
  const passwordToggles = document.querySelectorAll(".toggle-password")
  const googleSigninContainer = document.getElementById("google-signin-button")

  // Initialize cart badge
  updateCartBadge()

  // Initialize Google Sign-In
  if (googleSigninContainer) {
    // Check if google is defined before calling initGoogleSignIn
    if (typeof google !== "undefined") {
      initGoogleSignIn()
    } else {
      console.error("Google Sign-In API not loaded. Ensure the script is included in your HTML.")
    }
  }

  // Toggle password visibility
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input")
      const showIcon = this.querySelector(".show-password")
      const hideIcon = this.querySelector(".hide-password")

      if (input.type === "password") {
        input.type = "text"
        showIcon.style.display = "none"
        hideIcon.style.display = "block"
      } else {
        input.type = "password"
        showIcon.style.display = "block"
        hideIcon.style.display = "none"
      }
    })
  })

  // Password strength meter
  const passwordInput = document.getElementById("password")
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      updatePasswordStrength(this.value)
    })
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Reset previous errors
      clearErrors()

      // Get form values
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const rememberMe = document.getElementById("remember-me")?.checked || false

      // Validate form
      let isValid = true

      if (!validateEmail(email)) {
        showError("email-error", "Please enter a valid email address")
        isValid = false
      }

      if (password.length < 6) {
        showError("password-error", "Password must be at least 6 characters")
        isValid = false
      }

      if (isValid) {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem("users")) || []
        const user = users.find((u) => u.email === email)

        if (user && user.password === password) {
          // Set current user in localStorage
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              isGoogleVerified: user.isGoogleVerified || false,
              picture: user.picture || null,
            }),
          )

          // Show success notification
          showNotification("Login successful! Redirecting...", "success")

          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = "index.html"
          }, 1500)
        } else {
          // Show login error
          const loginError = document.getElementById("login-error")
          loginError.textContent = "Invalid email or password"
          loginError.style.display = "block"
        }
      }
    })
  }

  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Reset previous errors
      clearErrors()

      // Get form values
      const firstName = document.getElementById("first-name").value
      const lastName = document.getElementById("last-name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const termsAccepted = document.getElementById("terms").checked

      // Validate form
      let isValid = true

      if (firstName.trim() === "") {
        showError("first-name-error", "First name is required")
        isValid = false
      }

      if (lastName.trim() === "") {
        showError("last-name-error", "Last name is required")
        isValid = false
      }

      if (!validateEmail(email)) {
        showError("email-error", "Please enter a valid email address")
        isValid = false
      }

      if (!validatePhone(phone)) {
        showError("phone-error", "Please enter a valid phone number")
        isValid = false
      }

      if (password.length < 6) {
        showError("password-error", "Password must be at least 6 characters")
        isValid = false
      }

      if (password !== confirmPassword) {
        showError("confirm-password-error", "Passwords do not match")
        isValid = false
      }

      if (!termsAccepted) {
        showError("terms-error", "You must accept the Terms of Service and Privacy Policy")
        isValid = false
      }

      if (isValid) {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem("users")) || []
        const existingUser = users.find((u) => u.email === email)

        if (existingUser) {
          showError("email-error", "Email already in use")
          return
        }

        // Create new user
        const newUser = {
          id: generateUserId(),
          firstName,
          lastName,
          email,
          phone,
          password,
          isGoogleVerified: false,
          createdAt: new Date().toISOString(),
        }

        // Add user to localStorage
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // Set current user in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            isGoogleVerified: false,
          }),
        )

        // Show success notification
        showNotification("Account created successfully! Redirecting...", "success")

        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1500)
      }
    })
  }

  // Reset password form submission
  if (resetForm) {
    resetForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Reset previous errors
      clearErrors()

      // Get form values
      const email = document.getElementById("email").value

      // Validate form
      let isValid = true

      if (!validateEmail(email)) {
        showError("email-error", "Please enter a valid email address")
        isValid = false
      }

      if (isValid) {
        // Check if user exists
        const users = JSON.parse(localStorage.getItem("users")) || []
        const user = users.find((u) => u.email === email)

        if (user) {
          // Show success message
          const resetSuccess = document.getElementById("reset-success")
          resetSuccess.textContent = "Password reset instructions have been sent to your email"
          resetSuccess.style.display = "block"

          // Hide the form
          resetForm.style.display = "none"
        } else {
          // Show error message
          const resetError = document.getElementById("reset-error")
          resetError.textContent = "No account found with this email address"
          resetError.style.display = "block"
        }
      }
    })
  }

  // Helper Functions

  // Initialize Google Sign-In
  function initGoogleSignIn() {
    if (typeof google === "undefined") {
      console.error("Google API not loaded")
      return
    }
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your actual Google Client ID
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
    })

    google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
    })
  }

  // Handle Google Sign-In
  function handleGoogleSignIn(response) {
    // Decode the JWT token from Google
    const payload = parseJwt(response.credential)

    if (payload) {
      const { email, given_name, family_name, picture, sub } = payload

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users")) || []
      const user = users.find((u) => u.email === email)

      if (user) {
        // Update existing user with Google info
        user.isGoogleVerified = true
        user.googleId = sub
        user.picture = picture

        // Update users in localStorage
        localStorage.setItem("users", JSON.stringify(users))

        // Set current user in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            isGoogleVerified: true,
            picture: picture,
          }),
        )
      } else {
        // Create new user
        const newUser = {
          id: generateUserId(),
          firstName: given_name,
          lastName: family_name,
          email: email,
          phone: "",
          isGoogleVerified: true,
          googleId: sub,
          picture: picture,
          createdAt: new Date().toISOString(),
        }

        // Add user to localStorage
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // Set current user in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            isGoogleVerified: true,
            picture: picture,
          }),
        )
      }

      // Show success notification
      showNotification("Google authentication successful! Redirecting...", "success")

      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    } else {
      showNotification("Google authentication failed. Please try again.", "error")
    }
  }

  // Parse JWT token
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error("Error parsing JWT token", e)
      return null
    }
  }

  // Validate email
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Validate phone number
  function validatePhone(phone) {
    const re = /^[0-9]{10}$/
    return re.test(String(phone).replace(/[^0-9]/g, ""))
  }

  // Show error message
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
      errorElement.textContent = message
    }
  }

  // Clear all error messages
  function clearErrors() {
    const errorElements = document.querySelectorAll(".input-error")
    errorElements.forEach((element) => {
      element.textContent = ""
    })

    const formErrors = document.querySelectorAll(".auth-error")
    formErrors.forEach((element) => {
      element.style.display = "none"
    })
  }

  // Generate unique user ID
  function generateUserId() {
    return "user_" + Math.random().toString(36).substr(2, 9)
  }

  // Update password strength meter
  function updatePasswordStrength(password) {
    const strengthSegments = document.querySelectorAll(".strength-segment")
    const strengthText = document.querySelector(".strength-text")

    if (!strengthSegments.length || !strengthText) return

    // Reset segments
    strengthSegments.forEach((segment) => {
      segment.className = "strength-segment"
    })

    // Calculate password strength
    let strength = 0

    // Length check
    if (password.length >= 8) {
      strength += 1
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1
    }

    // Number check
    if (/[0-9]/.test(password)) {
      strength += 1
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1
    }

    // Update strength meter
    if (password.length === 0) {
      strengthText.textContent = "Password strength"
    } else if (strength < 2) {
      strengthText.textContent = "Weak"
      strengthSegments[0].classList.add("weak")
    } else if (strength < 4) {
      strengthText.textContent = "Medium"
      strengthSegments[0].classList.add("medium")
      strengthSegments[1].classList.add("medium")
    } else {
      strengthText.textContent = "Strong"
      strengthSegments[0].classList.add("strong")
      strengthSegments[1].classList.add("strong")
      strengthSegments[2].classList.add("strong")
      strengthSegments[3].classList.add("strong")
    }
  }

  // Update cart badge
  function updateCartBadge() {
    const cartBadge = document.querySelector(".cart-badge")
    if (cartBadge) {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      cartBadge.textContent = totalItems
    }
  }

  // Show notification
  function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll(".auth-notification")
    existingNotifications.forEach((notification) => notification.remove())

    // Create notification element
    const notification = document.createElement("div")
    notification.className = `auth-notification ${type}`

    // Create notification content
    const content = document.createElement("div")
    content.className = "auth-notification-content"

    // Add icon based on type
    const icon = document.createElement("div")
    icon.className = `auth-notification-icon ${type}`

    if (type === "success") {
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    } else {
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    }

    // Add message
    const messageElement = document.createElement("div")
    messageElement.className = "auth-notification-message"
    messageElement.textContent = message

    // Add close button
    const closeButton = document.createElement("button")
    closeButton.className = "auth-notification-close"
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    closeButton.addEventListener("click", () => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })

    // Assemble notification
    content.appendChild(icon)
    content.appendChild(messageElement)
    notification.appendChild(content)
    notification.appendChild(closeButton)

    // Add to body
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.remove("show")
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Check if user is logged in
  function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    if (currentUser) {
      // Update user button to show profile dropdown
      const userButton = document.querySelector(".user-button")
      if (userButton) {
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
  }

  // Initialize auth status
  checkAuthStatus()
})

