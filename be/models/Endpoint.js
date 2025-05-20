// be/models/Endpoint.js (modified)

const Datastore = require('nedb');
const path = require('path');

const db = new Datastore({
  filename: path.join(__dirname, '../data/endpoints.db'),
  autoload: true
});

// Create initial endpoints if the database is empty
db.count({}, (err, count) => {
  if (count === 0) {
    const initialEndpoints = [
      {
        method: 'POST',
        path: '/api/auth/endpoint',
        featureId: null, // Will be updated with initial feature ID
        queryParams: [],
        description: 'Authentication endpoint for user login', // Added description
        completed: false, // Added completed field
        requestBody: '{\n  "json": {}\n}',
        responseBody: '{\n  "json": {}\n}',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        method: 'GET',
        path: '/api/auth/endpoint',
        featureId: null, // Will be updated with initial feature ID
        queryParams: [
          { key: 'sort', value: 'true' },
          { key: 'limit', value: '10' },
          { key: 'filter', value: 'org' }
        ],
        description: 'Retrieves user authentication status', // Added description
        completed: false, // Added completed field
        requestBody: '{}',
        responseBody: '{}',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Get the ID of the initial feature and associate endpoints with it
    const featuresDb = new Datastore({
      filename: path.join(__dirname, '../data/features.db'),
      autoload: true
    });
    
    featuresDb.findOne({}, (err, feature) => {
      if (feature) {
        initialEndpoints.forEach(endpoint => {
          endpoint.featureId = feature._id;
        });
      }
      
      db.insert(initialEndpoints, (err) => {
        if (err) console.error('Error initializing endpoints:', err);
        else console.log('Endpoints initialized successfully');
      });
    });
  }
});

const Endpoint = {
  // Find all endpoints
  findAll: (callback) => {
    db.find({}).sort({ createdAt: -1 }).exec(callback);
  },

  // Find endpoints by feature ID
  findByFeatureId: (featureId, callback) => {
    db.find({ featureId }).sort({ createdAt: -1 }).exec(callback);
  },

  // Find endpoint by ID
  findById: (id, callback) => {
    db.findOne({ _id: id }, callback);
  },

  // Create a new endpoint
  create: (endpointData, callback) => {
    const endpoint = {
      ...endpointData,
      description: endpointData.description || '', // Default to empty string if not provided
      completed: endpointData.completed || false, // Default to false if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.insert(endpoint, callback);
  },

  // Update an endpoint
  update: (id, endpointData, callback) => {
    db.update(
      { _id: id },
      { $set: { ...endpointData, updatedAt: new Date() } },
      {},
      (err) => {
        if (err) return callback(err);
        db.findOne({ _id: id }, callback);
      }
    );
  },

  // Toggle completion status
  toggleCompletion: (id, callback) => {
    db.findOne({ _id: id }, (err, endpoint) => {
      if (err) return callback(err);
      if (!endpoint) return callback(new Error('Endpoint not found'));
      
      const completed = !endpoint.completed;
      
      db.update(
        { _id: id },
        { $set: { completed, updatedAt: new Date() } },
        {},
        (err) => {
          if (err) return callback(err);
          db.findOne({ _id: id }, callback);
        }
      );
    });
  },

  // Delete an endpoint
  delete: (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  }
};

module.exports = Endpoint;