document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accessErrorMessage = document.getElementById('accessErrorMessage');

    // if (!currentUser || !currentUser.isAdmin) {
    //     accessErrorMessage.textContent = 'Access denied. Only admins can access this page.';
    //     accessErrorMessage.style.display = 'block';
    //     document.getElementById('adminContent').style.display = 'none';
    //     return;
    // }

    const addProductForm = document.getElementById('addProductForm');
    const addCategoryForm = document.getElementById('addCategoryForm');
    const productList = document.getElementById('productList');
    const categoryList = document.getElementById('categoryList');
    const productCategorySelect = document.getElementById('productCategory');
    const productErrorMessage = document.getElementById('productErrorMessage');
    const categoryErrorMessage = document.getElementById('categoryErrorMessage');
    const productIdInput = document.getElementById('productId');

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let categories = JSON.parse(localStorage.getItem('categories')) || [];

    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function renderCategories() {
        categoryList.innerHTML = '';
        productCategorySelect.innerHTML = '';
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            categoryItem.innerHTML = `
                <span>${category.name}</span>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Delete</button>
            `;
            categoryList.appendChild(categoryItem);
            
            const categoryOption = document.createElement('option');
            categoryOption.value = category.id;
            categoryOption.textContent = category.name;
            productCategorySelect.appendChild(categoryOption);
        });
    }

    function renderProducts() {
        productList.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            productItem.innerHTML = `
                <span>${product.name} - $${product.price} (${categories.find(c => c.id === product.category)?.name || 'Uncategorized'})</span>
                <div>
                    <img src="${product.image}" alt="${product.name}" class="img-thumbnail mr-2" style="width: 50px; height: 50px; object-fit: cover;">
                    <button class="btn btn-secondary btn-sm mr-2" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            `;
            productList.appendChild(productItem);
        });
    }

    function loadProductToForm(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            productIdInput.value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
        }
    }

    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = productIdInput.value;
        const name = document.getElementById('productName').value.trim();
        const price = document.getElementById('productPrice').value.trim();
        const category = document.getElementById('productCategory').value;
        const imageInput = document.getElementById('productImage').files[0];
        productErrorMessage.textContent = '';

        if (!name || !price || !category || (!id && !imageInput)) {
            productErrorMessage.textContent = 'All fields are required.';
            return;
        }

        const handleProductSave = (image = null) => {
            const product = { id: id || Date.now(), name, price: parseFloat(price), category: parseInt(category), image: image || products.find(p => p.id == id).image };
            if (id) {
                products = products.map(p => p.id == id ? product : p);
            } else {
                products.push(product);
            }
            saveToLocalStorage('products', products);
            renderProducts();
            addProductForm.reset();
        };

        if (imageInput) {
            const reader = new FileReader();
            reader.onload = function(e) {
                handleProductSave(e.target.result);
            };
            reader.readAsDataURL(imageInput);
        } else {
            handleProductSave();
        }
    });

    addCategoryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('categoryName').value.trim();
        categoryErrorMessage.textContent = '';

        if (!name) {
            categoryErrorMessage.textContent = 'Category name is required.';
            return;
        }

        const category = { id: Date.now(), name };
        categories.push(category);
        saveToLocalStorage('categories', categories);
        renderCategories();
        addCategoryForm.reset();
    });

    window.editProduct = function(id) {
        loadProductToForm(id);
    };

    window.deleteProduct = function(id) {
        products = products.filter(p => p.id != id);
        saveToLocalStorage('products', products);
        renderProducts();
    };

    window.deleteCategory = function(id) {
        categories = categories.filter(c => c.id != id);
        saveToLocalStorage('categories', categories);
        renderCategories();
    };

    window.logout = function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    };

    renderCategories();
    renderProducts();
    
    const urlParams = new URLSearchParams(window.location.search);
    const editProductId = urlParams.get('edit');
    if (editProductId) {
        loadProductToForm(editProductId);
    }
});