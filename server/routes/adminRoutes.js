const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { roleCheck } = require('../middlewares/roleCheck');
const { getAllUsers, getAllOrganizers, getPendingEvents, approveEvent } = require('../controllers/adminController');

router.get('/users', auth, roleCheck(['admin']), getAllUsers);
router.get('/organizers', auth, roleCheck(['admin']), getAllOrganizers);
router.get('/events/pending', auth, roleCheck(['admin']), getPendingEvents);
router.put('/approve-event/:id', auth, roleCheck(['admin']), approveEvent);

module.exports = router;