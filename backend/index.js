require('dotenv').config();
const express = require('express');
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
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://caption-jualan.vercel.app/', 
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
  res.json({ message: 'Caption Jualan API is running 🚀' });
});

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/captions', captionRoutes);

// Jalankan server lokal hanya jika bukan di lingkungan Vercel
if (process.env.NODE_ENV !== 'production') {
    const startServer = async () => {
        try {
            await connectDB();
            await db.sequelize.sync({ alter: true });
            console.log('✅ Semua tabel Sequelize berhasil disinkronisasi.');
            
            // Sync models (opsional dijalankan otomatis di lokal)
            // const syncResult = await aiService.syncModelsFromApi();
            // console.log(`✅ ${syncResult.message}.`);

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
