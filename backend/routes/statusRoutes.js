const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

router.post('/request', statusController.requestBusyMode);
router.post('/approve', statusController.approveRequest);
router.post('/reject', statusController.rejectRequest); // <--- Added this
router.get('/notifications', statusController.getNotifications);

module.exports = router;