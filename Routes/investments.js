const { Router } = require('express');
const prisma = require('../DB/dbconfig.js');
const jwt = require('jsonwebtoken');
const fetchInvestor = require('../Middleware/investorMiddleware.js'); // Middleware for investor authentication

const investmentRouter = Router();

investmentRouter.post('/invest', fetchInvestor, async (req, res) => {
    const { startupId, amount } = req.body;

    try {
        // Create a new investment entry and associate it with the authenticated investor
        const investment = await prisma.investment.create({
            data: {
                amount,
                startupId,
                investorId: req.investor.id, // Associate the investment with the logged-in investor
            },
        });

        // Update the raisedAmount in the Startup model
        await prisma.startup.update({
            where: { id: startupId },
            data: {
                raisedAmount: {
                    increment: amount, // Increment the raisedAmount by the invested amount
                },
            },
        });

        return res.status(201).json({ message: 'Investment successful', investment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = investmentRouter;
