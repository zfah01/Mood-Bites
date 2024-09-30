const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This creates the user schema, where all our user data is held
const User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: { type: String, required: true, minlength: 6 },
    recipes: [
        {
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                default: ''
            },
            recipeUrl: {
                type: String,
                default: ''
            },
            cuisines: {
                type: Object,
                default: ''
            },
            sourceName: {
                type: String,
                default: ''
            },
            summary: {
                type: String,
                default: ''
            },
            preptime: {
                type: Number,
                default: ''
            },
            totalCookingTime: {
                type: Number,
                default: ''
            },
            ingredients: {
                type: Object,
                default: ''
            },
            dishTypes: {
                type: Object,
                default: ''
            },
            diets: {
                type: Object,
                default: ''
            },
            instructions: {
                type: Object,
                default: ''
            },
            winePairing: {
                type: Object,
                default: ''
            },
            playlistRef: {
                type: String,
                default: ''
            },
            cookingTime: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: ''
            }
        }
    ],
    spotifyTokens: {
        // this one gets returned
        access: {
            type: String,
            default: ''
        },
        // this one stays on the backend
        refresh: {
            type: String,
            default: ''
        }
    },
    moodData: {
        happy: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        energetic: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('User', User);