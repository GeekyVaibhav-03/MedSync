const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
  updateUser
} = require('../controllers/authController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateUser, getMe);
router.get('/users', authenticateUser, authorizeRole('admin'), getAllUsers);
router.put('/users/:id', authenticateUser, authorizeRole('admin'), updateUser);

module.exports = router;
