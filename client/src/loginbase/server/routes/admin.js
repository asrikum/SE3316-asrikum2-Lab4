const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const router = express.Router();

// Initialize LowDB
const adapter = new FileSync('db.json');
const db = low(adapter);







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


async function promoteUserToAdmin(userId) {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const database = client.db(dbName);
        const usersCollection = database.collection('users');

        let userObjectId;
        try {
            userObjectId = new ObjectId(userId);
        } catch (error) {
            console.error("Invalid ObjectId format for userId:", userId);
            throw new Error("Invalid ObjectId format");
        }

        console.log("Promoting user with ObjectId:", userObjectId);
        const user = await usersCollection.findOne({ _id: userObjectId });
        console.log("Find one User",user);
        const result = await usersCollection.findOneAndUpdate(
            { _id: userObjectId },
            { $set: { isAdmin: true } },
            { returnDocument: 'after' }
        );

        if (!result) {
            console.log("No user found with ID:", userObjectId);
            return null;
        }

        return result.value;
    } catch (error) {
        console.error("Error in promoteUserToAdmin:", error);
        throw error;
    } finally {
        await client.close();
    }
}
router.put('/users/:userId/promote-to-admin', adminAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Call the function to promote the user
        const updatedUser = promoteUserToAdmin(userId);

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        res.send({ message: 'User successfully promoted to admin.', user: updatedUser });
        res.status(200).json({ message: 'Admin status updated successfully' });
    } catch (error) {
        console.error('Error in promoting user:', error);
        res.status(500).send('Internal server error');
    }
});
  
async function disableuser(userId) {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const database = client.db(dbName);
        const usersCollection = database.collection('users');

        let userObjectId;
        try {
            userObjectId = new ObjectId(userId);
        } catch (error) {
            console.error("Invalid ObjectId format for userId:", userId);
            throw new Error("Invalid ObjectId format");
        }
        

        // Update the user with the toggled status

        console.log("Disabling user with ObjectId:", userObjectId);
        const user = await usersCollection.findOne({ _id: userObjectId });
        console.log("Find one User",user);
        const updatedDisabledStatus = !user.disabled;
        const result = await usersCollection.findOneAndUpdate(
            { _id: userObjectId },
            { $set: { disabled: updatedDisabledStatus } },
            { returnDocument: 'after' }
        );

        if (!result) {
            console.log("No username found with ID:", userObjectId);
            return null;
        }

        return result.value;
    } catch (error) {
        console.error("Error in disableUser:", error);
        throw error;
    } finally {
        await client.close();
    }
}
router.put('/users/:userId/disable', adminAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Call the function to promote the user
        const updatedUser = disableuser(userId);

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        res.send({ message: 'User disabled', user: updatedUser });
    } catch (error) {
        console.error('Error in disabling user:', error);
        res.status(500).send('Internal server error');
    }
});







// Other Admin Routes...

module.exports = router;
