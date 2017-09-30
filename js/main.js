var productsNameList = [
    "Box1",
    "Box2",
    "Clothes1",
    "Clothes2",
    "Jeans",
    "Keyboard",
    "KeyboardCombo",
    "Mice",
    "PC1",
    "PC2",
    "PC3",
    "Tent"
];
var cart = {};
var products = {};
var inactiveTime = 0;  // in seconds
var alertUserTimerId;
var trackInactiveTimeId;

// used to product objects from name list
// this way if we were to add a product, we only have to add the name
// to the productsNameList
function constructObject(object, field, value) {
    object[field] = value;
}

// construct product global variables
for (var i = 0, len = productsNameList.length; i < len; i++) {
    constructObject(products, productsNameList[i], 5);
}

// Adds a given product into the cart and decrease its supply value by 1
function addToCart(productName) {
    // reset alert timer and inactive time
    clearInterval(alertUserTimerId);
    alertUserTimerId = setInterval(alertUser, 30000);
    inactiveTime = 0;

    if (cart[productName]) {
        cart[productName]++;
    } else {
        cart[productName] = 1;
    }
    products[productName]--;
}

// Remove the given product from cart and increase its supply value by 1
// if the item does not exist in cart, alert user
function removeFromCart(productName) {
    // reset alert timer and inactive time
    clearInterval(alertUserTimerId);
    alertUserTimerId = setInterval(alertUser, 30000);
    inactiveTime = 0;

    if (cart[productName]) {
        cart[productName]--;
        if (cart[productName] === 0) {
            delete cart[productName];
        }
        products[productName]++;
    } else {
        window.alert("Product " + productName + " does not exist in the cart")
    }
}

// show user the current items in the cart
function showCart() {
    var currentCart='';
    for (var propName in cart) {
        var propValue = cart[propName];
        var string = propName + " : " + propValue + "\n";
        currentCart += string;
    }
    if (currentCart) {
        window.alert(currentCart);
    } else {
        window.alert('empty cart');
    }
}

function alertUser() {
    window.alert("Hey there! Are you still planning to buy something?");
    clearInterval(alertUserTimerId);
    alertUserTimerId = setInterval(alertUser, 30000);
    inactiveTime = 0;
}

function trackInactiveTime() {
    inactiveTime++;
}

function startTimers() {
    alertUserTimerId = setInterval(alertUser, 30000);
    trackInactiveTimeId = setInterval(trackInactiveTime, 1000);
}

window.onload = startTimers;
