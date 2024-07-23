document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const productList = document.getElementById('productList');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    if (!currentUser) {
        alert('Please log in to view products.');
        window.location.href = 'login.html';
        return;
    }

    function renderProducts() {
        productList.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 mb-4';
            productCard.innerHTML = `
                <div class="card">
                    <img src="${product.image}" alt="${product.name}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price}</p>
                        <p class="card-text">${categories.find(c => c.id === product.category)?.name || 'Uncategorized'}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                        ${currentUser.isAdmin ? `<button class="btn btn-secondary ml-2" onclick="editProduct(${product.id})">Edit</button>` : ''}
                        ${currentUser.isAdmin ? `<button class="btn btn-danger ml-2" onclick="deleteProduct(${product.id})">Delete</button>` : ''}
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    window.addToCart = function(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart');
    };

    window.editProduct = function(productId) {
        window.location.href = `admin.html?edit=${productId}`;
    };

    window.deleteProduct = function(productId) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
        }
    };

    window.logout = function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    };

    renderProducts();
});