import { useState, useCallback } from "react";
import * as aiService from "@/services/ai";

export function useCaptionGenerator() {
    const [resultText, setResultText] = useState("");
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback(async (productName: string, inputPrompt: string, modelId: string, imageModel?: string, imageFile?: File) => {
        if (!productName.trim() || !modelId) {
            setError("Product name and Model are required.");
            return;
        }

        setResultText("");
        setGeneratedImageUrl(null);
        setIsLoading(true);
        setIsGeneratingImage(true);
        setError(null);

        try {
            const result = await aiService.generateCaption(productName, inputPrompt, modelId, imageModel, imageFile);
            
            if (result.success && result.data) {
                setResultText(result.data.result_text);
                if (result.data.generated_image_url) {
                    setGeneratedImageUrl(result.data.generated_image_url);
                } else {
                    console.warn("⚠️ Caption generated, but image failed.");
                }
            } else {
                console.error("❌ Generate Error Response:", result);
                setError(result.message || 'Failed to generate caption. Check console for details.');
            }
        } catch (err: unknown) {
            console.error("❌ Generate Connection Error:", err);
            const message = err instanceof Error ? err.message : "Gagal menghasilkan caption.";
            setError(message);
        } finally {
            setIsLoading(false);
            setIsGeneratingImage(false);
        }
    }, []);

    const reset = useCallback(() => {
        setResultText("");
        setGeneratedImageUrl(null);
        setError(null);
        setIsLoading(false);
        setIsGeneratingImage(false);
    }, []);

    return { 
        resultText, 
        generatedImageUrl, 
        setResultText, 
        isLoading, 
        isGeneratingImage, 
        error, 
        generate, 
        reset 
    };
}
