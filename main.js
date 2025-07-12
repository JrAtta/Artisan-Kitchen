      // Toggle mobile menu
      const menuToggle = document.getElementById("menu-toggle");
      const navMenu = document.getElementById("nav-menu");

      menuToggle.addEventListener("click", () => {
        if (navMenu.style.maxHeight) {
          // Close menu
          navMenu.style.maxHeight = null;
          navMenu.style.opacity = "0";
          navMenu.style.pointerEvents = "none";
        } else {
          // Open menu
          navMenu.style.maxHeight = navMenu.scrollHeight + "px";
          navMenu.style.opacity = "1";
          navMenu.style.pointerEvents = "auto";
        }
      });

      // Toggle theme
      const themeToggle = document.getElementById("theme-toggle");
      const body = document.body;

      themeToggle.addEventListener("click", () => {
        body.dataset.theme = body.dataset.theme === "light" ? "dark" : "light";
        themeToggle.innerHTML =
          body.dataset.theme === "light"
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
        lucide.createIcons();
      });

      // Animation classes for floating images - add this early
      document.head.insertAdjacentHTML(
        "beforeend",
        `
        <style>
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes float-slow {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          @keyframes float-reverse {
            0% { transform: translateY(0px); }
            50% { transform: translateY(10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 7s ease-in-out infinite;
          }
          .animate-float-reverse {
            animation: float-reverse 5s ease-in-out infinite;
          }
        </style>
      `
      );

      // Set RGB values immediately
      function processColors() {
        // Helper function for RGB conversion
        function hexToRgb(hex) {
          // Remove # if present
          hex = hex.replace(/^#/, "");

          // Parse the hex values
          let r, g, b;
          if (hex.length === 3) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
          } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
          }

          return `${r}, ${g}, ${b}`;
        }

        // Helper function to get RGB values from different color formats
        function getRgbValues(color) {
          // For hex colors
          if (color.startsWith("#")) {
            return hexToRgb(color);
          }

          // For rgb/rgba colors
          if (color.startsWith("rgb")) {
            const match = color.match(
              /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
            );
            if (match) {
              return `${match[1]}, ${match[2]}, ${match[3]}`;
            }
          }

          return "0, 0, 0"; // Default fallback
        }

        // Get color values
        const getCssVariable = (variableName) => {
          return getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();
        };

        // Set default RGB values if conversion fails
        document.documentElement.style.setProperty(
          "--bg-secondary-rgb",
          "255, 255, 255"
        );
        document.documentElement.style.setProperty(
          "--cta-primary-rgb",
          "195, 150, 120"
        );
        document.documentElement.style.setProperty(
          "--accent-primary-rgb",
          "125, 145, 119"
        );

        // Now try to get the actual colors
        try {
          const bgSecondary = getCssVariable("--bg-secondary");
          const ctaPrimary = getCssVariable("--cta-primary");
          const accentPrimary = getCssVariable("--accent-primary");

          // Only override if we get valid values
          if (bgSecondary) {
            document.documentElement.style.setProperty(
              "--bg-secondary-rgb",
              getRgbValues(bgSecondary)
            );
          }

          if (ctaPrimary) {
            document.documentElement.style.setProperty(
              "--cta-primary-rgb",
              getRgbValues(ctaPrimary)
            );
          }

          if (accentPrimary) {
            document.documentElement.style.setProperty(
              "--accent-primary-rgb",
              getRgbValues(accentPrimary)
            );
          }
        } catch (e) {
          console.log("Error converting colors:", e);
        }
      }

      // Process colors immediately
      processColors();

      // Smooth scroll for navigation
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("href").substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Close the mobile menu if open
            if (window.innerWidth < 768) {
              navMenu.style.maxHeight = null;
            }

            // Scroll to the target element
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: "smooth",
            });
          }
        });
      });

      // Make sure  icons are initialized
      window.addEventListener("load", function () {});

      // GSAP animations setup
      document.addEventListener("DOMContentLoaded", function () {
        // Create icons again to be sure

        // Show all recipe cards immediately if GSAP fails
        document.querySelectorAll(".recipe-card").forEach((card) => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });

        // Show all fade-in elements immediately if GSAP fails
        document.querySelectorAll(".fade-in").forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        });

        // Now try to set up GSAP animations
        if (typeof gsap !== "undefined" && gsap.registerPlugin) {
          try {
            // Initialize GSAP ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);

            // Animate recipe cards
            gsap.utils.toArray(".recipe-card").forEach((card, i) => {
              gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom-=100",
                  toggleActions: "play none none none",
                },
                delay: i * 0.1,
              });
            });

            // Animate fade-in elements
            gsap.utils.toArray(".fade-in").forEach((element, i) => {
              gsap.from(element, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top bottom-=100",
                  toggleActions: "play none none none",
                },
              });
            });

            // Add header shadow on scroll
            const header = document.querySelector("header");

            ScrollTrigger.create({
              start: "top top",
              end: "max",
              onUpdate: (self) => {
                if (self.direction === 1 && self.progress > 0.05) {
                  header.classList.add("shadow-md");
                } else if (self.direction === -1 && self.progress < 0.05) {
                  header.classList.remove("shadow-md");
                }
              },
            });
          } catch (e) {
            console.log("GSAP error:", e);
          }
        }
      });

      // Add navbar scroll effect
      window.addEventListener("scroll", function () {
        const navbar = document.getElementById("navbar");
        if (window.scrollY > 10) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      });

      // Update mobile theme toggle to match main toggle
      const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
      if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener("click", () => {
          body.dataset.theme =
            body.dataset.theme === "light" ? "dark" : "light";
        });
      }
    
      document.addEventListener("DOMContentLoaded", () => {
  // Recipe data with prices
  const recipes = {
    "truffle-risotto": {
      title: "Truffle Risotto",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80",
      description: "A creamy indulgence with truffle essence, perfect for an elegant dinner.",
      difficulty: "Medium",
      ingredients: ["1 cup Arborio rice", "4 cups chicken stock", "1/2 cup Parmesan cheese", "2 tbsp truffle oil"],
      price: 12.99,
    },
    "seared-salmon": {
      title: "Seared Salmon",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80",
      description: "Crisp outside, tender inside with a delicate flavor profile.",
      difficulty: "Easy",
      ingredients: ["2 salmon fillets", "1 tbsp olive oil", "1 tsp lemon zest", "Fresh herbs"],
      price: 9.99,
    },
    "chocolate-souffle": {
      title: "Chocolate Soufflé",
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80",
      description: "Light, rich, and airy dessert that melts in your mouth.",
      difficulty: "Hard",
      ingredients: ["100g dark chocolate", "2 large eggs", "1/4 cup sugar", "1 tsp vanilla"],
      price: 7.99,
    },
    "herb-roast-chicken": {
      title: "Herb Roast Chicken",
      image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&q=80",
      description: "Golden and fragrant, a perfect centerpiece for any dinner table.",
      difficulty: "Medium",
      ingredients: ["1 whole chicken", "2 tbsp olive oil", "Fresh herbs", "2 garlic cloves"],
      price: 14.99,
    },
    "caprese-salad": {
      title: "Caprese Salad",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80",
      description: "Fresh, vibrant, and colorful - the essence of Mediterranean cuisine.",
      difficulty: "Easy",
      ingredients: ["2 large tomatoes", "Fresh mozzarella", "Fresh basil leaves", "Balsamic glaze"],
      price: 6.99,
    },
    "lemon-ricotta-pancakes": {
      title: "Lemon Ricotta Pancakes",
      image: "https://www.abakingjourney.com/wp-content/uploads/2021/01/Lemon-Ricotta-Cake-Feature.jpg",
      description: "Fluffy with a citrus twist, perfect for a luxurious breakfast.",
      difficulty: "Easy",
      ingredients: ["1 cup ricotta cheese", "1 cup all-purpose flour", "2 tbsp sugar", "1 lemon, zested"],
      price: 8.99,
    },
  };

  // Initialize GSAP animations for recipe cards
  const recipeCards = document.querySelectorAll(".recipe-card[data-animation='scroll']");
  recipeCards.forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: i * 0.2,
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // Recipe filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const recipeGrid = document.querySelector(".grid[role='region']");

  filterButtons.forEach((button) => {
    const handleFilter = () => {
      const filter = button.dataset.filter;

      // Update active button state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter recipe cards
      recipeCards.forEach((card) => {
        const category = card.dataset.category;
        const isVisible = filter === "all" || category === filter;

        gsap.to(card, {
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.95,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            card.style.display = isVisible ? "block" : "none";
          },
        });
      });

      // Announce filter change for accessibility
      recipeGrid.setAttribute("aria-label", `Filtered to ${filter} recipes`);
    };

    button.addEventListener("click", handleFilter);
    button.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleFilter();
      }
    });
  });

  // Favorite toggle
  const favoriteButtons = document.querySelectorAll(".favorite-toggle");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || {};

  // Load favorite states
  favoriteButtons.forEach((button) => {
    const recipeId = button.dataset.recipe;
    if (favorites[recipeId]) {
      button.classList.add("favorited");
      button.setAttribute("aria-label", `Remove ${button.dataset.recipe.replace(/-/g, " ")} from favorites`);
    }
  });

  favoriteButtons.forEach((button) => {
    const toggleFavorite = () => {
      const recipeId = button.dataset.recipe;
      const isFavorited = button.classList.toggle("favorited");

      // Update localStorage
      favorites[recipeId] = isFavorited;
      localStorage.setItem("favorites", JSON.stringify(favorites));

      // Update aria-label
      const recipeName = recipeId.replace(/-/g, " ");
      button.setAttribute("aria-label", isFavorited ? `Remove ${recipeName} from favorites` : `Add ${recipeName} to favorites`);

      // Animate heart icon
      gsap.to(button, {
        scale: 1.2,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.in" });
        },
      });
    };

    button.addEventListener("click", toggleFavorite);
    button.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFavorite();
      }
    });
  });

  // Cart functionality
  const cartToggle = document.querySelector("#cart-toggle");
  const cartSidebar = document.querySelector("#cart-sidebar");
  const closeCartBtn = document.querySelector("#close-cart");
  const cartItemsContainer = document.querySelector("#cart-items");
  const cartTotal = document.querySelector("#cart-total");
  const checkoutBtn = document.querySelector("#checkout-btn");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Calculate total price
  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => {
      const recipe = recipes[item.id];
      return sum + (recipe ? recipe.price * item.quantity : 0);
    }, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
  };

  // Render cart items
  const renderCart = () => {
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-[var(--text-secondary)]">Your cart is empty.</p>';
      calculateTotal();
      return;
    }
    cart.forEach((item, index) => {
      const recipe = recipes[item.id];
      if (recipe) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "flex items-center space-x-4 p-2 bg-[var(--bg-accent)] rounded-lg";
        itemDiv.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}" class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <span class="text-[var(--text-primary)]">${recipe.title}</span>
            <p class="text-[var(--cta-primary)] text-sm">$${recipe.price.toFixed(2)} x ${item.quantity} = $${(recipe.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button class="decrease-qty p-1 bg-[var(--bg-accent)] rounded-full hover:bg-[var(--cta-primary)] hover:text-white transition-all" data-index="${index}" aria-label="Decrease quantity of ${recipe.title}" tabindex="0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14" />
              </svg>
            </button>
            <span class="text-[var(--text-primary)]">${item.quantity}</span>
            <button class="increase-qty p-1 bg-[var(--bg-accent)] rounded-full hover:bg-[var(--cta-primary)] hover:text-white transition-all" data-index="${index}" aria-label="Increase quantity of ${recipe.title}" tabindex="0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
      }
    });

    // Add event listeners for quantity buttons
    const decreaseButtons = document.querySelectorAll(".decrease-qty");
    const increaseButtons = document.querySelectorAll(".increase-qty");

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = button.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
      button.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          button.click();
        }
      });
    });

    increaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = button.dataset.index;
        cart[index].quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
      button.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          button.click();
        }
      });
    });

    calculateTotal();
  };

  // Open cart sidebar
  const openCart = () => {
    cartSidebar.classList.remove("hidden");
    gsap.to(cartSidebar, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
      onStart: () => {
        cartSidebar.style.pointerEvents = "auto";
      },
    });
    renderCart();
  };

  // Close cart sidebar
  const closeCart = () => {
    gsap.to(cartSidebar, {
      x: "100%",
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        cartSidebar.classList.add("hidden");
        cartSidebar.style.pointerEvents = "none";
      },
    });
  };

  cartToggle.addEventListener("click", openCart);
  cartToggle.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openCart();
    }
  });

  closeCartBtn.addEventListener("click", closeCart);
  closeCartBtn.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeCart();
    }
  });

  // Add to cart
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    const addToCart = () => {
      const recipeId = button.dataset.recipeId;
      const existingItem = cart.find((item) => item.id === recipeId);
      if (existingItem) {
        Swal.fire({
          title: `${recipes[recipeId].title} is already in your cart!`,
          icon: "info",
          confirmButtonText: "View Cart",
          showCancelButton: true,
          cancelButtonText: "Continue Shopping",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-[var(--cta-primary)] text-white font-medium px-4 py-2 rounded-full shadow-md hover:bg-[var(--cta-hover)] transition-all",
            cancelButton: "bg-[var(--bg-accent)] text-[var(--text-primary)] font-medium px-4 py-2 rounded-full shadow-md hover:bg-[var(--cta-primary)] hover:text-white transition-all ml-2",
            popup: "rounded-2xl shadow-xl",
            title: "text-[var(--text-primary)] text-lg font-semibold",
          },
        }).then((result) => {
          if (result.isConfirmed) openCart();
        });
      } else {
        cart.push({ id: recipeId, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        Swal.fire({
          title: `${recipes[recipeId].title} added to cart!`,
          icon: "success",
          confirmButtonText: "View Cart",
          showCancelButton: true,
          cancelButtonText: "Continue Shopping",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-[var(--cta-primary)] text-white font-medium px-4 py-2 rounded-full shadow-md hover:bg-[var(--cta-hover)] transition-all",
            cancelButton: "bg-[var(--bg-accent)] text-[var(--text-primary)] font-medium px-4 py-2 rounded-full shadow-md hover:bg-[var(--cta-primary)] hover:text-white transition-all ml-2",
            popup: "rounded-2xl shadow-xl",
            title: "text-[var(--text-primary)] text-lg font-semibold",
          },
        }).then((result) => {
          if (result.isConfirmed) openCart();
        });
      }
    };

    button.addEventListener("click", addToCart);
    button.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        addToCart();
      }
    });
  });

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Your cart is empty!",
        icon: "warning",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-[var(--cta-primary)] text-white font-medium px-4 py-2 rounded-full shadow-md hover:bg-[var(--cta-hover)] transition-all",
          popup: "rounded-2xl shadow-xl",
          title: "text-[var(--text-primary)] text-lg font-semibold",
        },
      });
      return;
    }
    Swal.fire({
      title: "Checkout complete!",
      text: `Total: ${cartTotal.textContent}`,
      icon: "success",
      confirmButtonText: "Back to Home",
      buttonsStyling: false,
      customClass: {
        confirmButton: "bg-[var(--cta-primary)] text-white font-medium px-4 py-2 rounded-full shadow-md hover:bg-[var(--cta-hover)] transition-all",
        popup: "rounded-2xl shadow-xl",
        title: "text-[var(--text-primary)] text-lg font-semibold",
        content: "text-[var(--text-secondary)]",
      },
    }).then(() => {
      localStorage.removeItem("cart");
      cart.length = 0;
      closeCart();
      window.location.hash = "home";
    });
  });
  checkoutBtn.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      checkoutBtn.click();
    }
  });

  // Recipe modal
  const modal = document.querySelector("#recipe-modal");
  const modalContent = document.querySelector("#modal-content");
  const closeModalBtn = document.querySelector("#close-modal");

  const openModal = (recipeId) => {
    const recipe = recipes[recipeId];
    if (!recipe) return;

    // Populate modal
    document.querySelector("#modal-image").src = recipe.image;
    document.querySelector("#modal-image").alt = recipe.title;
    document.querySelector("#modal-title").textContent = recipe.title;
    document.querySelector("#modal-description").textContent = recipe.description;
    document.querySelector("#modal-difficulty").textContent = `Difficulty: ${recipe.difficulty}`;
    const ingredientsList = document.querySelector("#modal-ingredients ul");
    ingredientsList.innerHTML = recipe.ingredients.map((item) => `
      <li class="flex items-center">
        <span class="inline-block w-2 h-2 rounded-full bg-[var(--accent-secondary)] mr-2"></span>
        ${item}
      </li>
    `).join("");

    // Show modal
    modal.classList.remove("hidden");
    gsap.to(modalContent, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const closeModal = () => {
    gsap.to(modalContent, {
      scale: 0.95,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.classList.add("hidden");
      },
    });
  };

  // Open modal on recipe click
  const viewRecipeLinks = document.querySelectorAll(".view-recipe");
  viewRecipeLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(link.dataset.recipeId);
    });
    link.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(link.dataset.recipeId);
      }
    });
  });

  // Close modal
  closeModalBtn.addEventListener("click", closeModal);
  closeModalBtn.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeModal();
    }
  });

  // Close modal on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
});
    