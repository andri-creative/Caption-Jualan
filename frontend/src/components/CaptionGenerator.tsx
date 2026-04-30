import { useEffect, useState } from "react";
import {
    Sparkles,
    Copy,
    RotateCcw,
    Loader2,
    Check,
    Zap,
    Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCaptionGenerator } from "@/hooks/useCaptionGenerator";
import { useToast } from "@/hooks/use-toast";
import * as aiService from "@/services/ai";

export default function CaptionGenerator() {
    const [namaProduk, setNamaProduk] = useState("");
    const [inputPrompt, setInputPrompt] = useState("");
    const [models, setModels] = useState<aiService.AIModel[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [copied, setCopied] = useState(false);
    const { resultText, isLoading, error, generate, reset } = useCaptionGenerator();
    const { toast } = useToast();

    const selectedModelData = models.find(m => m._id === selectedModel);

    useEffect(() => {
        const fetchModels = async () => {
            const result = await aiService.getAIModels();
            if (result.success) {
                setModels(result.data);
                if (result.data.length > 0) {
                    // Default ke model pertama (misal: gemini)
                    const defaultModel = result.data.find(m => m._id.includes('gemini')) || result.data[0];
                    setSelectedModel(defaultModel._id);
                }
            }
        };
        fetchModels();
    }, []);

    const handleGenerate = () => {
        if (!namaProduk.trim()) {
            toast({ title: "Nama produk kosong", description: "Masukkan nama produk terlebih dahulu.", variant: "destructive" });
            return;
        }
        if (!inputPrompt.trim()) {
            toast({ title: "Prompt kosong", description: "Masukkan deskripsi atau prompt untuk produk Anda.", variant: "destructive" });
            return;
        }
        if (!selectedModel) {
            toast({ title: "Model belum dipilih", description: "Silakan pilih model AI terlebih dahulu.", variant: "destructive" });
            return;
        }
        generate(namaProduk, inputPrompt, selectedModel);
    };

    const handleCopy = async () => {
        if (!resultText) return;
        try {
            await navigator.clipboard.writeText(resultText);
            setCopied(true);
            toast({ title: "Disalin!", description: "Caption berhasil disalin ke clipboard." });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast({ title: "Gagal menyalin", description: "Tidak dapat mengakses clipboard.", variant: "destructive" });
        }
    };

    const handleReset = () => {
        reset();
        setNamaProduk("");
        setInputPrompt("");
    };

    return (
        <section id="generator" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Generator Caption AI
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Buat Caption Jualan
                        <span className="text-primary"> Viral</span> dalam Detik
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Masukkan nama produk dan informasi singkat, AI kami akan buat 3 variasi caption jualan yang menarik.
                    </p>
                </div>

                {/* Generator card */}
                <div className="bg-card rounded-2xl border border-border shadow-md-custom overflow-hidden">
                    {/* Input section */}
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama Produk */}
                            <div className="space-y-2">
                                <Label htmlFor="namaProduk" className="text-sm font-semibold text-foreground">
                                    Nama Produk <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="namaProduk"
                                    placeholder="Contoh: Serum Vitamin C Brightening"
                                    value={namaProduk}
                                    onChange={(e) => setNamaProduk(e.target.value)}
                                    disabled={isLoading}
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">Nama produk yang ingin dibuatkan caption</p>
                            </div>

                            {/* Model AI */}
                            <div className="space-y-2">
                                <Label htmlFor="modelAi" className="text-sm font-semibold text-foreground">
                                    Model AI <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                                        {selectedModelData?.logo_url ? (
                                            <img 
                                                src={selectedModelData.logo_url} 
                                                alt="Logo" 
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <Cpu className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <select
                                        id="modelAi"
                                        className="flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={isLoading || models.length === 0}
                                    >
                                        {models.length === 0 ? (
                                            <option value="">Loading models...</option>
                                        ) : (
                                            models.map((model) => (
                                                <option key={model._id} value={model._id}>
                                                    {model.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Pilih otak AI yang akan membuatkan caption</p>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                            <p className="text-xs font-semibold text-primary mb-2">Tips Prompt Terbaik:</p>
                            <ul className="text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                <li>• Sebutkan target audiens (ibu rumah tangga, remaja, dll)</li>
                                <li>• Masukkan keunggulan utama produk</li>
                                <li>• Tentukan platform target (Instagram, TikTok, dll)</li>
                                <li>• Tambahkan promo atau harga jika ada</li>
                            </ul>
                        </div>

                        {/* Input Prompt */}
                        <div className="space-y-2">
                            <Label htmlFor="inputPrompt" className="text-sm font-semibold text-foreground">
                                Deskripsi / Prompt <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="inputPrompt"
                                placeholder="Contoh: Serum untuk mencerahkan kulit kusam, cocok untuk wanita 25-40 tahun, harga Rp 89.000, target Instagram, ada promo beli 2 gratis 1..."
                                value={inputPrompt}
                                onChange={(e) => setInputPrompt(e.target.value)}
                                disabled={isLoading}
                                className="min-h-[120px] resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Jelaskan target pembeli, keunggulan produk, platform, dan info lainnya
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleGenerate}
                                disabled={isLoading || !namaProduk.trim() || !inputPrompt.trim()}
                                className="flex-1 h-12 gradient-hero text-primary-foreground border-0 hover:opacity-90 transition-opacity text-sm font-semibold"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Caption...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4 mr-2" /> Generate Caption AI</>
                                )}
                            </Button>

                            {(resultText || error) && (
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    className="h-12 px-4"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Result section */}
                    {(resultText || isLoading) && (
                        <div className="border-t border-border">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <h3 className="text-sm font-semibold text-foreground">
                                            {isLoading ? "Sedang generate caption..." : "Hasil Caption AI"}
                                        </h3>
                                    </div>
                                    {resultText && !isLoading && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="h-8 gap-1.5 text-xs"
                                        >
                                            {copied ? (
                                                <><Check className="w-3.5 h-3.5 text-primary" /> Disalin!</>
                                            ) : (
                                                <><Copy className="w-3.5 h-3.5" /> Salin Semua</>
                                            )}
                                        </Button>
                                    )}
                                </div>

                                <div className="bg-muted/40 rounded-xl p-5 min-h-[120px] border border-border/50">
                                    {isLoading && !resultText ? (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            <span className="text-sm">AI sedang menulis caption jualan terbaik untuk Anda...</span>
                                        </div>
                                    ) : (
                                        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                                            {resultText}
                                            {isLoading && (
                                                <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                                            )}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="border-t border-destructive/20 bg-destructive/5 p-4 md:px-8">
                            <p className="text-sm text-destructive">
                                <span className="font-semibold">Error: </span>{error}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
