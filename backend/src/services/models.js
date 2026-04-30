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

// Fungsi untuk mengambil data model dari MongoDB (dengan filter ID asli OpenRouter)
const getModelsFromDB = async () => {
    try {
        // Daftar ID asli (slug) yang ingin kita tampilkan
        const modelMappings = {
            "google/gemini-2.0-flash-001": "Google: Gemini 2.0 Flash",
            "deepseek/deepseek-chat": "DeepSeek: DeepSeek V3",
            "openai/gpt-4o": "OpenAI: GPT-4o Pro",
            "anthropic/claude-3-5-sonnet": "Anthropic: Claude 3.5 Sonnet",
            "meta-llama/llama-3.3-70b-instruct:free": "Meta: Llama 3.3 70B (Free)",
            "nvidia/llama-3.1-nemotron-70b-instruct:free": "NVIDIA: Nemotron 70B (Free)",
            "qwen/qwen-2.5-72b-instruct": "Qwen: Qwen 2.5 72B",
            "xai/grok-2-1212": "xAI: Grok 2"
        };

        const allowedIds = Object.keys(modelMappings);

        const models = await AiModel.find({
            _id: { $in: allowedIds }
        });

        // Tambahkan logo_url dan gunakan Nama Cantik pilihan kita
        const modelsWithLogos = models.map(model => {
            const slug = model._id;
            const displayName = modelMappings[slug] || model.name;
            const modelKey = slug.toLowerCase();
            
            let logo = 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'; // Default

            for (const key in LOGO_MAP) {
                if (modelKey.includes(key)) {
                    logo = LOGO_MAP[key];
                    break;
                }
            }

            return {
                ...model.toObject(),
                id: slug, // Frontend butuh field 'id'
                name: displayName, // Gunakan nama cantik kita
                logo_url: logo
            };
        });

        return modelsWithLogos;
    } catch (error) {
        console.error("Error mengambil data dari DB:", error);
        throw error;
    }
};

module.exports = {
    syncModelsFromApi,
    getModelsFromDB
};
