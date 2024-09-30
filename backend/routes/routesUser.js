// Declare the libraries needed
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
// Declare the user-model we're using
const userModel = require('../models/user');
const axios = require('axios');
// These are the main routes of the app which let us change
// the users in the db. These are private and can only be accessed
// if a correct token is provided in the request header.

// Delete an account given the correct id and token
router.delete('/:id', auth, async (req, res) => {
    try {
        // Search by id and delete user
        const user = await userModel.findByIdAndDelete(req.params.id);

        if (!user) res.status(400).send('No user here');
        console.log('user deleted');
        res.status(200).send('User has been deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update/edit an existing account's password and username
router.put('/:id', auth, async (req, res) => {
    try {
        // Find user by id in request
        const user = await userModel.findById(req.params.id);
        // Logic for updating username
        if (req.body.newUsername) {
            // Only update if newUsername does not match current
            if (req.body.newUsername !== user.username) {
                await user.updateOne({ username: req.body.newUsername });
                return res
                    .status(200)
                    .send(`Username has been updated to ${req.body.newUsername}`);
            } else {
                throw 'Please provide a new username';
            }
        }

        // Logic for updating password and encrypting it
        if (req.body.newPassword) {
            if (req.body.newPassword.length > 5) {
                // Check if current password in req is the same as the current
                const isMatch = await bcrypt.compare(
                    req.body.currentPassword,
                    user.password
                );

                // Only proceed if current password is a match
                if (!isMatch) {
                    console.log('Current password does not match');
                    res.status(400).send('Current password does not match');
                } else {
                    // hash the new password and update the user
                    const salt = await bcrypt.genSalt(10);
                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

                    await user.update({ password: req.body.newPassword });
                    console.log('Password has been updated');
                    res.status(200).send('Password has been updated');
                }
            } else {
                throw 'New Password does not meet requirements';
            }
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err);
    }
});

// A route for adding a recipe onto a users recipe array
router.put('/recipes/add', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.body.id);
        let newRecipe = req.body.newRecipe;

        // Ensure ingredients are stored correctly
        if (Array.isArray(newRecipe.ingredients)) {
            newRecipe.ingredients = newRecipe.ingredients.map(ing => ({
                original: ing.original,
                ingredient: ing.ingredient,
                ingredientAmount: ing.ingredientAmount
            }));
        }

        let newRecipes = [...user.recipes, newRecipe];
        await user.updateOne({ recipes: newRecipes });
        res.send(newRecipes);
    } catch (err) {
        console.log('Error adding recipe:', err);
        res.status(400).send(err);
    }
});

// Delete a recipe from a users recipe array
router.put('/recipes/delete', auth, async (req, res) => {
    try {
        // find current user in db, and the recipe index of the recipe to be deleted.
        const user = await userModel.findById(req.body.id);
        const recipeIndex = user.recipes.findIndex(
            (recipe) => recipe.id == req.body.recipeId
        );

        // splice the recipe from the user array using the index
        if (recipeIndex === null) throw 'no recipe with given id found';
        let newRecipes = [...user.recipes];
        newRecipes.splice(recipeIndex, 1);
        // update user and return new recipes
        await user.updateOne({ recipes: newRecipes });
        res.status(200).send(newRecipes);
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err);
    }
});


// Update mood data
router.post('/mood', auth, async (req, res) => {
    try {
        const { userId, mood } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.moodData) {
            user.moodData = {
                happy: 0,
                sad: 0,
                energetic: 0,
                neutral: 0
            };
        }

        user.moodData[mood]++;
        await user.save();

        res.status(200).json({ moodData: user.moodData });
    } catch (err) {
        console.error('Error updating mood:', err);
        res.status(500).json({ message: 'Server error while updating mood' });
    }
});

// Get mood data
router.get('/mood/:userId', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ moodData: user.moodData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get recommended recipes based on mood
router.get('/recipes/recommended/:mood', auth, async (req, res) => {
    try {
        const mood = req.params.mood;
        let cuisine = '';
        switch (mood) {
            case 'happy':
                cuisine = 'Mediterranean';
                break;
            case 'sad':
                cuisine = 'Chinese';
                break;
            case 'energetic':
                cuisine = 'Japanese';
                break;
            case 'neutral':
                cuisine = 'Italian';
                break;
            default:
                cuisine = '';
        }

        const response = await axios.get(
            `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&addRecipeInformation=true&number=10`
        );

        res.status(200).json({ recipes: response.data.results });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;