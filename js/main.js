var products = {};
var previousProducts = {}; // used to compare with newly retrieved products
var cart = {};
var totalPrice = 0;
var inactiveTime = 0;  // users inactive time in seconds
var alertTime = 300000; // inactive time limit for alert
var alertUserTimerId;
var trackInactiveTimeId;

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

// initialize products array using information retrieved from server
// and renders html
function initializeProducts(response) {
    products = JSON.parse(response);
    if (!products) {
        window.alert('no products received from server');
    }
    renderProducts();
}

// when users checkouts, check with backend for quantity and price updates and alert user as needed
function updateProducts(response) {
    products = JSON.parse(response);
    var alertString = 'Update Alert: \n';
    for (var key in cart) {
        var orderedAmount = cart[key];
        var availableUpdatedAmount = products[key].quantity;

        // check if valid quantity
        if (orderedAmount > availableUpdatedAmount) {
            cart[key] = availableUpdatedAmount;
            alertString +=  key + ' Quantity: changed from ' + orderedAmount + ' to ' + availableUpdatedAmount +'\n';
            if (availableUpdatedAmount === 0) {
                delete cart[key];
            }
        }

        // check if price changed
        var oldPrice = oldProducts[key].price;
        var newPrice = products[key].price;
        if (oldPrice !== newPrice) {
            alertString += key + ' Price: changed from $' + oldPrice + ' to $' + newPrice +'\n';
        }
    }
    if (alertString !== 'Update Alert: \n') {
        createTable();
        computeAndUpdateTotalPrice();
        window.alert(alertString + '\n' + 'Your new total is $' + totalPrice);
    } else {
        window.confirm('No change in quantity and price, your total is $' + totalPrice);
    }
}

function onErrorCallBack(response) {
    window.alert("error: " + response + " retrieving products from server");
}

function checkProducts() {
    oldProducts = products;
    ajaxGet("https://cpen400a-bookstore.herokuapp.com/products", updateProducts, onErrorCallBack);
}

function computeAndUpdateTotalPrice() {
    totalPrice = 0;
    for (var key in cart) {
        totalPrice += products[key].price * cart[key];
    }
    updateCartButton();
    updateTotal();
    showCart();
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
    // initialize products
    ajaxGet("https://cpen400a-bookstore.herokuapp.com/products", initializeProducts, onErrorCallBack);
};
