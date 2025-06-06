
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const componentRoutes = require('./routes/components');
const endpointRoutes = require('./routes/endpoints');
const databaseChangeRoutes = require('./routes/databaseChanges');
const featureRoutes = require('./routes/features');
const imageRoutes = require('./routes/images');
const userRoutes = require('./routes/users'); // Add the user routes

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 6969;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/components', componentRoutes);
app.use('/api/endpoints', endpointRoutes);
app.use('/api/database-changes', databaseChangeRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes); // Register the user routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});