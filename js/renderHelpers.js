// creates a div for a given product with name key
function createProduct(key) {
    // product div
    var product = document.createElement('div');
    product.className = 'product';

    // productName div
    var productName = document.createElement('div');
    productName.className = 'productName';
    var imageLabel = document.createElement('span');
    imageLabel.className = 'imageLabel';
    var imageTextNode = document.createTextNode(key);
    imageLabel.appendChild(imageTextNode);
    productName.appendChild(imageLabel);

    // productImage div
    var productImage = document.createElement('div');
    productImage.className = 'productImage';

    var img = document.createElement('img');
    img.src = products[key].imageUrl;
    img.alt = key;

    // Overlay div
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    var text = document.createElement('div');
    text.className = 'text';
    var textNode = document.createTextNode('$' + products[key].price);
    text.appendChild(textNode);
    overlay.appendChild(text);

    // OverlayCart div
    var overlayCart = document.createElement('div');
    overlayCart.className = 'overlayCart ' + key;
    overlayCart.addEventListener('mouseover', updateAddRemoveButtons(key));
    var cartImg = document.createElement('img');
    cartImg.src = 'images/cart.png';
    var message = document.createElement('message');
    message.className = 'message';
    message.id = 'outOfStockMsg' + key;
    var p = document.createElement('p');
    var pText = document.createTextNode('This item is out of stock');
    p.appendChild(pText);
    message.appendChild(p);

    // Button div
    var buttons = document.createElement('div');
    buttons.className = 'button';

    var addButton = document.createElement('button');
    addButton.className = 'addButton';
    addButton.id = 'addButton'+ key;
    addButton.addEventListener('click', addToCart(key));
    var addButtonText = document.createElement('div');
    addButtonText.className = 'text';
    var addButtonTextNode = document.createTextNode('Add');
    addButtonText.appendChild(addButtonTextNode);
    addButton.appendChild(addButtonText);

    var removeButton = document.createElement('button');
    removeButton.className = 'removeButton';
    removeButton.id = 'removeButton' + key;
    removeButton.addEventListener('click', removeFromCart(key));
    var removeButtonText = document.createElement('div');
    removeButtonText.className = 'text';
    var removeButtonTextNode = document.createTextNode('Remove');
    removeButtonText.appendChild(removeButtonTextNode);
    removeButton.appendChild(removeButtonText);

    buttons.appendChild(addButton);
    buttons.appendChild(removeButton);
    overlayCart.appendChild(cartImg);
    overlayCart.appendChild(message);
    overlayCart.appendChild(buttons);
    productImage.appendChild(img);
    productImage.appendChild(overlay);
    productImage.appendChild(overlayCart);
    product.appendChild(productImage);
    product.appendChild(productName);

    return product;
}

function renderProducts() {
    var productsListFragment = document.createDocumentFragment();
    for (var key in products) {
        productsListFragment.appendChild(createProduct(key));
    }

    var productList = document.getElementById('productList');
    productList.appendChild(productsListFragment);
}

// creates a table with products in cart
function createTable() {
    var node = document.getElementById('cartContent');
    var node2 = document.getElementById('cartInfo');
    if (document.getElementById('tableContent')) {
        node.removeChild(document.getElementById('tableContent'));
    }
    var tbl = document.createElement('table');
    tbl.style.width='100%';
    tbl.setAttribute('border', 1);
    tbl.setAttribute('id', 'tableContent');
    var tbdy = document.createElement('tbody');

    var header = tbl.insertRow();
    var nameLabel = header.insertCell();
    var quantityLabel = header.insertCell();
    var addOrRemoveLabel = header.insertCell();
    nameLabel.appendChild(document.createTextNode('Product Name'));
    quantityLabel.appendChild(document.createTextNode('Product Quantity'));
    addOrRemoveLabel.appendChild(document.createTextNode('Add/Remove'));

    for (var propName in cart) {
        var tr = tbl.insertRow();
        var td = tr.insertCell();
        var td2 = tr.insertCell();
        var td3 = tr.insertCell();
        td.appendChild(document.createTextNode(propName));
        td2.appendChild(document.createTextNode(cart[propName]));

        var addButton = function() {
            var btn = document.createElement("button");
            btn.appendChild(document.createTextNode("+"));

            var name = propName;
            btn.addEventListener("click", function() {
                addToCart(name)();
                showCart();
            });
            return btn;
        }();

        var removeButton = function() {
            var btn = document.createElement("button");
            btn.appendChild(document.createTextNode("-"));

            var name = propName;
            btn.addEventListener("click", function() {
                removeFromCart(name)();
                showCart();
            });
            return btn;
        }();

        td3.appendChild(addButton);
        td3.appendChild(removeButton);
    }
    node.appendChild(tbl);
    updateTotal();
}

