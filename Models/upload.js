const multer = require('multer');

// Multer memory storage configuration
const storage = multer.memoryStorage(); // Store files in memory instead of disk

// File filter: Accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and JPG files are allowed!'), false);
  }
};

// Multer upload instance with memory storage
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
});

module.exports = upload;
