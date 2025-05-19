const Datastore = require('nedb');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const db = new Datastore({
  filename: path.join(__dirname, '../data/images.db'),
  autoload: true
});

const Image = {
  // Find all images
  findAll: (callback) => {
    db.find({}).sort({ createdAt: -1 }).exec(callback);
  },

  // Find images by feature ID
  findByFeatureId: (featureId, callback) => {
    db.find({ featureId }).sort({ createdAt: -1 }).exec(callback);
  },

  // Find image by ID
  findById: (id, callback) => {
    db.findOne({ _id: id }, callback);
  },

  // Create a new image
  create: (imageData, callback) => {
    const image = {
      ...imageData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.insert(image, callback);
  },

  // Update an image
  update: (id, imageData, callback) => {
    db.update(
      { _id: id },
      { $set: { ...imageData, updatedAt: new Date() } },
      {},
      (err) => {
        if (err) return callback(err);
        db.findOne({ _id: id }, callback);
      }
    );
  },

  // Delete an image
  delete: (id, callback) => {
    // First find the image to get the filename
    db.findOne({ _id: id }, (err, image) => {
      if (err) return callback(err);
      if (!image) return callback(null, 0);
      
      // Delete the file if it exists
      if (image.filename) {
        const filePath = path.join(uploadsDir, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      // Then remove from the database
      db.remove({ _id: id }, {}, callback);
    });
  }
};

module.exports = Image;