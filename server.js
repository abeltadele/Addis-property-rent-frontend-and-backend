const propertiesRoutes = require('./routes/properties');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', propertiesRoutes);

app.get('/', (req, res) => res.send('Addis Property Rent API'));

const PORT = process.env.PORT || 5000;
// Comment out or remove this line:
// connectDB();

// Add this temporary storage:
let properties = [];
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));