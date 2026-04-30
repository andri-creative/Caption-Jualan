const captionService = require('../services/captionService');

const createCaption = async (req, res) => {
    try {
        const { product_name, input_prompt, model_used } = req.body;
        
        // userId harus dari id lokal (PostgreSQL)
        const userId = req.user.id; 

        if (!userId) {
            return res.status(401).json({ success: false, message: "User ID tidak ditemukan. Silakan login ulang." });
        }
        if (!product_name || !model_used) {
            return res.status(400).json({
                success: false,
                message: "Nama produk dan model AI wajib diisi."
            });
        }

        const result = await captionService.generateCaption(
            userId,
            product_name,
            input_prompt || "Buatkan caption yang bagus",
            model_used
        );

        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal membuat caption",
            error: error.message
        });
    }
};

module.exports = {
    createCaption
};
