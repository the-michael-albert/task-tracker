const Datastore = require('nedb');
const path = require('path');

const db = new Datastore({
  filename: path.join(__dirname, '../data/features.db'),
  autoload: true
});

// Create initial feature structure if the database is empty
db.count({}, (err, count) => {
  if (count === 0) {
    const initialFeatures = [
      {
        name: 'Dashboard Creation',
        description: 'Main dashboard creation feature',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    db.insert(initialFeatures, (err) => {
      if (err) console.error('Error initializing features:', err);
      else console.log('Features initialized successfully');
    });
  }
});

const Feature = {
  // Find all features
  findAll: (callback) => {
    db.find({}).sort({ createdAt: -1 }).exec(callback);
  },

  // Find feature by ID
  findById: (id, callback) => {
    db.findOne({ _id: id }, callback);
  },

  // Create a new feature
  create: (featureData, callback) => {
    const feature = {
      ...featureData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.insert(feature, callback);
  },

  // Update a feature
  update: (id, featureData, callback) => {
    db.update(
      { _id: id },
      { $set: { ...featureData, updatedAt: new Date() } },
      {},
      (err) => {
        if (err) return callback(err);
        db.findOne({ _id: id }, callback);
      }
    );
  },

  // Delete a feature
  delete: (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  }
};

module.exports = Feature;