import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { Github, Rocket, Copy, ExternalLink, Sparkles, Code2 } from "lucide-react";
import { ScannerHeader } from "@/components/ScannerHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/deploy")({
  head: () => ({
    meta: [
      { title: "Deploy Hub — Sentinel.AI" },
      { name: "description", content: "Generate Lovable import links and Vercel deploy buttons for any open-source GitHub repository." },
      { property: "og:title", content: "Deploy Hub — Sentinel.AI" },
      { property: "og:description", content: "Turn any GitHub repo into one-click Lovable + Vercel deploy links." },
    ],
  }),
  component: DeployPage,
});

function parseRepo(url: string): { owner: string; repo: string; clean: string } | null {
  try {
    const u = new URL(url.trim());
    if (!/github\.com$/i.test(u.hostname)) return null;
    const [owner, repo] = u.pathname.replace(/^\/+|\.git$/g, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo, clean: `https://github.com/${owner}/${repo}` };
  } catch {
    return null;
  }
}

function DeployPage() {
  const [url, setUrl] = useState("https://github.com/vercel/next.js");
  const parsed = useMemo(() => parseRepo(url), [url]);

  const links = useMemo(() => {
    if (!parsed) return null;
    const repoEnc = encodeURIComponent(parsed.clean);
    return {
      lovableImport: `https://lovable.dev/?import=${repoEnc}`,
      lovableRemix: `https://lovable.dev/projects/new?github=${repoEnc}`,
      vercelDeploy: `https://vercel.com/new/clone?repository-url=${repoEnc}`,
      netlifyDeploy: `https://app.netlify.com/start/deploy?repository=${repoEnc}`,
      stackblitz: `https://stackblitz.com/github/${parsed.owner}/${parsed.repo}`,
      codesandbox: `https://codesandbox.io/p/github/${parsed.owner}/${parsed.repo}`,
      lovableBadgeMd: `[![Open in Lovable](https://img.shields.io/badge/Open%20in-Lovable-22d3ee?style=for-the-badge&logo=react)](https://lovable.dev/?import=${repoEnc})`,
      vercelBadgeMd: `[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=${repoEnc})`,
    };
  }, [parsed]);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }

  return (
    <div className="min-h-screen bg-hero">
      <Toaster theme="dark" position="top-right" />
      <ScannerHeader />
      <main className="container mx-auto px-5 md:px-6 py-10 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/40 border border-border rounded-full px-3 py-1 mb-6 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Open-Source Deploy Hub
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4">
            Ship any GitHub repo to{" "}
            <span className="bg-neon-gradient bg-clip-text text-transparent text-glow">
              Lovable
            </span>{" "}
            in one click.
          </h1>
          <p className="text-muted-foreground">
            Paste a public GitHub URL — we'll generate Lovable import, Vercel deploy, and sandbox links instantly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-card-gradient border border-border rounded-xl p-5 md:p-6 backdrop-blur-md">
          <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
            GitHub Repository URL
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-input border border-border rounded-lg px-3 focus-within:border-primary/60 transition-colors">
              <Github className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="flex-1 bg-transparent py-3 text-sm font-mono outline-none placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          {url && !parsed && (
            <p className="text-destructive text-xs mt-2 font-mono">
              ▸ Invalid GitHub URL
            </p>
          )}
          {parsed && (
            <p className="text-low text-xs mt-2 font-mono">
              ▸ Detected: {parsed.owner}/{parsed.repo}
            </p>
          )}
        </div>

        {links && (
          <div className="max-w-3xl mx-auto mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <DeployCard
                icon={<Rocket className="w-4 h-4" />}
                title="Open in Lovable"
                desc="Remix this repo as a Lovable project"
                href={links.lovableImport}
                accent
                onCopy={() => copy(links.lovableImport, "Lovable link")}
              />
              <DeployCard
                icon={<Rocket className="w-4 h-4" />}
                title="Deploy to Vercel"
                desc="One-click clone & deploy"
                href={links.vercelDeploy}
                onCopy={() => copy(links.vercelDeploy, "Vercel link")}
              />
              <DeployCard
                icon={<Rocket className="w-4 h-4" />}
                title="Deploy to Netlify"
                desc="Clone repo to Netlify"
                href={links.netlifyDeploy}
                onCopy={() => copy(links.netlifyDeploy, "Netlify link")}
              />
              <DeployCard
                icon={<Code2 className="w-4 h-4" />}
                title="Open in StackBlitz"
                desc="Instant browser IDE"
                href={links.stackblitz}
                onCopy={() => copy(links.stackblitz, "StackBlitz link")}
              />
            </div>

            <div className="bg-card-gradient border border-border rounded-xl p-5 backdrop-blur-md">
              <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3">
                README Badges (Markdown)
              </div>
              <BadgeRow label="Lovable" code={links.lovableBadgeMd} onCopy={() => copy(links.lovableBadgeMd, "Lovable badge")} />
              <BadgeRow label="Vercel" code={links.vercelBadgeMd} onCopy={() => copy(links.vercelBadgeMd, "Vercel badge")} />
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto mt-8">
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3">
            Quick Picks
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "https://github.com/shadcn-ui/ui",
              "https://github.com/vercel/next.js",
              "https://github.com/supabase/supabase",
              "https://github.com/tailwindlabs/tailwindcss",
              "https://github.com/TanStack/router",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setUrl(q)}
                className="bg-secondary/60 border border-border hover:border-primary/60 rounded-full px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-all"
              >
                {q.replace("https://github.com/", "")}
              </button>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function DeployCard({
  icon, title, desc, href, accent, onCopy,
}: { icon: React.ReactNode; title: string; desc: string; href: string; accent?: boolean; onCopy: () => void }) {
  return (
    <div className={`bg-card-gradient border rounded-xl p-4 backdrop-blur-md transition-all ${accent ? "border-primary/50 glow" : "border-border hover:border-primary/40"}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={accent ? "text-primary" : "text-foreground"}>{icon}</span>
        <div className="font-display font-semibold text-sm">{title}</div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{desc}</p>
      <div className="flex gap-2">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
            accent
              ? "bg-neon-gradient text-primary-foreground font-semibold hover:shadow-[var(--shadow-glow)]"
              : "bg-secondary/60 border border-border hover:border-primary/60"
          }`}
        >
          <ExternalLink className="w-3 h-3" /> Open
        </a>
        <button
          onClick={onCopy}
          className="bg-secondary/60 border border-border hover:border-primary/60 rounded-lg px-3 py-2 transition-all"
          aria-label="Copy link"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function BadgeRow({ label, code, onCopy }: { label: string; code: string; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-2 mb-2 last:mb-0">
      <div className="font-mono text-[10px] uppercase text-muted-foreground w-16 shrink-0">{label}</div>
      <code className="flex-1 bg-input/60 border border-border rounded px-2 py-1.5 font-mono text-[10px] text-foreground/80 truncate">
        {code}
      </code>
      <button
        onClick={onCopy}
        className="bg-secondary/60 border border-border hover:border-primary/60 rounded px-2 py-1.5 transition-all"
        aria-label="Copy"
      >
        <Copy className="w-3 h-3" />
      </button>
    </div>
  );
}
