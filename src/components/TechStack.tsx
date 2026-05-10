import { Cpu, Zap, Brain, Shield, Network, Activity } from "lucide-react";

const STACK = [
  { icon: Cpu, label: "AMD Developer Cloud", hint: "Compute fabric", accent: "text-amd" },
  { icon: Zap, label: "ROCm", hint: "GPU acceleration", accent: "text-amd" },
  { icon: Brain, label: "Lovable AI", hint: "Inference gateway", accent: "text-primary" },
  { icon: Network, label: "Agentic AI", hint: "Multi-agent orchestration", accent: "text-primary" },
  { icon: Shield, label: "Cybersecurity Intelligence", hint: "OWASP / CWE / CVE", accent: "text-info" },
  { icon: Activity, label: "AI Threat Detection", hint: "Real-time triage", accent: "text-medium" },
] as const;

export function TechStack() {
  return (
    <section className="mt-16 md:mt-24">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-secondary/40 border border-border rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Powered by
          </span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
          Built on a <span className="bg-neon-gradient bg-clip-text text-transparent">next-gen AI stack</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {STACK.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group relative bg-card-gradient border border-border rounded-xl p-4 md:p-5 backdrop-blur-md hover:border-primary/40 transition-all overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className={`w-5 h-5 ${s.accent} mb-3 relative`} />
              <div className="font-display font-semibold text-sm md:text-base relative">{s.label}</div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mt-1 relative">
                {s.hint}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
