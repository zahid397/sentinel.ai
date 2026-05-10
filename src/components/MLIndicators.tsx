import { Brain, Network, Sparkles, Activity } from "lucide-react";

const SIGNALS = [
  { icon: Brain, label: "ML Threat Classification", status: "Active" },
  { icon: Network, label: "Neural Risk Analysis", status: "Running" },
  { icon: Sparkles, label: "AI Pattern Recognition", status: "Enabled" },
  { icon: Activity, label: "Behavioral Anomaly Engine", status: "Monitoring" },
] as const;

export function MLIndicators() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {SIGNALS.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-card-gradient border border-border rounded-lg p-3 backdrop-blur-md flex items-center gap-2.5 hover:border-primary/40 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />
              <Icon className="w-4 h-4 text-primary relative" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase truncate">
                {s.label}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-low animate-pulse" />
                <span className="font-mono text-[10px] text-low">{s.status}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
