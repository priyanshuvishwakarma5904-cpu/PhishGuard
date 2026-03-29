import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield } from "lucide-react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Shield className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to analyze (e.g. https://example.com)"
          className="w-full bg-input border border-border rounded-lg py-3 sm:py-4 pl-10 sm:pl-12 pr-28 sm:pr-36 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-display font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-md flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:brightness-90 transition-all glow-primary"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Search className="w-4 h-4" />
            </motion.div>
          ) : (
            <Search className="w-4 h-4" />
          )}
          {isLoading ? "Scanning..." : "Scan URL"}
        </button>
      </div>
    </form>
  );
}
