const express = require('express');
const DatabaseChange = require('../models/DatabaseChange');

const router = express.Router();

// Get all database changes
router.get('/', (req, res) => {
  DatabaseChange.findAll((err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving database changes' });
    }
    res.json(changes);
  });
});

// Get database change by ID
router.get('/:id', (req, res) => {
  DatabaseChange.findById(req.params.id, (err, change) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving database change' });
    }
    if (!change) {
      return res.status(404).json({ error: 'Database change not found' });
    }
    res.json(change);
  });
});

// Create a new database change
router.post('/', (req, res) => {
  const changeData = req.body;

  if (!changeData.type || !changeData.name) {
    return res.status(400).json({ error: 'Database change type and name are required' });
  }

  DatabaseChange.create(changeData, (err, change) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating database change' });
    }
    res.status(201).json(change);
  });
});

// Update a database change
router.put('/:id', (req, res) => {
  const changeData = req.body;

  if (!changeData.type || !changeData.name) {
    return res.status(400).json({ error: 'Database change type and name are required' });
  }

  DatabaseChange.update(req.params.id, changeData, (err, change) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating database change' });
    }
    if (!change) {
      return res.status(404).json({ error: 'Database change not found' });
    }
    res.json(change);
  });
});

// Mark database change as completed/uncompleted
router.patch('/:id/complete', (req, res) => {
  const { completed } = req.body;
  
  if (completed === undefined) {
    return res.status(400).json({ error: 'Completed status is required' });
  }

  DatabaseChange.markCompleted(req.params.id, completed, (err, change) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating database change' });
    }
    if (!change) {
      return res.status(404).json({ error: 'Database change not found' });
    }
    res.json(change);
  });
});

// Delete a database change
router.delete('/:id', (req, res) => {
  DatabaseChange.delete(req.params.id, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting database change' });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'Database change not found' });
    }
    res.json({ message: 'Database change deleted successfully' });
  });
});

module.exports = router;