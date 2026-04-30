const { Caption } = require('../models');
const { urlAi, key } = require('../../config/ai-api');
const { marked } = require('marked');
const imageService = require('./imageService');
const fs = require('fs');

/**
 * Generate Caption and optional AI Image
 * @param {number} userId - Local database user ID
 * @param {string} productName - Name of the product
 * @param {string} inputPrompt - User prompt for AI
 * @param {string} modelUsed - OpenRouter model ID
 * @param {Object} imageFile - Multer file object
 * @returns {Promise<Object>} - Created Caption record
 */
const generateCaption = async (userId, productName, inputPrompt, modelUsed, imageModel = "openai/dall-e-3", imageFile = null) => {
    console.log("🚀 generateCaption function started!");
    console.log("📦 Parameters:", { userId, productName, modelUsed, imageModel, hasImage: !!imageFile });
    
    try {
        let userContent;
        let imageUrlForDB = null;
        let generatedImageUrlForDB = null;

        // 1. UPLOAD ORIGINAL IMAGE TO CLOUDINARY
        if (imageFile) {
            console.log("📤 Uploading original product image to Cloudinary...");
            imageUrlForDB = await imageService.uploadLocalFile(imageFile.path, 'product_images');
            console.log("✅ Original image uploaded:", imageUrlForDB);

            // Cleanup local file after upload
            try {
                fs.unlinkSync(imageFile.path);
                console.log("🗑️ Local temporary file deleted.");
            } catch (err) {
                console.error("⚠️ Failed to delete local file:", err.message);
            }

            userContent = [
                { type: "text", text: `Product Name: ${productName}. \nPrompt/Description: ${inputPrompt}` },
                {
                    type: "image_url",
                    image_url: {
                        url: imageUrlForDB
                    }
                }
            ];
        } else {
            userContent = `Product Name: ${productName}. \nPrompt/Description: ${inputPrompt}`;
        }

        // 2. GENERATE CAPTION & IMAGE PROMPT VIA OPENROUTER (Vision Call)
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
                        content: `You are an expert sales copywriter and creative director. 
                        Based on the product details and image provided, you must return:
                        1. A compelling sales caption (in HTML format).
                        2. A specific, highly detailed prompt for an AI Image Generator to create a NEW professional marketing photo of this product.
                        
                        Format your response EXACTLY as follows:
                        ---CAPTION---
                        [Your HTML Caption Here]
                        ---IMAGE_PROMPT---
                        [Your Detailed Image Prompt Here]`
                    },
                    {
                        role: "user",
                        content: userContent
                    }
                ],
                max_tokens: 800,
                max_completion_tokens: 800,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gagal mendapatkan respon dari AI");
        }

        const data = await response.json();
        console.log("🤖 AI Raw Response received.");
        
        if (!data.choices || data.choices.length === 0) {
            console.error("❌ AI Response Error:", data);
            throw new Error("AI tidak memberikan pilihan jawaban.");
        }

        const rawOutput = data.choices[0].message.content;
        if (!rawOutput) {
            console.error("❌ AI Response Content is null/empty:", data);
            throw new Error("AI memberikan respon kosong (content: null).");
        }
        console.log("📝 Raw Output length:", rawOutput.length);

        // Extract Caption and Image Prompt with fallback
        let aiResultHtml = "";
        let generatedImagePrompt = "";

        const captionMatch = rawOutput.match(/---CAPTION---([\s\S]*?)---IMAGE_PROMPT---/);
        const imagePromptMatch = rawOutput.match(/---IMAGE_PROMPT---([\s\S]*)/);

        if (captionMatch && imagePromptMatch) {
            aiResultHtml = captionMatch[1].trim();
            generatedImagePrompt = imagePromptMatch[1].trim();
            console.log("✅ Successfully extracted Caption and Image Prompt.");
        } else {
            console.warn("⚠️ AI did not follow format markers. Using fallback parsing.");
            aiResultHtml = await marked.parse(rawOutput);
            generatedImagePrompt = `High-quality marketing photo of ${productName}, ${inputPrompt}`;
        }

        // 3. GENERATE NEW AI MARKETING IMAGE (Integrated Logic)
        try {
            // Dynamically find a suitable image model from the API/DB
            const allModelsResult = await require('./models').getModelsFromDB();
            const imageModels = allModelsResult.filter(m => 
                m.architecture?.modality?.includes('->image') || 
                m.architecture?.output_modalities?.includes('image') ||
                m.id.toLowerCase().includes('-image')
            );
            
            // Pilih model gambar terbaik (Prioritaskan Flux atau Gemini Image)
            let dynamicImageModel = imageModels.find(m => m.id.includes('flux'))?.id || 
                                    imageModels.find(m => m.id.includes('image'))?.id ||
                                    imageModels[0]?.id || 
                                    "google/gemini-2.5-flash-image";

            console.log("🎨 Executing dynamic AI Image Generation for:", dynamicImageModel);
            
            const imgResponse = await fetch(`${urlAi}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: dynamicImageModel,
                    messages: [
                        {
                            role: "user",
                            content: generatedImagePrompt
                        }
                    ]
                })
            });

            const contentType = imgResponse.headers.get("content-type");
            if (!imgResponse.ok || !contentType || !contentType.includes("application/json")) {
                const errorText = await imgResponse.text();
                console.error("❌ Image Generation API Error (Non-JSON):", errorText.substring(0, 100));
                throw new Error("Gagal generate gambar");
            }

            const imgData = await imgResponse.json();
            
            // Mencari URL gambar di berbagai kemungkinan lokasi (OpenRouter/OpenAI/FLUX)
            let tempAiImageUrl = "";
            
            // 1. Format Standar OpenAI (data[0].url)
            if (imgData.data && imgData.data[0] && imgData.data[0].url) {
                tempAiImageUrl = imgData.data[0].url;
            } 
            // 2. Format Chat Completion (URL di content)
            else if (imgData.choices && imgData.choices[0].message.content) {
                const urlMatch = imgData.choices[0].message.content.match(/https?:\/\/[^\s)]+/);
                if (urlMatch) tempAiImageUrl = urlMatch[0];
            }
            // 3. Format Tool Calls (Beberapa provider menggunakan ini)
            else if (imgData.choices && imgData.choices[0].message.tool_calls) {
                const toolOutput = JSON.stringify(imgData.choices[0].message.tool_calls);
                const urlMatch = toolOutput.match(/https?:\/\/[^\s"]+/);
                if (urlMatch) tempAiImageUrl = urlMatch[0];
            }

            if (tempAiImageUrl) {
                console.log("📥 Syncing AI-generated image to Cloudinary...");
                const imageBuffer = await imageService.downloadImageAsBuffer(tempAiImageUrl);
                generatedImageUrlForDB = await imageService.uploadBuffer(imageBuffer, 'generated_marketing_images');
                console.log("✅ AI Image stored:", generatedImageUrlForDB);
            } else {
                console.warn("⚠️ No image URL found in AI response. Data:", JSON.stringify(imgData).substring(0, 200));
            }
        } catch (imgGenError) {
            console.error("⚠️ AI Image Generation failed:", imgGenError.message);
        }

        // 4. SAVE EVERYTHING TO DATABASE
        console.log("💾 Saving to database...");
        const newCaption = await Caption.create({
            user_id: userId,
            product_name: productName,
            input_prompt: inputPrompt,
            model_used: modelUsed,
            result_text: aiResultHtml,
            image_url: imageUrlForDB,
            generated_image_url: generatedImageUrlForDB
        });

        console.log("✅ All data successfully saved. ID:", newCaption.id);
        return newCaption;
    } catch (error) {
        console.error("❌ Final Error in captionService:", error);
        throw error;
    }
};

module.exports = {
    generateCaption
};
