require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully.");
}).catch(err => {
    console.log("Failed to connect to MongoDB:", err);
});

// Middleware
app.use(cors());
app.use(express.json()); // Make sure we can parse JSON request bodies

// Routes
app.use('/api/users', userRoutes); // All user-related routes are here

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

