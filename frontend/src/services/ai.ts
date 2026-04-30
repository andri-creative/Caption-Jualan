const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AIModel {
    _id: string;
    id: string;
    name: string;
    description: string;
    logo_url?: string;
}

export interface GenerationResponse {
    success: boolean;
    data?: {
        id: number;
        result_text: string;
        product_name: string;
    };
    message?: string;
}

/**
 * Mengambil daftar model AI dari database melalui backend
 */
export const getAIModels = async (): Promise<{ success: boolean; data: AIModel[] }> => {
    try {
        const response = await fetch(`${API_URL}/ai/models`, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        return { success: result.success, data: result.data || [] };
    } catch (error) {
        return { success: false, data: [] };
    }
};

/**
 * Generate Caption melalui backend
 */
export const generateCaption = async (productName: string, prompt: string, modelId: string): Promise<GenerationResponse> => {
    try {
        const response = await fetch(`${API_URL}/captions/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_name: productName,
                input_prompt: prompt,
                model_used: modelId
            }),
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Gagal generate caption. Silakan coba lagi.' };
    }
};
