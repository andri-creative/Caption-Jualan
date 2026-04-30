import { useState, useRef, useCallback } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

const FALLBACK_MESSAGES: Record<string, string> = {
    authentication_error: "Autentikasi gagal. Silakan refresh halaman.",
    rate_limit_error: "Terlalu banyak permintaan. Coba lagi nanti.",
    invalid_request_error: "Permintaan tidak valid. Silakan coba lagi.",
    overloaded_error: "Layanan sedang sibuk. Coba lagi nanti.",
    insufficient_credits: "Kredit AI habis. Hubungi administrator.",
    permission_error: "Fitur AI dinonaktifkan. Hubungi administrator.",
    api_error: "Layanan sementara tidak tersedia.",
};

function getErrorMessage(code: string, backendMessage: string): string {
    if (backendMessage) return backendMessage;
    return FALLBACK_MESSAGES[code] || "Layanan sementara tidak tersedia.";
}

const blocks = new Map<number, { type: "thinking" | "text"; content: string }>();

export function useCaptionGenerator() {
    const [resultText, setResultText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const generate = useCallback(async (namaProduk: string, inputPrompt: string) => {
        if (!namaProduk.trim() || !inputPrompt.trim()) return;

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        blocks.clear();

        setResultText("");
        setIsLoading(true);
        setError(null);

        try {
            await fetchEventSource(`${SUPABASE_URL}/functions/v1/caption-generator-c1bc72df8421`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                },
                body: JSON.stringify({ namaProduk, inputPrompt }),
                signal: abortControllerRef.current.signal,

                async onopen(response) {
                    const contentType = response.headers.get("content-type");

                    if (!response.ok) {
                        if (contentType?.includes("text/event-stream")) {
                            const text = await response.text();
                            const dataMatch = text.match(/data: (.+)/);
                            if (dataMatch) {
                                try {
                                    const errorData = JSON.parse(dataMatch[1]);
                                    const message = errorData.error?.message;
                                    if (message) throw new Error(message);
                                } catch (parseError) {
                                    if (parseError instanceof Error && parseError.message !== "Unexpected token") {
                                        throw parseError;
                                    }
                                }
                            }
                        }
                        if (contentType?.includes("application/json")) {
                            const errorData = await response.json();
                            throw new Error(errorData.error?.message || `Request failed: ${response.status}`);
                        }
                        throw new Error(`Request failed: ${response.status}`);
                    }

                    if (!contentType?.includes("text/event-stream")) {
                        throw new Error(`Expected text/event-stream, got: ${contentType}`);
                    }
                },

                onmessage(event) {
                    if (!event.data || event.data === "[DONE]") return;

                    let data: Record<string, unknown>;
                    try {
                        data = JSON.parse(event.data);
                    } catch {
                        return;
                    }

                    if (data.type === "error") {
                        const err = data.error as { type?: string; message?: string } | undefined;
                        const msg = getErrorMessage(err?.type || "api_error", err?.message || "");
                        setError(msg);
                        setIsLoading(false);
                        return;
                    }

                    switch (data.type) {
                        case "content_block_start": {
                            const cb = data.content_block as { type: "thinking" | "text" };
                            blocks.set(data.index as number, { type: cb.type, content: "" });
                            break;
                        }
                        case "content_block_delta": {
                            const block = blocks.get(data.index as number);
                            const delta = data.delta as { type?: string; text?: string; thinking?: string };
                            if (block?.type === "text") {
                                block.content += delta.text || "";
                                setResultText(block.content);
                            } else if (block?.type === "thinking") {
                                block.content += delta.thinking || "";
                            }
                            break;
                        }
                        case "message_stop":
                            setIsLoading(false);
                            break;
                    }
                },

                onerror(err) {
                    throw err;
                },
            });
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== "AbortError") {
                setError(err.message || "Gagal menghasilkan caption.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancel = useCallback(() => {
        abortControllerRef.current?.abort();
        setIsLoading(false);
    }, []);

    const reset = useCallback(() => {
        cancel();
        setResultText("");
        setError(null);
    }, [cancel]);

    return { resultText, isLoading, error, generate, cancel, reset };
}
