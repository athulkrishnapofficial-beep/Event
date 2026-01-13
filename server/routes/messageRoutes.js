const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { roleCheck } = require('../middlewares/roleCheck');
const {
  submitMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/messageController');

// Public route - submit contact form
router.post('/submit', submitMessage);

// Admin routes - get and manage messages
router.get('/all', auth, roleCheck(['admin']), getAllMessages);
router.get('/:id', auth, roleCheck(['admin']), getMessageById);
router.put('/:id/status', auth, roleCheck(['admin']), updateMessageStatus);
router.delete('/:id', auth, roleCheck(['admin']), deleteMessage);

module.exports = router;
