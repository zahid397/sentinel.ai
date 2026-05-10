type Severity = "critical" | "high" | "medium" | "low" | "info";

const styles: Record<Severity, string> = {
  critical: "bg-critical/15 text-critical border-critical/40 shadow-[0_0_20px_oklch(0.62_0.27_18/0.3)]",
  high: "bg-high/15 text-high border-high/40",
  medium: "bg-medium/15 text-medium border-medium/40",
  low: "bg-low/15 text-low border-low/40",
  info: "bg-info/15 text-info border-info/40",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[10px] uppercase tracking-wider font-semibold ${styles[severity]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {severity}
    </span>
  );
}
