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
    origin: 'http://localhost:5173', // URL frontend Anda
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// --- Register Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'Caption Jualan API is running 🚀' });
});

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/captions', captionRoutes);


const startServer = async () => {
  try {
    await connectDB();
    await db.sequelize.sync({ alter: true });
    console.log('✅ Semua tabel Sequelize berhasil disinkronisasi.');
    const syncResult = await aiService.syncModelsFromApi();
    console.log(`✅ ${syncResult.message} (${syncResult.total_synced || 0} model).`);

    // 4. Start HTTP Server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Gagal menjalankan server:', err);
    process.exit(1);
  }
};

// Eksekusi Server
startServer();
