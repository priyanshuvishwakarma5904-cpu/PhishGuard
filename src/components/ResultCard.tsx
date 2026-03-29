import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { DetectionResult } from "@/lib/phishing-detector";

const statusConfig = {
  Safe: {
    icon: ShieldCheck,
    color: "text-safe",
    bg: "bg-safe/10",
    border: "border-safe/30",
    glow: "glow-primary",
    label: "SAFE",
  },
  Suspicious: {
    icon: ShieldAlert,
    color: "text-suspicious",
    bg: "bg-suspicious/10",
    border: "border-suspicious/30",
    glow: "glow-warning",
    label: "SUSPICIOUS",
  },
  Phishing: {
    icon: ShieldX,
    color: "text-phishing",
    bg: "bg-phishing/10",
    border: "border-phishing/30",
    glow: "glow-danger",
    label: "PHISHING",
  },
};

interface ResultCardProps {
  result: DetectionResult;
  url: string;
}

export function ResultCard({ result, url }: ResultCardProps) {
  const config = statusConfig[result.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full max-w-2xl mx-auto rounded-xl border ${config.border} ${config.bg} p-6 ${config.glow}`}
    >
      {/* Status Header */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <Icon className={`w-12 h-12 ${config.color}`} />
        </motion.div>
        <div>
          <h2 className={`text-2xl font-bold font-display ${config.color}`}>
            {config.label}
          </h2>
          <p className="text-muted-foreground font-mono text-xs truncate max-w-md">
            {url}
          </p>
        </div>
        <div className="ml-auto text-right">
          <div className={`text-3xl font-bold font-mono ${config.color}`}>
            {result.score}
          </div>
          <div className="text-xs text-muted-foreground">threat score</div>
        </div>
      </div>

      {/* Threat Score Bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${result.score}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`h-full rounded-full ${
            result.status === "Safe"
              ? "bg-safe"
              : result.status === "Suspicious"
              ? "bg-suspicious"
              : "bg-phishing"
          }`}
        />
      </div>

      {/* Reasons */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Analysis Details
        </h3>
        {result.reasons.map((reason, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-2 text-sm"
          >
            {result.status === "Safe" ? (
              <CheckCircle2 className="w-4 h-4 text-safe shrink-0 mt-0.5" />
            ) : reason.includes("No suspicious") ? (
              <CheckCircle2 className="w-4 h-4 text-safe shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-phishing shrink-0 mt-0.5" />
            )}
            <span className="text-card-foreground">{reason}</span>
          </motion.div>
        ))}
      </div>

      {/* Technical Details */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <Detail label="HTTPS" value={result.details.hasHttps ? "Yes" : "No"} good={result.details.hasHttps} />
          <Detail label="Length" value={`${result.details.urlLength}`} good={result.details.urlLength <= 75} />
          <Detail label="Dots" value={`${result.details.dotCount}`} good={result.details.dotCount <= 3} />
          <Detail label="IP Addr" value={result.details.hasIpAddress ? "Yes" : "No"} good={!result.details.hasIpAddress} />
        </div>
      </div>
    </motion.div>
  );
}

function Detail({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className="bg-muted/50 rounded-md p-2">
      <div className="text-muted-foreground">{label}</div>
      <div className={good ? "text-safe" : "text-phishing"}>{value}</div>
    </div>
  );
}
