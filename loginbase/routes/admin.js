const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();

// Assuming these details are correct and stored in your environment or config
const mongoUri = 'mongodb+srv://saahash:happylife@login.nquijq4.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'test';

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send('Access denied. Admin privileges required.');
    }
    next();
};

// Function to get users using MongoDB native client
async function getUsers() {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const database = client.db(dbName);
        const usersCollection = database.collection('users');

        // Fetching users without the password field
        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
        return users;
    } finally {
        await client.close();
    }
}

// Admin Route: List All Users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error('Administer Route Error:', error);
        res.status(500).send('Server Error');
    }
});

// Other Admin Routes...

module.exports = router;
