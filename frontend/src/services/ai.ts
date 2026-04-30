const API_URL = "https://caption-backend.vercel.app/api";

export interface AIModel {
    id: string;
    name: string;
    description: string;
    logo_url?: string;
    architecture?: {
        modality: string;
        input_modalities?: string[];
        output_modalities?: string[];
    };
}

export interface GenerationResponse {
    success: boolean;
    data?: {
        id: number;
        result_text: string;
        product_name: string;
        image_url?: string;
        generated_image_url?: string;
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
export const generateCaption = async (productName: string, prompt: string, modelId: string, imageModel?: string, imageFile?: File): Promise<GenerationResponse> => {
    try {
        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('input_prompt', prompt);
        formData.append('model_used', modelId);

        if (imageModel) {
            formData.append('image_model', imageModel);
        }

        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch(`${API_URL}/captions/generate`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Gagal generate caption. Silakan coba lagi.' };
    }
};
