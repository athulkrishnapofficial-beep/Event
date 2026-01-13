const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const upload = require('../middlewares/upload');

const {
  createEvent,
  getEvents,
  getEventById, 
  getMyEvents,
  updateEvent,
  deleteEvent,
  toggleInterest,
} = require("../controllers/eventController");
router.get("/", getEvents);
router.get("/single/:id", getEventById); 
router.post('/', auth, upload.single('coverImage'), createEvent);
router.post('/create', auth, upload.single('coverImage'), createEvent);
router.get("/my-events", auth, getMyEvents);
router.put("/:id", auth, upload.single('coverImage'), updateEvent);
router.delete("/:id", auth, deleteEvent);
router.put('/interest/:id', auth, toggleInterest);

module.exports = router;