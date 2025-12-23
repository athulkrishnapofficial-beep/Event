const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { auth } = require("../middlewares/auth");
const { roleCheck } = require("../middlewares/roleCheck");

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", auth, roleCheck(["admin", "provider"]), createEvent);
router.put("/:id", auth, roleCheck(["admin", "provider"]), updateEvent);
router.delete("/:id", auth, roleCheck(["admin"]), deleteEvent);

module.exports = router;
