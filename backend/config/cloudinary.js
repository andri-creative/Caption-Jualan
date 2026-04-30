const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: "ddixnspn2",
  api_key: "876731862614435",
  api_secret: "KMw5UYBjjNGpBnvC3AzIymFBaUQ"
});

module.exports = cloudinary;
