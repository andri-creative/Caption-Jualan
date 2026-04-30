const express = require('express');
const router = express.Router();
const captionController = require('../controllers/captionController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Endpoint untuk generate caption (Hanya untuk user yang login)
router.post('/generate', requireAuth, captionController.createCaption);

module.exports = router;
