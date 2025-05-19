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

    db.insert(initialComponents, (err) => {
      if (err) console.error('Error initializing components:', err);
      else console.log('Components initialized successfully');
    });
  }
});

const Component = {
  // Find all components
  findAll: (callback) => {
    db.find({}).sort({ createdAt: -1 }).exec(callback);
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

  // Delete a component
  delete: (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  }
};

module.exports = Component;