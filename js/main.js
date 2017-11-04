var products = {
    'Box1': {
        'product': new Product('Box1', 10, 'images/products/Box1_$10.png'),
        'quantity': 5
    },
    'Box2': {
        'product': new Product('Box2', 5, 'images/products/Box1_$5.png'),
        'quantity': 5
    },
    'Clothes1': {
        'product': new Product('Clothes1', 20, 'images/products/Clothes1_$20.png'),
        'quantity': 5
    },
    'Clothes2': {
        'product': new Product('Clothes2', 30, 'images/products/Clothes2_$30.png'),
        'quantity': 5
    },
    'Jeans': {
        'product': new Product('Jeans', 50, 'images/products/Jeans_$50.png'),
        'quantity': 5
    },
    'Keyboard': {
        'product': new Product('Keyboard', 20, 'images/products/Keyboard_$20.png'),
        'quantity': 5
    },
    'KeyboardCombo': {
        'product': new Product('KeyboardCombo', 40, 'images/products/KeyboardCombo_$40.png'),
        'quantity': 5
    },
    'Mice': {
        'product': new Product('Mice', 20, 'images/products/Mice_$20.png'),
        'quantity': 5
    },
    'PC1': {
        'product': new Product('PC1', 350, 'images/products/PC1_$350.png'),
        'quantity': 5
    },
    'PC2': {
        'product': new Product('PC2',400, 'images/products/PC2_$400.png'),
        'quantity': 5
    },
    'PC3': {
        'product': new Product('PC3', 300, 'images/products/PC3_$300.png'),
        'quantity': 5
    },
    'Tent': {
        'product': new Product('Tent', 100, 'images/products/Tent_$100.png'),
        'quantity': 5
    }
};
var newProducts = {};
var cart = {};
var totalPrice = 0;
var inactiveTime = 0;  // users inactive time in seconds
var alertTime = 300000; // inactive time limit for alert
var alertUserTimerId;
var trackInactiveTimeId;

// Adds a given product into the cart and decrease its supply value by 1
function addToCart(productName) {
    // reset alert timer and inactive time
    restartTimers();

    if (products[productName].quantity !== 0) {
        if (cart[productName]) {
            cart[productName]++;
        } else {
            cart[productName] = 1;
        }
        products[productName].quantity--;
        totalPrice = totalPrice + products[productName].product.price;
        updateCartButton();
    } else {
        window.alert(productName + " is sold out");
    }
    updateAddRemoveButtons(productName);
}

// Remove the given product from cart and increase its supply value by 1
// if the item does not exist in cart, alert user
function removeFromCart(productName) {
    // reset alert timer and inactive time
    restartTimers();

    if (cart[productName]) {
        cart[productName]--;
        if (cart[productName] === 0) {
            delete cart[productName];
        }
        products[productName].quantity++;
        totalPrice = totalPrice - products[productName].product.price;
        updateCartButton();
    } else {
        window.alert("Product " + productName + " does not exist in the cart")
    }
    updateAddRemoveButtons(productName);
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
    if (Object.keys(cart).length === 0 || cart[productName] === undefined) {
        document.getElementById('removeButton' + productName).style.visibility="hidden";
    } else {
        document.getElementById('removeButton' + productName).style.visibility="visible";
    }

    if (products[productName].quantity === 0) {
        document.getElementById('addButton' + productName).style.visibility="hidden";
        document.getElementById('outOfStockMsg' + productName).style.visibility="visible";
    } else {
        document.getElementById('addButton' + productName).style.visibility="visible";
        document.getElementById('outOfStockMsg' + productName).style.visibility="hidden";
    }
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
                addToCart(name);
                showCart();
            });
            return btn;
        }();

        var removeButton = function() {
            var btn = document.createElement("button");
            btn.appendChild(document.createTextNode("-"));

            var name = propName;
            btn.addEventListener("click", function() {
                removeFromCart(name);
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

function alertUser() {
    window.alert("Hey there! Are you still planning to buy something?");
    restartTimers();
}

function trackInactiveTime() {
    inactiveTime++;

    // update inactive time display in footer
    var node = document.getElementById('inactiveTime');
    var newNode = document.createElement('p');
    newNode.setAttribute('id', 'liveInactiveTime');
    newNode.appendChild(document.createTextNode('Inactive time: ' + inactiveTime));
    if (document.getElementById('liveInactiveTime')) {
        node.removeChild(document.getElementById('liveInactiveTime'));
    }
    node.appendChild(newNode);
}

function startTimers() {
    alertUserTimerId = setInterval(alertUser, alertTime);
    trackInactiveTimeId = setInterval(trackInactiveTime, 1000);
}

function restartTimers() {
    clearInterval(alertUserTimerId);
    alertUserTimerId = setInterval(alertUser, alertTime);
    inactiveTime = 0;
}

function closeModal() {
    document.getElementById('cartModal').style.display= "none";
    document.getElementById("mainContent").style.opacity = "1";
}

function onSuccessCallBack(response) {
    newProducts = JSON.parse(response);
}

function onErrorCallBack(response) {
    window.alert("error: " + response + " retrieving products");
}

function checkProducts() {
    var oldProducts = products;
    ajaxGet("https://cpen400a-bookstore.herokuapp.com/products", onSuccessCallBack, onErrorCallBack);

    // TODO: put this in a callback
    // Check quantity
    var alertString = 'Updated Quantities: \n';
    for (var key in cart) {
        var orderedAmount = cart[key];
        var availableUpdatedAmount = products[key].quantity;
        if (orderedAmount > availableUpdatedAmount) {
            cart[key] = availableUpdatedAmount;
        }
        alertString +=  key + ' Quantity:' + availableUpdatedAmount +'\n';
    }
    window.alert(alertString);
}

function addEventListeners() {
    var checkoutButtonElement = document.getElementById('checkoutButton');
    checkoutButtonElement.addEventListener('click', function() {
        checkProducts();
    })
}

window.onload = function() {
    addEventListeners();
    startTimers();
    ajaxGet("https://cpen400a-bookstore.herokuapp.com/products", onSuccessCallBack, onErrorCallBack);
};