// updates the total amount in pop up window
function updateTotal() {
    if (document.getElementById('totalPrice')) {
        document.getElementById('cartInfo').removeChild(document.getElementById('totalPrice'));
    }
    var total = document.createElement('p');
    total.setAttribute('id', 'totalPrice');
    total.appendChild(document.createTextNode('Total: $' + totalPrice));
    document.getElementById('cartInfo').appendChild(total);
}

// show user the current items in the cart
function showCart() {
    restartTimers();
    document.getElementById('cartModal').style.display= "block";

    var node = document.getElementById('cartContent');
    var newNode = document.getElementById('cartInfo');

    if (Object.keys(cart).length === 0) {
        if (document.getElementById('tableContent')) {
            node.removeChild(document.getElementById('tableContent'));
        }
        if (document.getElementById('totalPrice')) {
            document.getElementById('cartInfo').removeChild(document.getElementById('totalPrice'));
        }
        document.getElementById('emptyMsg').style.visibility="visible";
        document.getElementById('checkoutButton').style.visibility="hidden";
    } else {
        // create table of product names and quantity
        createTable();
        document.getElementById('emptyMsg').style.visibility="hidden";
        document.getElementById('checkoutButton').style.visibility="visible";
    }
    node.appendChild(newNode);
}

// Adds a given product into the cart and decrease its supply value by 1
function addToCart(productName) {
    // reset alert timer and inactive time
    return function() {
        restartTimers();

        if (products[productName].quantity !== 0) {
            if (cart[productName]) {
                cart[productName]++;
            } else {
                cart[productName] = 1;
            }
            // products[productName].quantity--;
            totalPrice = totalPrice + products[productName].price;
            updateCartButton();
        } else {
            window.alert(productName + " is sold out");
        }
        updateAddRemoveButtons(productName)();
    }
}

// Remove the given product from cart and increase its supply value by 1
// if the item does not exist in cart, alert user
function removeFromCart(productName) {
    return function() {
        // reset alert timer and inactive time
        restartTimers();

        if (cart[productName]) {
            cart[productName]--;
            if (cart[productName] === 0) {
                delete cart[productName];
            }
            // products[productName].quantity++;
            totalPrice = totalPrice - products[productName].price;
            updateCartButton();
        } else {
            window.alert("Product " + productName + " does not exist in the cart")
        }
        updateAddRemoveButtons(productName)();
    }
}

function updateCartButton() {
    var buttonNode = document.getElementById('cartButton');
    var newNode = document.createElement('p');
    newNode.setAttribute('id', 'cartTotal');
    newNode.appendChild(document.createTextNode('Cart ($' + totalPrice + ')'));
    if (document.getElementById('cartTotal')) {
        buttonNode.removeChild(document.getElementById('cartTotal'));
    }
    buttonNode.appendChild(newNode);
}

// conditionally hide or show add/remove buttons
function updateAddRemoveButtons(productName) {
    return function() {
        if (Object.keys(cart).length === 0 || cart[productName] === undefined) {
            document.getElementById('removeButton' + productName).style.visibility = "hidden";
        } else {
            document.getElementById('removeButton' + productName).style.visibility = "visible";
        }

        if (products[productName].quantity === 0) {
            document.getElementById('addButton' + productName).style.visibility = "hidden";
            document.getElementById('outOfStockMsg' + productName).style.visibility = "visible";
        } else {
            document.getElementById('addButton' + productName).style.visibility = "visible";
            document.getElementById('outOfStockMsg' + productName).style.visibility = "hidden";
        }
    }
}

function closeModal() {
    document.getElementById('cartModal').style.display= "none";
    document.getElementById("mainContent").style.opacity = "1";
}
