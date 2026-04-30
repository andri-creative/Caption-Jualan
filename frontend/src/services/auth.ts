const API_URL = "https://caption-backend.vercel.app/api";

export interface User {
    id: string;
    name: string;
    email: string;
    provider: string;
    provider_id: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    message?: string;
    url?: string;
}

/**
 * Login dengan Email & Password
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // Penting untuk mengirim/menerima cookies
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Gagal menghubungi server' };
    }
};

/**
 * Register Akun Baru
 */
export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Gagal menghubungi server' };
    }
};

/**
 * Logout
 */
export const logout = async (): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Gagal logout' };
    }
};

/**
 * Cek Sesi User Aktif (Get Me)
 */
export const getMe = async (): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Sesi tidak ditemukan' };
    }
};

/**
 * Dapatkan URL Login Google
 */
export const getGoogleUrl = async (): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/auth/google`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Gagal mendapatkan URL Google' };
    }
};
