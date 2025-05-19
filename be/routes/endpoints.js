const express = require('express');
const Endpoint = require('../models/Endpoint');

const router = express.Router();

// Get all endpoints
router.get('/', (req, res) => {
  Endpoint.findAll((err, endpoints) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving endpoints' });
    }
    res.json(endpoints);
  });
});

// Get endpoint by ID
router.get('/:id', (req, res) => {
  Endpoint.findById(req.params.id, (err, endpoint) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving endpoint' });
    }
    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.json(endpoint);
  });
});

// Create a new endpoint
router.post('/', (req, res) => {
  const endpointData = req.body;

  if (!endpointData.method || !endpointData.path) {
    return res.status(400).json({ error: 'Endpoint method and path are required' });
  }

  Endpoint.create(endpointData, (err, endpoint) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating endpoint' });
    }
    res.status(201).json(endpoint);
  });
});

// Update an endpoint
router.put('/:id', (req, res) => {
  const endpointData = req.body;

  if (!endpointData.method || !endpointData.path) {
    return res.status(400).json({ error: 'Endpoint method and path are required' });
  }

  Endpoint.update(req.params.id, endpointData, (err, endpoint) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating endpoint' });
    }
    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.json(endpoint);
  });
});

// Delete an endpoint
router.delete('/:id', (req, res) => {
  Endpoint.delete(req.params.id, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting endpoint' });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.json({ message: 'Endpoint deleted successfully' });
  });
});

module.exports = router;