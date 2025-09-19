const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('Error: MONGO_URI environment variable is not set.\n' +
        'Create a .env file from .env.example and set MONGO_URI, or set the environment variable.');
      // Exit with non-zero so nodemon stops and you see the message
      process.exit(1);
    }

    // Add connection options for better handling
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Ensure we exit with failure code
    process.exit(1);
  }
};

module.exports = connectDB;
