/**
 * get-prerender-routes.ts — Verzamelt alle statische + dynamische routes
 * voor build-time prerendering (vite-plugin-prerender / @prerenderer).
 *
 * Hergebruikt dezelfde extractie-logica als generate-sitemap.ts, maar
 * geeft een platte string[] terug i.p.v. XML.
 *
 * Uitgesloten:
 *  - /admin/* (auth-vereist, niet voor SEO)
 *  - * (404-fallback)
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const safeRead = (root: string, rel: string): string => {
  try {
    return readFileSync(resolve(root, rel), "utf-8");
  } catch {
    return "";
  }
};
const extractStaticRoutes = (appTsx: string): string[] => {
  const re = /<Route\s+path="([^"]+)"/g;
  const found = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(appTsx))) {
    const p = m[1];
    if (p === "*") continue;
    if (p.includes(":")) continue;
    if (!p.startsWith("/")) continue;
    if (p.startsWith("/admin")) continue;
    found.add(p.replace(/\/+$/, "") || "/");
  }
  return Array.from(found);
};
const extractProperties = (cfg: string): { slug: string; type: string }[] => {
  const re = /slug:\s*"([^"]+)"[\s\S]*?type:\s*"([^"]+)"/g;
  const out: { slug: string; type: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(cfg))) out.push({ slug: m[1], type: m[2] });
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
const extractSlugs = (cfg: string): string[] => {
  const re = /slug:\s*"([^"]+)"/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(cfg))) out.push(m[1]);
  return out;
};
const extractObjectKeys = (src: string): string[] => {
  const re = /^\s+"([a-z0-9][a-z0-9-]+)":\s*\{/gm;
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) out.add(m[1]);
  return Array.from(out);
};
export const getPrerenderRoutes = (root: string): string[] => {
  const appTsx = readFileSync(resolve(root, "src/App.tsx"), "utf-8");
  const propCfg = readFileSync(resolve(root, "src/config/propertyConfig.ts"), "utf-8");
  // unitsConfig.ts niet meer gebruiken — de /verblijf/* routes bestaan niet meer
  // in de app. Alle property-routes worden al correct gegenereerd via propertyConfig.ts
  // + propertyToPath() hierboven.
  const wandelSrc = safeRead(root, "src/pages/WandelDetail.tsx");
  const paardrijdenSrc = safeRead(root, "src/pages/PaardrijdenDetail.tsx");
  const familieSrc = safeRead(root, "src/pages/FamilieDetail.tsx");
  const omgevingSrc = safeRead(root, "src/pages/OmgevingDetail.tsx");
  const all = new Set<string>();
  for (const p of extractStaticRoutes(appTsx)) all.add(p);
  for (const { slug, type } of extractProperties(propCfg)) all.add(propertyToPath(slug, type));
  for (const slug of extractObjectKeys(wandelSrc)) all.add(`/activiteiten/wandelen/${slug}`);
  for (const slug of extractObjectKeys(paardrijdenSrc)) all.add(`/activiteiten/paardrijden/${slug}`);
  for (const slug of extractSlugs(familieSrc)) all.add(`/activiteiten/familie/${slug}`);
  for (const slug of extractObjectKeys(omgevingSrc)) all.add(`/activiteiten/in-de-omgeving/${slug}`);
  return Array.from(all).sort();
};
