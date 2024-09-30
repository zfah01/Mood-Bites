const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

// Dev route to return all users
router.get('/', async (req, res) => {
    const users = await userModel.find({});
    try {
        res.status(200).send(users);
    } catch (err) {
        console.log('there was an error');
        res.status(500).send(err);
    }
});

// dev route to get a single user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(400).send('No user here'); // Added return to avoid further execution

        res.status(200).send(user);
    } catch (err) { // Add 'err' here
        res.status(500).send(err.message);
        console.log('Not a valid user', err); // Optional: log the actual error for debugging
    }
});


// dev route to delete all users
router.delete('/', async (req, res) => {
    try {
        const user = await userModel.deleteMany({});
        res.status(200).json();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;