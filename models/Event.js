const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: String,
    fixedPrice: Number,
    apiIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'API' }], // APIs called by this event
});

module.exports = mongoose.model('Event', EventSchema);
