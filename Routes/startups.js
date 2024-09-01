const { Router } = require("express");
const prisma = require('../DB/dbconfig.js');
const fs = require('fs');
const path = require('path');  // Import the path module
const startuprouter = Router();
const fetchUser = require('../Middleware/middleware.js');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";  // Replace with a strong secret key

startuprouter.post('/onboard', fetchUser, async (req, res) => {
    const { name, description, industry, fundingGoal, logoBase64 } = req.body;
    const parsedFundingGoal = parseFloat(fundingGoal);

    try {
        let logoUrl = null;

        // Check if logoBase64 is provided and decode it to save as a file
        if (logoBase64) {
            // Generate a unique filename for the logo
            const logoFilename = `logo-${Date.now()}.png`;

            // Define the path for the uploads directory and the logo file
            const uploadsDir = path.join(__dirname, '../uploads');  // Move one directory up to create uploads folder
            const logoPath = path.join(uploadsDir, logoFilename);

            // Ensure the uploads directory exists, create it if it doesn't
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });  // Create the directory if it doesn't exist
            }

            // Decode the Base64 string and write it to a file
            const logoBuffer = Buffer.from(logoBase64, 'base64');

            // Write the file to the uploads directory
            fs.writeFileSync(logoPath, logoBuffer);

            // Set the logo URL for storing in the database
            logoUrl = `/uploads/${logoFilename}`;
        }

        // Create the startup entry in the database
        const startup = await prisma.startup.create({
            data: {
                name,
                description,
                industry,
                fundingGoal: parsedFundingGoal,
                logo: logoUrl,
                userId: req.user.id, // Assuming `userId` is available from authenticated user
            }
        });

        res.status(201).json({ message: 'Startup onboarded successfully', startup });
    } catch (error) {
        console.error('Error onboarding startup:', error);
        res.status(500).json({ message: 'Internal server error' });
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
