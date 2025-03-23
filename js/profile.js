document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    if (!currentUser) {
      // Redirect to login page if not logged in
      window.location.href = "login.html"
      return
    }
  
    // DOM Elements
    const profileAvatar = document.getElementById("profile-avatar")
    const profileName = document.getElementById("profile-name")
    const profileForm = document.getElementById("profile-form")
    const logoutButton = document.getElementById("logout-button")
    const tabLinks = document.querySelectorAll(".profile-menu-link")
  
    // Populate user information
    if (profileAvatar) {
      if (currentUser.picture) {
        profileAvatar.innerHTML = `<img src="${currentUser.picture}" alt="${currentUser.firstName}" class="profile-avatar-img">`
      } else {
        profileAvatar.innerHTML = `<span>${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}</span>`
      }
    }
  
    if (profileName) {
      profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`
    }
  
    // Populate profile form
    if (profileForm) {
      document.getElementById("first-name").value = currentUser.firstName || ""
      document.getElementById("last-name").value = currentUser.lastName || ""
      document.getElementById("email").value = currentUser.email || ""
      document.getElementById("phone").value = currentUser.phone || ""
  
      // Handle form submission
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form values
        const firstName = document.getElementById("first-name").value
        const lastName = document.getElementById("last-name").value
        const phone = document.getElementById("phone").value
  
        // Update user in localStorage
        const users = JSON.parse(localStorage.getItem("users")) || []
        const userIndex = users.findIndex((u) => u.id === currentUser.id)
  
        if (userIndex !== -1) {
          users[userIndex].firstName = firstName
          users[userIndex].lastName = lastName
          users[userIndex].phone = phone
  
          localStorage.setItem("users", JSON.stringify(users))
  
          // Update current user
          currentUser.firstName = firstName
          currentUser.lastName = lastName
          currentUser.phone = phone
  
          localStorage.setItem("currentUser", JSON.stringify(currentUser))
  
          // Update profile name
          if (profileName) {
            profileName.textContent = `${firstName} ${lastName}`
          }
  
          // Update avatar initials if no picture
          if (profileAvatar && !currentUser.picture) {
            profileAvatar.innerHTML = `<span>${firstName.charAt(0)}${lastName.charAt(0)}</span>`
          }
  
          // Show success message
          showNotification("Profile updated successfully", "success")
        }
      })
    }
  
    // Handle tab navigation
    tabLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Get tab ID
        const tabId = this.getAttribute("data-tab")
  
        // Remove active class from all tabs
        document.querySelectorAll(".profile-menu-item").forEach((item) => {
          item.classList.remove("active")
        })
  
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active")
        })
  
        // Add active class to clicked tab
        this.parentElement.classList.add("active")
        document.getElementById(tabId).classList.add("active")
      })
    })
  
    // Handle logout
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        localStorage.removeItem("currentUser")
        window.location.href = "login.html"
      })
    }
  
    // Handle delete account
    const deleteAccountBtn = document.getElementById("delete-account-btn")
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
          // Remove user from localStorage
          const users = JSON.parse(localStorage.getItem("users")) || []
          const updatedUsers = users.filter((u) => u.id !== currentUser.id)
  
          localStorage.setItem("users", JSON.stringify(updatedUsers))
          localStorage.removeItem("currentUser")
  
          // Redirect to home page
          window.location.href = "index.html"
        }
      })
    }
  
    // Show notification
    function showNotification(message, type) {
      // Create notification element
      const notification = document.createElement("div")
      notification.className = `notification ${type}`
      notification.textContent = message
  
      // Add to body
      document.body.appendChild(notification)
  
      // Show notification
      setTimeout(() => {
        notification.classList.add("show")
      }, 10)
  
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          notification.remove()
        }, 300)
      }, 3000)
    }
  })
  
  