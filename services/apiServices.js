const API = require("../models/API");

const getApis = async () => {
    return await API.find()
}

const getApiData = async (data) => {
    return {
        status: true,
        message: 'Data fetched successfully',
        data: { message: "This is Paid API Data" }
    };
}


const triggerEvent = async (eventId) => {
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({
            status: false,
            message: 'Event not found'
        });
    }
    return {
        status: true,
        message: 'Event processed successfully',
        data: {
            eventId: eventId,
            status: 'processed',
        }
    };
}

module.exports = {
    getApis,
    getApiData,
    triggerEvent
}