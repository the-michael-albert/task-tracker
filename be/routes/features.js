const express = require('express');
const Feature = require('../models/Feature');
const Component = require('../models/Component');
const Endpoint = require('../models/Endpoint');
const DatabaseChange = require('../models/DatabaseChange');

const router = express.Router();

// Get all features
router.get('/', (req, res) => {
  Feature.findAll((err, features) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving features' });
    }
    res.json(features);
  });
});

// Get feature by ID
router.get('/:id', (req, res) => {
  Feature.findById(req.params.id, (err, feature) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving feature' });
    }
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  });
});

// Get components for a specific feature
router.get('/:id/components', (req, res) => {
  Component.findByFeatureId(req.params.id, (err, components) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving components' });
    }
    res.json(components);
  });
});

// Get endpoints for a specific feature
router.get('/:id/endpoints', (req, res) => {
  Endpoint.findByFeatureId(req.params.id, (err, endpoints) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving endpoints' });
    }
    res.json(endpoints);
  });
});

// Get database changes for a specific feature
router.get('/:id/database-changes', (req, res) => {
  DatabaseChange.findByFeatureId(req.params.id, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving database changes' });
    }
    res.json(changes);
  });
});

// Create a new feature
router.post('/', (req, res) => {
  const featureData = req.body;

  if (!featureData.name) {
    return res.status(400).json({ error: 'Feature name is required' });
  }

  Feature.create(featureData, (err, feature) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating feature' });
    }
    res.status(201).json(feature);
  });
});

// Update a feature
router.put('/:id', (req, res) => {
  const featureData = req.body;

  if (!featureData.name) {
    return res.status(400).json({ error: 'Feature name is required' });
  }

  Feature.update(req.params.id, featureData, (err, feature) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating feature' });
    }
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  });
});

// Delete a feature
router.delete('/:id', (req, res) => {
  Feature.delete(req.params.id, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting feature' });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json({ message: 'Feature deleted successfully' });
  });
});

module.exports = router;