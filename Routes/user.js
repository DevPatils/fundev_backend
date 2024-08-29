const { Router } = require("express");
const prisma = require('../DB/dbconfig.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userrouter = Router();

// Secret key for JWT (you should store this in your .env file)
const JWT_SECRET = process.env.JWT_SECRET ;  // Replace with a strong secret key

userrouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const findUser = await prisma.user.findUnique({
            where: { email }
        });

        if (findUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        const id = user.id;
        // Generate a JWT token with an expiration time
        const token = jwt.sign({ id: id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with the user data and token
        return res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = userrouter;
