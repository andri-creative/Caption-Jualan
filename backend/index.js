require('pg');
require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectDB } = require('./config/database');
const db = require('./src/models');
const aiService = require('./src/services/models');
const aiRoutes = require('./src/routes/aiRoutes');
const authRoutes = require('./src/routes/authRoutes');
const captionRoutes = require('./src/routes/captionRoutes'); // Tambahkan ini
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
const allowedOrigins = [
    'https://caption-jualan.vercel.app',
    'http://localhost:5173',
];

app.use(cors({
    origin: function (origin, callback) {
        // Izinkan request tanpa origin (seperti mobile apps atau curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'Kebijakan CORS untuk situs ini tidak mengizinkan akses dari origin yang ditentukan.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Middleware untuk memastikan DB terkoneksi (Serverless Friendly)
let isDbConnected = false;
app.use(async (req, res, next) => {
    if (!isDbConnected) {
        try {
            await connectDB();
            isDbConnected = true;
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }
    next();
});

// --- Register Routes ---
app.get('/', (req, res) => {
    res.json({ message: 'Caption Jualan API is running 🚀', });
});

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/captions', captionRoutes);

// Error Handler Global
app.use((err, req, res, next) => {
    console.error("❌ GLOBAL ERROR:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

// Jalankan server lokal hanya jika bukan di lingkungan Vercel
if (process.env.NODE_ENV !== 'production') {
    const startServer = async () => {
        try {
            await connectDB();
            await db.sequelize.sync({ alter: false });
            console.log('✅ Semua tabel Sequelize berhasil disinkronisasi.');

            // Manual fix for missing column if alter:true fails
            try {
                await db.sequelize.query('ALTER TABLE captions ADD COLUMN IF NOT EXISTS generated_image_url VARCHAR(255);');
                console.log('✅ Column generated_image_url checked/added.');
            } catch (err) {
                console.log('ℹ️ Column check skipped or already exists.');
            }

            // Jalankan sinkronisasi model AI dari OpenRouter secara otomatis
            console.log('🔄 Memulai sinkronisasi model AI dari OpenRouter...');
            const syncResult = await aiService.syncModelsFromApi();
            console.log(`✅ ${syncResult.message}: ${syncResult.total_synced} model.`);

            app.listen(PORT, () => {
                console.log(`🚀 Server is running on http://localhost:${PORT}`);
            });
        } catch (err) {
            console.error('❌ Gagal menjalankan server lokal:', err);
        }
    };
    startServer();
}

// Penting untuk Vercel
module.exports = app;
