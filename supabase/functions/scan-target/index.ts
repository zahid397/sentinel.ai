// Sentinel AI vulnerability analysis function
// Uses Lovable AI Gateway to perform AI-driven recon + vulnerability triage

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScanRequest {
  target: string;
  scanType: "web" | "network" | "api" | "system";
  depth: "quick" | "standard" | "deep";
}

const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "1-2 sentence executive summary" },
    riskScore: { type: "number", description: "Overall risk 0-100" },
    surface: {
      type: "array",
      description: "Likely exposed attack surface elements",
      items: { type: "string" },
    },
    vulnerabilities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "Short ID like VULN-001" },
          title: { type: "string" },
          severity: { type: "string", enum: ["critical", "high", "medium", "low", "info"] },
          cvss: { type: "number", description: "0-10" },
          category: { type: "string", description: "OWASP/CWE category" },
          description: { type: "string" },
          impact: { type: "string" },
          remediation: { type: "string" },
          references: { type: "array", items: { type: "string" } },
        },
        required: ["id", "title", "severity", "cvss", "category", "description", "impact", "remediation"],
        additionalProperties: false,
      },
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["summary", "riskScore", "surface", "vulnerabilities", "recommendations"],
  additionalProperties: false,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { target, scanType, depth } = (await req.json()) as ScanRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!target || target.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Invalid target" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are SENTINEL-AI, an elite offensive security analyst running on AMD Instinct GPUs via the AMD Developer Cloud. You perform realistic, educational vulnerability assessments.

Given a target and scan profile, produce a SIMULATED but technically accurate vulnerability report based on common misconfigurations, CVE patterns, OWASP Top 10, and known attack surface analysis. Treat this as a defensive security exercise — output is for the system OWNER.

Be specific: name real CVE classes, CWE numbers, port/service assumptions, and concrete remediation steps. Vary the findings realistically based on the target type. Generate between ${depth === "quick" ? "3-5" : depth === "standard" ? "6-9" : "10-14"} findings spanning multiple severity levels.

Always call the report_vulnerabilities tool. Never reply in plain text.`;

    const userPrompt = `Target: ${target}
Scan Type: ${scanType}
Scan Depth: ${depth}

Perform a comprehensive AI-driven vulnerability assessment and produce a structured security report.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_vulnerabilities",
              description: "Return the structured vulnerability assessment report.",
              parameters: SCHEMA,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_vulnerabilities" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please retry shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const report = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        target,
        scanType,
        depth,
        scannedAt: new Date().toISOString(),
        report,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("scan-target error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
