import { Search, Brain, Gauge, FileText, ArrowRight } from "lucide-react";

const AGENTS = [
  { icon: Search, name: "Recon Agent", role: "Surface mapping", color: "text-info" },
  { icon: Brain, name: "Analysis Agent", role: "Vector reasoning", color: "text-primary" },
  { icon: Gauge, name: "Risk Agent", role: "CVSS triage", color: "text-medium" },
  { icon: FileText, name: "Report Agent", role: "Synthesis", color: "text-accent-foreground" },
] as const;

interface Props {
  active?: boolean;
  stage?: number;
}

export function AgentWorkflow({ active = false, stage = -1 }: Props) {
  return (
    <div className="bg-card-gradient border border-border rounded-xl p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div>
          <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            Agentic Workflow
          </div>
          <h3 className="font-display font-semibold tracking-tight mt-0.5">
            Multi-Agent Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-primary animate-pulse" : "bg-muted-foreground/50"}`} />
          <span className="text-muted-foreground tracking-widest uppercase">
            {active ? "Pipeline Live" : "Idle"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-stretch">
        {AGENTS.map((a, i) => {
          const Icon = a.icon;
          const isActive = active && stage === i;
          const isDone = active && stage > i;
          return (
            <div key={a.name} className="contents md:contents">
              <div
                className={`md:col-span-1 relative flex md:flex-col items-center md:items-start gap-3 p-3.5 rounded-lg border transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                    : isDone
                    ? "border-low/40 bg-low/5"
                    : "border-border bg-secondary/30"
                }`}
              >
                <div className={`relative ${isActive ? "animate-pulse-glow rounded-md" : ""}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : isDone ? "text-low" : a.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-sm font-semibold leading-tight">{a.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mt-0.5">
                    {a.role}
                  </div>
                </div>
              </div>
              {i < AGENTS.length - 1 && (
                <div className="md:col-span-1 hidden md:flex items-center justify-center">
                  <ArrowRight className={`w-4 h-4 ${isDone ? "text-low" : "text-muted-foreground/50"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
