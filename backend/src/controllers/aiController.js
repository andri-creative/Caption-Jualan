const aiService = require('../services/models');

const syncModels = async (req, res) => {
    try {
        const result = await aiService.syncModelsFromApi();
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal melakukan sinkronisasi model",
            error: error.message
        });
    }
};

const getModels = async (req, res) => {
    try {
        const models = await aiService.getModelsFromDB();
        
        return res.status(200).json({
            success: true,
            count: models.length,
            data: models
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data model dari database",
            error: error.message
        });
    }
};

module.exports = {
    syncModels,
    getModels
};
