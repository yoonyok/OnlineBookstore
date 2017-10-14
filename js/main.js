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
var cart = {};
var totalPrice = 0;
var inactiveTime = 0;  // users inactive time in seconds
var alertTime = 300000;
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

// show user the current items in the cart
function showCart() {
    restartTimers();
    document.getElementById('cartModal').style.display= "block";

    var node = document.getElementById('cartContent');
    var newNode = document.createElement('p');
    newNode.setAttribute('id', 'cartInfo');

    var currentCart = '';
    for (var propName in cart) {
        var propValue = cart[propName];
        var string = propName + " : " + propValue + "\n";
        currentCart += string;
    }

    if (currentCart) {
        newNode.appendChild(document.createTextNode(currentCart));
    } else {
        newNode.appendChild(document.createTextNode('Your cart is empty'));
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
    var parent = document.getElementById('cartContent');
    var child = document.getElementById('cartInfo');

    document.getElementById("mainContent").style.opacity = "1";
    parent.removeChild(child);
}

window.onload = startTimers;
