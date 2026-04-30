const express = require('express');
const router = express.Router();
const captionController = require('../controllers/captionController');
const { requireAuth } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Endpoint untuk generate caption (Mendukung upload gambar tunggal)
router.post('/generate', requireAuth, upload.single('image'), captionController.createCaption);

module.exports = router;
