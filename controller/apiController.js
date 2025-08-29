const apiServices = require('../services/apiServices')
const getDataPaidApiData = async (req, res) => {
    try {
        const data = await apiServices.getApiData()
        res.json({ status: true, message: "API's fetched successfully", data });
    } catch (error) {
        console.error('GetData API error:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to retrieve data'
        });
    }
}

const triggerEvent = async (req, res) => {
    try {
        const result = await apiServices.triggerEvent(req.params.eventId);
        res.json({ status: true, message: "Event triggered successfully", data: result });
    } catch (error) {
        console.error('TriggerEvent API error:', error);
        res.status(500).json({
            status: false,
        });
    }
}

const getApis = async (req, res) => {
    try {
        const data = await apiServices.getApis();
        res.json({ status: true, message: "Api's fetched successfully", data });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
            status: false,
        });
    }
}

module.exports = {
    getDataPaidApiData,
    triggerEvent,
    getApis
}