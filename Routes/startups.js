const { Router } = require("express");
const prisma = require('../DB/dbconfig.js');
const fs = require('fs');
const path = require('path');  // Import the path module
const startuprouter = Router();
const fetchUser = require('../Middleware/middleware.js');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";  // Replace with a strong secret key

startuprouter.post('/onboard', fetchUser, async (req, res) => {
    const { name, description, industry, fundingGoal } = req.body;
    const parsedFundingGoal = parseFloat(fundingGoal);

    try {
        // Create a new startup
        const startup = await prisma.startup.create({
            data: {
                name,
                description,
                industry,
                fundingGoal: parsedFundingGoal,
                userId: req.user.id
            }
        });

        return res.status(200).json({ startup });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

});

startuprouter.get('/get-my-startups', fetchUser, async (req, res) => {
    try {
        // Fetch all startups associated with the authenticated user
        const startups = await prisma.startup.findMany({
            where: { userId: req.user.id }
        });

        return res.status(200).json({ startups });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

startuprouter.get('/get-all-startups', async (req, res) => {
    try {
        // Fetch all startups
        const startups = await prisma.startup.findMany();

        return res.status(200).json({ startups });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = startuprouter;
