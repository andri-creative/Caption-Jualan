const { Caption } = require('../models');
const { urlAi, key } = require('../../config/ai-api');

const generateCaption = async (userId, productName, inputPrompt, modelUsed) => {
    try {
        // 1. Kirim permintaan ke OpenRouter AI
        const response = await fetch(`${urlAi}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelUsed,
                messages: [
                    {
                        role: "system",
                        content: "Anda adalah pakar copywriter jualan yang handal. Buatlah caption yang menarik, persuasif, dan menjual berdasarkan informasi produk yang diberikan."
                    },
                    {
                        role: "user",
                        content: `Produk: ${productName}. \nPermintaan Tambahan: ${inputPrompt}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Detail Error OpenRouter:", JSON.stringify(errorData, null, 2));
            throw new Error(errorData.error?.message || "Gagal mendapatkan respon dari AI");
        }

        const data = await response.json();
        const aiResultText = data.choices[0].message.content;

        // 2. Simpan hasil ke database PostgreSQL
        const newCaption = await Caption.create({
            user_id: userId,
            product_name: productName,
            input_prompt: inputPrompt,
            model_used: modelUsed,
            result_text: aiResultText,
            image_url: null // Opsional, dikosongkan dulu sesuai permintaan
        });

        return newCaption;
    } catch (error) {
        console.error("Error di captionService:", error);
        throw error;
    }
};

module.exports = {
    generateCaption
};
