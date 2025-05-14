const products = [
    {
        id: 1,
        name: 'Grilled Tilapia',
        description: 'Fresh lake tilapia grilled to perfection, served with ugali and traditional greens',
        price: 850,
        image: 'https://public.readdy.ai/ai/img_res/f42659acf3498a1ffb7e9decdce728e3.jpg'
    },
    {
        id: 2,
        name: 'African Blend Coffee',
        description: 'Premium blend of Ethiopian and Kenyan coffee beans, freshly ground',
        price: 280,
        image: 'https://public.readdy.ai/ai/img_res/067603282523b5b24908229c1fe18c0a.jpg'
    },
    {
        id: 3,
        name: 'Tropical Smoothie Bowl',
        description: 'Blend of mango, passion fruit, and banana topped with chia seeds and coconut',
        price: 450,
        image: 'https://public.readdy.ai/ai/img_res/10e3ff8bd54d5f3966fc11bbd5152d30.jpg'
    },
    {
        id: 4,
        name: 'Signature Burger',
        description: 'Hand-crafted beef patty with caramelized onions, avocado, and special sauce',
        price: 650,
        image: 'https://public.readdy.ai/ai/img_res/efbb778d96ca7667d7a8908111e656ab.jpg'
    }
];

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = `${message} added to cart`;
    notification.classList.add('active');
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const totalAmount = document.getElementById('total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            if (cartTotal) cartTotal.style.display = 'none';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            if (cartCount) cartCount.textContent = '0';
            return;
        }

        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})"><i class="fas fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
        if (cartCount) cartCount.textContent = cartItems.length.toString();
        if (cartTotal) cartTotal.style.display = 'flex';
        if (checkoutBtn) checkoutBtn.style.display = 'block';
    }
    saveCart();
}

function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
        cartItems = cartItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    updateCart();
    showNotification(product.name);
}

function updateQuantity(id, quantity) {
    if (quantity <= 0) {
        cartItems = cartItems.filter(item => item.id !== id);
    } else {
        cartItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
    }
    updateCart();
}

function removeFromCart(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    updateCart();
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    const searchQuery = document.getElementById('search-input')?.value.toLowerCase() || '';
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span>$${product.price}</span>
                    <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart and products
    updateCart();
    renderProducts();

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            if (email) {
                document.getElementById('subscribe-modal').classList.add('active');
                document.getElementById('newsletter-email').value = '';
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            if (name && email && message) {
                document.getElementById('contact-modal').classList.add('active');
                contactForm.reset();
            }
        });
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', renderProducts);
    }
});