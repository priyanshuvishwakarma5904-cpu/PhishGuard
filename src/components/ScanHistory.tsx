import { motion } from "framer-motion";
import { Clock, ShieldCheck, ShieldAlert, ShieldX, Trash2, X } from "lucide-react";
import type { ThreatLevel } from "@/lib/phishing-detector";

export interface HistoryEntry {
  url: string;
  status: ThreatLevel;
  score: number;
  timestamp: Date;
}

const icons = {
  Safe: ShieldCheck,
  Suspicious: ShieldAlert,
  Phishing: ShieldX,
};

const colors = {
  Safe: "text-safe",
  Suspicious: "text-suspicious",
  Phishing: "text-phishing",
};

interface ScanHistoryProps {
  history: HistoryEntry[];
  onSelect: (url: string) => void;
  onDeleteOne: (index: number) => void;
  onClearAll: () => void;
}

export function ScanHistory({ history, onSelect, onDeleteOne, onClearAll }: ScanHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" /> Scan History
        </h3>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-phishing transition-colors font-mono"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>
      <div className="space-y-2">
        {history.map((entry, i) => {
          const Icon = icons[entry.status];
          return (
            <motion.div
              key={`${entry.url}-${entry.timestamp.getTime()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => onSelect(entry.url)}
                className="flex-1 flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 hover:border-primary/40 transition-all text-left"
              >
                <Icon className={`w-5 h-5 ${colors[entry.status]} shrink-0`} />
                <span className="font-mono text-xs text-card-foreground truncate flex-1">
                  {entry.url}
                </span>
                <span className={`text-xs font-bold font-mono ${colors[entry.status]}`}>
                  {entry.score}
                </span>
                <span className="text-xs text-muted-foreground">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
              </button>
              <button
                onClick={() => onDeleteOne(i)}
                className="p-2 text-muted-foreground hover:text-phishing hover:bg-phishing/10 rounded-md transition-colors shrink-0"
                title="Remove from history"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
