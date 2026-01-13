const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { roleCheck } = require('../middlewares/roleCheck');
const { getAllUsers, getAllOrganizers, getPendingEvents, approveEvent, getApprovedEvents, unapproveEvent } = require('../controllers/adminController');

router.get('/users', auth, roleCheck(['admin']), getAllUsers);
router.get('/organizers', auth, roleCheck(['admin']), getAllOrganizers);
router.get('/events/pending', auth, roleCheck(['admin']), getPendingEvents);
router.get('/events/approved', auth, roleCheck(['admin']), getApprovedEvents);
router.put('/approve-event/:id', auth, roleCheck(['admin']), approveEvent);
router.put('/unapprove-event/:id', auth, roleCheck(['admin']), unapproveEvent);

module.exports = router;