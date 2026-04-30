const authService = require('../services/auth');

// Durasi cookie (misal: 7 hari)
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 
};

// Fungsi bantuan untuk menset cookie
const setTokensInCookies = (res, session) => {
    if (session) {
        res.cookie('access_token', session.access_token, COOKIE_OPTIONS);
        res.cookie('refresh_token', session.refresh_token, COOKIE_OPTIONS);
    }
};

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.registerWithEmail(email, password, name);
        
        setTokensInCookies(res, result.session);

        return res.status(201).json({ success: true, user: result.user });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginWithEmail(email, password);
        
        setTokensInCookies(res, result.session);

        return res.status(200).json({ success: true, user: result.user });
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(200).json({ success: true, message: "Anda telah berhasil keluar dari sistem." });
};

const getGoogleLoginUrl = async (req, res) => {
    try {
        const url = await authService.getGoogleOAuthUrl();
        return res.status(200).json({ success: true, url });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getMe = async (req, res) => {
    // req.user sudah di-set oleh authMiddleware
    return res.status(200).json({ success: true, user: req.user });
};

const googleCallback = async (req, res) => {
    try {
        // Supabase biasanya mengirim token via hash fragment (#), 
        // tapi jika kita pakai server-side, kita tangkap dari query params jika ada
        const { access_token, refresh_token } = req.query;

        if (!access_token) {
            return res.status(400).send("Proses login Google tidak dapat dilanjutkan. Silakan coba beberapa saat lagi.");
        }

        const result = await authService.getSessionFromUrl(access_token, refresh_token);
        
        setTokensInCookies(res, result.session);

        // Setelah sukses, arahkan user kembali ke Home atau Dashboard frontend
        return res.redirect('http://localhost:5173'); // Sesuaikan dengan URL frontend Anda
    } catch (error) {
        return res.status(500).send("Terjadi kesalahan saat memproses otentikasi Google.");
    }
};

module.exports = {
    register,
    login,
    logout,
    getGoogleLoginUrl,
    getMe,
    googleCallback
};
