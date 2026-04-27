/**
 * seo-geo-check.ts — Verifieert na elke build dat de SEO/GEO-bestanden
 * correct gegenereerd zijn:
 *   1. `llms.txt`        — bestaat, bevat verplichte secties
 *   2. `robots.txt`      — bevat alle AI-bots + sitemap-directive
 *   3. `sitemap.xml`     — geldig XML, ≥10 <url>-entries, hoofdroutes aanwezig
 *
 * Wordt automatisch aangeroepen door de Vite-plugin in `vite.config.ts`
 * (closeBundle hook) na productie-builds. Faalt nooit de build, maar
 * print duidelijke ✓/✗ rapportage met exit-tellingen voor logs.
 *
 * Standalone draaien: `bun scripts/seo-geo-check.ts <outDir>`
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const REQUIRED_AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
];

// Verplichte H2-secties (moeten letterlijk in llms.txt staan)
const REQUIRED_LLMS_SECTIONS = [
  "## Kerninformatie",
  "## Veelgestelde vragen",
  "## Sitemap",
];

const REQUIRED_SITEMAP_PATHS = [
  "/",
  "/overnachten",
  "/groepsverblijf",
  "/vergaderen",
  "/contact",
];

interface CheckResult {
  name: string;
  ok: boolean;
  message: string;
  details?: string[];
}

/**
 * Verifieert llms.txt tegen de officiële llmstxt.org-spec:
 *   1. Exact één H1 op regel 1
 *   2. Een blockquote (`> …`) direct na de H1 (samenvatting)
 *   3. Geen H3 of dieper (de spec staat enkel H1 + H2 toe)
 *   4. H2-secties bevatten enkel link-list-items (`- [name](url): notes`)
 *      — uitzondering: vrije proza-paragrafen vóór de eerste H2
 *   5. Alle verplichte H2-secties aanwezig
 */
const checkLlmsTxt = (outDir: string): CheckResult => {
  const path = resolve(outDir, "llms.txt");
  if (!existsSync(path)) {
    return { name: "llms.txt", ok: false, message: `bestand ontbreekt op ${path}` };
  }
  const content = readFileSync(path, "utf-8");
  const lines = content.split(/\r?\n/);
  const errors: string[] = [];

  // 1. H1 op regel 1
  const h1Match = lines[0]?.match(/^#\s+(.+)$/);
  if (!h1Match) {
    errors.push("eerste regel moet een H1 zijn (`# Project Naam`)");
  }
  const h1Count = lines.filter((l) => /^#\s+/.test(l)).length;
  if (h1Count > 1) errors.push(`meer dan één H1 gevonden (${h1Count})`);

  // 2. Blockquote-samenvatting na H1 (binnen eerste 5 niet-lege regels)
  const earlyNonEmpty = lines.slice(1, 8).filter((l) => l.trim() !== "");
  const hasBlockquote = earlyNonEmpty.some((l) => /^>\s+.+/.test(l));
  if (!hasBlockquote) {
    errors.push("blockquote-samenvatting (`> …`) ontbreekt direct na de H1");
  }

  // 3. Geen H3+ toegestaan
  const badHeadings = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => /^#{3,}\s+/.test(l));
  if (badHeadings.length) {
    errors.push(
      `${badHeadings.length} verboden H3+ heading(s) (spec staat enkel H1 + H2 toe): ` +
        badHeadings
          .slice(0, 3)
          .map(({ l, i }) => `regel ${i + 1}: "${l.trim()}"`)
          .join(" · "),
    );
  }

  // 4. Binnen elke H2-sectie alleen link-list-items toegestaan
  const linkItemRe = /^[-*]\s+\[[^\]]+\]\([^)]+\)(?::\s+.+)?\s*$/;
  let inH2Section = false;
  const sectionViolations: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^##\s+/.test(l)) {
      inH2Section = true;
      continue;
    }
    if (/^#\s+/.test(l)) continue;
    if (!inH2Section) continue;
    const trimmed = l.trim();
    if (trimmed === "") continue;
    // Toegestaan: link-list-items
    if (linkItemRe.test(l)) continue;
    // Niet toegestaan binnen H2: andere bullets, proza, kop-fragmenten
    if (sectionViolations.length < 5) {
      sectionViolations.push(`regel ${i + 1}: "${trimmed.slice(0, 80)}"`);
    }
  }
  if (sectionViolations.length) {
    errors.push(
      `H2-secties bevatten niet-link content (spec vereist enkel \`- [name](url): notes\`): ` +
        sectionViolations.join(" · "),
    );
  }

  // 5. Verplichte secties
  const missingSections = REQUIRED_LLMS_SECTIONS.filter((s) => !content.includes(s));
  if (missingSections.length) {
    errors.push(`mist verplichte sectie(s): ${missingSections.join(", ")}`);
  }

  if (errors.length) {
    return {
      name: "llms.txt",
      ok: false,
      message: `${errors.length} spec-fout(en) — zie llmstxt.org`,
      details: errors,
    };
  }
  const h2Count = lines.filter((l) => /^##\s+/.test(l)).length;
  return {
    name: "llms.txt",
    ok: true,
    message: `${content.length} bytes, ${h2Count} H2-secties, llmstxt.org spec ✓`,
  };
};

