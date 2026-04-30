const { AiModel } = require('../models');
const { urlAi, key } = require('../../config/ai-api');

const syncModelsFromApi = async () => {
    try {
        const response = await fetch(`${urlAi}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${key}`
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // OpenRouter biasanya mereturn list model di dalam properti "data"
        const models = data.data;

        if (!models || models.length === 0) {
            return { message: "Tidak ada data model dari API" };
        }

        // Gunakan bulkWrite untuk melakukan upsert secara massal (efisien)
        const bulkOps = models.map(model => {
            return {
                updateOne: {
                    filter: { _id: model.id },
                    update: {
                        $set: {
                            canonical_slug: model.canonical_slug,
                            name: model.name,
                            description: model.description,
                            context_length: model.context_length,
                            created: model.created,
                            architecture: model.architecture,
                            pricing: model.pricing,
                            top_provider: model.top_provider,
                            supported_parameters: model.supported_parameters,
                            default_parameters: model.default_parameters,
                        }
                    },
                    upsert: true
                }
            };
        });

        if (bulkOps.length > 0) {
            await AiModel.bulkWrite(bulkOps);
        }

        return {
            message: "Sinkronisasi model AI berhasil",
            total_synced: bulkOps.length
        };

    } catch (error) {
        console.error("Error di services/models.js:", error);
        throw error;
    }
};

// Fungsi untuk mengambil data model dari MongoDB
const getModelsFromDB = async () => {
    try {
        // Ambil semua data model dari database, misalnya diurutkan berdasarkan nama
        const models = await AiModel.find({}).sort({ name: 1 });
        return models;
    } catch (error) {
        console.error("Error mengambil data dari DB:", error);
        throw error;
    }
};

module.exports = {
    syncModelsFromApi,
    getModelsFromDB
};
