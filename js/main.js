/**
 * TechForge - Premium PC Parts Store
 * Main JavaScript File
 * Handles navigation, cart, filtering, and UI interactions
 */

// ============================================
// PRODUCT DATA
// ============================================
const products = [
    {
        id: 1,
        name: 'NVIDIA GeForce RTX 4090 Founders Edition',
        category: 'gpu',
        price: 1599,
        image: 'assets/images/rtx-4090.png',
        specs: ['24GB GDDR6X', '2520 MHz', '450W']
    },
    {
        id: 2,
        name: 'AMD Ryzen 9 7950X 16-Core',
        category: 'cpu',
        price: 549,
        image: 'assets/images/ryzen-9.png',
        specs: ['16 Cores', '5.7 GHz', 'AM5']
    },
    {
        id: 3,
        name: 'G.Skill Trident Z5 RGB DDR5-6400',
        category: 'ram',
        price: 189,
        originalPrice: 219,
        image: 'assets/images/ddr5-ram.png',
        specs: ['32GB (2x16GB)', '6400 MHz', 'CL32']
    },
    {
        id: 4,
        name: 'Samsung 990 Pro 2TB NVMe SSD',
        category: 'storage',
        price: 179,
        image: 'assets/images/samsung-ssd.png',
        specs: ['2TB', '7450 MB/s', 'PCIe 4.0']
    },
    {
        id: 5,
        name: 'ASUS ROG Maximus Z790 Hero',
        category: 'motherboard',
        price: 629,
        image: 'assets/images/asus-mobo.png',
        specs: ['Z790', 'DDR5', 'WiFi 6E']
    },
    {
        id: 6,
        name: 'Corsair RM1000x 80+ Gold',
        category: 'psu',
        price: 189,
        image: 'assets/images/corsair-psu.png',
        specs: ['1000W', '80+ Gold', 'Modular']
    },
    {
        id: 7,
        name: 'NVIDIA GeForce RTX 4080 Super',
        category: 'gpu',
        price: 999,
        image: 'assets/images/rtx-4080.png',
        specs: ['16GB GDDR6X', '2550 MHz', '320W']
    },
    {
        id: 8,
        name: 'AMD Radeon RX 7900 XTX',
        category: 'gpu',
        price: 899,
        originalPrice: 999,
        image: 'assets/images/rx-7900.png',
        specs: ['24GB GDDR6', '2500 MHz', '355W']
    },
    {
        id: 9,
        name: 'Intel Core i9-14900K',
        category: 'cpu',
        price: 589,
        image: 'assets/images/i9-14900k.png',
        specs: ['24 Cores', '6.0 GHz', 'LGA1700']
    },
    {
        id: 10,
        name: 'Corsair Dominator Platinum RGB DDR5',
        category: 'ram',
        price: 349,
        image: 'assets/images/corsair-ram.png',
        specs: ['64GB (2x32GB)', '6000 MHz', 'CL30']
    },
    {
        id: 11,
        name: 'WD Black SN850X 4TB NVMe',
        category: 'storage',
        price: 349,
        image: 'assets/images/wd-ssd.png',
        specs: ['4TB', '7300 MB/s', 'PCIe 4.0']
    },
    {
        id: 12,
        name: 'MSI MEG X670E ACE',
        category: 'motherboard',
        price: 699,
        image: 'assets/images/msi-mobo.png',
        specs: ['X670E', 'DDR5', 'WiFi 6E']
    }
];

// ============================================
// CART STATE
// ============================================
let cart = JSON.parse(localStorage.getItem('techforge_cart')) || [];

// ============================================
// DOM ELEMENTS
// ============================================
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbar-toggle');
const navbarMenu = document.getElementById('navbar-menu');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const toastContainer = document.getElementById('toast-container');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCart();
    initFilters();
    updateCartUI();
});

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================
function initNavbar() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navbarToggle) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
        });
    });
}

// ============================================
// CART FUNCTIONALITY
// ============================================
function initCart() {
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('techforge_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toLocaleString()}</p>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                            <button onclick="updateQuantity(${item.id}, -1)" style="background: var(--bg-tertiary); color: var(--text-primary); border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" style="background: var(--bg-tertiary); color: var(--text-primary); border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">+</button>
                            <button onclick="removeFromCart(${item.id})" style="margin-left: auto; background: none; border: none; color: var(--color-error); cursor: pointer; font-size: 1.25rem;">✕</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update cart total
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toLocaleString()}`;
    }
}

// ============================================
// PRODUCT FILTERING (Products Page)
// ============================================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('products-grid');
    const productCount = document.getElementById('product-count');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter products
                const filter = btn.dataset.filter;
                const productCards = document.querySelectorAll('.product-card');
                let visibleCount = 0;

                productCards.forEach(card => {
                    const category = card.dataset.category;
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Update count
                if (productCount) {
                    productCount.textContent = visibleCount;
                }
            });
        });

        // Check URL for category filter
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            const targetBtn = document.querySelector(`[data-filter="${category}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        }
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '!'}</span>
        <span class="toast-message">${message}</span>
    `;

    if (toastContainer) {
        toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// ANIMATION ON SCROLL
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards and category cards
document.querySelectorAll('.product-card, .category-card, .value-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Add CSS for observed elements
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .product-card, .category-card, .value-card {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .animate-fade-in-up {
        opacity: 1 !important;
        animation: fadeInUp 0.5s ease forwards;
    }
`;
document.head.appendChild(style);

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    // Close cart with Escape key
    if (e.key === 'Escape') {
        closeCart();
        navbarMenu.classList.remove('active');
    }
});

console.log('🚀 TechForge Store initialized successfully!');
