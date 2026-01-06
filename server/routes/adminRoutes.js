const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { getAllUsers, getAllOrganizers, getPendingEvents, approveEvent } = require('../controllers/adminController');

// Middleware to ensure user is admin
const verifyAdmin = (req, res, next) => {
  // ensure this email matches exactly what is in your database
  if (req.user && req.user.email === 'admin@gmail.com') { 
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admins Only" });
  }
};

router.get('/users', auth, verifyAdmin, getAllUsers);
router.get('/organizers', auth, verifyAdmin, getAllOrganizers);
router.get('/events/pending', auth, verifyAdmin, getPendingEvents);
router.put('/approve-event/:id', auth, verifyAdmin, approveEvent);

module.exports = router;