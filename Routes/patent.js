const { Router } = require('express');
const prisma = require('../DB/dbconfig.js'); // Import Prisma client
const fetchUser = require('../Middleware/middleware.js'); // Import the authentication middleware
const patentrouter = Router();


patentrouter.post('/file-patent', fetchUser, async (req, res) => {
    const { title, description, inventorName, filingDate } = req.body;

    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Create a new patent application
        const patent = await prisma.patent.create({
            data: {
                title,
                description,
                inventorName,
                filingDate,
                
                userId: req.user.id ,
                user : req.user.user
            }
        });

        // Respond with the newly created patent application
        return res.status(201).json({
            message: "Patent application registered successfully",
            patent
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


patentrouter.get('/getAllPatents',async(req,res)=>{
    try{
        const patents = await prisma.patent.findMany();
        return res.status(200).json({patents});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
})
patentrouter.get('/get-my-patents', fetchUser, async (req, res) => {
    try {
        // Fetch all patents associated with the authenticated user
        const patents = await prisma.patent.findMany({
            where: { userId: req.user.id }
        });

        return res.status(200).json({ patents });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Endpoint to update the patent status
patentrouter.patch('/update-patent/:id', async (req, res) => {
    const { id } = req.params; // Patent ID from URL parameters
    const { status } = req.body; // New status from request body

    try {
        // Check if the provided status is valid
        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update the patent status
        const updatedPatent = await prisma.patent.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        // Respond with the updated patent
        return res.status(200).json({
            message: 'Patent status updated successfully',
            patent: updatedPatent
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = patentrouter;
