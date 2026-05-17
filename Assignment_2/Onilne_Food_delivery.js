// Online Food Delivery System
// Inputs
const orderAmount = 650; // change as needed
const isPremiumMember = true; // change as needed

// Delivery charge logic
let deliveryCharge = 50;
let hasFreeDelivery = false;

if (orderAmount > 500) {
  deliveryCharge = 0;
  hasFreeDelivery = true;
}

// Total before discount
let total = orderAmount + deliveryCharge;

// Premium discount
if (isPremiumMember) {
  total = total * 0.9;
}

console.log("Final payable bill:", total.toFixed(2));
console.log("Free delivery:", hasFreeDelivery ? "Yes" : "No");
