import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast, Toaster } from "sonner";
import { Activity, Cpu, Lock, Sparkles } from "lucide-react";
import { ScannerHeader } from "@/components/ScannerHeader";
import { ScannerForm, type ScanType, type ScanDepth } from "@/components/ScannerForm";
import { ScanResults, type ScanResult } from "@/components/ScanResults";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel.AI — AMD-Powered Vulnerability Intelligence" },
      { name: "description", content: "Sentinel.AI is an AI-driven cybersecurity scanner that identifies system vulnerabilities, scored and triaged by LLMs running on AMD Instinct GPUs." },
    ],
  }),
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  async function handleScan(target: string, scanType: ScanType, depth: ScanDepth) {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("scan-target", {
        body: { target, scanType, depth },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data as ScanResult);
      toast.success("Scan complete", { description: `${data.report.vulnerabilities.length} findings reported.` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Scan failed";
      toast.error("Scan failed", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero relative">
      <Toaster theme="dark" position="top-right" />
      <ScannerHeader />

      <main className="container mx-auto px-6 py-10 md:py-16 relative z-10">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-secondary/40 border border-border rounded-full px-3 py-1 mb-6 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              AMD Developer Cloud · ROCm · Lovable AI
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] mb-5">
            Find every weakness <br />
            <span className="bg-neon-gradient bg-clip-text text-transparent text-glow">
              before attackers do.
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sentinel.AI is an autonomous vulnerability intelligence engine. Point it at any asset —
            it reasons about your attack surface and returns a triaged, CVSS-scored report.
          </p>
        </div>

        {/* Scanner */}
        <div className="max-w-3xl mx-auto">
          <ScannerForm onScan={handleScan} loading={loading} />
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto mt-10">
          {result ? (
            <ScanResults result={result} />
          ) : loading ? (
            <ScanLoading />
          ) : (
            <FeatureGrid />
          )}
        </div>
      </main>

      <footer className="container mx-auto px-6 py-10 text-center font-mono text-[10px] tracking-widest uppercase text-muted-foreground border-t border-border/40 mt-10">
        Sentinel.AI · For authorized security testing only · Built for the AMD Developer Hackathon
      </footer>
    </div>
  );
}

function ScanLoading() {
  const lines = [
    "Initializing AMD Instinct compute lane...",
    "Resolving target topology...",
    "Enumerating attack surface vectors...",
    "Cross-referencing CVE & CWE databases...",
    "Reasoning over OWASP heuristics...",
    "Compiling triaged report...",
  ];
  return (
    <div className="bg-card-gradient border border-border rounded-xl p-6 backdrop-blur-md font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Activity className="w-4 h-4 animate-pulse" />
        <span className="tracking-widest text-xs uppercase">Live Trace</span>
      </div>
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <div
            key={i}
            className="text-foreground/70 animate-in fade-in slide-in-from-left-2"
            style={{ animationDelay: `${i * 350}ms`, animationFillMode: "backwards" }}
          >
            <span className="text-primary mr-2">▸</span>{l}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureGrid() {
  const items = [
    { icon: Cpu, title: "AMD-Accelerated", body: "Inference workloads designed for Instinct MI300X GPUs via ROCm." },
    { icon: Activity, title: "Autonomous Reasoning", body: "Multi-step agentic analysis across the OWASP Top 10 + CWE catalog." },
    { icon: Lock, title: "Defensive-First", body: "Educational, simulated findings — built for owners auditing their own assets." },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <div key={i} className="bg-card-gradient border border-border rounded-xl p-5 backdrop-blur-md hover:border-primary/40 transition-colors">
            <Icon className="w-5 h-5 text-primary mb-3" />
            <div className="font-display font-semibold mb-1">{it.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{it.body}</p>
          </div>
        );
      })}
    </div>
  );
}