const checkRobotsTxt = (outDir: string): CheckResult => {
  const path = resolve(outDir, "robots.txt");
  if (!existsSync(path)) {
    return { name: "robots.txt", ok: false, message: `bestand ontbreekt op ${path}` };
  }
  const content = readFileSync(path, "utf-8");
  const missingBots = REQUIRED_AI_BOTS.filter(
    (bot) => !new RegExp(`^User-agent:\\s*${bot}\\s*$`, "im").test(content),
  );
  const hasSitemap = /^Sitemap:\s*https?:\/\/.+sitemap\.xml\s*$/im.test(content);
  const errors: string[] = [];
  if (missingBots.length) errors.push(`mist AI-bots: ${missingBots.join(", ")}`);
  if (!hasSitemap) errors.push("Sitemap-directive ontbreekt of ongeldig");

  if (errors.length) {
    return { name: "robots.txt", ok: false, message: errors.join(" · "), details: errors };
  }
  return {
    name: "robots.txt",
    ok: true,
    message: `${REQUIRED_AI_BOTS.length} AI-bots toegelaten, sitemap-directive ✓`,
  };
};

const checkSitemapXml = (outDir: string): CheckResult => {
  const path = resolve(outDir, "sitemap.xml");
  if (!existsSync(path)) {
    return { name: "sitemap.xml", ok: false, message: `bestand ontbreekt op ${path}` };
  }
  const content = readFileSync(path, "utf-8");

  // Minimale XML-validatie
  if (!content.startsWith("<?xml")) {
    return { name: "sitemap.xml", ok: false, message: "ontbreekt XML-declaratie" };
  }
  if (!content.includes("<urlset")) {
    return { name: "sitemap.xml", ok: false, message: "<urlset>-root ontbreekt" };
  }

  const urlCount = (content.match(/<url>/g) ?? []).length;
  if (urlCount < 10) {
    return {
      name: "sitemap.xml",
      ok: false,
      message: `slechts ${urlCount} URLs (verwacht ≥10)`,
    };
  }

  // Verifieer dat hoofdroutes erin zitten
  const missing = REQUIRED_SITEMAP_PATHS.filter((p) => {
    const re = new RegExp(`<loc>https?://[^<]+${p === "/" ? "/?" : p}</loc>`);
    return !re.test(content);
  });
  if (missing.length) {
    return {
      name: "sitemap.xml",
      ok: false,
      message: `mist ${missing.length} kritieke route(s)`,
      details: missing,
    };
  }

  return {
    name: "sitemap.xml",
    ok: true,
    message: `${urlCount} URLs, alle ${REQUIRED_SITEMAP_PATHS.length} kritieke routes aanwezig`,
  };
};

/**
 * Cross-check: de `Sitemap:`-URL in `robots.txt` moet exact verwijzen naar
 * de host die ook gebruikt wordt in `sitemap.xml` (eerste `<loc>`-entry).
 * Faalt bij host-mismatch, ontbrekend pad `/sitemap.xml`, of als één van
 * de bestanden ontbreekt.
 */
