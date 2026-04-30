import { useEffect, useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/LoginDialog";
import * as authService from "@/services/auth";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [user, setUser] = useState<authService.User | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const result = await authService.getMe();
            if (result.success && result.user) {
                setUser(result.user);
            }
        };
        checkUser();
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        setUser(null);
        window.location.reload();
    };

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
                            
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                                        <User className="w-4 h-4" />
                                        {user.name}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Keluar
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    className="gradient-hero text-primary-foreground border-0 shadow-md-custom hover:opacity-90 transition-opacity"
                                    onClick={() => setLoginOpen(true)}
                                >
                                    Login
                                </Button>
                            )}
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
                            
                            {user ? (
                                <div className="pt-2 border-t border-border">
                                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground mb-2">
                                        <User className="w-4 h-4" />
                                        {user.name}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start text-muted-foreground hover:text-destructive"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Keluar
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    className="w-full gradient-hero text-primary-foreground border-0"
                                    onClick={() => { setLoginOpen(true); setMenuOpen(false); }}
                                >
                                    Login
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
        </>
    );
}
