const authService = require('../services/auth');

// Durasi cookie (misal: 7 hari)
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true, // Must be true for sameSite: 'none'
    sameSite: 'none',
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
        const { code, access_token, refresh_token } = req.query;

        // Jembatan (Bridge) untuk menangkap fragment (#) dan mengubahnya jadi query (?)
        // Jika tidak ada code atau access_token di query, kirim script untuk cek di fragment (#)
        if (!code && !access_token) {
            return res.send(`
                <html>
                    <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
                        <div style="text-align: center;">
                            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite; margin: 0 auto 20px;"></div>
                            <p>Menyelesaikan autentikasi, mohon tunggu...</p>
                        </div>
                        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                        <script>
                            const hash = window.location.hash;
                            if (hash) {
                                // Ambil params dari fragment (#) dan pindahkan ke query (?)
                                const searchParams = new URLSearchParams(hash.substring(1));
                                if (searchParams.has('access_token')) {
                                    window.location.href = window.location.pathname + '?' + hash.substring(1);
                                } else {
                                    document.body.innerHTML = 'Gagal autentikasi: Fragment tidak valid.';
                                }
                            } else {
                                document.body.innerHTML = 'Proses login tidak dapat dilanjutkan: Data tidak ditemukan.';
                            }
                        </script>
                    </body>
                </html>
            `);
        }

        let result;
        if (code) {
            // Jika menggunakan alur PKCE (Code)
            result = await authService.getSessionFromUrl(code);
        } else {
            // Jika menggunakan alur Implicit (Access Token)
            const { data, error } = await authService.supabase.auth.setSession({
                access_token,
                refresh_token
            });
            if (error) throw error;
            result = { session: data.session, user: data.user };
        }

        setTokensInCookies(res, result.session);

        // Setelah sukses, beri tahu opener bahwa login berhasil menggunakan BroadcastChannel
        const frontendUrl = "https://caption-jualan.vercel.app";
        return res.send(`
            <html>
                <body>
                    <script>
                        try {
                            const channel = new BroadcastChannel("popup-channel");
                            channel.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' });
                            setTimeout(() => { window.close(); }, 100);
                        } catch(e) {
                            if (window.opener) {
                                window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' }, '*');
                                window.close();
                            } else {
                                window.location.href = '${frontendUrl}';
                            }
                        }
                    </script>
                </body>
            </html>
        `);
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
