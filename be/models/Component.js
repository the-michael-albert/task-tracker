// be/models/Component.js (modified)

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
        completed: false, // Added completed field
        description: 'Provides state and context for the dashboard features', // Added description field
        children: [
          {
            name: 'DashboardProvider',
            type: 'provider',
            completed: false, // Added completed field
            description: 'Provider implementation for Dashboard context', // Added description field
            children: [
              { 
                name: 'ActionTable', 
                type: 'component', 
                completed: false, 
                description: 'Table component for displaying dashboard actions' 
              },
              { 
                name: 'Snapshot', 
                type: 'component', 
                completed: false, 
                description: 'Component for displaying dashboard snapshots' 
              }
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
      completed: componentData.completed || false, // Default to false if not provided
      description: componentData.description || '', // Default to empty string if not provided
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

  // Toggle completion status
  toggleCompletion: (id, callback) => {
    db.findOne({ _id: id }, (err, component) => {
      if (err) return callback(err);
      if (!component) return callback(new Error('Component not found'));
      
      const completed = !component.completed;
      
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

  // Add a child to a component
  addChild: (parentId, childData, callback) => {
    db.findOne({ _id: parentId }, (err, parent) => {
      if (err) return callback(err);
      if (!parent) return callback(new Error('Parent not found'));

      const children = parent.children || [];
      const child = {
        ...childData,
        _id: new Date().getTime().toString(),
        completed: childData.completed || false, // Default to false if not provided
        description: childData.description || '', // Default to empty string if not provided
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

  // Toggle child completion status
  toggleChildCompletion: (parentId, childId, callback) => {
    db.findOne({ _id: parentId }, (err, parent) => {
      if (err) return callback(err);
      if (!parent) return callback(new Error('Parent not found'));

      const children = parent.children || [];
      const childIndex = children.findIndex(child => child._id === childId);
      
      if (childIndex === -1) return callback(new Error('Child not found'));
      
      children[childIndex].completed = !children[childIndex].completed;
      children[childIndex].updatedAt = new Date();
      
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