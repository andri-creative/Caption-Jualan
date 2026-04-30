const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "ddixnspn2",
  api_key: process.env.CLOUDINARY_API_KEY || "876731862614435",
  api_secret: process.env.CLOUDINARY_API_SECRET || "KMw5UYBjjNGpBnvC3AzIymFBaUQ"
});

module.exports = cloudinary;
