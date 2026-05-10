import { Download, Share2, FileText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  payload: unknown;
  filename?: string;
}

export function ExportBar({ payload, filename = "sentinel-report" }: Props) {
  function downloadJSON() {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  }

  function generatePDF() {
    const html = `<!doctype html><html><head><title>${filename}</title>
      <style>body{font-family:ui-sans-serif,system-ui;padding:40px;background:#0a0e1a;color:#e6f1ff}
      pre{background:#0f1729;padding:20px;border-radius:8px;border:1px solid #1e2a44;overflow:auto;font-size:11px}
      h1{color:#22d3ee;border-bottom:1px solid #22d3ee;padding-bottom:8px}</style></head>
      <body><h1>SENTINEL.AI — Threat Report</h1>
      <p>Generated ${new Date().toISOString()}</p>
      <pre>${JSON.stringify(payload, null, 2).replace(/</g, "&lt;")}</pre></body></html>`;
    const w = window.open("", "_blank");
    if (!w) return toast.error("Popup blocked");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  async function share() {
    const text = `Sentinel.AI report — ${filename}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Sentinel.AI", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Share link copied");
      }
    } catch {
      /* user dismissed */
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={downloadJSON}
        className="inline-flex items-center gap-2 bg-secondary/60 border border-border hover:border-primary/60 text-foreground rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all"
      >
        <Download className="w-3.5 h-3.5" /> Download
      </button>
      <button
        onClick={generatePDF}
        className="inline-flex items-center gap-2 bg-secondary/60 border border-border hover:border-primary/60 text-foreground rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all"
      >
        <FileText className="w-3.5 h-3.5" /> Generate PDF
      </button>
      <button
        onClick={share}
        className="inline-flex items-center gap-2 bg-neon-gradient text-primary-foreground rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold hover:shadow-[var(--shadow-glow)] transition-all"
      >
        <Share2 className="w-3.5 h-3.5" /> Share Scan
      </button>
    </div>
  );
}
