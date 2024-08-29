const { Router } = require("express");
const prisma = require('../DB/dbconfig.js');
const jwt = require('jsonwebtoken');
const investmentrouter = Router();  
const fetchUser = require('../Middleware/middleware.js');


 investmentrouter.post('/invest', fetchUser, async (req, res) => {
    const { startupId, amount } = req.body;
    try {
        // Create a new investment entry and associate it with the authenticated user
        const investment = await prisma.investment.create({
            data: {
                amount,
                startupId,
                userId: req.user.id  // Associate the investment with the logged-in user
            }
        });

        return res.status(201).json({ message: "Investment successful", investment });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
 });

module.exports = investmentrouter;  // Export the router