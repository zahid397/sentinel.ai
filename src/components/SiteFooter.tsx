import { Shield, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 mt-20 bg-background/40 backdrop-blur-md">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display font-bold tracking-tight">
              SENTINEL<span className="text-neon">.AI</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Autonomous Vulnerability Intelligence Engine. Multi-agent reasoning over your attack surface,
            triaged in real time on AMD Instinct GPUs.
          </p>
        </div>

        <div>
          <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-3">
            Capabilities
          </div>
          <ul className="space-y-1.5 text-xs text-foreground/70">
            <li>· AI Vulnerability Scanner</li>
            <li>· SecureDoc AI</li>
            <li>· Agentic Threat Pipeline</li>
            <li>· Real-time CVSS Triage</li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-3">
            Built For
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-amd/10 border border-amd/40 text-amd font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded">
              AMD Hackathon
            </span>
            <a
              href="#"
              className="bg-secondary/60 border border-border hover:border-primary/40 text-foreground/70 rounded-md p-1.5 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            For authorized security testing only
          </p>
        </div>
      </div>
      <div className="border-t border-border/30">
        <div className="container mx-auto px-6 py-4 text-center font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          © 2026 Sentinel.AI · Powered by AMD Developer Cloud · ROCm · Lovable AI
        </div>
      </div>
    </footer>
  );
}
