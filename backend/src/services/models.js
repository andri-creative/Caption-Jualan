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

// Mapping logo berdasarkan keyword provider (Case-insensitive)
const LOGO_MAP = {
    "openai": "https://openrouter.ai/images/icons/OpenAI.svg",
    "gpt-5": "https://openrouter.ai/images/icons/OpenAI.svg",
    "nvidia": "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nvidia.com/&size=256",
    "qwen": "https://openrouter.ai/images/icons/Qwen.png",
    "gemini": "https://openrouter.ai/images/icons/GoogleGemini.svg",
    "google": "https://openrouter.ai/images/icons/GoogleGemini.svg",
    "anthropic": "https://openrouter.ai/images/icons/Anthropic.svg",
    "claude": "https://openrouter.ai/images/icons/Anthropic.svg",
    "clousde": "https://openrouter.ai/images/icons/Anthropic.svg",
    "deepseek": "https://openrouter.ai/images/icons/DeepSeek.png",
    "xai": "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://x.ai/&size=256",
    "meta": "https://openrouter.ai/images/icons/Meta.png",
    "llama": "https://openrouter.ai/images/icons/Meta.png"
};

// Fungsi untuk mengambil data model langsung dari OpenRouter API
const getModelsFromDB = async () => {
    try {
        console.log("🌐 Fetching models directly from OpenRouter API...");
        const response = await fetch(`${urlAi}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${key}`
            }
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const models = data.data || [];

        // Tambahkan logo_url secara dinamis
        return models.map(model => {
            const modelKey = model.id.toLowerCase();
            let logo = 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png';

            for (const key in LOGO_MAP) {
                if (modelKey.includes(key)) {
                    logo = LOGO_MAP[key];
                    break;
                }
            }

            return {
                ...model,
                logo_url: logo
            };
        });
    } catch (error) {
        console.error("Error fetching models from API:", error);
        throw error;
    }
};

module.exports = {
    syncModelsFromApi,
    getModelsFromDB
};
