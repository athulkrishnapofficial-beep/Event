const Message = require('../models/messageModel');

// 1. Submit Contact Form Message
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      status: 'unread',
    });

    const savedMessage = await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: savedMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get All Messages (Admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Get Message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Update Message Status (Admin only)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['unread', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Status updated successfully', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Delete Message (Admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
