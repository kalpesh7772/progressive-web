// DOM Elements
const productGrid = document.getElementById('productGrid');
const installButton = document.getElementById('installButton');
const notifyButton = document.getElementById('notifyButton');
const notificationBadge = document.getElementById('notificationBadge');
const notificationToast = document.getElementById('notificationToast');
const connectionStatus = document.getElementById('connectionStatus');
const cartCount = document.getElementById('cartCount');

// Sample product data
const products = [
    {
        id: 1,
        title: "Wireless Headphones",
        price: 99.99,
        description: "High-quality wireless headphones with noise cancellation",
        image: "https://via.placeholder.com/300x200?text=Headphones"
    },
    {
        id: 2,
        title: "Smart Watch",
        price: 199.99,
        description: "Feature-rich smartwatch with health monitoring",
        image: "https://via.placeholder.com/300x200?text=Smart+Watch"
    },
    {
        id: 3,
        title: "Bluetooth Speaker",
        price: 79.99,
        description: "Portable speaker with 20-hour battery life",
        image: "https://via.placeholder.com/300x200?text=Speaker"
    },
    {
        id: 4,
        title: "Laptop Backpack",
        price: 49.99,
        description: "Durable backpack with USB charging port",
        image: "https://via.placeholder.com/300x200?text=Backpack"
    }
];

// Cart functionality
let cart = [];

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification(`${product.title} added to cart!`);
    }
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Show notification
function showNotification(message) {
    const toastContent = notificationToast.querySelector('.toast-content');
    toastContent.textContent = message;
    notificationToast.classList.add('show');
    
    setTimeout(() => {
        notificationToast.classList.remove('show');
    }, 3000);
}

// Check connection status
function updateConnectionStatus() {
    if (navigator.onLine) {
        connectionStatus.textContent = 'Online';
        connectionStatus.style.color = 'green';
    } else {
        connectionStatus.textContent = 'Offline';
        connectionStatus.style.color = 'red';
        showNotification('You are currently offline. Some features may be limited.');
    }
}

// Event Listeners
window.addEventListener('load', () => {
    displayProducts();
    updateConnectionStatus();
    
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
    
    // Check for PWA installation
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installButton.classList.remove('hidden');
        
        installButton.addEventListener('click', () => {
            e.prompt();
            e.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    installButton.classList.add('hidden');
                } else {
                    console.log('User dismissed the install prompt');
                }
            });
        });
    });
});

// Network status
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// Notification button
notifyButton.addEventListener('click', () => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('ShopPWA Notification', {
            body: 'Thank you for using our PWA! Check out our latest products.',
            icon: 'icon-192x192.png'
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('ShopPWA Notification', {
                    body: 'Thank you for enabling notifications!',
                    icon: 'icon-192x192.png'
                });
            }
        });
    }
});

// Initialize notification badge
if ('Notification' in window && Notification.permission === 'granted') {
    notificationBadge.textContent = '1';
    notificationBadge.classList.remove('hidden');
}