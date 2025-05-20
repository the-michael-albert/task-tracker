
const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get all users
router.get('/', (req, res) => {
  User.findAll((err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving users' });
    }
    res.json(users);
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving user' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Search users by name or email
router.get('/search/:query', (req, res) => {
  User.search(req.params.query, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error searching users' });
    }
    res.json(users);
  });
});

// Create a new user
router.post('/', (req, res) => {
  const userData = req.body;

  if (!userData.name || !userData.email) {
    return res.status(400).json({ error: 'User name and email are required' });
  }

  User.create(userData, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating user' });
    }
    res.status(201).json(user);
  });
});

// Update a user
router.put('/:id', (req, res) => {
  const userData = req.body;

  if (!userData.name || !userData.email) {
    return res.status(400).json({ error: 'User name and email are required' });
  }

  User.update(req.params.id, userData, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating user' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Delete a user
router.delete('/:id', (req, res) => {
  User.delete(req.params.id, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;