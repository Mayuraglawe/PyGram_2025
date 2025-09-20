import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/use-theme";
import { Moon, Sun } from 'lucide-react';
import { useState } from "react";

function LogoImage() {
  const [ok, setOk] = useState(true);
  const src = "https://cdn.builder.io/api/v1/image/assets%2F2eee8cdc1a0849ce9573cd1f6b8b1470%2F532b6195227a44ac868676fe6e2f1685?format=webp&width=800";
  if (ok) {
    return (
      <img
        src={src}
        alt="Py-Gram logo"
        className="h-8 w-8 rounded-xl object-cover shadow-sm"
        onError={() => setOk(false)}
      />
    );
  }
  return <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-sm" />;
}

export default function PublicHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/signin" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <LogoImage />
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Py-Gram 2k25
            </span>
            <span className="text-xs text-muted-foreground font-medium">AI-Powered Timetables</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="rounded-xl h-10 w-10 hover:bg-accent/60"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button asChild className="rounded-xl font-medium gradient-primary hover:scale-105 transition-transform">
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}