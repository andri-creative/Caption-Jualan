const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Public Routes (Bebas akses)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/google', authController.getGoogleLoginUrl);
router.get('/callback', authController.googleCallback);

// Protected Routes (Harus punya cookie / sudah login)
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
