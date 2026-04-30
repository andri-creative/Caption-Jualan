require('dotenv').config();
const mongoose = require('mongoose');
const { AiModel } = require('./src/models');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/caption_jualan";

const correctModels = [
    {
        _id: "google/gemini-2.0-flash-001",
        name: "Google: Gemini 2.0 Flash",
        description: "Model terbaru dari Google, sangat cepat dan cerdas."
    },
    {
        _id: "deepseek/deepseek-chat",
        name: "DeepSeek: DeepSeek V3.2 Speciale",
        description: "Model DeepSeek V3 yang dioptimasi untuk chat."
    },
    {
        _id: "openai/gpt-4o",
        name: "OpenAI: GPT-5.2 Chat",
        description: "Model flagship terbaru dari OpenAI."
    },
    {
        _id: "anthropic/claude-3-5-sonnet",
        name: "Anthropic: Claude Opus 4.7",
        description: "Model cerdas dari Anthropic dengan pemahaman konteks tinggi."
    },
    {
        _id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "Meta: Llama 3.3 70B Instruct (free)",
        description: "Model open-source terbaik dari Meta (Gratis)."
    },
    {
        _id: "nvidia/llama-3.1-nemotron-70b-instruct:free",
        name: "NVIDIA: Nemotron 3 Nano 30B A3B (free)",
        description: "Model NVIDIA yang dioptimasi untuk instruksi (Gratis)."
    },
    {
        _id: "qwen/qwen-2.5-72b-instruct",
        name: "Qwen: Qwen3.5 Plus 2026-02-15",
        description: "Model hebat dari Alibaba Cloud."
    },
    {
        _id: "xai/grok-2-1212",
        name: "xAI: Grok 4.20 Multi-Agent",
        description: "Model futuristik dari xAI."
    }
];

async function fixModels() {
    try {
        console.log("🔄 Menghubungkan ke MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Terhubung ke MongoDB.");

        console.log("🧹 Membersihkan data model lama...");
        await AiModel.deleteMany({});

        console.log("📥 Memasukkan data model dengan ID yang benar...");
        await AiModel.insertMany(correctModels);

        console.log("✨ Perbaikan SELESAI! Sekarang ID model sudah sesuai dengan OpenRouter.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Terjadi kesalahan:", error);
        process.exit(1);
    }
}

fixModels();
