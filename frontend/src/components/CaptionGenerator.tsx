import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Loader2,
    Sparkles,
    Copy,
    Check,
    RotateCcw,
    Image as ImageIcon,
    X,
    MessageSquare,
    Zap
} from "lucide-react";
import { useCaptionGenerator } from "@/hooks/useCaptionGenerator";
import { useToast } from "@/hooks/use-toast";
import * as aiService from "@/services/ai";
import Editor from 'react-simple-wysiwyg';

export default function CaptionGenerator() {
    const [productName, setProductName] = useState("");
    const [inputPrompt, setInputPrompt] = useState("");
    const [models, setModels] = useState<aiService.AIModel[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedImageModel] = useState("openai/dall-e-3");
    const [copied, setCopied] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { resultText, generatedImageUrl, setResultText, isLoading, isGeneratingImage, error, generate, reset } = useCaptionGenerator();
    const { toast } = useToast();

    useEffect(() => {
        const fetchModels = async () => {
            const result = await aiService.getAIModels();
            if (result.success) {
                // Filter models based on modalities from API
                const allModels = result.data;
                
                // Identify text/vision models (Input Core)
                const txtModels = allModels.filter(m => 
                    m.architecture?.input_modalities?.includes('text') || 
                    !m.architecture?.output_modalities?.includes('image')
                );

                // Identify vision models (input includes 'image')
                const visionModels = txtModels.filter(m => 
                    m.architecture?.input_modalities?.includes('image')
                );

                setModels(txtModels);

                if (txtModels.length > 0) {
                    // Default to first vision model or first available model
                    const defaultTxt = visionModels[0] || txtModels[0];
                    setSelectedModel(defaultTxt.id);
                }
            }
        };
        fetchModels();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Maximum image size is 5MB.",
                    variant: "destructive"
                });
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleGenerate = async () => {
        if (!productName || !selectedModel) {
            toast({
                title: "Missing Information",
                description: "Please enter product name and select an AI model.",
                variant: "destructive"
            });
            return;
        }

        // Cek apakah model mendukung vision jika ada gambar
        const currentModel = models.find(m => m.id === selectedModel);
        const modelId = currentModel?.id.toLowerCase() || "";
        const modelName = currentModel?.name.toLowerCase() || "";
        
        const supportsVision = currentModel?.architecture?.input_modalities?.includes('image') || 
                               modelName.includes('vision') ||
                               modelId.includes('vision') ||
                               modelId.includes('gemini') ||
                               modelId.includes('gpt-4o') ||
                               modelId.includes('claude-3-5') ||
                               modelId.includes('claude-3-opus') ||
                               modelId.includes('pixtral');

        if (imageFile && !supportsVision) {
            toast({
                title: "Model Mismatch",
                description: "Model yang Anda pilih tidak mendukung analisis gambar. Silakan pilih model dengan label [VISION].",
                variant: "destructive"
            });
            return;
        }

        await generate(productName, inputPrompt, selectedModel, selectedImageModel, imageFile || undefined);
    };

    const handleCopy = () => {
        if (!resultText) return;
        const plainText = resultText.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(plainText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Copied!",
            description: "Caption copied to clipboard.",
        });
    };

    const handleReset = () => {
        setProductName("");
        setInputPrompt("");
        setImageFile(null);
        setImagePreview(null);
        reset();
    };

    return (
        <section className="relative min-h-screen text-white py-12 px-4 md:py-20 font-sans overflow-hidden">
            {/* Anime Background - Changed from fixed to absolute to prevent covering hero */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/anime-bg.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-30 scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/95 via-[#0a0a0a]/85 to-[#0a0a0a]/98"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left Column: AI Character & Narrative */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-end space-y-8 lg:sticky lg:top-24">
                    <div className="relative group">
                        {/* Anime Aura Glow */}
                        <div className="absolute -inset-4 bg-linear-to-r from-[#D4AF37] to-[#FFD700] rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>

                        <div className="relative w-56 h-56 md:w-80 md:h-80 rounded-4xl overflow-hidden border-4 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)] -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="/ai-character.png"
                                alt="AI Assistant"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-size-[100%_4px] bg-[linear-gradient(transparent_0%,rgba(212,175,55,0.15)_50%,transparent_100%)] pointer-events-none"></div>
                        </div>

                        {/* Manga Style Speech Bubble */}
                        <div className="absolute -top-16 lg:-right-12 bg-white text-black p-6 rounded-4xl rounded-bl-none shadow-[10px_10px_0px_rgba(0,0,0,1)] min-w-[250px] animate-bounce-subtle border-4 border-black">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-6 h-6 text-[#D4AF37] mt-1 shrink-0" />
                                <p className="text-sm md:text-base font-black italic uppercase tracking-tight leading-tight">
                                    {isLoading
                                        ? "System core active... Synchronizing data!"
                                        : "Ready for orders! Let's build your brand empire!"}
                                </p>
                            </div>
                            <div className="absolute -bottom-4 left-0 w-8 h-8 bg-white border-l-4 border-b-4 border-black transform rotate-45"></div>
                        </div>
                    </div>

                    <div className="text-center lg:text-right space-y-4">
                        <div className="inline-block bg-[#D4AF37] text-black px-4 py-1 font-black -skew-x-12 mb-2 uppercase italic text-sm border-2 border-black">
                            S-Rank Strategic Agent
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none italic uppercase">
                            AI <span className="text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">VIRTUAL</span><br />MARKETER
                        </h2>
                        <p className="text-base text-white font-bold max-w-sm ml-auto bg-black/80 p-5 rounded-2xl border-r-8 border-[#D4AF37] backdrop-blur-md shadow-2xl">
                            Deploy high-frequency intelligence to dominate your sales niche with ease.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-8 w-full">
                    <div className="bg-[#1a1a1a]/95 rounded-[3rem] border-4 border-black shadow-[20px_20px_0px_rgba(212,175,55,0.3)] overflow-hidden backdrop-blur-2xl">
                        <div className="p-8 md:p-12 space-y-10">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Product Name */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-black text-[#FFD700] uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">
                                        <div className="w-3 h-3 bg-[#D4AF37] rotate-45"></div> Product Name
                                    </Label>
                                    <Input
                                        placeholder="Type product name here..."
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="bg-black border-2 border-gray-700 focus:border-[#D4AF37] text-white h-14 rounded-xl text-lg font-black placeholder:text-gray-500 transition-all focus:ring-0"
                                    />
                                </div>

                                {/* AI Intelligence Core */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-black text-[#FFD700] uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">
                                        <div className="w-3 h-3 bg-[#D4AF37] rotate-45"></div> AI Intelligence
                                    </Label>
                                    <select 
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="w-full h-14 px-4 bg-black border-2 border-gray-700 rounded-xl text-white font-black text-lg focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer hover:bg-gray-900 shadow-inner"
                                    >
                                        {models.map((model) => {
                                            const isVision = model.architecture?.input_modalities?.includes('image');
                                            return (
                                                <option key={model.id} value={model.id} className="bg-black py-2 text-white">
                                                    {model.name.toUpperCase()} {isVision ? '⚡ [VISION]' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Target Platform (Disabled/Static) */}
                                <div className="space-y-3 opacity-50 cursor-not-allowed">
                                    <Label className="text-sm font-black text-[#FFD700] uppercase tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-3 h-3 bg-gray-600 rotate-45"></div> Target Platform
                                    </Label>
                                    <div className="flex gap-2 h-14 items-center bg-gray-900 border-2 border-gray-800 rounded-xl px-4 text-gray-500 font-bold uppercase italic text-xs">
                                        Optimization Enabled
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload Area */}
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-[#FFD700] uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">
                                    <div className="w-3 h-3 bg-[#D4AF37] rotate-45"></div> Visual Analysis Scan
                                </Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative h-60 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden ${imagePreview
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                                            : 'border-gray-700 hover:border-[#D4AF37] hover:bg-black shadow-2xl'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    {imagePreview ? (
                                        <div className="relative w-full h-full p-4">
                                            <img src={imagePreview} className="w-full h-full object-contain rounded-3xl" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <p className="bg-[#D4AF37] text-black px-6 py-2 font-black text-sm uppercase tracking-[0.2em] border-2 border-black">Update Visual Data</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                className="absolute top-8 right-8 p-3 bg-black border-4 border-red-500 rounded-full text-red-500 hover:bg-red-500 hover:text-black transition-all transform hover:scale-125 z-20 shadow-2xl"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-8 rounded-full bg-gray-900 border-2 border-gray-800 mb-4 group-hover:scale-110 group-hover:border-[#D4AF37] transition-all duration-500 shadow-2xl">
                                                <ImageIcon className="w-12 h-12 text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                            </div>
                                            <p className="text-xl text-white font-black uppercase italic tracking-tighter">Initialize Data Scan</p>
                                            <p className="text-xs text-[#D4AF37] mt-2 font-black uppercase tracking-widest">Click to upload file</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Description Editor */}
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-[#FFD700] uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">
                                    <div className="w-3 h-3 bg-[#D4AF37] rotate-45"></div> Strategic Context
                                </Label>
                                <Textarea
                                    placeholder="Enter promotional details, features, or target audience..."
                                    value={inputPrompt}
                                    onChange={(e) => setInputPrompt(e.target.value)}
                                    className="bg-black border-2 border-gray-700 focus:border-[#D4AF37] text-white min-h-[160px] rounded-2xl resize-none p-6 font-bold text-lg placeholder:text-gray-500 transition-all"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8 pt-4">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="flex-1 h-20 text-2xl font-black uppercase italic bg-[#D4AF37] hover:bg-white text-black shadow-[10px_10px_0px_rgba(0,0,0,1)] border-4 border-black rounded-3xl transform transition-all hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-8 h-8 mr-4 animate-spin" /> Synchronizing...</>
                                    ) : (
                                        <><Zap className="w-8 h-8 mr-4 fill-current" /> Execute Script</>
                                    )}
                                </Button>
                                {(resultText || error) && (
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        className="h-20 px-10 border-4 border-black bg-gray-900 hover:bg-red-500 hover:text-black text-white rounded-3xl shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all font-black text-xl"
                                    >
                                        <RotateCcw className="w-8 h-8" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Result Display */}
                        {(resultText || isLoading) && (
                            <div className="bg-[#D4AF37] p-8 md:p-14 border-t-8 border-black">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-6 h-6 bg-black animate-ping" />
                                        <h3 className="text-3xl font-black text-black italic uppercase tracking-tighter">
                                            {isLoading ? "Drafting Result..." : "Generated Output"}
                                        </h3>
                                    </div>
                                    {resultText && !isLoading && (
                                        <Button
                                            onClick={handleCopy}
                                            className="w-full md:w-auto gap-4 bg-black hover:bg-white hover:text-black text-white font-black uppercase italic tracking-widest px-8 h-14 rounded-2xl border-4 border-black transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.2)]"
                                        >
                                            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                            {copied ? "Copied" : "Copy Result"}
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                    {/* Caption Editor */}
                                    <div className="bg-white rounded-[2.5rem] overflow-hidden border-4 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.15)] flex flex-col">
                                        <div className="bg-gray-100 px-6 py-4 border-b-4 border-black font-black uppercase italic tracking-widest text-sm flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" /> Marketing Copy
                                        </div>
                                        {isLoading && !resultText ? (
                                            <div className="flex-1 p-20 flex flex-col items-center justify-center text-center space-y-8">
                                                <Sparkles className="w-16 h-16 text-[#D4AF37] animate-spin-slow" />
                                                <p className="text-black font-black text-xl italic uppercase tracking-wider">Drafting...</p>
                                            </div>
                                        ) : (
                                            <Editor
                                                value={resultText}
                                                onChange={(e) => setResultText(e.target.value)}
                                                className="min-h-[400px]"
                                            />
                                        )}
                                    </div>

                                    {/* Generated Image Display */}
                                    <div className="bg-white rounded-[2.5rem] overflow-hidden border-4 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.15)] flex flex-col">
                                        <div className="bg-gray-100 px-6 py-4 border-b-4 border-black font-black uppercase italic tracking-widest text-sm flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> AI Generated Visual
                                        </div>
                                        <div className="flex-1 relative bg-black min-h-[400px] flex items-center justify-center group">
                                            {isGeneratingImage ? (
                                                <div className="flex flex-col items-center space-y-6">
                                                    <div className="w-20 h-20 border-8 border-t-[#D4AF37] border-gray-800 rounded-full animate-spin"></div>
                                                    <p className="text-[#D4AF37] font-black uppercase italic tracking-[0.3em] animate-pulse">Rendering Visual...</p>
                                                </div>
                                            ) : generatedImageUrl ? (
                                                <>
                                                    <img
                                                        src={generatedImageUrl}
                                                        alt="AI Generated Marketing"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                                        <a
                                                            href={generatedImageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-[#D4AF37] text-black px-8 py-3 font-black uppercase italic border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-white transition-all transform hover:-translate-y-1"
                                                        >
                                                            Open HD Version
                                                        </a>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-10">
                                                    <Sparkles className="w-20 h-20 text-gray-800 mx-auto mb-6" />
                                                    <p className="text-gray-600 font-black uppercase italic text-lg">Visual output will appear here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0) rotate(-2deg); }
                    50% { transform: translateY(-12px) rotate(1deg); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 4s ease-in-out infinite;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
                .rsw-editor {
                    border: none !important;
                    background: white !important;
                    color: black !important;
                }
                .rsw-toolbar {
                    background: #f9fafb !important;
                    border-bottom: 4px solid black !important;
                    padding: 1.25rem !important;
                }
                .rsw-btn {
                    color: black !important;
                    border: 2px solid transparent !important;
                    width: 38px !important;
                    height: 38px !important;
                }
                .rsw-btn:hover {
                    background: #D4AF37 !important;
                    border: 2px solid black !important;
                    transform: scale(1.1);
                }
                .rsw-btn[data-active="true"] {
                    background: #D4AF37 !important;
                    border: 2px solid black !important;
                }
                .rsw-content {
                    padding: 3rem !important;
                    line-height: 2 !important;
                    font-weight: 600 !important;
                    font-size: 1.25rem !important;
                    color: #1a1a1a !important;
                }
                /* Scrollbar */
                ::-webkit-scrollbar { width: 14px; }
                ::-webkit-scrollbar-track { background: #0a0a0a; }
                ::-webkit-scrollbar-thumb { 
                    background: #D4AF37; 
                    border: 4px solid #0a0a0a;
                    border-radius: 20px;
                }
                ::-webkit-scrollbar-thumb:hover { background: #white; }
                
                ::placeholder {
                    color: #6b7280 !important;
                    opacity: 1 !important;
                }
            `}} />
        </section>
    );
}
