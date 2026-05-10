import { AlertTriangle, ShieldCheck, Target, Zap, FileWarning, Lightbulb, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SeverityBadge } from "./SeverityBadge";

export interface Vulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  cvss: number;
  category: string;
  description: string;
  impact: string;
  remediation: string;
  references?: string[];
}

export interface ScanReport {
  summary: string;
  riskScore: number;
  surface: string[];
  vulnerabilities: Vulnerability[];
  recommendations: string[];
}

export interface ScanResult {
  target: string;
  scanType: string;
  depth: string;
  scannedAt: string;
  report: ScanReport;
}

function riskColor(score: number) {
  if (score >= 80) return "text-critical";
  if (score >= 60) return "text-high";
  if (score >= 40) return "text-medium";
  if (score >= 20) return "text-low";
  return "text-info";
}

function riskLabel(score: number) {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "MODERATE";
  if (score >= 20) return "LOW";
  return "MINIMAL";
}

export function ScanResults({ result }: { result: ScanResult }) {
  const { report, target } = result;
  const counts = report.vulnerabilities.reduce(
    (acc, v) => ({ ...acc, [v.severity]: (acc[v.severity] || 0) + 1 }),
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Risk overview */}
      <div className="bg-card-gradient border border-border rounded-xl p-6 backdrop-blur-md shadow-[var(--shadow-card)]">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="oklch(0.27 0.03 260)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="44" fill="none"
                  stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(report.riskScore / 100) * 276.46} 276.46`}
                  className={riskColor(report.riskScore)}
                />
              </svg>
              <div className="text-center">
                <div className={`text-3xl font-bold font-mono ${riskColor(report.riskScore)}`}>
                  {report.riskScore}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                  Risk Score
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono text-xs font-bold tracking-widest ${riskColor(report.riskScore)}`}>
                {riskLabel(report.riskScore)} EXPOSURE
              </span>
              <span className="text-xs font-mono text-muted-foreground">·</span>
              <span className="text-xs font-mono text-muted-foreground truncate">{target}</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{report.summary}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {(["critical", "high", "medium", "low", "info"] as const).map((s) =>
                counts[s] ? (
                  <div key={s} className="flex items-center gap-2 bg-secondary/60 border border-border rounded-md px-3 py-1.5">
                    <SeverityBadge severity={s} />
                    <span className="font-mono text-sm font-bold">{counts[s]}</span>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attack surface */}
      <div className="bg-card-gradient border border-border rounded-xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold tracking-tight">Attack Surface</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {report.surface.map((s, i) => (
            <span key={i} className="font-mono text-xs bg-secondary/60 border border-border rounded-md px-3 py-1.5 text-foreground/80">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Vulnerabilities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileWarning className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold tracking-tight">
            Findings <span className="text-muted-foreground font-mono text-sm">({report.vulnerabilities.length})</span>
          </h3>
        </div>
        <div className="space-y-3">
          {report.vulnerabilities.map((v) => (
            <VulnCard key={v.id} v={v} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card-gradient border border-border rounded-xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold tracking-tight">Strategic Recommendations</h3>
        </div>
        <ul className="space-y-2.5">
          {report.recommendations.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground/85">
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function VulnCard({ v }: { v: Vulnerability }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card-gradient border border-border rounded-xl backdrop-blur-md overflow-hidden hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 text-left flex items-start gap-4"
      >
        <div className="flex-shrink-0 mt-1">
          <AlertTriangle className={`w-5 h-5 ${v.severity === "critical" || v.severity === "high" ? "text-critical" : "text-medium"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <SeverityBadge severity={v.severity} />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {v.id} · CVSS {v.cvss.toFixed(1)} · {v.category}
            </span>
          </div>
          <div className="font-display font-semibold text-foreground">{v.title}</div>
          {!open && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{v.description}</p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform mt-2 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-border/60 grid md:grid-cols-3 gap-5 mt-2">
          <div>
            <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-2">Description</div>
            <p className="text-sm text-foreground/85 leading-relaxed">{v.description}</p>
          </div>
          <div>
            <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-2">Impact</div>
            <p className="text-sm text-foreground/85 leading-relaxed">{v.impact}</p>
          </div>
          <div>
            <div className="text-[10px] font-mono text-primary tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Remediation
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">{v.remediation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
