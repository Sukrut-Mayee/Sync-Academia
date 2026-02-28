const express = require('express');
const router = express.Router();
const { seedDatabase, getUserStatus, updateUserStatus } = require('../controllers/authController');

router.get('/seed', seedDatabase);
router.get('/status/:email', getUserStatus);
router.post('/update-status', updateUserStatus); // <--- New Route

module.exports = router;