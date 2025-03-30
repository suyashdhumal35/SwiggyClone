const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    servedToPeoples: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

const restaurantSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    cuisines: { type: [String], required: true },
    costForTwoMessage: { type: String, required: true },
    imageUrl: { type: String, required: true },
    promotion: { type: Boolean, required: true },
    deliveryTime: { type: String, required: true },
    rating: { type: Number, required: true },
    vegMenu: [menuItemSchema],
    nonVegMenu: [menuItemSchema],
    drinks: [menuItemSchema],
    speciality: [menuItemSchema]
});

module.exports = mongoose.model("restaurants", restaurantSchema);
