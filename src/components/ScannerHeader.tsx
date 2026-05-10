import { Shield, Cpu } from "lucide-react";

export function ScannerHeader() {
  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-md bg-background/40">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-gradient blur-md opacity-60" />
            <div className="relative bg-card border border-primary/40 rounded-md p-2 glow">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none tracking-tight">
              SENTINEL<span className="text-neon">.AI</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mt-1">
              Vulnerability Intelligence Engine
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-low animate-pulse" />
            CORE ONLINE
          </div>
          <div className="flex items-center gap-2 text-muted-foreground border-l border-border pl-4">
            <Cpu className="w-3.5 h-3.5 text-amd" />
            <span>POWERED BY <span className="text-amd font-semibold">AMD INSTINCT</span></span>
          </div>
        </div>
      </div>
    </header>
  );
}
