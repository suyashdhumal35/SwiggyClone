const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("./db/config"); // Database connection
const User = require('./db/Users');
const Restaurant = require('./db/restaurantSchema');


const app = express();
app.use(express.json());
app.use(cors());


// ✅ Register User
app.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        const result = await user.save();
        const { password, ...userData } = result.toObject(); // Remove password from response

        res.status(201).json({ user: userData });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: "Error registering user" });
    }
});

// ✅ User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _, ...userData } = user.toObject();

        res.json({ user: userData });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Error logging in" });
    }
});

// ✅ Get All Restaurants
// ✅ Fetch all restaurants (From Restaurant Collection)
app.get("/restaurants", async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No Restaurants Found" });
        }
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: "Error fetching restaurants" });
    }
});

// ✅ Get Restaurant by ID
app.get("/restaurants/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ error: "Error fetching restaurant" });
    }
});

// ✅ Add a new restaurant (POST request)
app.post("/add-restaurant", async (req, res) => {
    try {
        // Fetch the last added restaurant to determine the next ID
        const lastRestaurant = await Restaurant.findOne().sort({ id: -1 });

        // Calculate the next ID (convert to string for consistency)
        const newId = lastRestaurant ? (parseInt(lastRestaurant.id) + 1).toString() : "1";

        // Ensure req.body.id is not used directly (MongoDB handles it)
        const newRestaurant = new Restaurant({
            ...req.body,
            id: newId, // Assign the generated ID
        });

        const savedRestaurant = await newRestaurant.save();
        res.status(201).json({ message: "Restaurant added successfully", restaurant: savedRestaurant });
    } catch (error) {
        res.status(500).json({ error: "Error adding restaurant", details: error.message });
    }
});



// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}/`));
