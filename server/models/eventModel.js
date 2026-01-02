const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    coverImage: { type: String, required: true }, 
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);