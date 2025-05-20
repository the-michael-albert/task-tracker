const Datastore = require('nedb');
const path = require('path');

const db = new Datastore({
  filename: path.join(__dirname, '../data/users.db'),
  autoload: true
});

// Create initial users if the database is empty
db.count({}, (err, count) => {
  if (count === 0) {
    const initialUsers = [
      {
        name: 'Pol',
        email: '...',
        role: 'Developer',
        avatar: 'user1.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jackie',
        email: '...',
        role: 'Designer',
        avatar: 'user2.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chinna',
        email: '...',
        role: 'Developer',
        avatar: 'user3.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    db.insert(initialUsers, (err) => {
      if (err) console.error('Error initializing users:', err);
      else console.log('Users initialized successfully');
    });
  }
});

const User = {
  // Find all users
  findAll: (callback) => {
    db.find({}).sort({ name: 1 }).exec(callback);
  },

  // Find user by ID
  findById: (id, callback) => {
    db.findOne({ _id: id }, callback);
  },

  // Find user by email
  findByEmail: (email, callback) => {
    db.findOne({ email }, callback);
  },

  // Create a new user
  create: (userData, callback) => {
    const user = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.insert(user, callback);
  },

  // Update a user
  update: (id, userData, callback) => {
    db.update(
      { _id: id },
      { $set: { ...userData, updatedAt: new Date() } },
      {},
      (err) => {
        if (err) return callback(err);
        db.findOne({ _id: id }, callback);
      }
    );
  },

  // Delete a user
  delete: (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  },

  // Search users by name or email
  search: (query, callback) => {
    const regex = new RegExp(query, 'i');
    db.find({ 
      $or: [
        { name: regex },
        { email: regex }
      ]
    }).sort({ name: 1 }).exec(callback);
  }
};

module.exports = User;