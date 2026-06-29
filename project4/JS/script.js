
const products = [
    { id: 1,  name: 'Silver Bracelet',    price: 200, category: 'Bracelet', genre: 'women', image: 'image/Bracelets1.jfif',       isFavorite: false, isInCart: false, quantity: 1 },
    { id: 2,  name: 'Golden Bracelet',    price: 150, category: 'Bracelet', genre: 'women', image: 'image/Bracelet2.jfif',        isFavorite: false, isInCart: false, quantity: 1 },
    { id: 3,  name: 'Golden Set Bracelet',price: 500, category: 'Bracelet', genre: 'women', image: 'image/set-of-Bracelets.jfif', isFavorite: false, isInCart: false, quantity: 1 },
    { id: 4,  name: 'Silver Rings',       price: 350, category: 'Rings',    genre: 'women', image: 'image/Rings1.jfif',           isFavorite: false, isInCart: false, quantity: 1 },
    { id: 5,  name: 'Golden Rings',       price: 480, category: 'Rings',    genre: 'women', image: 'image/Rings2.jfif',           isFavorite: false, isInCart: false, quantity: 1 },
    { id: 6,  name: 'Golden Set Rings',   price: 550, category: 'Rings',    genre: 'women', image: 'image/set-Of-Rings.jfif',     isFavorite: false, isInCart: false, quantity: 1 },
    { id: 7,  name: 'Silver Necklace',    price: 300, category: 'Necklace', genre: 'women', image: 'image/Necklaces1.jfif',       isFavorite: false, isInCart: false, quantity: 1 },
    { id: 8,  name: 'Golden Necklace',    price: 400, category: 'Necklace', genre: 'women', image: 'image/Necklaces2.jfif',       isFavorite: false, isInCart: false, quantity: 1 },
    { id: 9,  name: 'Silver set Jewelary',price: 600, category: 'Necklace', genre: 'women', image: 'image/set-Of-Jewelry.jfif',   isFavorite: false, isInCart: false, quantity: 1 },
];


function renderProducts(productList) {
    console.log('Rendering products:', productList);

    const productsRow = document.getElementById('products-row');
    if (!productsRow) return;
    productsRow.innerHTML = '';

    productList.forEach(function(product) {
        const col = document.createElement('div');
        col.className = 'w-full md:w-1/2 xl:w-1/3 p-4 flex'; 

        col.innerHTML =
            '<div class="bg-white rounded-2xl shadow-md overflow-hidden h-full w-full flex flex-col border-2 border-transparent transition-all duration-300 transform hover:border-indigo-600 hover:-translate-y-2 hover:shadow-xl">' +
                '<img src="' + product.image + '" class="w-full h-64 object-cover" alt="' + product.name + '">'+
                '<div class="p-4 flex flex-col flex-1">' +
                    '<h5 class="text-lg font-semibold text-gray-800 mb-1">' + product.name + '</h5>' +
                    '<p class="text-sm text-gray-500 mb-1">Price: <span class="font-bold text-gray-700">$' + product.price + '</span></p>' +
                    '<p class="text-sm text-gray-500 mb-4">Category: ' + product.category + '</p>' +
                    '<div class="flex items-center justify-between mt-auto">' +
                        '<i class="fas fa-heart text-2xl cursor-pointer transition-colors duration-200 ' +
                            (product.isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-500') +
                        '" onclick="toggleFavorite(' + product.id + ')"></i>' +
                        '<button class="px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ' +
                            (product.isInCart
                                ? 'bg-red-100 text-red-600 border border-red-400 hover:bg-red-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700') +
                        '" onclick="toggleCart(' + product.id + ')">' +
                            (product.isInCart ? 'Remove from Cart' : 'Add to Cart') +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        productsRow.appendChild(col);
    });
}

function searchProducts() {
    const searchType = document.getElementById('searchType').value;
    const searchText = document.getElementById('searchBox').value.toLowerCase();

    const filteredProducts = products.filter(function(product) {
        if (searchType === 'name') {
            return product.name.toLowerCase().includes(searchText);
        } else if (searchType === 'category') {
            return product.category.toLowerCase().includes(searchText);
        }
        return false;
    });

    renderProducts(filteredProducts);
}


function redirectTo(url) {
    window.location.href = url;
}


let loggedIn = false;

function register() {
    const firstName = document.getElementById('firstName').value;
    const lastName  = document.getElementById('lastName').value;
    const email     = document.getElementById('email').value;
    const password  = document.getElementById('password').value;

    if (!firstName || !lastName || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[email] = { password: password, firstName: firstName, lastName: lastName };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully!');
    window.location.href = 'login.html';
}

function login() {
    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users    = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email] && users[email].password === password) {
        localStorage.setItem('loggedInUser', JSON.stringify(users[email]));
        loggedIn = true;
        localStorage.setItem('loggedIn', loggedIn);
        window.location.href = 'loggedin.html';
    } else {
        alert('Invalid email or password.');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedIn');
    loggedIn = false;
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    window.location.href = 'index.html';
}


function toggleCart(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    console.log('Toggle Cart Clicked. Logged in:', isLoggedIn);

    if (!isLoggedIn) {
        console.log('Redirecting to login.html');
        redirectTo('login.html');
        return;
    }

    const product = products.find(function(p) { return p.id === productId; });
    const cart    = JSON.parse(localStorage.getItem('cart')) || [];

    if (product.isInCart) {
        product.isInCart = false;
        product.quantity = 0;
        const index = cart.findIndex(function(p) { return p.id === productId; });
        if (index > -1) cart.splice(index, 1);
    } else {
        product.isInCart = true;
        product.quantity = 1;
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: product.quantity, category: product.category });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    saveCartAndFavorites();
    updateCartDropdown();
    updateCartCount();
    renderProducts(products);
    if (window.location.href.includes('cart.html')) renderCartItems();
}

