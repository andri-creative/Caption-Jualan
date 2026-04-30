const cloudinary = require('../../config/cloudinary');
const axios = require('axios');
const aiConfig = require('../../config/ai-api');
const fs = require('fs');

/**
 * Upload local file to Cloudinary
 * @param {string} filePath - Path to local file
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadLocalFile = async (filePath, folder = 'product_images') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Upload buffer to Cloudinary (for generated images or streams)
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadBuffer = async (buffer, folder = 'generated_images') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Buffer Upload Error:', error);
          return reject(new Error('Failed to upload buffer to Cloudinary'));
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Helper to download image from URL and return buffer
 * @param {string} url - Image URL
 * @returns {Promise<Buffer>}
 */
const downloadImageAsBuffer = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
};

module.exports = {
  uploadLocalFile,
  uploadBuffer,
  downloadImageAsBuffer
};
