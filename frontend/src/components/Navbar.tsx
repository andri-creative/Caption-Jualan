import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/LoginDialog";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src="/favicon-96x96.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                            <span className="font-bold text-lg text-foreground">
                                Caption<span className="text-primary"> Jualan</span> AI
                            </span>
                        </div>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#fitur" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Fitur
                            </a>
                            <a href="#generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Generator
                            </a>
                            <a href="#cara-pakai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Cara Pakai
                            </a>
                            <Button
                                size="sm"
                                className="gradient-hero text-primary-foreground border-0 shadow-md-custom hover:opacity-90 transition-opacity"
                                onClick={() => setLoginOpen(true)}
                            >
                                Login
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
                        <div className="px-4 py-3 space-y-3">
                            <a href="#fitur" className="block text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>
                                Fitur
                            </a>
                            <a href="#generator" className="block text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>
                                Generator
                            </a>
                            <a href="#cara-pakai" className="block text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>
                                Cara Pakai
                            </a>
                            <Button
                                size="sm"
                                className="w-full gradient-hero text-primary-foreground border-0"
                                onClick={() => { setLoginOpen(true); setMenuOpen(false); }}
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
        </>
    );
}
