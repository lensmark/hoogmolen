/**
 * generate-sitemap.ts — Build-time sitemap generator (v4.22.7).
 *
 * Wordt aangeroepen door de Vite-plugin in `vite.config.ts` (closeBundle hook).
 *
 * Aggregeert ALLE bestaande routes:
 *   1. Statische routes uit `App.tsx` (geen :param's, geen /admin/*)
 *   2. Dynamische property-slugs uit `propertyConfig.ts`
 *      → mapped op type:
 *        - house  → /overnachten/vakantiewoningen/<slug>
 *        - duplex → /overnachten/suites-kamers/duplexsuites/<slug>
 *        - room|suite → /overnachten/suites-kamers/kamers/<slug>
 *   3. Unit-routes (verblijf-detail) uit `unitsConfig.ts`
 *      → /verblijf/<slug> (incl. duplexsuite/<slug> nested slugs)
 *   4. **NIEUW** — Activiteit detail-routes uit page-bestanden:
 *      - /activiteiten/wandelen/<slug>      (WandelDetail.tsx ROUTES)
 *      - /activiteiten/paardrijden/<slug>   (PaardrijdenDetail.tsx ROUTES)
 *      - /activiteiten/familie/<slug>       (FamilieDetail.tsx DATA)
 *      - /activiteiten/in-de-omgeving/<slug> (OmgevingDetail.tsx SPOTS)
 *
 * SEO-tags (priority + changefreq) per categorie:
 *   - Homepage          → priority 1.0, weekly
 *   - Property/Unit     → priority 0.9, weekly  (boekbare units = belangrijkst)
 *   - Hub-overzichten   → priority 0.8, weekly  (overnachten, vergaderen, …)
 *   - Activiteiten      → priority 0.7, monthly
 *   - Activiteit-detail → priority 0.6, monthly
 *   - Over-ons / Info   → priority 0.5, monthly
 *   - Juridisch         → priority 0.3, yearly
 *
 * Schrijft naar `<outDir>/sitemap.xml` + `public/sitemap.xml`.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const ORIGIN = "https://hoogmolen.be";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface UrlEntry {
  loc: string;
  changefreq: ChangeFreq;
  priority: string;
}

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Slimme priority + changefreq per pad-categorie. */
const seoTagsForPath = (path: string): { priority: string; changefreq: ChangeFreq } => {
  if (path === "/") return { priority: "1.0", changefreq: "weekly" };

  // Boekbare units (hoogste commerciële waarde)
  if (
    path.startsWith("/overnachten/vakantiewoningen/") ||
    path.startsWith("/overnachten/suites-kamers/kamers/") ||
    path.startsWith("/overnachten/suites-kamers/duplexsuites/") ||
    path.startsWith("/verblijf/") ||
    path.startsWith("/accommodaties/")
  ) {
    return { priority: "0.9", changefreq: "weekly" };
  }

  // Hub-/landingspagina's voor overnachten / groep / vergaderen / teambuildings
  if (
    path === "/overnachten" ||
    path === "/overnachten/vakantiewoningen" ||
    path === "/overnachten/suites-kamers" ||
    path === "/overnachten/suites-kamers/duplexsuites" ||
    path === "/overnachten/suites-kamers/kamers" ||
    path === "/groepsverblijf" ||
    path.startsWith("/groepsverblijf/") ||
    path.startsWith("/groepen/") ||
    path === "/vergaderen" ||
    path.startsWith("/vergaderen/") ||
    path === "/teambuildings" ||
    path.startsWith("/teambuildings/") ||
    path === "/paardenlogies"
  ) {
    return { priority: "0.8", changefreq: "weekly" };
  }

  // Activiteiten-hubs
  if (path === "/activiteiten" || /^\/activiteiten\/[^/]+$/.test(path)) {
    return { priority: "0.7", changefreq: "monthly" };
  }

  // Activiteit-detail (geneste slug)
  if (/^\/activiteiten\/[^/]+\/[^/]+$/.test(path)) {
    return { priority: "0.6", changefreq: "monthly" };
  }

  // Ervaringen / over-ons / contact / info
  if (
    path === "/ervaringen" ||
    path === "/wall-of-love" ||
    path === "/contact" ||
    path === "/faq" ||
    path === "/praktisch" ||
    path.startsWith("/praktisch/") ||
    path === "/over-ons" ||
    path.startsWith("/over-ons/")
  ) {
    return { priority: "0.5", changefreq: "monthly" };
  }

  // Juridisch + jobs
  if (
    path === "/privacy" ||
    path === "/algemene-voorwaarden" ||
    path === "/cookies" ||
    path === "/jobs"
  ) {
    return { priority: "0.3", changefreq: "yearly" };
  }

  return { priority: "0.5", changefreq: "monthly" };
};

/** Extract static routes (path="/foo/bar") uit App.tsx. */
const extractStaticRoutes = (appTsx: string): string[] => {
  const re = /<Route\s+path="([^"]+)"/g;
  const found = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(appTsx))) {
    const p = m[1];
    if (p === "*") continue;
    if (p.includes(":")) continue;
    // Skip relatieve paths (geneste routes binnen <Route path="/admin">)
    if (!p.startsWith("/")) continue;
    if (p.startsWith("/admin")) continue;
    found.add(p.replace(/\/+$/, "") || "/");
  }
  return Array.from(found);
};

