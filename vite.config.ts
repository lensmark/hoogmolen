import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeSitemap } from "./scripts/generate-sitemap";
import { runSeoGeoCheck } from "./scripts/seo-geo-check";
import { getPrerenderRoutes } from "./scripts/get-prerender-routes";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

/**
 * Sitemap-plugin — schrijft `dist/sitemap.xml` na de build en draait
 * vervolgens de SEO/GEO post-build check (llms.txt, robots.txt, sitemap.xml).
 */
const sitemapPlugin = (): Plugin => ({
  name: "hoogmolen-sitemap",
  apply: "build",
  closeBundle() {
    const outDir = path.resolve(__dirname, "dist");
    try {
      writeSitemap(__dirname, outDir);
    } catch (err) {
      console.warn("[sitemap] generation failed:", err);
    }
    try {
      runSeoGeoCheck(outDir);
    } catch (err) {
      console.warn("[seo-geo-check] verification failed:", err);
    }
  },
});

/**
 * Prerender-plugin — Puppeteer rendert iedere route naar statische HTML
 * tijdens `vite build`. Resultaat: per route een `index.html` met volledige
 * tekst + hero-images, zodat `view-source` (en SEO-crawlers) de content
 * direct zien zonder JS uit te voeren.
 *
 * Wacht op het `render-event` (gefired door AdminModeContext nadat de
 * Supabase-overrides geladen zijn) vóór de snapshot wordt gemaakt.
 *
 * Skip via env: `PRERENDER=false vite build` (handig voor snelle dev-builds).
 */
const prerenderPlugin = (): Plugin | false => {
  if (process.env.PRERENDER === "false") return false;
  const routes = getPrerenderRoutes(__dirname);
  console.log(`[prerender] ${routes.length} routes will be snapshotted`);
  return prerender({
    routes,
    renderer: new PuppeteerRenderer({
      renderAfterDocumentEvent: "render-event",
      maxConcurrentRoutes: 4,
      headless: true,
      timeout: 60_000,
      // Vercel build container heeft geen sandbox-priv → no-sandbox vereist
      launchOptions: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      // Log browser-console errors uit prerender-context naar build-output
      consoleHandler: (route: string, msg: { type: () => string; text: () => string }) => {
        const t = msg.type();
        if (t === "error" || t === "warning") {
          console.log(`[prerender:${route}] ${t}: ${msg.text()}`);
        }
      },
    }),
    postProcess(renderedRoute: { route: string; html: string }) {
      // Voorkom dat de SPA na hydratie naar `/` redirect (sommige routers doen dat)
      renderedRoute.html = renderedRoute.html.replace(
        /<script (.*?)>/g,
        "<script $1 defer>",
      );
    },
  }) as Plugin;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    sitemapPlugin(),
    mode !== "development" && prerenderPlugin(),
  ].filter(Boolean) as Plugin[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
