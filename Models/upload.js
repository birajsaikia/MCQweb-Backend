const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary'); // Import Cloudinary config

// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Change folder name as needed
    format: async (req, file) => 'png', // Convert all images to PNG
    public_id: (req, file) => file.originalname.split('.')[0], // Use file name as public_id
  },
});

const upload = multer({ storage });

module.exports = upload;
