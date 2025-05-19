const express = require('express');
const Component = require('../models/Component');

const router = express.Router();

// Get all components
router.get('/', (req, res) => {
  Component.findAll((err, components) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving components' });
    }
    res.json(components);
  });
});

// Get component by ID
router.get('/:id', (req, res) => {
  Component.findById(req.params.id, (err, component) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving component' });
    }
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json(component);
  });
});

// Create a new component
router.post('/', (req, res) => {
  const componentData = req.body;

  if (!componentData.name) {
    return res.status(400).json({ error: 'Component name is required' });
  }

  Component.create(componentData, (err, component) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating component' });
    }
    res.status(201).json(component);
  });
});

// Update a component
router.put('/:id', (req, res) => {
  const componentData = req.body;

  if (!componentData.name) {
    return res.status(400).json({ error: 'Component name is required' });
  }

  Component.update(req.params.id, componentData, (err, component) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating component' });
    }
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json(component);
  });
});

// Delete a component
router.delete('/:id', (req, res) => {
  Component.delete(req.params.id, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting component' });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json({ message: 'Component deleted successfully' });
  });
});

module.exports = router;