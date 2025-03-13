const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwl6gqjhi', // Replace with your Cloudinary cloud name
  api_key: '943172974527559', // Replace with your API key
  api_secret: 'cdnKtOvHk77pAW5GGkh9cZP3g4g', // Replace with your API secret
  secure: true,
});

module.exports = cloudinary;
