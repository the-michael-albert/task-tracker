const Datastore = require('nedb');
const path = require('path');

const db = new Datastore({
  filename: path.join(__dirname, '../data/databaseChanges.db'),
  autoload: true
});

// Create initial database changes if the database is empty
db.count({}, (err, count) => {
  if (count === 0) {
    const initialDatabaseChanges = [
      {
        type: 'Create Table',
        name: 'User Preferences',
        featureId: null, // Will be updated with initial feature ID
        icon: 'user',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Get the ID of the initial feature and associate database changes with it
    const featuresDb = new Datastore({
      filename: path.join(__dirname, '../data/features.db'),
      autoload: true
    });
    
    featuresDb.findOne({}, (err, feature) => {
      if (feature) {
        initialDatabaseChanges[0].featureId = feature._id;
      }
      
      db.insert(initialDatabaseChanges, (err) => {
        if (err) console.error('Error initializing database changes:', err);
        else console.log('Database changes initialized successfully');
      });
    });
  }
});

const DatabaseChange = {
  // Find all database changes
  findAll: (callback) => {
    db.find({}).sort({ createdAt: -1 }).exec(callback);
  },

  // Find database changes by feature ID
  findByFeatureId: (featureId, callback) => {
    db.find({ featureId }).sort({ createdAt: -1 }).exec(callback);
  },

  // Find database change by ID
  findById: (id, callback) => {
    db.findOne({ _id: id }, callback);
  },

  // Create a new database change
  create: (changeData, callback) => {
    const databaseChange = {
      ...changeData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.insert(databaseChange, callback);
  },

  // Update a database change
  update: (id, changeData, callback) => {
    db.update(
      { _id: id },
      { $set: { ...changeData, updatedAt: new Date() } },
      {},
      (err) => {
        if (err) return callback(err);
        db.findOne({ _id: id }, callback);
      }
    );
  },

  // Mark database change as completed
  markCompleted: (id, completed, callback) => {
    db.update(
      { _id: id },
      { $set: { completed, updatedAt: new Date() } },
      {},
      (err) => {
        if (err) return callback(err);
        db.findOne({ _id: id }, callback);
      }
    );
  },

  // Delete a database change
  delete: (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  }
};

module.exports = DatabaseChange;