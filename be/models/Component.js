const Datastore = require('nedb');
const path = require('path');

const db = new Datastore({
  filename: path.join(__dirname, '../data/components.db'),
  autoload: true
});

// Create initial component structure if the database is empty
db.count({}, (err, count) => {
  if (count === 0) {
    const initialComponents = [
      {
        name: 'DashboardContext',
        type: 'context',
        featureId: null, // This will be updated to match the initial feature ID
        children: [
          {
            name: 'DashboardProvider',
            type: 'provider',
            children: [
              { name: 'ActionTable', type: 'component' },
              { name: 'Snapshot', type: 'component' }
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Get the ID of the initial feature and associate components with it
    const featuresDb = new Datastore({
      filename: path.join(__dirname, '../data/features.db'),
      autoload: true
    });
    
    featuresDb.findOne({}, (err, feature) => {
      if (feature) {
        initialComponents[0].featureId = feature._id;
      }
      
      db.insert(initialComponents, (err) => {
        if (err) console.error('Error initializing components:', err);
        else console.log('Components initialized successfully');
      });
    });
  }
});

const Component = {
  // Find all components
  findAll: (callback) => {
    db.find({}).sort({ createdAt: -1 }).exec(callback);
  },

  // Find components by feature ID
  findByFeatureId: (featureId, callback) => {
    db.find({ featureId }).sort({ createdAt: -1 }).exec(callback);
  },

  // Find component by ID
  findById: (id, callback) => {
    db.findOne({ _id: id }, callback);
  },

  // Create a new component
  create: (componentData, callback) => {
    const component = {
      ...componentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.insert(component, callback);
  },

  // Update a component
  update: (id, componentData, callback) => {
    db.update(
      { _id: id },
      { $set: { ...componentData, updatedAt: new Date() } },
      {},
      (err) => {
        if (err) return callback(err);
        db.findOne({ _id: id }, callback);
      }
    );
  },

  // Add a child to a component
  addChild: (parentId, childData, callback) => {
    db.findOne({ _id: parentId }, (err, parent) => {
      if (err) return callback(err);
      if (!parent) return callback(new Error('Parent not found'));

      const children = parent.children || [];
      const child = {
        ...childData,
        _id: new Date().getTime().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      children.push(child);
      
      db.update(
        { _id: parentId },
        { $set: { children, updatedAt: new Date() } },
        {},
        (err) => {
          if (err) return callback(err);
          db.findOne({ _id: parentId }, callback);
        }
      );
    });
  },

  // Remove a child from a component
  removeChild: (parentId, childId, callback) => {
    db.findOne({ _id: parentId }, (err, parent) => {
      if (err) return callback(err);
      if (!parent) return callback(new Error('Parent not found'));

      const children = parent.children || [];
      const updatedChildren = children.filter(child => child._id !== childId);
      
      db.update(
        { _id: parentId },
        { $set: { children: updatedChildren, updatedAt: new Date() } },
        {},
        (err) => {
          if (err) return callback(err);
          db.findOne({ _id: parentId }, callback);
        }
      );
    });
  },

  // Delete a component
  delete: (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  }
};

module.exports = Component;