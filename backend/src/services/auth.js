const supabase = require('../../config/supabaseClient');
const { User } = require('../models');

// 1. Register dengan Email & Password
const registerWithEmail = async (email, password, name) => {
    // Daftar ke Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    if (error) throw new Error(error.message);

    // Simpan ke database lokal (PostgreSQL)
    const newUser = await User.create({
        name: name || 'User',
        email,
        provider: 'email',
        provider_id: data.user.id
    });

    return { user: newUser, session: data.session };
};

// 2. Login dengan Email & Password
const loginWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw new Error(error.message);

    // Cek user di DB lokal
    let user = await User.findOne({ where: { email } });
    if (!user) {
        user = await User.create({
            name: data.user.user_metadata?.name || 'User',
            email,
            provider: 'email',
            provider_id: data.user.id
        });
    }

    return { user, session: data.session };
};

// 3. Mendapatkan URL Google OAuth
const getGoogleOAuthUrl = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // URL setelah login Google sukses (harus didaftarkan di Supabase Dashboard)
            redirectTo: 'http://localhost:3000/api/auth/callback' 
        }
    });

    if (error) throw new Error(error.message);
    return data.url;
};

// 4. Proses Callback setelah Login Google (Menangkap session)
const getSessionFromUrl = async (accessToken, refreshToken) => {
    const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    if (error) throw new Error(error.message);

    // Sinkronisasi data user Google ke database lokal kita
    let user = await User.findOne({ where: { email: data.user.email } });
    if (!user) {
        user = await User.create({
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'Google User',
            email: data.user.email,
            provider: 'google',
            provider_id: data.user.id
        });
    }

    return { user, session: data.session };
};

module.exports = {
    registerWithEmail,
    loginWithEmail,
    getGoogleOAuthUrl,
    getSessionFromUrl
};
