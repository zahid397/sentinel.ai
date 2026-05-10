import { useState } from "react";
import { ScanLine, Loader2, Globe, Network, Code2, Server } from "lucide-react";

export type ScanType = "web" | "network" | "api" | "system";
export type ScanDepth = "quick" | "standard" | "deep";

const SCAN_TYPES: { id: ScanType; label: string; icon: typeof Globe; hint: string }[] = [
  { id: "web", label: "Web App", icon: Globe, hint: "Domains & URLs" },
  { id: "network", label: "Network", icon: Network, hint: "Hosts & ports" },
  { id: "api", label: "API", icon: Code2, hint: "REST / GraphQL" },
  { id: "system", label: "System", icon: Server, hint: "Servers & infra" },
];

interface Props {
  onScan: (target: string, type: ScanType, depth: ScanDepth) => void;
  loading: boolean;
}

export function ScannerForm({ onScan, loading }: Props) {
  const [target, setTarget] = useState("");
  const [type, setType] = useState<ScanType>("web");
  const [depth, setDepth] = useState<ScanDepth>("standard");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (target.trim() && !loading) onScan(target.trim(), type, depth);
      }}
      className="bg-card-gradient border border-border rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[var(--shadow-card)] relative overflow-hidden"
    >
      {loading && (
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan pointer-events-none" />
      )}

      {/* Target input */}
      <label className="block">
        <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-2">
          Target Asset
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-primary text-sm">$</span>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example.com  ·  192.168.1.0/24  ·  api.service.io"
            className="w-full bg-background/60 border border-border rounded-lg pl-9 pr-4 py-3.5 font-mono text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </label>

      {/* Scan type */}
      <div className="mt-6">
        <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-2">
          Scan Profile
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SCAN_TYPES.map((t) => {
            const Icon = t.icon;
            const active = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`relative flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-all ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 text-foreground/70 hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="font-display font-semibold text-sm">{t.label}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{t.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Depth */}
      <div className="mt-6 flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div>
          <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-2">
            Depth
          </div>
          <div className="inline-flex bg-secondary/40 border border-border rounded-lg p-1">
            {(["quick", "standard", "deep"] as ScanDepth[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepth(d)}
                className={`px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${
                  depth === d
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !target.trim()}
          className="group relative inline-flex items-center justify-center gap-2 bg-neon-gradient text-primary-foreground font-display font-semibold px-7 py-3.5 rounded-lg shadow-[var(--shadow-glow)] hover:shadow-[0_0_60px_oklch(0.82_0.18_195/0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-mono uppercase tracking-widest text-sm">Scanning...</span>
            </>
          ) : (
            <>
              <ScanLine className="w-4 h-4" />
              <span className="font-mono uppercase tracking-widest text-sm">Initiate Scan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