/** Extract { slug, type } objects via regex. */
const extractProperties = (cfg: string): { slug: string; type: string }[] => {
  const re = /slug:\s*"([^"]+)"[\s\S]*?type:\s*"([^"]+)"/g;
  const out: { slug: string; type: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(cfg))) {
    out.push({ slug: m[1], type: m[2] });
  }
  return out;
};

const propertyToPath = (slug: string, type: string): string => {
  switch (type) {
    case "house":
      return `/overnachten/vakantiewoningen/${slug}`;
    case "duplex":
      return `/overnachten/suites-kamers/duplexsuites/${slug}`;
    case "room":
    case "suite":
      return `/overnachten/suites-kamers/kamers/${slug}`;
    default:
      return `/overnachten/${slug}`;
  }
};

/** Extract simpele `slug: "xxx"` matches uit een config-blob. */
const extractSlugs = (cfg: string): string[] => {
  const re = /slug:\s*"([^"]+)"/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(cfg))) out.push(m[1]);
  return out;
};

/**
 * Extract object-keys (slugs) uit een TS-bestand met patroon:
 *   const ROUTES: Record<string, X> = {
 *     "slug-name": { ... },
 *     ...
 *   };
 * We zoeken simpelweg naar `"slug": {` op kolom-positie 2/4.
 */
const extractObjectKeys = (src: string): string[] => {
  const re = /^\s+"([a-z0-9][a-z0-9-]+)":\s*\{/gm;
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) out.add(m[1]);
  return Array.from(out);
};

/** Veilige read — return "" als file ontbreekt. */
const safeRead = (root: string, rel: string): string => {
  try {
    return readFileSync(resolve(root, rel), "utf-8");
  } catch {
    return "";
  }
};

export const generateSitemapXml = (root: string): string => {
  const appTsx = readFileSync(resolve(root, "src/App.tsx"), "utf-8");
  const propCfg = readFileSync(resolve(root, "src/config/propertyConfig.ts"), "utf-8");
  const unitsCfg = safeRead(root, "src/config/unitsConfig.ts");
  const wandelSrc = safeRead(root, "src/pages/WandelDetail.tsx");
  const paardrijdenSrc = safeRead(root, "src/pages/PaardrijdenDetail.tsx");
  const familieSrc = safeRead(root, "src/pages/FamilieDetail.tsx");
  const omgevingSrc = safeRead(root, "src/pages/OmgevingDetail.tsx");

  const entries: UrlEntry[] = [];

  const push = (path: string) => {
    const tags = seoTagsForPath(path);
    entries.push({ loc: `${ORIGIN}${path}`, ...tags });
  };

  // 1) Statisch
  for (const path of extractStaticRoutes(appTsx)) push(path);

  // 2) Properties (detail-templates)
  for (const { slug, type } of extractProperties(propCfg)) {
    push(propertyToPath(slug, type));
  }

  // 3) Units (verblijf-detail variant) — slug kan "duplexsuite/de-fries" bevatten
  if (unitsCfg) {
    for (const slug of extractSlugs(unitsCfg)) push(`/verblijf/${slug}`);
  }

  // 4) Activiteit-detailpagina's — extract slugs uit de DATA/ROUTES/SPOTS objecten
  for (const slug of extractObjectKeys(wandelSrc)) push(`/activiteiten/wandelen/${slug}`);
  for (const slug of extractObjectKeys(paardrijdenSrc)) push(`/activiteiten/paardrijden/${slug}`);
  // Familie gebruikt array van objects met slug-veld → extractSlugs werkt hier
  for (const slug of extractSlugs(familieSrc)) push(`/activiteiten/familie/${slug}`);
  for (const slug of extractObjectKeys(omgevingSrc)) {
    push(`/activiteiten/in-de-omgeving/${slug}`);
  }

  // Dedupe op loc
  const seen = new Set<string>();
  const unique = entries.filter((e) => {
    if (seen.has(e.loc)) return false;
    seen.add(e.loc);
    return true;
  });

  // Stabiele sortering (alfabetisch op loc) voor leesbare diffs
  unique.sort((a, b) => a.loc.localeCompare(b.loc));

  const today = new Date().toISOString().slice(0, 10);
  const body = unique
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
};

export const writeSitemap = (root: string, outDir: string) => {
  const xml = generateSitemapXml(root);
  const count = xml.match(/<url>/g)?.length ?? 0;
  // 1) dist/sitemap.xml — geserveerd door Netlify/Vercel na deploy
  const distPath = resolve(outDir, "sitemap.xml");
  if (!existsSync(dirname(distPath))) mkdirSync(dirname(distPath), { recursive: true });
  writeFileSync(distPath, xml, "utf-8");
  // eslint-disable-next-line no-console
  console.log(`✓ sitemap.xml geschreven (${count} URLs) → ${distPath}`);
  // 2) public/sitemap.xml — gecommit in repo, zodat dev-preview & SEMrush
  //    direct toegang hebben (zelfs zonder build te draaien).
  try {
    const publicPath = resolve(root, "public/sitemap.xml");
    writeFileSync(publicPath, xml, "utf-8");
    // eslint-disable-next-line no-console
    console.log(`✓ public/sitemap.xml gesynchroniseerd (${count} URLs)`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[sitemap] public/sitemap.xml niet bijgewerkt:", err);
  }
};
