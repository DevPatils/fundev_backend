const { Router } = require("express");
const prisma = require('../DB/dbconfig.js');
const jwt = require('jsonwebtoken');
const startuprouter = Router();
const fetchUser = require('../Middleware/middleware.js');

// Secret key for JWT (you can store this in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";  // Replace with a strong secret key



startuprouter.post('/onboard', fetchUser, async (req, res) => {
    const { name, description, industry, fundingGoal } = req.body;

    try {
        // Create a new startup entry and associate it with the authenticated user
        const startup = await prisma.startup.create({
            data: {
                name,
                description,
                industry,
                fundingGoal,
                userId: req.user.id  // Associate the startup with the logged-in user
            }
        });

        return res.status(201).json({ message: "Startup onboarded successfully", startup });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = startuprouter;
