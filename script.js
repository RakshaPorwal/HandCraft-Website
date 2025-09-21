const pages = document.querySelectorAll('.page-section');
const cartCount = document.getElementById('cart-count');
const productListDiv = document.getElementById('product-list');
const featuredProductListDiv = document.getElementById('featured-product-list');
const cartItemsDiv = document.getElementById('cart-items');
const cartSubtotalSpan = document.getElementById('cart-subtotal');
const checkoutTotalSpan = document.getElementById('checkout-total');
const cartSummaryDiv = document.getElementById('cart-summary');
const cartEmptyMessage = document.getElementById('cart-empty-message');

// Simulated Product Data
const products = [{
    id: 1,
    name: "HandMade Woolen KeyChain",
    price: 300,
    image: "image/item1.jpg"
}, {
    id: 2,
    name: "HandMade Cute Clips",
    price: 200,
    image: "image/Item2.jpg"
}, {
    id: 3,
    name: "Macrame Hand Purse",
    price: 650,
    image: "image/item3.jpg"
}, {
    id: 4,
    name: "HandMade Choker Set",
    price: 1000,
    image: "image/item4.jpg"
}, {
    id: 5,
    name: "HandMade Pearl Bracelate",
    price: 300,
    image: "image/item5.jpg"
}, {
    id: 6,
    name: "DIY Dollar Tree Crate",
    price: 800,
    image: "image/item6.jpg"
}, {
    id: 7,
    name: "Handmade Stylish Bag",
    price: 1000,
    image: "image/item7.png"
}, {
    id: 8,
    name: "HandMade Butterfly Earrings",
    price: 300,
    image: "image/item8.jpg"
}, {
    id: 9,
    name: "HandMade Pen Box",
    price: 600,
    image: "image/item9.jpg"
},];

let cart = [];

// --- Page Navigation ---
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);

    if (pageId === 'cart') {
        updateCartUI();
    }
    if (pageId === 'checkout') {
        checkoutTotalSpan.textContent = `₹${calculateCartTotal()}`;
    }
}

// --- Product Rendering ---
function renderProducts() {
    productListDiv.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>₹${product.price}</p>
                        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `).join('');

    // Also render a few featured products for the home page
    const featuredProducts = products.slice(0, 3);
    featuredProductListDiv.innerHTML = featuredProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>₹${product.price}</p>
                        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `).join('');

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

// --- Cart Logic ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    if (totalItems > 0) {
        cartCount.classList.add('visible');
    } else {
        cartCount.classList.remove('visible');
    }
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartUI() {
    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartSummaryDiv.style.display = 'none';
        cartItemsDiv.innerHTML = '';
        return;
    }
    cartEmptyMessage.style.display = 'none';
    cartSummaryDiv.style.display = 'block';

    cartItemsDiv.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-details">
                        <h3>${item.name}</h3>
                        <p class="price">₹${item.price}</p>
                    </div>
                </div>
            `).join('');
    cartSubtotalSpan.textContent = `₹${calculateCartTotal()}`;
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "₹0";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <div class="cart-controls">
          <button onclick="decreaseQty(${index})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})">+</button>
          <button onclick="removeItem(${index})">Remove</button>
        </div>
        <span>₹${item.price * item.quantity}</span>
      </div>
    `;
    });

    cartTotal.textContent = `₹${total}`;
}

// Increase Quantity
function increaseQty(index) {
    cart[index].quantity++;
    updateCart();
}

// Decrease Quantity
function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

// Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Calculate Total
function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// --- CHECKOUT LOGIC ---
const checkoutForm = document.getElementById("checkoutForm");
const paymentMethodSelect = document.getElementById("paymentMethod");
const paymentDetailsDiv = document.getElementById("paymentDetails");
const qrContainer = document.getElementById("qrContainer");

// Change Payment Fields
paymentMethodSelect.addEventListener("change", () => {
    const method = paymentMethodSelect.value;
    paymentDetailsDiv.innerHTML = "";
    qrContainer.style.display = "none";

    if (method === "card") {
        paymentDetailsDiv.innerHTML = `
      <input type="text" placeholder="Card Number" required>
      <input type="text" placeholder="Expiry Date (MM/YY)" required>
      <input type="text" placeholder="CVV" required>
    `;
    } else if (method === "upi") {
        paymentDetailsDiv.innerHTML = `
      <input type="text" id="upiId" placeholder="Enter UPI ID" required>
    `;

        const upiInput = document.getElementById("upiId");

        // Auto generate QR on typing
        upiInput.addEventListener("input", () => {
            if (upiInput.value.trim() !== "") {
                const upi = upiInput.value.trim();

                // Google Chart API for QR
                const qrUrl = "image/QR.jpg";

                document.getElementById("upiQR").src = qrUrl;
                qrContainer.style.display = "block";
            } else {
                qrContainer.style.display = "none";
            }
        });
    }
});


// Place Order
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const orderTotal = calculateCartTotal();

    document.getElementById("checkout").innerHTML = `
    <div class="container" style="text-align:center; padding:3rem;">
      <h2>Thank you for your order!</h2>
      <p>Your total of <strong>₹${orderTotal}</strong> has been successfully processed.</p>
      <p>You will receive a confirmation email shortly.</p>
      <a href="#" class="btn" onclick="showPage('home')">Back to Home</a>
    </div>
  `;

    cart = [];
    updateCart();
});



// --- Formspree Contact Form Logic ---
document.getElementById("contactform").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const responseMsg = document.getElementById("responseMsg");

    try {
        const res = await fetch(form.action, {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json",
            },
        });

        if (res.ok) {
            responseMsg.innerText = "✅ Message sent successfully!";
            form.reset();
        } else {
            responseMsg.innerText = "❌ Failed to send. Please try again.";
        }
    } catch (error) {
        responseMsg.innerText = "⚠️ Network error. Please check connection.";
    }
});

// --- Formspree Feedback Form Logic ---
document.getElementById("FeedbackForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const responseMsg2 = document.getElementById("responseMsg2");

    try {
        const res = await fetch(form.action, {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json",
            },
        });

        if (res.ok) {
            responseMsg2.innerText = "✅ Feedback sent successfully!";
            form.reset();
        } else {
            responseMsg2.innerText = "❌ Failed to send. Please try again.";
        }
    } catch (error) {
        responseMsg2.innerText = "⚠️ Network error. Please check connection.";
    }
});

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});