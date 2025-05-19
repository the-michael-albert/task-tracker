const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filter out non-image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB size limit
  }
});

// Get all images
router.get('/', (req, res) => {
  Image.findAll((err, images) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving images' });
    }
    
    // Add full URL path to each image
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagesWithUrls = images.map(image => ({
      ...image,
      url: `${baseUrl}/uploads/${image.filename}`
    }));
    
    res.json(imagesWithUrls);
  });
});

// Upload a new image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const { name, featureId } = req.body;
  
  const imageData = {
    name: name || 'Unnamed Image',
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    featureId: featureId || null
  };

  Image.create(imageData, (err, image) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving image information' });
    }
    
    // Add the URL to the response
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    image.url = `${baseUrl}/uploads/${image.filename}`;
    
    res.status(201).json(image);
  });
});

// Get image by ID
router.get('/:id', (req, res) => {
  Image.findById(req.params.id, (err, image) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving image' });
    }
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Add full URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    image.url = `${baseUrl}/uploads/${image.filename}`;
    
    res.json(image);
  });
});

// Delete an image
router.delete('/:id', (req, res) => {
  Image.delete(req.params.id, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting image' });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  });
});

module.exports = router;