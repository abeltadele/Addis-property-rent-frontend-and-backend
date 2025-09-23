 server.js// Load environment variables from .env file
require('dotenv').config();

// Import necessary packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const propertyRoutes = require('./routes/propertyRoutes');

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
// This allows us to accept JSON data in the request body
app.use(express.json());

// Enable CORS for all routes
// This allows our frontend to make requests to our backend
app.use(cors());

// Database Connection
// Connect to MongoDB using the connection string from .env file
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Use routes
// All routes will be prefixed with /api
app.use('/api', propertyRoutes);

// Define a simple root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Addis Property Rent API' });
});

// Error handling middleware
// This will catch any errors that occur in our routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

// Set the port to the environment variable PORT or 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
