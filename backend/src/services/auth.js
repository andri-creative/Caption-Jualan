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
            redirectTo: 'https://caption-jualan.vercel.app/api/auth/callback',
            flowType: 'pkce', 
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        }
    });

    if (error) throw new Error(error.message);
    return data.url;
};

/**
 * Tukarkan CODE dari Google/Supabase menjadi Session
 */
const getSessionFromUrl = async (code) => {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw error;

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
    getSessionFromUrl,
    supabase
};
