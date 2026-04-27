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
 * tijdens `vite build`. Gebruikt @sparticuz/chromium-min voor compatibiliteit
 * met Vercel's serverless build-omgeving (geen libnspr4/libgbm vereist).
 *
 * Skip via env: `PRERENDER=false vite build` (handig voor snelle dev-builds).
 */
const prerenderPlugin = async (): Promise<Plugin | false> => {
    if (process.env.PRERENDER === "false") return false;

    // Dynamisch importeren zodat het alleen geladen wordt tijdens een build
    const chromium = (await import("@sparticuz/chromium-min")).default;

    const executablePath = await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"
    );

    const routes = getPrerenderRoutes(__dirname);
    console.log(`[prerender] ${routes.length} routes will be snapshotted`);

    return prerender({
        routes,
        renderer: new PuppeteerRenderer({
            renderAfterDocumentEvent: "render-event",
            maxConcurrentRoutes: 2,
            headless: true,
            timeout: 60_000,
            launchOptions: {
                args: [
                    ...chromium.args,
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--blink-settings=imagesEnabled=false",
                ],
                executablePath,
                headless: true,
            },
            consoleHandler: (route: string, msg: { type: () => string; text: () => string }) => {
                const t = msg.type();
                if (t === "error" || t === "warning") {
                    console.log(`[prerender:${route}] ${t}: ${msg.text()}`);
                }
            },
        }),
        postProcess(renderedRoute: { route: string; html: string }) {
            // Voeg defer toe alleen aan externe JS-scripts (niet aan JSON-LD of inline scripts)
            renderedRoute.html = renderedRoute.html.replace(
                /<script ([^>]*src=[^>]*)>/g,
                (match, attrs) => {
                    if (attrs.includes("defer")) return match;
                    return `<script ${attrs} defer>`;
                },
            );
        },
    }) as Plugin;
};

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
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
        mode !== "development" && (await prerenderPlugin()),
    ].filter(Boolean) as Plugin[],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
}));
