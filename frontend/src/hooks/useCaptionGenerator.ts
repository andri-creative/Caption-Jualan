import { useState, useCallback } from "react";
import * as aiService from "@/services/ai";

export function useCaptionGenerator() {
    const [resultText, setResultText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback(async (namaProduk: string, inputPrompt: string, modelId: string) => {
        if (!namaProduk.trim() || !inputPrompt.trim() || !modelId) return;

        setResultText("");
        setIsLoading(true);
        setError(null);

        try {
            const result = await aiService.generateCaption(namaProduk, inputPrompt, modelId);
            
            if (result.success && result.data) {
                setResultText(result.data.result_text);
            } else {
                throw new Error(result.message || "Gagal generate caption");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Gagal menghasilkan caption.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setResultText("");
        setError(null);
    }, []);

    return { resultText, setResultText, isLoading, error, generate, reset };
}
