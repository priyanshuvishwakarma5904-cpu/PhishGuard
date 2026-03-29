import { SAMPLE_URLS } from "@/lib/phishing-detector";

interface SampleUrlsProps {
  onSelect: (url: string) => void;
}

export function SampleUrls({ onSelect }: SampleUrlsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
        Try sample URLs:
      </p>
      <div className="flex flex-wrap gap-2">
        {[...SAMPLE_URLS.safe.slice(0, 1), ...SAMPLE_URLS.suspicious.slice(0, 1), ...SAMPLE_URLS.phishing.slice(0, 1)].map(
          (url) => (
            <button
              key={url}
              onClick={() => onSelect(url)}
              className="text-xs font-mono bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border hover:border-primary/30 transition-all"
            >
              {url.length > 45 ? url.slice(0, 45) + "..." : url}
            </button>
          )
        )}
      </div>
    </div>
  );
}