function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdownItems').parentElement;
    if (cartDropdown) {
        cartDropdown.classList.toggle('hidden');
        cartDropdown.classList.toggle('block');
    }
}

function updateCartCount() {
    const cart      = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce(function(total, item) { return total + item.quantity; }, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.textContent = cartCount;
}

function updateCartDropdown() {
    const cartItems         = JSON.parse(localStorage.getItem('cart')) || [];
    const cartDropdownItems = document.getElementById('cartDropdownItems');
    if (!cartDropdownItems) return;
    cartDropdownItems.innerHTML = '';

    if (cartItems.length === 0) {
        cartDropdownItems.innerHTML = '<p class="text-center text-gray-400 py-3 text-sm">Your cart is empty.</p>';
    } else {
        cartItems.forEach(function(item) {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2 mb-2 bg-gray-50 rounded-xl';
            div.innerHTML =
                '<div>' +
                    '<h6 class="text-sm font-semibold text-gray-800">' + item.name + '</h6>' +
                    '<p class="text-xs text-gray-500">Price: $<span id="itemPrice' + item.id + '">' + (item.price * item.quantity) + '</span></p>' +
                '</div>' +
                '<div class="flex items-center gap-2">' +
                    '<button class="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm" onclick="decreaseQuantity(' + item.id + ')">-</button>' +
                    '<span id="itemQuantity' + item.id + '" class="text-sm font-medium w-5 text-center">' + item.quantity + '</span>' +
                    '<button class="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm" onclick="increaseQuantity(' + item.id + ')">+</button>' +
                '</div>';
            cartDropdownItems.appendChild(div);
        });
    }

    updateCartCount();
}

function increaseQuantity(productId) {
    const product = products.find(function(p) { return p.id === productId; });
    const cart    = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItem = cart.find(function(p) { return p.id === productId; });
    if (cartItem) {
        cartItem.quantity++;
        if (product) product.quantity = cartItem.quantity;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDropdown();
    if (window.location.href.includes('cart.html')) renderCartItems();
    updateTotalPrice();
}

function decreaseQuantity(productId) {
    const cart    = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(function(p) { return p.id === productId; });
    const cartItem = cart.find(function(p) { return p.id === productId; });

    if (cartItem) {
        cartItem.quantity--;

        if (cartItem.quantity <= 0) {
            if (product) {
                product.isInCart = false;
                product.quantity = 0;
            }
            const index = cart.findIndex(function(p) { return p.id === productId; });
            if (index > -1) cart.splice(index, 1);
        } else {
            if (product) product.quantity = cartItem.quantity;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDropdown();
        renderProducts(products);
        if (window.location.href.includes('cart.html')) renderCartItems();
        updateTotalPrice();
    }
}


function saveCartAndFavorites() {
    const cart      = products.filter(function(p) { return p.isInCart; });
    const favorites = products.filter(function(p) { return p.isFavorite; });
    localStorage.setItem('cart',      JSON.stringify(cart));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadCartAndFavorites() {
    const cart      = JSON.parse(localStorage.getItem('cart'))      || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    products.forEach(function(product) {
        const cartProduct     = cart.find(function(p)      { return p.id === product.id; });
        const favoriteProduct = favorites.find(function(p) { return p.id === product.id; });

        if (cartProduct) {
            product.isInCart = true;
            product.quantity = cartProduct.quantity;
        } else {
            product.isInCart = false;
            product.quantity = 0;
        }

        product.isFavorite = !!favoriteProduct;
    });
}


function toggleFavorite(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));

    if (!isLoggedIn) {
        redirectTo('login.html');
        return;
    }

    const product = products.find(function(p) { return p.id === productId; });

    if (product.isFavorite) {
        removeFavorite(productId);
    } else {
        product.isFavorite = true;
        saveCartAndFavorites();
    }

    renderProducts(products);
    if (window.location.href.includes('cart.html')) renderFavoriteItems();
}

function removeFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const product   = products.find(function(p) { return p.id === productId; });

    if (product) product.isFavorite = false;
    
    const index = favorites.findIndex(function(p) { return p.id === productId; });
    if (index > -1) favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    renderProducts(products);
    if (window.location.href.includes('cart.html')) renderFavoriteItems();
}


function renderCartItems() {
    const cartItems          = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-gray-400 py-6">Your cart is empty.</p>';
        updateTotalPrice();
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-wrap -mx-3 w-full';

    cartItems.forEach(function(item) {
        const col = document.createElement('div');
        '<img src="' + item.image + '" class="w-36 h-36 object-cover flex-shrink-0" alt="' + item.name + '">';
        col.innerHTML =
            '<div class="flex flex-row items-center bg-white rounded-2xl shadow-md overflow-hidden" data-product-id="' + item.id + '">'+
                '<img src="' + item.image + '" class="w-28 h-28 object-cover flex-shrink-0" alt="' + item.name + '">' +
                '<div class="p-4 flex-1">' +
                    '<h5 class="text-base font-semibold text-gray-800 mb-1">' + item.name + '</h5>' +
                    '<p class="text-sm text-gray-500 mb-1">Category: ' + item.category + '</p>' +
                    '<p class="text-sm text-gray-500 mb-3">Price: $' + (item.price * item.quantity) + '</p>' +
                    '<div class="flex items-center gap-2 flex-wrap">' +
                        '<button class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold" onclick="decreaseQuantity(' + item.id + ')">-</button>' +
                        '<span class="w-6 text-center text-sm font-medium">' + item.quantity + '</span>' +
                        '<button class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold" onclick="increaseQuantity(' + item.id + ')">+</button>' +
                        '<button class="ml-4 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition-colors" onclick="removeFromCart(' + item.id + ')">Remove</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        wrapper.appendChild(col);
    });

    cartItemsContainer.appendChild(wrapper);
    updateTotalPrice();
}


function renderFavoriteItems() {
    const favorites              = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteItemsContainer = document.getElementById('favorite-items');
    if (!favoriteItemsContainer) return;
    favoriteItemsContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoriteItemsContainer.innerHTML = '<p class="text-center text-gray-400 py-6">You have no favorite items.</p>';
        return;
    }

    favorites.forEach(function(item) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-md overflow-hidden p-3';
        card.setAttribute('data-product-id', item.id);

        card.innerHTML =
            '<img src="' + item.image + '" class="w-full h-44 object-cover rounded-xl mb-3" alt="' + item.name + '">' +
            '<div class="flex flex-col">' +
                '<h5 class="text-base font-semibold text-gray-800 mb-1">' + item.name + '</h5>' +
                '<p class="text-sm text-gray-500 mb-3">Category: ' + item.category + '</p>' +
                '<div class="flex justify-between items-center">' +
                    '<i class="fas fa-heart text-2xl cursor-pointer text-red-500" onclick="toggleFavorite(' + item.id + ')"></i>' +
                '</div>' +
            '</div>';

        favoriteItemsContainer.appendChild(card);
    });
}


function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce(function(total, item) { return total + (item.price * item.quantity); }, 0);
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) totalPriceEl.textContent = totalPrice.toFixed(2);
}


function removeFromCart(productId) {
    const product = products.find(function(p) { return p.id === productId; });
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (product) {
        product.isInCart = false;
        product.quantity = 0;
    }

    const index = cart.findIndex(function(p) { return p.id === productId; });
    if (index > -1) cart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderProducts(products);
    updateCartDropdown();
    if (window.location.href.includes('cart.html')) renderCartItems();
    updateTotalPrice();
}


document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn   = JSON.parse(localStorage.getItem('loggedIn'));

    const usernameDisplay = document.getElementById('usernameDisplay');
    if (loggedInUser && isLoggedIn) {
        loggedIn = true;
        if (usernameDisplay) usernameDisplay.textContent = 'Hello, ' + loggedInUser.firstName;
    } else {
        loggedIn = false;
    }

    console.log('DOM fully loaded and parsed');
    loadCartAndFavorites();
    renderProducts(products);
    updateCartDropdown();
    updateCartCount();

    if (window.location.href.includes('cart.html')) {
        renderCartItems();
        renderFavoriteItems();
    }

    const cartIcon = document.querySelector('.fas.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCartDropdown);
    }
});