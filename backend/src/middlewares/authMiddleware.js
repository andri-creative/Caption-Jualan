const supabase = require('../../config/supabaseClient');
const { User } = require('../models');

const requireAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            return res.status(401).json({ success: false, message: "Akses ditolak. Tidak ada token (Silakan login)" });
        }

        // Verifikasi token menggunakan Supabase
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error || !user) {
            return res.status(401).json({ success: false, message: "Token tidak valid atau kadaluarsa" });
        }

        // Cari atau Buat user di database lokal agar ID-nya valid untuk tabel Captions
        let localUser = await User.findOne({ where: { email: user.email } });
        
        if (!localUser) {
            localUser = await User.create({
                name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
                email: user.email,
                provider: user.app_metadata?.provider || 'email',
                provider_id: user.id
            });
        }
        
        req.user = localUser; 
        
        next();
    } catch (error) {
        console.error("Middleware Error:", error);
        return res.status(500).json({ success: false, message: "Kesalahan server pada autentikasi" });
    }
};

module.exports = { requireAuth };
