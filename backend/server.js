// Declare the routes we're going to use
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Declare the routes we are going to use
const userRouter = require('./routes/routesUser.js');
const authRouter = require('./routes/routesAuth');


// Tells the app to read from the .env file inr the root folder
require('dotenv').config({ path: './.env' });

const app = express();
app.use(express.json()); //init middleware
app.use(cors());

// Connect to mongoose db
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Tells express where to use the routes we've declared earlier
app.use('/users', userRouter);
app.use('/auth', authRouter);

// These are the dev routes that we don't want in our production env.
// app.use('/dev/users', devRouter);

// Tell our server to startup
app.listen(process.env.PORT || 5000, () => {
    console.log(`Servers running on port ${process.env.PORT}`);
});

module.exports = app;