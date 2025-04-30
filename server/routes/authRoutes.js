const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', registerUser);

// Kullanıcı girişi
router.post('/login', loginUser);

module.exports = router;
