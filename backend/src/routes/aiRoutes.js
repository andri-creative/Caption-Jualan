const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Endpoint untuk trigger sinkronisasi model dari OpenRouter
router.post('/sync', aiController.syncModels);

// Endpoint untuk mengambil daftar model dari database (untuk ditampilkan di Frontend)
router.get('/models', aiController.getModels);
router.get('/sync', aiController.syncModels);

module.exports = router;
