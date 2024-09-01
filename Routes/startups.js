const { Router } = require("express");
const prisma = require('../DB/dbconfig.js');
const jwt = require('jsonwebtoken');
const startuprouter = Router();
const fetchUser = require('../Middleware/middleware.js');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";  // Replace with a strong secret key


startuprouter.post('/onboard', fetchUser, async (req, res) => {

    console.log(JWT_SECRET);
    const { name, description, industry, fundingGoal,logourl } = req.body;
    const parsedFundingGoal = parseFloat(fundingGoal);
    console.log(name, description, industry, fundingGoal,logourl);
    try {
        // Create a new startup entry and associate it with the authenticated user
        const startup = await prisma.startup.create({
            data: {
                name,
                description,
                industry,
                logo:logourl,
                fundingGoal: parsedFundingGoal,
                userId: req.user.id  // Associate the startup with the logged-in user
            }
        });

        return res.status(201).json({ message: "Startup onboarded successfully", startup });

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
})
startuprouter.get('/get-all-startups', async (req, res) => {
    try {
        // Fetch all startups
        const startups = await prisma.startup.findMany();

        return res.status(200).json({ startups });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = startuprouter;
console.log(JWT_SECRET);