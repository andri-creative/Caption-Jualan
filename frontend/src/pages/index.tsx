import {
    Sparkles,
    Zap,
    TrendingUp,
    Clock,
    ChevronRight,
    Camera,
    MessageSquare,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CaptionGenerator from "@/components/CaptionGenerator";

const features = [
    {
        icon: Zap,
        title: "Generate Instan",
        desc: "Buat caption jualan dalam hitungan detik, bukan jam. Hemat waktu, fokus jualan.",
    },
    {
        icon: TrendingUp,
        title: "Terbukti Viral",
        desc: "Caption dioptimalkan dengan formula copywriting terbukti yang meningkatkan konversi.",
    },
    {
        icon: MessageSquare,
        title: "3 Variasi Gaya",
        desc: "Dapatkan 3 variasi caption sekaligus: energik, profesional, dan storytelling.",
    },
    {
        icon: Clock,
        title: "Hemat Waktu 90%",
        desc: "Dari 30 menit nulis caption menjadi hanya 10 detik. Lebih banyak waktu untuk jualan.",
    },
];

const useCases = [
    { icon: Camera, label: "Instagram" },
    { icon: MessageSquare, label: "WhatsApp" },
    { icon: Star, label: "TikTok" },
    { icon: Sparkles, label: "Facebook" },
];

const steps = [
    { number: "01", title: "Masukkan Nama Produk", desc: "Ketik nama produk yang ingin Anda jualkan." },
    { number: "02", title: "Isi Deskripsi Produk", desc: "Ceritakan target pembeli, keunggulan produk, dan platform target." },
    { number: "03", title: "Klik Generate", desc: "Dalam detik, dapatkan 3 variasi caption jualan yang siap pakai." },
];

export default function Index() {
    const scrollToGenerator = () => {
        document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-full bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                        <Sparkles className="w-4 h-4" />
                        Powered by Claude AI · Gratis Digunakan
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
                        Caption Jualan{" "}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "var(--gradient-shine)" }}
                        >
                            Viral & Persuasif
                        </span>
                        <br />
                        dalam Hitungan Detik
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                        Buat caption jualan yang menarik, persuasif, dan siap viral untuk Instagram, TikTok, dan WhatsApp
                        — cukup masukkan nama produk dan klik generate.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
                        <Button
                            size="lg"
                            onClick={scrollToGenerator}
                            className="gradient-hero text-primary-foreground border-0 hover:opacity-90 transition-opacity text-base px-8 h-12 shadow-glow"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Coba Gratis Sekarang
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={scrollToGenerator}
                            className="text-base px-8 h-12 gap-2"
                        >
                            Lihat Contoh Caption <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Platform badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="text-xs text-muted-foreground">Cocok untuk:</span>
                        {useCases.map((uc) => (
                            <div key={uc.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                                <uc.icon className="w-3.5 h-3.5" />
                                {uc.label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="py-20 px-4 bg-secondary/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Kenapa Pilih Caption Jualan AI?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Alat terlengkap untuk para pebisnis online yang ingin caption jualan lebih efektif.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-md-custom transition-all duration-300 group"
                            >
                                <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Generator Section */}
            <CaptionGenerator />

            {/* How to use */}
            <section id="cara-pakai" className="py-20 px-4 bg-secondary/20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Cara Pakai yang Mudah
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            3 langkah mudah untuk caption jualan yang viral
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => (
                            <div key={step.number} className="relative text-center">
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-border" />
                                )}
                                <div className="relative inline-flex w-12 h-12 rounded-full gradient-hero items-center justify-center text-primary-foreground font-bold text-lg mb-4 shadow-glow">
                                    {step.number}
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button
                            size="lg"
                            onClick={scrollToGenerator}
                            className="gradient-hero text-primary-foreground border-0 hover:opacity-90 transition-opacity px-8 h-12 shadow-glow"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Mulai Generate Caption Gratis
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/favicon-96x96.png" alt="Logo" className="w-6 h-6 rounded-md" />
                        <span className="text-sm font-semibold text-foreground">
                            Caption<span className="text-primary"> Jualan</span> AI
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Caption Jualan AI. Dibuat dengan AI untuk pebisnis Indonesia.
                    </p>
                </div>
            </footer>
        </div>
    );
}
