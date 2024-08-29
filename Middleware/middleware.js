const jwt = require('jsonwebtoken');
const prisma = require('../DB/dbconfig.js'); // Import Prisma client
const JWT_SECRET = process.env.JWT_SECRET // Load secret from environment variables

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token'); // Get the token from the 'auth-token' header

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch the user by ID from the payload
        const user = await prisma.user.findFirst({
            where: { id: decoded.id },  
            select: { id: true, name: true, email: true } // Exclude the password
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Attach the user to the request object
        req.user = user;
        next(); // Pass control to the next middleware/route handler
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = fetchUser;
