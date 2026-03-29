import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Github, Terminal } from "lucide-react";
import { UrlInput } from "@/components/UrlInput";
import { ResultCard } from "@/components/ResultCard";
import { ScanHistory, type HistoryEntry } from "@/components/ScanHistory";
import { SampleUrls } from "@/components/SampleUrls";
import { analyzeUrl, type DetectionResult } from "@/lib/phishing-detector";

const Index = () => {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleScan = useCallback(async (url: string) => {
    setIsLoading(true);
    setResult(null);
    setCurrentUrl(url);

    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 1200));

    const detection = analyzeUrl(url);
    setResult(detection);
    setIsLoading(false);

    setHistory((prev) => [
      { url, status: detection.status, score: detection.score, timestamp: new Date() },
      ...prev.slice(0, 9),
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background scanline relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(160 100% 45%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 100% 45%) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              <div>
                <h1 className="text-base sm:text-lg font-bold font-display text-foreground">
                  PhishGuard
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                  URL Threat Analyzer v1.0
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Terminal className="w-4 h-4" />
              <span>Rule-Based Engine</span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-display text-foreground mb-3 text-glow">
              Advanced Phishing URL Analyzer
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto px-2">
              Enter a URL to check whether it is Safe, Suspicious, or Phishing based on security indicators like HTTPS, domain structure, and suspicious keywords.
            </p>
          </motion.div>

          {/* Input */}
          <UrlInput onSubmit={handleScan} isLoading={isLoading} />

          {/* Sample URLs */}
          {!result && !isLoading && <SampleUrls onSelect={handleScan} />}

          {/* Loading Animation */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center mt-12 gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Shield className="w-12 h-12 text-primary" />
              </motion.div>
              <div className="font-mono text-sm text-muted-foreground">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Analyzing URL patterns...
                </motion.span>
              </div>
            </motion.div>
          )}

          {/* Result */}
          {result && !isLoading && (
            <div className="mt-8">
              <ResultCard result={result} url={currentUrl} />
            </div>
          )}

          {/* History */}
          <ScanHistory
            history={history}
            onSelect={handleScan}
            onDeleteOne={(index) => setHistory((prev) => prev.filter((_, i) => i !== index))}
            onClearAll={() => setHistory([])}
          />
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-12 sm:mt-20 py-4 sm:py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-[10px] sm:text-xs text-muted-foreground font-mono">
            PhishGuard – Cybersecurity URL Detection Tool | Academic Project
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
