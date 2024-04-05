const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authenticate, authorize } = require('../helpers/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', authenticate, authorize(['admin']), userController.getAllUsers);
router.put('/status/:id', authenticate, authorize(['admin']), userController.changeUserStatus);

// Google OAuth2 routes
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

module.exports = router;