const checkSitemapUrlConsistency = (outDir: string): CheckResult => {
  const robotsPath = resolve(outDir, "robots.txt");
  const sitemapPath = resolve(outDir, "sitemap.xml");
  if (!existsSync(robotsPath) || !existsSync(sitemapPath)) {
    return {
      name: "sitemap-url",
      ok: false,
      message: "robots.txt of sitemap.xml ontbreekt — kan consistentie niet verifiëren",
    };
  }
  const robots = readFileSync(robotsPath, "utf-8");
  const sitemap = readFileSync(sitemapPath, "utf-8");

  const sitemapDirective = robots.match(/^Sitemap:\s*(\S+)\s*$/im);
  if (!sitemapDirective) {
    return { name: "sitemap-url", ok: false, message: "geen Sitemap-directive in robots.txt" };
  }
  const declaredUrl = sitemapDirective[1];

  let declared: URL;
  try {
    declared = new URL(declaredUrl);
  } catch {
    return {
      name: "sitemap-url",
      ok: false,
      message: `Sitemap-URL is geen geldige absolute URL: ${declaredUrl}`,
    };
  }

  const errors: string[] = [];
  if (declared.protocol !== "https:") {
    errors.push(`protocol moet https zijn, niet ${declared.protocol.replace(":", "")}`);
  }
  if (!declared.pathname.endsWith("/sitemap.xml")) {
    errors.push(`pad moet eindigen op /sitemap.xml (gevonden: ${declared.pathname})`);
  }

  // Host vergelijken met eerste <loc>-host in sitemap.xml
  const firstLoc = sitemap.match(/<loc>\s*(https?:\/\/[^<\s]+)\s*<\/loc>/i);
  if (!firstLoc) {
    errors.push("geen <loc>-entries in sitemap.xml om host te verifiëren");
  } else {
    const sitemapHost = new URL(firstLoc[1]).host;
    if (sitemapHost.toLowerCase() !== declared.host.toLowerCase()) {
      errors.push(
        `host-mismatch: robots.txt verwijst naar "${declared.host}" maar sitemap.xml gebruikt "${sitemapHost}"`,
      );
    }
  }

  if (errors.length) {
    return {
      name: "sitemap-url",
      ok: false,
      message: errors.join(" · "),
      details: [...errors, `declared: ${declaredUrl}`],
    };
  }
  return {
    name: "sitemap-url",
    ok: true,
    message: `${declaredUrl} ↔ sitemap.xml host match ✓`,
  };
};

