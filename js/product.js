var Product = function(name, price, imageUrl) {
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
};

Product.prototype.computeNetPrice = function(quantity) {
    return this.price* quantity;
};
