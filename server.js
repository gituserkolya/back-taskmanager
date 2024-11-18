// server.js
const express = require('express');
const cors = require('cors'); // Import cors

const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const connectDB = require('./src/config/db');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors()); // Allow all origins by default
console.log('working');
// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const startServer = async () => {
  try {
      await connectDB();
      app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
      });
  } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
  }
};

startServer();
