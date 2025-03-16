document.addEventListener("DOMContentLoaded", () => {
  const menuItemsContainer = document.getElementById("menu-items-container")
  const menuTabs = document.getElementById("menu-tabs")
  const searchInput = document.getElementById("menu-search")

  let currentCategory = "all"
  let searchQuery = ""

  // Declare menuItems and cartItems (replace with actual data or import)
  const menuItems = [
    {
      id: "1",
      name: "Egg Bhurji",
      description: "1 Plate of Egg Bhurji",
      price: 30,
      category: "main",
      image: "https://i.postimg.cc/qqcrtQD4/Egg-Bhurji-2-3.jpg",
      vegetarian: false,
    },
    {
      id: "2",
      name: "Chicken  Sandwich",
      description: "2 Chicken Sandwich",
      price: 35,
      category: "main",
      image: "https://i.postimg.cc/CLYBc2gC/mayo-chicken-sandwich-recipe.jpg",
      vegetarian: false,
    },
    {
      id: "3",
      name: "Veg Sandwich",
      description: "2 Veg Sandwich",
      price: 25,
      category: "side",
      image: "https://i.postimg.cc/52QXyWqV/vegetarian-club-sandwich-recipe.jpg",
      vegetarian: true,
    },
    {
      id: "4",
      name: "Egg Bhurji",
      description: "1 Plate of Egg Bhurji",
      price: 30,
      category: "Breakfast",
      image: "https://i.postimg.cc/qqcrtQD4/Egg-Bhurji-2-3.jpg",
      vegetarian: false,
    },
    {
      id: "5",
      name: "Chicken  Sandwich",
      description: "2 Chicken Sandwich",
      price: 35,
      category: "Breakfast",
      image: "https://i.postimg.cc/CLYBc2gC/mayo-chicken-sandwich-recipe.jpg",
      vegetarian: false,
    },
    {
      id: "6",
      name: "Veg Sandwich",
      description: "2 Veg Sandwich",
      price: 25,
      category: "Breakfast",
      image: "https://i.postimg.cc/52QXyWqV/vegetarian-club-sandwich-recipe.jpg",
      vegetarian: true,
    },
    {
      id: "7",
      name: "Boiled Egg",
      description: "2 Boiled Egg",
      price: 20,
      category: "Breakfast",
      image: "https://i.postimg.cc/DzVPygGx/Getty-Images-1309107688-hbeggs-scaled.jpg",
      vegetarian: false,
    },
    {
      id: "8",
      name: "Omlet",
      description: "1 Omlet with two bread",
      price: 25,
      category: "Breakfast",
      image: "https://i.postimg.cc/RFZRj0Km/photo.jpg",
      vegetarian: false,
    },
    {
      id: "9",
      name: "Poori",
      description: "Chana Masala with Poori",
      price: 25,
      category: "Lunch",
      image: "https://i.postimg.cc/qBjRJvKY/photo.jpg",
      vegetarian: true,
    },
    {
      id: "10",
      name: "Rajma Chawal",
      description: "Rajma Chawal with Raita",
      price: 75,
      category: "Lunch",
      image: "https://i.postimg.cc/C1vggd2s/rajma-chawal-1.jpg",
      vegetarian: true,
    },
    {
      id: "11",
      name: "Rice",
      description: "Rice with Curry",
      price: 40,
      category: "Lunch",
      image: "https://i.postimg.cc/ZqdHmQD7/instant-pot-dal-rice-recipe.jpg",
      vegetarian: true,
    },
    {
      id: "12",
      name: "Chicken Biriyani",
      description: "Chicken Biriyani with Raita",
      price: 130,
      category: "Lunch",
      image: "https://i.postimg.cc/qRBNwhns/Chicken-Biryani-resized.jpg",
      vegetarian: false,
    },
    {
      id: "13",
      name: "Chowmin",
      description: "1 Plate Chowmin with Salad",
      price: 55,
      category: "Lunch",
      image: "https://i.postimg.cc/HLXNzjHk/20221130023757-untitled-design-12-3.png",
      vegetarian: true,
    },
    {
      id: "14",
      name: "7 Up",
      description: "500 ml of 7 Up",
      price: 30,
      category: "Juice",
      image: "https://i.postimg.cc/D0FVX2dJ/new-product-500x500.jpg",
      vegetarian: false,
    },
    {
      id: "15",
      name: "Thums Up",
      description: "500 ml of Thums Up",
      price: 30,
      category: "Juice",
      image: "https://i.postimg.cc/3NpgPTPB/thums-up-soft-drink-01-500x500.jpg",
      vegetarian: false,
    },
    {
      id: "16",
      name: "Limca",
      description: "750 ml of Limca",
      price: 30,
      category: "Juice",
      image: "https://i.postimg.cc/KYZJBRdy/limca-750-ml-product-images-o491085936-p491085936-0-202203170642.webp",
      vegetarian: false,
    },
    {
      id: "17",
      name: "Paper Boat",
      description: "1 Pouch of Paper Boat",
      price: 10,
      category: "Juice",
      image: "https://i.postimg.cc/7LHrhP95/paper-boat-swing-slurpy-mango-juice-125-ml-product-images-o491586649-p590052492-0-202305051236.webp",
      vegetarian: false,
    },
    {
      id: "18",
      name: "Coca Cola",
      description: "500 ml of Coca Cola",
      price: 35,
      category: "Juice",
      image: "https://i.postimg.cc/bNmBg09w/68oif2Lf.jpg",
      vegetarian: false,
    },
    {
      id: 19,
      name: "Burger",
      image: "https://i.postimg.cc/59YqHZsg/83565509.jpg",
      price: 70,
      description: "A juicy beef burger with all the fixings.",
      category: "Lunch",
      featured: true,
      vegetarian: false,
    },
    {
      id: 20,
      name: "Pizza",
      image: "https://i.postimg.cc/MKrSsf7q/1200px-Pizza-3007395.jpg",
      price: 75,
      description: "A delicious pepperoni pizza.",
      category: "Lunch",
      featured: true,
      vegetarian: false,
    },
    {
      id: 21,
      name: "Salad",
      image: "https://i.postimg.cc/fyD9grht/how-to-make-a-simple-salad-recipe-vegan-gluten-free-lunch-260-main-img-6804-lrcc.jpg",
      price: 15,
      description: "A fresh and healthy salad.",
      category: "Lunch",
      featured: true,
      vegetarian: true,
    },
    {
      id: 22,
      name: "Pasta",
      image: "https://i.postimg.cc/15NQj5JF/320x198-Photo-2-862-How-to-Make-CHICKEN-PASTA-Like-an-Italian-V1.jpg",
      price: 45,
      description: "A creamy pasta dish.",
      category: "Lunch",
      featured: false,
      vegetarian: true,
    },
    // Add more menu items here...
    {
      id: 23,
      name: "Coffee",
      image: "https://i.postimg.cc/wMjhjGbK/worlds-coffee-mostly-comes-from-2-countries-thats-a-problem.jpg",
      price: 10,
      description: "A hot cup of coffee.",
      category: "Drinks",
      featured: false,
      vegetarian: true,
    },
    {
      id: 24,
      name: "Tea",
      image: "https://i.postimg.cc/2jWq4mhH/cardamom-tea4.jpg",
      price: 5,
      description: "A cup of tea.",
      category: "Drinks",
      featured: false,
      vegetarian: true,
    },
  ]
  const cartItems = JSON.parse(localStorage.getItem("cart")) || []

  // Initialize menu tabs
  if (menuTabs) {
    menuTabs.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab-button")) {
        const category = e.target.getAttribute("data-category")
        currentCategory = category

        // Update active tab
        document.querySelectorAll(".tab-button").forEach((tab) => {
          tab.classList.remove("active")
        })
        e.target.classList.add("active")

        // Render menu items
        renderMenuItems()
      }
    })
  }

  // Initialize search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase()
      renderMenuItems()
    })
  }

  // Render menu items based on category and search query
  function renderMenuItems() {
    if (!menuItemsContainer) return

    // Filter items based on category and search query
    let filteredItems = menuItems

    if (currentCategory !== "all") {
      filteredItems = filteredItems.filter((item) => item.category === currentCategory)
    }

    if (searchQuery) {
      filteredItems = filteredItems.filter(
        (item) => item.name.toLowerCase().includes(searchQuery) || item.description.toLowerCase().includes(searchQuery),
      )
    }

    // Group items by category if showing all
    if (currentCategory === "all") {
      // Get unique categories
      const categories = [...new Set(filteredItems.map((item) => item.category))]

      menuItemsContainer.innerHTML = categories
        .map(
          (category) => `
        <div class="menu-category">
          <h2 class="category-title">${category}</h2>
          <div class="menu-items">
            ${filteredItems
              .filter((item) => item.category === category)
              .map((item) => createMenuItemHTML(item))
              .join("")}
          </div>
        </div>
      `,
        )
        .join("")
    } else {
      menuItemsContainer.innerHTML = `
        <div class="menu-items">
          ${filteredItems.map((item) => createMenuItemHTML(item)).join("")}
        </div>
      `
    }

    // Add event listeners to Add buttons
    document.querySelectorAll(".add-button").forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = this.getAttribute("data-id")
        addToCart(itemId)

        // Animation effect
        this.innerHTML = "Added ✓"
        this.classList.add("pulse")

        setTimeout(() => {
          this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
            Add
          `
          this.classList.remove("pulse")
        }, 2000)
      })
    })
  }

  // Create HTML for a menu item
  function createMenuItemHTML(item) {
    return `
      <div class="menu-item">
        <div class="menu-item-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="menu-item-content">
          <div class="menu-item-header">
            <div>
              <h3 class="menu-item-title">${item.name}</h3>
              ${item.vegetarian ? '<span class="menu-item-badge">Veg</span>' : ""}
            </div>
            <span class="menu-item-price">₹${item.price}</span>
          </div>
          <p class="menu-item-description">${item.description}</p>
          <button class="add-button" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
            Add
          </button>
        </div>
      </div>
    `
  }

  // Function to add item to cart
  function addToCart(itemId) {
    const item = menuItems.find((item) => item.id === itemId)
    if (!item) return

    // Check if item is already in cart
    const existingItem = cartItems.find((cartItem) => cartItem.id === itemId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      })
    }

    // Update cart badge
    updateCartBadge()

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }

  // Update cart badge
  function updateCartBadge() {
    const cartBadge = document.querySelector(".cart-badge")
    if (cartBadge) {
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
      cartBadge.textContent = totalItems
    }
  }

  // Initialize
  renderMenuItems()
  updateCartBadge()
})

