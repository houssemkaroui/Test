const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refreshtoken', refreshToken);
router.get('/logout', protect, logout);

module.exports = router;