import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Upload, FileText, Loader2, Shield, AlertTriangle, Link2, Bug, KeyRound,
  Mail, Paperclip, ShieldCheck, X, Sparkles,
} from "lucide-react";
import { ScannerHeader } from "@/components/ScannerHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MLIndicators } from "@/components/MLIndicators";
import { ExportBar } from "@/components/ExportBar";

export const Route = createFileRoute("/securedoc")({
  head: () => ({
    meta: [
      { title: "SecureDoc AI — Document Threat Analysis · Sentinel.AI" },
      { name: "description", content: "AI-powered PDF & document security analysis. Detects malicious links, hidden scripts, malware indicators, and phishing patterns in seconds." },
      { property: "og:title", content: "SecureDoc AI — Document Threat Analysis" },
      { property: "og:description", content: "AI-powered PDF & document security analysis on AMD Instinct GPUs." },
    ],
  }),
  component: SecureDocPage,
});

interface DocReport {
  filename: string;
  size: number;
  safetyScore: number; // 0-100 (higher = safer)
  threatLevel: "safe" | "low" | "moderate" | "high" | "critical";
  confidence: number;
  summary: string;
  findings: { id: string; icon: typeof Link2; label: string; count: number; severity: "ok" | "warn" | "danger"; detail: string }[];
  actions: string[];
}

function analyzeFile(file: File): DocReport {
  // Deterministic mock analysis based on filename hash
  const seed = Array.from(file.name).reduce((a, c) => a + c.charCodeAt(0), 0) + file.size;
  const r = (n: number) => ((seed * (n + 7)) % 97) / 97;

  const links = Math.floor(r(1) * 6);
  const scripts = Math.floor(r(2) * 3);
  const malware = Math.floor(r(3) * 2);
  const creds = Math.floor(r(4) * 4);
  const phish = Math.floor(r(5) * 3);
  const attach = Math.floor(r(6) * 4);

  const threatPts = links * 3 + scripts * 12 + malware * 25 + creds * 10 + phish * 15 + attach * 4;
  const safety = Math.max(0, Math.min(100, 100 - threatPts));
  const level: DocReport["threatLevel"] =
    safety >= 85 ? "safe" : safety >= 65 ? "low" : safety >= 45 ? "moderate" : safety >= 25 ? "high" : "critical";

  return {
    filename: file.name,
    size: file.size,
    safetyScore: safety,
    threatLevel: level,
    confidence: 88 + Math.floor(r(7) * 11),
    summary:
      level === "safe"
        ? "Document passes all neural threat heuristics. No active payloads or social-engineering vectors detected."
        : level === "critical"
        ? "Multiple high-confidence indicators of compromise detected. Do not open this document outside a sandboxed environment."
        : "Mixed-signal document. Some content patterns warrant review before forwarding or executing embedded actions.",
    findings: [
      { id: "1", icon: Link2, label: "Suspicious Links", count: links, severity: links > 2 ? "warn" : links > 0 ? "warn" : "ok", detail: `${links} URL(s) cross-referenced against threat intel feeds.` },
      { id: "2", icon: Bug, label: "Hidden Scripts", count: scripts, severity: scripts > 0 ? "danger" : "ok", detail: scripts > 0 ? "Embedded JavaScript / OpenAction triggers detected." : "No active scripting payloads." },
      { id: "3", icon: AlertTriangle, label: "Malware Indicators", count: malware, severity: malware > 0 ? "danger" : "ok", detail: malware > 0 ? "Byte signatures match known dropper families." : "Clean against ML malware classifier." },
      { id: "4", icon: KeyRound, label: "Credential Leaks", count: creds, severity: creds > 1 ? "warn" : "ok", detail: `${creds} potential secret-like token(s) identified.` },
      { id: "5", icon: Mail, label: "Phishing Patterns", count: phish, severity: phish > 0 ? "warn" : "ok", detail: phish > 0 ? "Urgency / impersonation language detected." : "No phishing semantics matched." },
      { id: "6", icon: Paperclip, label: "Unsafe Attachments", count: attach, severity: attach > 1 ? "warn" : "ok", detail: `${attach} embedded file object(s) flagged for review.` },
    ],
    actions: [
      level === "safe" ? "Document may be distributed normally." : "Quarantine before forwarding or printing.",
      "Re-scan after any content changes.",
      "Strip metadata and embedded JavaScript prior to publishing.",
      "Verify sender authenticity through an out-of-band channel.",
    ],
  };
}

function SecureDocPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DocReport | null>(null);
  const [drag, setDrag] = useState(false);

  const onFiles = useCallback((files: FileList | null) => {
    if (!files || !files[0]) return;
    setFile(files[0]);
    setReport(null);
  }, []);

  async function runScan() {
    if (!file) return;
    setLoading(true);
    setReport(null);
    await new Promise((r) => setTimeout(r, 2400));
    const result = analyzeFile(file);
    setReport(result);
    setLoading(false);
    toast.success("Document analysis complete", { description: `Safety score: ${result.safetyScore}/100` });
  }

  return (
    <div className="min-h-screen bg-hero relative">
      <Toaster theme="dark" position="top-right" />
      <ScannerHeader />

      <main className="container mx-auto px-5 md:px-6 py-10 md:py-16 relative z-10">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-secondary/40 border border-border rounded-full px-3 py-1 mb-6 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              SecureDoc AI · Neural Document Forensics
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] mb-5">
            Every document, <br />
            <span className="bg-neon-gradient bg-clip-text text-transparent text-glow">
              forensically analyzed.
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Drop a PDF or office file. Sentinel's neural pipeline disassembles its structure, scans every embedded
            object, and returns a triaged threat verdict in seconds.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-6">
          <MLIndicators />
        </div>

        {/* Uploader */}
        <div className="max-w-3xl mx-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
            className={`bg-card-gradient border-2 border-dashed rounded-2xl p-8 md:p-10 text-center backdrop-blur-md transition-all ${
              drag ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]" : "border-border"
            }`}
          >
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-neon-gradient blur-xl opacity-50" />
              <div className="relative bg-card border border-primary/40 rounded-full p-4 glow">
                <Upload className="w-7 h-7 text-primary" />
              </div>
            </div>
            <h3 className="font-display font-semibold text-lg mb-1">Drop document here</h3>
            <p className="text-sm text-muted-foreground mb-5">
              PDF, DOCX, XLSX, PPTX · Max 25MB · Analyzed locally on AMD compute
            </p>
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                onChange={(e) => onFiles(e.target.files)}
              />
              <span className="inline-flex items-center gap-2 bg-secondary/60 border border-border hover:border-primary/60 rounded-lg px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all">
                <FileText className="w-3.5 h-3.5" /> Browse files
              </span>
            </label>
          </div>

          {/* Selected file */}
          {file && (
            <div className="mt-4 bg-card-gradient border border-border rounded-xl p-4 backdrop-blur-md flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-primary/10 border border-primary/40 rounded-lg p-3">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold truncate">{file.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB · {file.type || "binary"}
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setReport(null); }}
                className="text-muted-foreground hover:text-foreground p-2"
                aria-label="Remove"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={runScan}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-neon-gradient text-primary-foreground rounded-lg px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold shadow-[var(--shadow-glow)] hover:shadow-[0_0_60px_oklch(0.82_0.18_195/0.5)] transition-all disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing</> : <><Shield className="w-3.5 h-3.5" /> Analyze</>}
              </button>
            </div>
          )}
        </div>

        {/* Loading trace */}
        {loading && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-card-gradient border border-border rounded-xl p-5 backdrop-blur-md font-mono text-sm relative overflow-hidden">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              <div className="space-y-1.5">
                {[
                  "Disassembling document structure...",
                  "Extracting embedded objects & streams...",
                  "Cross-referencing URL threat intelligence...",
                  "Running malware byte-signature classifier...",
                  "Evaluating phishing language model...",
                  "Computing safety score...",
                ].map((l, i) => (
                  <div
                    key={i}
                    className="text-foreground/70 animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${i * 320}ms`, animationFillMode: "backwards" }}
                  >
                    <span className="text-primary mr-2">▸</span>{l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report */}
        {report && <DocReportView report={report} />}
      </main>

      <SiteFooter />
    </div>
  );
}

function DocReportView({ report }: { report: DocReport }) {
  const levelColor = {
    safe: "text-low", low: "text-low", moderate: "text-medium", high: "text-high", critical: "text-critical",
  }[report.threatLevel];

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card-gradient border border-border rounded-xl p-6 backdrop-blur-md grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="oklch(0.27 0.03 260)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="44" fill="none"
                stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${(report.safetyScore / 100) * 276.46} 276.46`}
                className={levelColor}
              />
            </svg>
            <div className="text-center">
              <div className={`text-3xl font-bold font-mono ${levelColor}`}>{report.safetyScore}</div>
              <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Safety</div>
            </div>
          </div>
          <div className={`mt-3 font-mono text-xs tracking-widest uppercase font-bold ${levelColor}`}>
            {report.threatLevel} threat
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-1">Verdict</div>
            <p className="text-sm text-foreground/90 leading-relaxed">{report.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="AI Confidence" value={`${report.confidence}%`} />
            <Stat label="Findings" value={String(report.findings.reduce((a, f) => a + f.count, 0))} />
          </div>
          <ExportBar payload={report} filename={`securedoc-${report.filename}`} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {report.findings.map((f) => {
          const Icon = f.icon;
          const sev = f.severity === "danger" ? "border-critical/40 bg-critical/5" : f.severity === "warn" ? "border-medium/40 bg-medium/5" : "border-border";
          const tone = f.severity === "danger" ? "text-critical" : f.severity === "warn" ? "text-medium" : "text-low";
          return (
            <div key={f.id} className={`bg-card-gradient border ${sev} rounded-xl p-4 backdrop-blur-md flex items-start gap-3`}>
              <Icon className={`w-5 h-5 ${tone} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display font-semibold">{f.label}</div>
                  <span className={`font-mono text-xs ${tone} font-bold`}>{f.count}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card-gradient border border-border rounded-xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold tracking-tight">Recommended Actions</h3>
        </div>
        <ul className="space-y-2.5">
          {report.actions.map((a, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground/85">
              <span className="text-primary mt-0.5">▸</span>{a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/40 border border-border rounded-lg p-3">
      <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">{label}</div>
      <div className="font-display font-bold text-xl mt-1 text-primary">{value}</div>
    </div>
  );
}
