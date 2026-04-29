const mongoose = require("mongoose");

const aiModelSchema = new mongoose.Schema({
    _id: { type: String }, // Menggunakan ID dari OpenRouter (misal: 'openai/gpt-4o')
    canonical_slug: String,
    name: String,
    description: String,
    context_length: Number,
    created: Number,

    architecture: {
        modality: String,
        input_modalities: [String],
        output_modalities: [String],
        tokenizer: String,
        instruct_type: String,
    },

    pricing: {
        prompt: String,
        completion: String,
    },

    top_provider: {
        context_length: Number,
        max_completion_tokens: Number,
        is_moderated: Boolean
    },

    supported_parameters: [String],

    default_parameters: {
        temperature: Number,
        top_p: Number,
        top_k: Number,
        frequency_penalty: Number,
        presence_penalty: Number,
        repetition_penalty: Number,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("AiModel", aiModelSchema);