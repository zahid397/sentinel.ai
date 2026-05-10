import { Shield, Cpu, ScanLine, FileSearch, Rocket, Menu, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Scanner", icon: ScanLine },
  { to: "/securedoc", label: "SecureDoc", icon: FileSearch },
  { to: "/deploy", label: "Deploy", icon: Rocket },
] as const;

export function ScannerHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 backdrop-blur-xl bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-5 md:px-6 py-3.5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-gradient blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
            <div className="relative bg-card border border-primary/40 rounded-md p-2 glow">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none tracking-tight">
              SENTINEL<span className="text-neon">.AI</span>
            </div>
            <div className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase mt-1">
              Autonomous Vulnerability Intelligence
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-secondary/40 border border-border rounded-full p-1">
          {NAV.map((n) => {
            const active = path === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-[var(--shadow-glow)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-low animate-pulse" />
            CORE ONLINE
          </div>
          <div className="flex items-center gap-2 text-muted-foreground border-l border-border pl-4">
            <Cpu className="w-3.5 h-3.5 text-amd" />
            <span className="text-amd font-semibold">AMD INSTINCT</span>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden bg-secondary/60 border border-border rounded-md p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl">
          <div className="container mx-auto px-5 py-3 flex flex-col gap-1">
            {NAV.map((n) => {
              const active = path === n.to;
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wider ${
                    active ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
