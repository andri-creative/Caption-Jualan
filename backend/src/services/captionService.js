const { Caption } = require('../models');
const { urlAi, key } = require('../../config/ai-api');

const generateCaption = async (userId, productName, inputPrompt, modelUsed) => {
    try {
        if (typeof fetch === 'undefined') {
            throw new Error("Node.js version too old. Please use Node.js v18+ or install node-fetch.");
        }

        console.log(`🤖 Menghubungi OpenRouter dengan model: ${modelUsed}...`);

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
        if (!data.choices || !data.choices[0]) {
            console.error("Respon OpenRouter tidak sesuai format:", data);
            throw new Error("Respon AI tidak valid");
        }
        const aiResultText = data.choices[0].message.content;

        console.log("✅ Berhasil mendapatkan caption dari AI. Menyimpan ke database...");

        // 2. Simpan hasil ke database PostgreSQL
        try {
            const newCaption = await Caption.create({
                user_id: userId,
                product_name: productName,
                input_prompt: inputPrompt,
                model_used: modelUsed,
                result_text: aiResultText,
                image_url: null
            });
            console.log("✅ Berhasil menyimpan caption ke DB.");
            return newCaption;
        } catch (dbError) {
            console.error("❌ Gagal menyimpan ke Database PostgreSQL:", dbError);
            throw new Error("Gagal menyimpan data ke database: " + dbError.message);
        }
    } catch (error) {
        console.error("❌ Error di captionService:", error.message);
        throw error;
    }
};

module.exports = {
    generateCaption
};
