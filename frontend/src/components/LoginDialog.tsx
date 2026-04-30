import { useState } from "react";
import { Eye, EyeOff, Loader2, Sparkles, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import * as authService from "@/services/auth";

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Mode = "login" | "register";

// Google "G" SVG icon
function GoogleIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
    const [mode, setMode] = useState<Mode>("login");
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsLoading(true);
        try {
            if (mode === "login") {
                const result = await authService.login(email, password);
                if (!result.success) throw new Error(result.message);
                
                toast({ title: "Berhasil login!", description: "Selamat datang kembali." });
                onOpenChange(false);
                // Reload to refresh user state across app
                window.location.reload(); 
            } else {
                const result = await authService.register(email, password, nama);
                if (!result.success) throw new Error(result.message);
                
                toast({ title: "Akun berhasil dibuat!", description: "Silakan login dengan akun Anda." });
                setMode("login");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Terjadi kesalahan";
            toast({ title: "Error", description: message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            const result = await authService.getGoogleUrl();
            if (result.success && result.url) {
                // Buka popup untuk login Google
                const width = 500;
                const height = 600;
                const left = window.screen.width / 2 - width / 2;
                const top = window.screen.height / 2 - height / 2;
                const popup = window.open(
                    result.url,
                    'GoogleLogin',
                    `width=${width},height=${height},top=${top},left=${left}`
                );

                if (popup) {
                    // Dengarkan pesan sukses dari popup
                    const messageListener = (event: MessageEvent) => {
                        if (event.data?.type === 'GOOGLE_LOGIN_SUCCESS') {
                            window.removeEventListener('message', messageListener);
                            toast({ title: "Berhasil login dengan Google!", description: "Selamat datang kembali." });
                            onOpenChange(false);
                            window.location.reload();
                        }
                    };
                    window.addEventListener('message', messageListener);
                    
                    // Deteksi jika popup ditutup
                    const checkClosed = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(checkClosed);
                            setIsGoogleLoading(false);
                            window.removeEventListener('message', messageListener);
                        }
                    }, 500);
                } else {
                    // Fallback jika popup diblokir
                    window.location.href = result.url;
                }
            } else {
                throw new Error(result.message || "Gagal mendapatkan URL Google");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Terjadi kesalahan";
            toast({ title: "Error Google Login", description: message, variant: "destructive" });
            setIsGoogleLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === "login" ? "register" : "login");
        setNama("");
        setEmail("");
        setPassword("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md gradient-hero flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <DialogTitle className="text-lg">
                            {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {mode === "login"
                            ? "Masuk untuk mengakses semua fitur Caption Jualan AI."
                            : "Daftar gratis dan mulai buat caption jualan yang viral."}
                    </DialogDescription>
                </DialogHeader>

                {/* Google Button */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 gap-2 font-medium"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                >
                    {isGoogleLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <GoogleIcon />
                    )}
                    {mode === "login" ? "Masuk dengan Google" : "Daftar dengan Google"}
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">atau</span>
                    <Separator className="flex-1" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama — hanya di register */}
                    {mode === "register" && (
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="nama"
                                    type="text"
                                    placeholder="Nama lengkap Anda"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    required
                                    autoComplete="name"
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="contoh@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full gradient-hero text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
                        ) : (
                            mode === "login" ? "Masuk" : "Daftar Sekarang"
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                    <button
                        onClick={switchMode}
                        className="text-primary font-medium hover:underline"
                    >
                        {mode === "login" ? "Daftar gratis" : "Masuk"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