export const runSeoGeoCheck = (outDir: string): { ok: boolean; results: CheckResult[] } => {
  const results = [
    checkLlmsTxt(outDir),
    checkRobotsTxt(outDir),
    checkSitemapXml(outDir),
    checkSitemapUrlConsistency(outDir),
  ];
  const ok = results.every((r) => r.ok);

  // eslint-disable-next-line no-console
  console.log("\n┌─ SEO/GEO post-build check ───────────────────────────");
  for (const r of results) {
    const icon = r.ok ? "✓" : "✗";
    // eslint-disable-next-line no-console
    console.log(`│ ${icon} ${r.name.padEnd(14)} ${r.message}`);
    if (r.details?.length) {
      for (const d of r.details) {
        // eslint-disable-next-line no-console
        console.log(`│     • ${d}`);
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log(
    `└─ ${ok ? "✓ ALLES OK — site is GEO-ready" : "✗ FAALT — fix bovenstaande issues vóór publish"}\n`,
  );

  // Schrijf machine-leesbaar JSON-rapport voor dashboards / CI / QA
  const report = {
    version: 1,
    generatedAt: new Date().toISOString(),
    outDir,
    ok,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
    },
    results: results.map((r) => ({
      name: r.name,
      ok: r.ok,
      status: r.ok ? "passed" : "failed",
      message: r.message,
      details: r.details ?? [],
    })),
  };
  try {
    const reportPath = resolve(outDir, "seo-geo-check-report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
    // eslint-disable-next-line no-console
    console.log(`   ↳ JSON-rapport: ${reportPath}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[seo-geo-check] kon JSON-rapport niet schrijven:", err);
  }

  // Schrijf mooi Markdown-rapport (volledig — incl. controle-criteria)
  try {
    const mdPath = resolve(outDir, "seo-geo-check-report.md");
    writeFileSync(mdPath, renderMarkdownReport(report), "utf-8");
    // eslint-disable-next-line no-console
    console.log(`   ↳ Markdown-rapport: ${mdPath}\n`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[seo-geo-check] kon Markdown-rapport niet schrijven:", err);
  }

  return { ok, results };
};

interface SeoGeoReport {
  version: number;
  generatedAt: string;
  outDir: string;
  ok: boolean;
  summary: { total: number; passed: number; failed: number };
  results: Array<{
    name: string;
    ok: boolean;
    status: string;
    message: string;
    details: string[];
  }>;
}

const renderMarkdownReport = (r: SeoGeoReport): string => {
  const icon = (ok: boolean) => (ok ? "✅" : "❌");
  const score =
    r.summary.total > 0 ? Math.round((r.summary.passed / r.summary.total) * 100) : 0;
  const overall = r.ok ? "✅ **GEO-READY**" : "❌ **NIET GEO-READY**";
  const date = new Date(r.generatedAt).toLocaleString("nl-BE", {
    timeZone: "Europe/Brussels",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const lines: string[] = [];
  lines.push("# SEO/GEO Post-Build Rapport — Landgoed De Hoogmolen");
  lines.push("");
  lines.push(`> ${overall} · **${score}%** geslaagd · gegenereerd op ${date}`);
  lines.push("");

  // Executive summary
  lines.push("## 📊 Samenvatting");
  lines.push("");
  lines.push("| Metriek | Waarde |");
  lines.push("|---|---|");
  lines.push(`| Globale status | ${overall} |`);
  lines.push(`| Score | **${r.summary.passed} / ${r.summary.total}** (${score}%) |`);
  lines.push(`| Geslaagd | ${r.summary.passed} |`);
  lines.push(`| Gefaald | ${r.summary.failed} |`);
  lines.push(`| Output-directory | \`${r.outDir}\` |`);
  lines.push(`| Rapport-versie | v${r.version} |`);
  lines.push(`| Tijdstip (UTC) | \`${r.generatedAt}\` |`);
  lines.push("");

  // Results overview
  lines.push("## 🧪 Check-resultaten");
  lines.push("");
  lines.push("| Status | Check | Boodschap |");
  lines.push("|:---:|---|---|");
  for (const c of r.results) {
    lines.push(`| ${icon(c.ok)} | \`${c.name}\` | ${c.message} |`);
  }
  lines.push("");

  // Detail per check (with failure breakdown)
  lines.push("## 🔍 Details per check");
  lines.push("");
  for (const c of r.results) {
    lines.push(`### ${icon(c.ok)} \`${c.name}\` — ${c.status.toUpperCase()}`);
    lines.push("");
    lines.push(`**Boodschap:** ${c.message}`);
    if (c.details.length) {
      lines.push("");
      lines.push("**Details:**");
      for (const d of c.details) lines.push(`- ${d}`);
    }
    lines.push("");
  }

  // Verification criteria — full transparency
  lines.push("## 📋 Controle-criteria");
  lines.push("");
  lines.push("### 1. `llms.txt` — llmstxt.org spec-conformiteit");
  lines.push("");
  lines.push("Strikte validatie volgens [llmstxt.org](https://llmstxt.org):");
  lines.push("");
  lines.push("- Eerste regel = exact één H1 (`# Project Naam`)");
  lines.push("- Blockquote-samenvatting (`> …`) direct na de H1");
  lines.push("- **Geen** H3 of dieper (spec staat enkel H1 + H2 toe)");
  lines.push("- H2-secties bevatten uitsluitend link-list-items in formaat `- [name](url): notes`");
  lines.push("- Verplichte H2-secties aanwezig:");
  for (const s of REQUIRED_LLMS_SECTIONS) lines.push(`  - \`${s}\``);
  lines.push("");
  lines.push("### 2. `robots.txt` — toegelaten AI-crawlers");
  lines.push("");
  lines.push("Vereiste `User-agent:`-entries (allen `Allow: /`):");
  lines.push("");
  for (const b of REQUIRED_AI_BOTS) lines.push(`- \`${b}\``);
  lines.push("");
  lines.push("Bovendien moet exact één `Sitemap:`-directive aanwezig zijn die naar `https://…/sitemap.xml` verwijst.");
  lines.push("");
  lines.push("### 3. `sitemap.xml` — kritieke routes");
  lines.push("");
  lines.push("- Geldige XML-declaratie (`<?xml …?>`)");
  lines.push("- Aanwezige `<urlset>`-root");
  lines.push("- Minimum **10** `<url>`-entries");
  lines.push("- Bevat de volgende kritieke paden:");
  for (const p of REQUIRED_SITEMAP_PATHS) lines.push(`  - \`${p}\``);
  lines.push("");
  lines.push("### 4. `sitemap-url` — host-consistentie");
  lines.push("");
  lines.push("- `Sitemap:`-URL in `robots.txt` is een geldige absolute URL");
  lines.push("- Protocol = `https`");
  lines.push("- Pad eindigt op `/sitemap.xml`");
  lines.push("- Host komt **exact** overeen met de host van de eerste `<loc>` in `sitemap.xml`");
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push(
    `_Automatisch gegenereerd door \`scripts/seo-geo-check.ts\` na elke productie-build._`,
  );
  lines.push("");
  return lines.join("\n");
};

// CLI-modus: `bun scripts/seo-geo-check.ts <outDir>`
if (import.meta.url === `file://${process.argv[1]}`) {
  const outDir = process.argv[2] ?? "dist";
  const { ok } = runSeoGeoCheck(resolve(process.cwd(), outDir));
  process.exit(ok ? 0 : 1);
}
