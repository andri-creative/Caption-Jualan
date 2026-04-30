import {
    Sparkles,
    Zap,
    TrendingUp,
    Clock,
    ChevronRight,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CaptionGenerator from "@/components/CaptionGenerator";

import { FaInstagram, FaWhatsapp, FaTiktok, FaSquareFacebook } from "react-icons/fa6";

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
    { icon: FaInstagram, label: "Instagram" },
    { icon: FaWhatsapp, label: "WhatsApp" },
    { icon: FaTiktok, label: "TikTok" },
    { icon: FaSquareFacebook, label: "Facebook" },
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
        <div className="min-h-full bg-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-black">
                {/* Anime Background for Hero */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/anime-bg.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
                </div>

                {/* Background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-yellow-500/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl" />
                </div>

                <div className="relative z-50 max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-sm font-bold mb-6 border border-yellow-500/40 uppercase tracking-widest"
                        style={{ color: '#fbbf24 !important' }}
                    >
                        <Sparkles className="w-4 h-4" />
                        Strategic AI Unit · Premium Access
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-4xl md:text-7xl font-black leading-tight mb-6 italic uppercase tracking-tighter"
                        style={{ color: 'white !important' }}
                    >
                        Caption Jualan{" "}
                        <span
                            className="drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]"
                            style={{ color: '#fbbf24 !important' }}
                        >
                            Viral & Persuasif
                        </span>
                        <br />
                        dalam Detik
                    </h1>

                    <p
                        className="text-lg md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed font-black"
                        style={{ color: '#e5e7eb !important' }}
                    >
                        Buat caption jualan yang menarik, persuasif, dan siap viral untuk Instagram, TikTok, dan WhatsApp
                        — cukup masukkan nama produk dan klik generate.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                        <Button
                            size="lg"
                            onClick={scrollToGenerator}
                            className="bg-yellow-500 hover:bg-white text-black font-black border-4 border-black text-xl px-10 h-16 shadow-[8px_8px_0px_rgba(250,204,21,0.3)] transition-all transform hover:-translate-x-1 hover:-translate-y-1"
                        >
                            <Sparkles className="w-6 h-6 mr-2" />
                            START GENERATE
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={scrollToGenerator}
                            className="bg-transparent border-4 border-white text-white font-black text-xl px-10 h-16 hover:bg-white hover:text-black transition-all"
                        >
                            VIEW EXAMPLES <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    {/* Platform badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span className="text-sm text-yellow-400 font-black uppercase tracking-widest">Supports:</span>
                        {useCases.map((uc) => (
                            <div key={uc.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-black border-2 border-gray-800">
                                <uc.icon className="w-4 h-4 text-yellow-400" />
                                {uc.label.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="py-24 px-4 bg-zinc-950 border-y-4 border-black">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase italic">
                            Kenapa Pilih <span className="text-yellow-400">AI Marketer?</span>
                        </h2>
                        <p className="text-gray-300 text-xl max-w-2xl mx-auto font-medium">
                            Alat terlengkap untuk para pebisnis online yang ingin caption jualan lebih efektif dan tertarget.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-zinc-900 rounded-3xl p-8 border-4 border-black hover:border-yellow-500/50 transition-all duration-300 group shadow-2xl"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-yellow-500 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg">
                                    <feature.icon className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Generator Section */}
            <div id="generator">
                <CaptionGenerator />
            </div>

            {/* How to use */}
            <section id="cara-pakai" className="py-24 px-4 bg-black">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
                            EASY <span className="text-yellow-400">PHASE</span> SYSTEM
                        </h2>
                        <p className="text-gray-300 text-xl font-medium">
                            Tiga fase operasional untuk mendominasi pasar digital Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {steps.map((step, idx) => (
                            <div key={step.number} className="relative text-center group">
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-zinc-800" />
                                )}
                                <div className="relative inline-flex w-20 h-20 rounded-3xl bg-yellow-500 items-center justify-center text-black font-black text-3xl mb-8 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] group-hover:-translate-y-2 transition-transform">
                                    {step.number}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{step.title}</h3>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-20">
                        <Button
                            size="lg"
                            onClick={scrollToGenerator}
                            className="bg-yellow-500 hover:bg-white text-black font-black border-4 border-black px-12 h-20 text-2xl uppercase italic shadow-[10px_10px_0px_rgba(250,204,21,0.2)] transition-all"
                        >
                            <Sparkles className="w-8 h-8 mr-4" />
                            DEPLOY MISSION NOW
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t-4 border-zinc-900 bg-zinc-950 py-12 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <img src="/favicon-96x96.png" alt="Logo" className="w-10 h-10 rounded-xl" />
                        <span className="text-2xl font-black text-white uppercase tracking-tighter">
                            Caption<span className="text-yellow-400"> Jualan</span> AI
                        </span>
                    </div>
                    <p className="text-gray-500 font-bold">
                        &copy; {new Date().getFullYear()} Strategic Marketing AI. Built for Digital Dominance.
                    </p>
                </div>
            </footer>
        </div>
    );
}
