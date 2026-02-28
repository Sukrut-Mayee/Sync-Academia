const express = require('express');
const router = express.Router();
const { checkConflict, createTask, getTasks } = require('../controllers/taskController');

router.post('/check-conflict', checkConflict);
router.post('/create', createTask);
router.get('/', getTasks); // <--- New Route

module.exports = router;