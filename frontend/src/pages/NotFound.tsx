import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary/10 select-none">404</h1>
          <p className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-foreground">
            Halaman Tidak Ditemukan
          </p>
        </div>
        
        <p className="text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>

        <Button asChild className="gap-2">
          <a href="/">
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
