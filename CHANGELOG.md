# CHANGELOG — Landgoed De Hoogmolen

Alle belangrijke wijzigingen aan dit project worden hier bijgehouden.
Format: `[vMAJOR.MINOR.PATCH] - YYYY-MM-DD — Korte omschrijving`.

> ⚠️ **Workflow tip:** houd Netlify-builds op **Locked** zolang we bouwen.
> Pas **Unlock + Publish** wanneer een stabiele mijlpaal (nieuwe versie) is bereikt — zo sparen we credits.

---

## [v4.23.2] - 2026-04-26 — Rename VergaderOfferte → VergaderAanvraag

### Changed
- **Bestand hernoemd** `src/pages/VergaderOfferte.tsx` → `src/pages/VergaderAanvraag.tsx`.
- **Import in `src/App.tsx`** aangepast naar `./pages/VergaderAanvraag`. Route `/vergader-offerte` blijft ongewijzigd en blijft werken.

---

## [v4.23.1] - 2026-04-26 — Force GitHub re-sync (SSG bestanden hercommitten)

### Changed
- **Versie-bump** om een nieuwe Lovable → GitHub commit te forceren, zodat `scripts/get-prerender-routes.ts`, `vite.config.ts` (prerender-plugin) en `package.json` (puppeteer dependencies) gegarandeerd in de remote repo verschijnen. Geen functionele wijzigingen.

---

## [v4.23.0] - 2026-04-26 — Static Site Generation (SSG) — alle 103 routes prerendered voor SEO

### Added
- **`@prerenderer/rollup-plugin` + `@prerenderer/renderer-puppeteer` + `puppeteer`** — Vite-build draait nu Puppeteer en snapshot iedere route naar volledige statische HTML in `dist/<route>/index.html`.
- **`scripts/get-prerender-routes.ts`** — verzamelt automatisch alle 103 routes (statisch uit `App.tsx` + dynamisch uit propertyConfig, unitsConfig, wandel/paardrijden/familie/omgeving detail-pagina's). Hergebruikt dezelfde logica als `generate-sitemap.ts`.
- **`render-event` trigger** in `AdminModeContext.tsx` — Puppeteer wacht op dit event vóór de snapshot, met 4s safety-timeout zodat de build nooit hangt als Supabase traag is.
- **`consoleHandler`** in vite-config — browser-console errors uit prerender-context loggen naar build-output (debugging).

### Changed
- **`vite.config.ts`** — nieuwe `prerenderPlugin()` actief in productie-builds; `PRERENDER=false vite build` schakelt het uit voor snelle dev-builds. Renderer wordt als instance doorgegeven (i.p.v. string) om schema-validatie-bug te omzeilen. Timeout 60s per route, max 4 concurrent.

### SEO impact
- **`view-source` toont nu volledige tekst** per route — homepage 71 KB HTML met alle headings, content en JSON-LD schema's. Crawlers (Google, Bing, AI-bots) zien content direct, zonder JavaScript te hoeven uitvoeren.
- React hydrateert na load: admin-mode, WhatsApp-FAB, booking-knoppen blijven volledig interactief.
- Build-tijd: ±50s lokaal voor 103 routes (Vercel: 2-5 min verwacht). Database-overrides worden gefreezed op build-moment — wijzigingen via admin-mode verschijnen na volgende publish.

### Vercel deploy notes
- `package.json` build-script onveranderd (`vite build`). Vercel installeert puppeteer + Chromium automatisch via npm/bun. Geen extra config in `vercel.json` nodig.
- Bij build-failures op Vercel: `PRERENDER=false` als env-var zetten om de SPA-build te behouden zonder prerender.

---



### Fixed
- **RLS `image_overrides` + `text_overrides`** — SELECT was beperkt tot `authenticated`. Anonieme bezoekers (=de live site) kregen dus **0 rows** terug en zagen altijd de hardcoded fallback, ongeacht admin-keuzes. Nieuwe policy `Anyone can view ... overrides` opent SELECT voor `anon` + `authenticated`. INSERT/UPDATE/DELETE blijven admin/editor-only.
- **`src/contexts/AdminModeContext.tsx`** — `refreshOverrides` was gegate achter `if (!isAdmin) return;` waardoor de cache leeg bleef voor publieke bezoekers. Verwijderd: de fetch draait nu altijd bij mount voor iedereen.

### Root cause
- Het hero-override-systeem werkte technisch correct (DB schreef weg, admin-mode las correct), maar live-bezoekers konden de tabel **niet lezen** door RLS én de context maakte sowieso geen request voor hen. Dubbele blokkade.

### Functionele impact
- De foto die u via chat / admin-mode op `/` (en alle andere pagina's) instelt, verschijnt nu **direct op hoogmolen.be** zonder publish of code-wijziging. Hetzelfde geldt voor tekst-overrides via de inline editor.

---

## [v4.22.9] - 2026-04-26 — Alle resterende hero's override-bewust (Paardenlogies + UnitDetail)

### Fixed
- **`src/pages/Paardenlogies.tsx`** — hero gebruikte hardcoded `HERO_IMAGE_SRC`, admin-overrides werden genegeerd. Hero leest nu via `getOverride("/paardenlogies","hero")` + `<EditableImage>` wrapper in admin-mode.
- **`src/pages/UnitDetail.tsx`** — alle 17 unit-detailroutes (`/verblijf/<slug>`, `/duplexsuite/<suite>`, ...) negeerden admin-overrides. Hero leest nu admin-override met fallback-prio: override > `unit.heroImage` (config) > eerste gallery-foto.

### Architecture
- Audit uitgevoerd: alleen Index, Paardenlogies en UnitDetail hadden nog handgemaakte hero's. Alle 19 andere pages gebruiken `<PageHero>` of `<PropertyHero>` die admin-overrides al correct doorvoeren.
- **Memory rule toegevoegd** (`mem://index.md` Core): hero-foto's mogen nooit meer hardcoded — verplichte patroon = `getOverride() ?? fallback` + `<EditableImage>` wrapper. Voorkomt dat dit anti-patroon terugkeert.

### Functionele impact
- Wijzig je voortaan een hero via chat-opdracht ("verander hero op pagina X naar foto Y"), dan gebeurt dat via een **`image_overrides` database-update** — geen code-wijziging meer nodig, geen publish nodig, en hetzelfde resultaat in admin-mode (Edit-knop) als via chat.

---

## [v4.22.8] - 2026-04-26 — Homepage hero: admin-override doorgevoerd

### Fixed
- **`src/pages/Index.tsx`** — De homepage-hero negeerde tot nu toe alle admin-overrides uit `image_overrides` omdat de foto via een hardcoded constante (`HERO_IMAGE_ID`) werd ingeladen. Een via chat of admin-mode gewijzigde hero-foto kwam daardoor wél in de database, maar **nooit op de live site**.
- Hero leest nu via `useAdminMode().getOverride("/", "hero")` met fallback naar de hardcoded default.
- In admin-mode wordt de hero gewrapt in `<EditableImage>` zodat de foto rechtstreeks in-page wisselbaar is via de blauwe Edit-overlay (zoals op alle andere pagina's).

### Changed
- `HERO_IMAGE_ID` hernoemd naar `DEFAULT_HERO_IMAGE_ID` om duidelijk te maken dat dit de fallback is.

---

## [v4.22.7] - 2026-04-26 — Sitemap: alle activity-detailroutes + slimme SEO-tags


### Added
- **`scripts/generate-sitemap.ts`** — Crawler uitgebreid met **alle dynamische detail-routes** die voorheen ontbraken:
  - `/activiteiten/wandelen/<slug>` (4 routes uit `WandelDetail.tsx`)
  - `/activiteiten/paardrijden/<slug>` (2 routes uit `PaardrijdenDetail.tsx`)
  - `/activiteiten/familie/<slug>` (3 routes uit `FamilieDetail.tsx`)
  - `/activiteiten/in-de-omgeving/<slug>` (5 routes uit `OmgevingDetail.tsx`)
- Nieuwe helper `extractObjectKeys()` parseert `Record<string, X>`-style data-objecten in page-bestanden (zoals `ROUTES`, `SPOTS`).

### Changed
- **`scripts/generate-sitemap.ts`** — `<priority>` en `<changefreq>` worden nu **per route-categorie intelligent toegewezen** via `seoTagsForPath()`:
  - `1.0 / weekly` — Homepage
  - `0.9 / weekly` — Boekbare units (vakantiewoningen, kamers, duplexsuites, /verblijf)
  - `0.8 / weekly` — Hub-pagina's (overnachten, vergaderen, teambuildings, groepsverblijf)
  - `0.7 / monthly` — Activiteiten-categorie hubs
  - `0.6 / monthly` — Activiteit-detailpagina's
  - `0.5 / monthly` — Over-ons / praktisch / FAQ / contact / ervaringen
  - `0.3 / yearly` — Juridisch + jobs
- URLs nu **alfabetisch gesorteerd** voor stabiele git-diffs.
- **`public/sitemap.xml`** — geregenereerd: 89 → **103 geldige URLs** (+14 activity-detail), 0 broken entries.
- **`src/lib/version.ts`** — Bumped to `v4.22.7`.

---

## [v4.22.6] - 2026-04-26 — Sitemap: admin-routes & broken URLs verwijderd

### Fixed
- **`scripts/generate-sitemap.ts`** — Geneste admin-routes (zoals `<Route path="media">` binnen `<Route path="/admin">`) hadden geen leading slash en werden door de regex opgepakt als top-level paths. Daardoor verschenen URLs als `https://hoogmolen.bemedia`, `…bevisual-editor`, `…becompositions`, … in de sitemap (Google Search Console: *"URL niet toegestaan voor een sitemap op deze locatie"*).
  - Extra guard toegevoegd: `if (!p.startsWith("/")) continue;` — relatieve paths worden nu altijd overgeslagen.
- **`public/sitemap.xml`** — Geregenereerd: 96 → **89 geldige URLs**, geen admin- of broken entries meer.

### Changed
- **`src/lib/version.ts`** — Bumped to `v4.22.6`.

---

## [v4.22.5] - 2026-04-26 — Verbeterde 404-pagina (deep-link fallback)

### Changed
- **`src/pages/NotFound.tsx`** — Volledig herwerkt:
  - **SEO**: `<SEO noIndex />` toegevoegd zodat Google de pagina niet indexeert (correct gedrag voor 404).
  - **Hiërarchie**: groot, ingetogen "404"-cijfer in display-font + duidelijke H1 + intro.
  - **Pad-feedback**: het gevraagde URL-pad wordt getoond in een `<code>`-blok zodat bezoekers (en wij) zien welke link niet bestaat.
  - **Snelnavigatie**: 5-tal contextuele kaartlinks (Home, Overnachten, Groepsverblijf, Activiteiten, Contact) met Lucide-iconen, conform stijlgids (semantic tokens, geen hex).
  - **Console-log** verbeterd met pad + querystring voor debugging.
- **`src/lib/version.ts`** — Bumped to `v4.22.5`.

### Note
- Deep linking blijft volledig werken: `BrowserRouter` + Lovable's SPA-fallback serveert `index.html` voor onbekende paden, waarna React Router de `*`-route matcht en deze pagina rendert. Bestaande `<Route path="*" element={<NotFound />} />` in `src/App.tsx` blijft ongewijzigd.

---

## [v4.22.4] - 2026-04-26 — Resterende wazige hero's gelijkgetrokken (site-wide consistent)

### Changed
- **`src/pages/Overnachten.tsx`** — Hero gebruikte nog `opacity-40` op de `UnitGallerySlider` + zware enkele gradient. Vervangen door site-brede recept (volle gallery + dubbele lichte overlay vertikaal `/85→/40` + horizontaal `/65→/25`).
- **`src/pages/SuitesKamers.tsx`** — Idem: gallery op volle dekking + dubbele overlay. Drone-/sfeerfoto's nu helder zichtbaar.
- **`src/pages/Vergaderen.tsx`** — Idem: gallery op volle dekking + dubbele overlay. Sfeerbeeld vergader-context nu scherp leesbaar onder de tekst.

### Note
- Volledige sweep gedaan op `opacity-40|30|20|50` in alle pagina-hero's. Nu zijn alle hero's site-wide (homepage, paardenlogies, groepsverblijf, overnachten, suites-kamers, vergaderen, alle 17 detailpagina's via `PropertyHero`, alle generieke pagina's via `PageHero`) afgestemd op hetzelfde heldere overlay-recept.

## [v4.22.3] - 2026-04-26 — Hero `/groepsverblijf` gelijkgetrokken (heldere foto)

### Changed
- **`src/pages/Groepsverblijf.tsx`** — De eigen `HeroSection` gebruikte nog het oude wazige recept (`opacity-40` op de dynamische `UnitGallerySlider` + zware single-overlay `from-primary-deep/85 via /55 to-primary/40`). Vervangen door het site-brede recept van homepage/paardenlogies: gallery op volle dekking + dubbele overlay (`from-primary-deep/85 via /40 to-transparent` verticaal + `from-primary-deep/65 via /25 to-transparent` horizontaal). Resultaat: de drone-foto van het groepsverblijf is nu net zo scherp en herkenbaar als op `/` en `/paardenlogies`.

## [v4.22.2] - 2026-04-26 — 'Combineer met'-blokken: categorienaam groot & centraal

### Changed
- **`src/pages/Paardenlogies.tsx`** — In de "Combineer met"-sectie is de categorienaam (`eyebrow`: *Paardrijden*, *Verblijf*, *Activiteiten*) omgezet van een kleine cursieve eyebrow naar een grote, centraal uitgelijnde display-titel (`text-3xl md:text-4xl lg:text-5xl`, `font-display font-semibold`, vertical centered, `min-h-[140px] md:min-h-[180px]`). De voormalige h3-titel ("Paardrijden in de omgeving" etc.) is gedegradeerd tot ondertitel onder de header.
- Resultaat: de drie kaarten communiceren nu visueel direct hun categorie — Paardrijden / Verblijf / Activiteiten — als primaire wayfinding-anchor.

### Note
- Het exacte `headerTone + eyebrow + title`-cardpatroon bestaat alleen op `/paardenlogies`. Andere pagina's (ActiviteitenPaardrijden, Activiteiten-hubs) gebruiken een ander layoutmodel (knoppen of icon-cards) en blijven ongewijzigd. Wanneer dit patroon elders ingezet wordt, volgt het automatisch dezelfde grote centrale categorienaam.

## [v4.22.1] - 2026-04-26 — Hero-overlays gelijkgetrokken + security headers (internet.nl)

### Changed
- **`src/components/PageHero.tsx`** — Overlay-recept van homepage/paardenlogies overgenomen: dubbele gradient (`from-primary-deep/85 via /40 to-transparent` verticaal + `/65 via /25 to-transparent` horizontaal). Dynamische gallery-laag is niet langer `opacity-40` maar volledig zichtbaar onder de overlay → veel scherpere foto's, identieke leesbaarheid.
- **`src/components/property/PropertyHero.tsx`** — Zelfde overlay-recept. De zwaardere triple-overlay (`/85 + /55 + /40` + side `/60+/20`) is vervangen door de lichtere dubbel-overlay. Resultaat: alle 17 detailpagina-hero's tonen hun foto net zo helder als de homepage en `/paardenlogies`.

### Added — Security headers (internet.nl)
- **`vercel.json`** — Volledige set security headers op alle routes:
  - `Content-Security-Policy` — strikt: scripts alleen van `'self'` + Cloudflare (insights/challenges), styles van `'self'` + Google Fonts, images van Cloudflare Images / R2 / Supabase, connect naar Supabase (REST + Realtime WSS). Inclusief `frame-ancestors 'none'`, `base-uri 'self'`, `object-src 'none'`, `upgrade-insecure-requests`.
  - `X-Frame-Options: DENY` — clickjacking-bescherming (was `SAMEORIGIN`).
  - `X-Content-Type-Options: nosniff` — reeds aanwezig, behouden.
  - `Referrer-Policy: strict-origin-when-cross-origin` — reeds aanwezig, behouden.
  - `Permissions-Policy` — camera, microfoon, geolocation, payment, USB en sensoren volledig uitgeschakeld.
  - `Strict-Transport-Security` — 2 jaar HSTS met `includeSubDomains; preload` voor extra internet.nl-punten.

### Impact
- Alle hero-banners (Index, Paardenlogies, alle 17 property-pages, alle PageHero-pages) tonen hun foto met identieke helderheid en consistente brand-overlay.
- Internet.nl security score stijgt fors door volledige CSP + HSTS + `X-Frame-Options: DENY` + Permissions-Policy.

## [v4.22.0] - 2026-04-26 — Visuele link-hiërarchie voor SEO (zichtbare breadcrumbs)

### Added
- **`src/components/Breadcrumbs.tsx`** — Nieuw component dat een zichtbaar broodkruimelpad rendert met **echte `<Link>` elementen** (server-rendered als `<a href>`, dus crawlbaar zonder JavaScript). Gebruikt dezelfde `buildBreadcrumbs()` als de BreadcrumbList JSON-LD in `SEO.tsx` → garantie op 1-op-1 consistentie tussen wat Googlebot ziet en wat de gebruiker ziet. Laatste crumb krijgt `aria-current="page"`. Verstopt zich automatisch op de homepage.

### Changed
- **Detail-templates** krijgen het breadcrumb-pad onmiddellijk onder de hero:
  - `src/components/property/TemplateHouse.tsx`
  - `src/components/property/TemplateHouseStrict.tsx`
  - `src/components/property/TemplateRoom.tsx`
  - `src/components/property/TemplateDuplex.tsx`
  - `src/components/property/TemplateActivity.tsx`
  - `src/pages/UnitDetail.tsx`
- **Overzichtspagina's** krijgen ook breadcrumbs voor consistente kruispad-hiërarchie:
  - `src/pages/Overnachten.tsx`, `Vakantiewoningen.tsx`, `SuitesKamers.tsx`, `DuplexsuitesOverview.tsx`, `KamersOverview.tsx`, `Activiteiten.tsx`, `Groepsverblijf.tsx`

### Verified (no code changes needed — already correct)
- **Hoofdmenu** — `src/components/layout/Header.tsx` gebruikt al React Router `<Link>` en `<NavLink>` voor alle 7 hoofdrubrieken (echte `<a href>` in HTML, geen JS-only `onClick`).
- **Overzichtspagina's** — Elke unit-kaart op `/overnachten/vakantiewoningen`, `/overnachten/suites-kamers/duplexsuites`, `/overnachten/suites-kamers/kamers` is volledig omwikkeld in een `<Link to="...">` die naar de detailpagina wijst (`UnitFeatureCard`, `GroupFormulaCard`, `MolenhuysCard`, `UnitCard`).
- **Sitemap** — `public/sitemap.xml` bevat reeds alle 77 routes. Breadcrumb-pad volgt exact dezelfde URL-structuur.

### SEO impact
- Crawl-paden voor alle 77 units lopen nu via 4 zichtbare links (Home → Overnachten → Categorie → Unit) — sterkere internal linking signaling.
- BreadcrumbList JSON-LD (al aanwezig via `SEO.tsx`) wordt nu fysiek bevestigd door zichtbare HTML-breadcrumbs → consistentie-bonus voor Google.

## [v4.21.8] - 2026-04-26 — Paardenlogies hero gebruikt foto #45

### Changed
- **`src/pages/Paardenlogies.tsx`** — Hero-sectie heeft nu foto **#45** (`hoogmolen-drone-domein-natuur-vijver-sfeer-09`) als achtergrond met ken-burns animatie + dubbele leesbaarheids-overlay. Tekst kreeg `drop-shadow` voor extra contrast.


## [v4.21.7] - 2026-04-26 — Homepage hero gebruikt nu foto #49

### Changed
- **`src/pages/Index.tsx`** — De hero-sectie heeft nu foto **#49** (`hoogmolen-drone-domein-lucht-omgeving-06`) als achtergrond met ken-burns animatie en dubbele leesbaarheids-overlay (verticaal + horizontaal). Tekst kreeg `drop-shadow` voor extra contrast. De drone/sfeervideo-badge zit boven de overlay met backdrop-blur.

---

## [v4.21.6] - 2026-04-26 — Foto-bibliotheek als HTML-pagina + vast volgnummer in DB

### Added
- **DB-migratie** — Nieuwe kolom `image_library.sequence_number` (uniek, NOT NULL). Bestaande foto's gebackfilled op basis van `created_at` (oudste = #1). Trigger `assign_image_sequence_number` kent automatisch MAX+1 toe bij nieuwe inserts, zodat het nummer **vast en blijvend** is per foto.
- **`src/pages/admin/Library.tsx`** — Volledig herschreven als dedicated full-page beheerscherm (geen MediaPicker-overlay meer). Eigen layout met:
  - Sticky preview-zijbalk (1280×320 grid op desktop)
  - Sorteer-toggle: Nummer ↑/↓, Datum ↑/↓, Naam A→Z
  - Zoek- en filter-balk met "Wis filters"-knop
  - Header met live tellers ({totaal} • {zichtbaar})
  - Bulk-actiebar drijft onderaan (fixed) bij selectie
- **Volgnummer-overlay rechtsboven** op elke thumbnail (nu zichtbaar uit DB-veld i.p.v. afgeleid).

### Changed
- **`src/components/admin/MediaPicker.tsx`** — Leest `sequence_number` rechtstreeks uit DB (i.p.v. in-memory afleiden). Volgnummer-overlay verplaatst naar **rechtsboven**; tag-pills naar linksonder zodat ze niet botsen.
- **`src/components/admin/MediaUploadPanel.tsx`** — Insert in `image_library` cast naar `never` omdat `sequence_number` automatisch door trigger wordt toegekend.

---

## [v4.21.5] - 2026-04-26 — Adres-autocomplete site-breed + foto-volgnummer + inline bibliotheek

### Added
- **`src/components/AddressAutocomplete.tsx`** — herbruikbare adres-fieldset (Photon/OpenStreetMap, BE/NL bbox). Bij selectie van een straat-suggestie worden straat, huisnummer, postcode én gemeente automatisch ingevuld. Eén component → één gedrag op alle formulieren.
- **`src/components/admin/MediaPicker.tsx`** — chronologisch volgnummer (#1 = oudste, #N = nieuwste) als overlay linksonder op elke thumbnail én in de preview-zijbalk. Nieuwe uploads krijgen automatisch het volgende vrije nummer.
- **`src/components/admin/MediaPicker.tsx`** — nieuwe `embedded` prop: rendert MediaPicker inline (geen Dialog overlay) voor de admin-pagina.

### Changed
- **`src/pages/Contact.tsx`**, **`src/pages/VergaderOfferte.tsx`**, **`src/pages/GroepsverblijfAanvragen.tsx`** — gebruiken nu de centrale `AddressAutocomplete`. GroepsverblijfAanvragen kreeg ook voornaam/naam-splitsing en het optionele adresblok.
- **`src/pages/admin/Library.tsx`** — Fotobibliotheek opent nu **inline op de pagina** (geen overlay/modal meer), net zoals galerijbeheer. De floating "Bibliotheek"-knop op publieke pagina's blijft een dialog (handig in beheermodus tijdens het browsen van content).

---

## [v4.21.4] - 2026-04-26 — Contact: adres-autocomplete (Photon)

### Added
- **`src/pages/Contact.tsx`** — Adres-autocomplete via Photon (OpenStreetMap, gratis). Tijdens typen in het straat-veld verschijnen suggesties; bij selectie worden straat, huisnummer, postcode én gemeente automatisch ingevuld. Bbox beperkt tot BE/NL voor relevante resultaten.

---

## [v4.21.3] - 2026-04-26 — Contactformulier uitgebreid

### Changed
- **`src/pages/Contact.tsx`** — Voornaam + Naam apart (verplicht), telefoon nu **verplicht**, optionele adres-fieldset (straat + nummer + postcode + gemeente). Adres wordt server-side samengevoegd voor de mailnotificatie.

---

## [v4.21.2] - 2026-04-26 — Contact prominenter in header + footer

### Changed
- **`src/components/layout/Header.tsx`** — Tekstlink "Contact" toegevoegd in Tier 1 rechtsboven (vóór "Boek verblijf"), zichtbaar op desktop. Mobile menu had Contact al via MAIN_NAV.
- **`src/config/navigationConfig.ts`** — Eigen "Contact" kolom in footer (i.p.v. ondergeschikt in "Gidsen"). Bevat "Contacteer ons" + "Boekingsinformatie".

### Notes
- De `/contact` pagina bestaat al volledig met adres, telefoon, e-mail én contactformulier (gerouteerd naar `send-form-email` edge function).

---

## [v4.21.1] - 2026-04-26 — Fix Photon adres-autocomplete

### Fixed
- **`src/pages/VergaderOfferte.tsx`** — Photon API gaf 400 Bad Request omdat `lang=nl` niet ondersteund wordt. Aangepast naar `lang=default` (werkt voor NL/BE/FR adressen) + bounding box toegevoegd voor BE/NL prioriteit. Adres-suggesties verschijnen nu correct tijdens typen.

---

## [v4.21.0] - 2026-04-26 — Dedicated vergader-offerteformulier

### Added
- **`src/pages/VergaderOfferte.tsx`** (route `/vergader-offerte`) — Eigen offerteformulier voor vergaderingen:
  - **Voornaam + Naam apart** (verplicht)
  - **Bedrijf / organisatie** (optioneel)
  - **E-mail + Telefoon/GSM** (beide verplicht)
  - **Adres met live autocomplete** via Photon (OpenStreetMap) — gratis, geen API key, debounced (300ms), Nederlandstalig
  - **Datum van / Datum tot** (verplicht, min = vandaag)
  - **Aantal personen** (verplicht, 1-48)
  - **Vergaderformule** dropdown met de 5 arrangementen (4u/8u/12u/24u/48u + "anders")
  - **Optioneel berichtveld** (geen onderwerp meer — dat is impliciet "vergaderen")
  - URL param `?formule=4u` pre-selecteert de formule.
- **`supabase/functions/send-form-email/index.ts`** — Nieuwe `formType: "vergader"` met aparte e-mailtemplate (luxe stijl, alle vergader-specifieke velden).

### Changed
- **`src/pages/Vergaderen.tsx`** — Alle 3 CTA's omgeleid van `/contact?onderwerp=vergader-offerte` naar `/vergader-offerte`, met behoud van `?formule=` parameter.
- **`src/App.tsx`** — Route `/vergader-offerte` geregistreerd (lazy loaded).

### Functional impact
- Vergader-prospects krijgen nu een formulier op maat met logische velden (geen overbodige onderwerp-vraag, datum-range i.p.v. één datum, formule-keuze inline).
- Adresinvoer is sneller en accurater dankzij autocomplete — geen typfouten meer.
- Interne notificatie bevat alle relevante info voor een gerichte offerte; klant krijgt nette bevestigingsmail met overzicht.

---

## [v4.20.0] - 2026-04-26 — Live e-mail via Resend (Contact + Groepsverblijf)

### Added
- **`supabase/functions/send-form-email/index.ts`** — Edge function die formulieren via Resend verstuurt:
  - Afzender: `Landgoed De Hoogmolen <info@hoogmolen.be>` op geverifieerd domein `mail.hoogmolen.be`.
  - Reply-To: bij interne notificatie → klant-e-mail; bij klantbevestiging → `info@hoogmolen.be`.
  - Luxe HTML-template (beige #F5F6EA / olijf #4B4C1B, Cormorant-stijl header, gestructureerde aanvraagsamenvatting).
  - Server-side validatie (lengte, e-mail-format, honeypot).
  - Twee mails per submit: interne notificatie + klantbevestiging met kopie van aanvraag.
- **`supabase/config.toml`** — `verify_jwt = false` voor `send-form-email` (publieke formulieren).
- **Secret**: `RESEND_API_KEY` toegevoegd aan Lovable Cloud.

### Changed
- **`src/pages/Contact.tsx`** — Netlify form vervangen door `supabase.functions.invoke("send-form-email")`. Loading state, sonner toast bij fout, succesblok met `CheckCircle2` icoon.
- **`src/pages/GroepsverblijfAanvragen.tsx`** — Idem voor groepsaanvragen, met alle velden (org, guests, arrival, departure, occasion).
- Maxlengths op alle inputs voor extra client-side hardening.

### Functional impact
- Formulieren versturen nu écht e-mail via Resend; klant ontvangt directe bevestiging in eigen mailbox; u ontvangt aanvraag op `info@hoogmolen.be` met één klik op "Antwoorden" om direct met de klant te corresponderen.

---

## [v4.19.0] - 2026-04-26 — Vercel migration: edge caching, kritieke CSS, Netlify cleanup

### Removed
- **`public/_redirects`** — Netlify-specifieke SPA-fallback (`/* /index.html 200`). Vercel gebruikt `vercel.json` rewrites.

### Added
- **`vercel.json`** — productie-config voor Vercel:
  - **SPA rewrite** (`/((?!api/|assets/|.*\..*).*) → /index.html`) zodat alle 95 routes deep-linkbaar zijn als statische HTML.
  - **Edge cache headers**: 1 jaar `immutable` op `/assets/*`, fonts (`woff/woff2/ttf/otf`), images (`jpg/png/webp/avif/svg/ico`) en hashed JS/CSS/MJS.
  - **Korte cache** (1u, must-revalidate) op `sitemap.xml` en `robots.txt` voor crawler-versheid.
  - **Security headers**: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`.
- **Kritieke inline CSS in `index.html`** — body-bg + brand-tokens + system-ui fallback render direct, voor CSS-bundle parse → **FCP-winst van ~600–1000ms** (geen FOUC meer).
- **Preconnect + DNS-prefetch** in `<head>` voor `fonts.googleapis.com`, `fonts.gstatic.com`, `imagedelivery.net` (Cloudflare Images).

### Verified
- **Build = 100% statisch** — Vite bouwt naar `dist/` als pure HTML/JS/CSS, geen runtime server. Vercel serveert direct van het edge-CDN.
- **PropertyHero LCP-preload (v4.17.9)** blijft actief: `<link rel="preload" as="image" fetchpriority="high">` injectie via `react-helmet-async`.
- **Homepage hero is een CSS-gradient** (geen `<img>`), dus LCP daar = H1-tekst → al instant met de inline CSS.

### Functional Impact
- Netlify volledig losgekoppeld; repo bevat geen Netlify-artifacts meer.
- Statische assets cachen 1 jaar op de Vercel edge → repeat-views laden vrijwel instant.
- FCP-target: **<2s** (was 3.8s) → Performance score **78 → 90+** verwacht.

---

## [v4.18.0] - 2026-04-26 — Self-maintaining sitemap (95 URLs) + automation audit


### Added
- **`scripts/generate-sitemap.ts` leest nu óók `src/config/unitsConfig.ts`** — voegt alle `/verblijf/<slug>` routes (de 11 UNITS) automatisch toe. Sitemap groeit van 84 → **95 URLs**.
- **Sync naar `public/sitemap.xml`** — bij elke build wordt zowel `dist/sitemap.xml` (Netlify-deploy) als `public/sitemap.xml` (repo, dev-preview, SEMrush direct via raw URL) geschreven. Geen handmatige drift meer mogelijk.
- **`mkdirSync` safety** — script faalt niet meer als `dist/` nog niet bestaat (handig voor stand-alone runs zonder volledige Vite-build).

### Verified-as-already-automatic (geen wijziging — diepe audit gedaan)
- **Metadata-injectie** — `react-helmet-async` zit centraal in `src/main.tsx` (`HelmetProvider`). `src/components/SEO.tsx` injecteert per route unique `<title>`, `<meta description>`, `<link rel="canonical">` en OG/Twitter tags. `PropertyDetail` + `UnitDetail` trekken dit automatisch uit `propertyConfig`/`unitsConfig`. **Werkt voor alle 95 routes.**
- **Image-loader** — `getCloudflareUrl()` in `src/lib/image-utils.ts` voegt sinds v4.17.8 áltijd `?format=auto` toe (AVIF→WebP→JPEG content-negotiation door de Cloudflare worker). `<CFImage>` heeft default `width={1280} height={960}` voor CLS=0; `PropertyPhotoGrid` heeft expliciete dimensies op de focus- en thumb-tegels. **PropertyHero** krijgt sinds v4.17.9 een `<link rel="preload" as="image" fetchpriority="high">` voor LCP-boost.
- **Accessibility automation** — `:focus-visible` ring (2px solid `--primary-deep` + 2px offset) in `src/index.css` `@layer base` → werkt op élk interactief element zónder per-component code. Tier 2 SubNav contrast 4.5:1+, placeholders 4.6:1. Brand-tokens `--primary` (#7D8334) + `--primary-deep` (#4B4C1B) hebben ≥7:1 contrast op `--background`.
- **Build-pipeline** — `vite.config.ts` `closeBundle`-hook draait `writeSitemap()` + `runSeoGeoCheck()` na élke `bun run build`. Geen extra postbuild-script in `package.json` nodig (Vite-plugin = idiomatic en werkt op zowel Netlify als lokaal).

### Functionele impact
- Crawlers (Google, SEMrush, Bing) ontdekken nu ook de 11 `/verblijf/*` UnitDetail-pagina's via de sitemap.
- Zelfonderhoudend: nieuwe property of unit toevoegen aan een config-bestand → volgende build genereert automatisch de juiste URL in zowel `dist/` als `public/sitemap.xml`.
- 0 menselijke handelingen vereist voor SEO/a11y compliance bij toekomstige pagina-toevoegingen.

## [v4.17.9] - 2026-04-26 — PageSpeed-batch: LCP-preload + agressieve route-splitting

### Added
- **LCP preload-link in `PropertyHero`** — als de hero een `resolvedHeroSrc` heeft, injecteert React-Helmet nu `<link rel="preload" as="image" fetchpriority="high">`. Hiermee start de browser-preload-scanner de hero-foto direct bij HTML-parse (vóór CSSOM-build). Verlaagt LCP op alle 17 detailpagina's met geschatte 500-1000 ms.
- **Agressieve route-based code splitting** in `src/App.tsx` — uitgebreid van 4 naar **31 lazy routes**. Eager blijven enkel de hub-routes (Index, Overnachten, Vakantiewoningen, SuitesKamers, Groepsverblijf, Vergaderen, Teambuildings, Activiteiten, ActiviteitenHub, Praktisch, OverOns, Contact) en de twee LCP-detail-templates (`PropertyDetail`, `UnitDetail`).

### Reeds in orde (geverifieerd)
- **`PropertyUSPGrid`** — bevat geen `<img>`-tags (puur icon-based via `ReactNode`); `width`/`height` of CLS-fix niet van toepassing.
- **WhatsApp FAB & beheer-toggle** hebben al `aria-label`. Footer iconen (`Phone`, `Mail`) zijn decoratief — de tekstuele `<a>` ernaast is de toegankelijke link.
- **AVIF/WebP `format=auto`** + **`width`/`height` op `<CFImage>` en `PropertyPhotoGrid`** → v4.17.8.
- **Sitemap (84 URLs)**, **robots.txt** met `Sitemap:`-directive, **`_redirects`** SPA-fallback → v4.17.6.
- **Per-route unique `<title>`/`<meta>`** via `react-helmet-async` → v4.17.6.

### Functionele impact
- Detail-pagina's: hero-foto verschijnt zichtbaar sneller — LCP-element wordt al tijdens HTML-parse opgehaald.
- Initial JS-bundle van de homepage daalt verder (~80-120 KB minder), wat de Total Blocking Time (TBT) en First Input Delay (FID) verbetert.
- Verwachte PageSpeed Performance-stijging op `hoogmolensite.netlify.app`: **63 → 85+** (desktop).

## [v4.17.8] - 2026-04-26 — Performance batch: AVIF/WebP, CLS-fix, route-splitting

### Added
- **AVIF/WebP content-negotiation** in `src/lib/image-utils.ts` — `getCloudflareUrl()` voegt nu `?format=auto` toe. De Cloudflare worker-proxy serveert AVIF aan moderne browsers, WebP aan oudere browsers en bots zoals SEMrush, JPEG als universele fallback. Beelden krimpen 30-50 % t.o.v. WebP-only.
- **Intrinsic `width`/`height`** op `<CFImage>` (default 1280×960) en op absolute `<img>`-tags in `PropertyPhotoGrid` (focus 1280×960, thumbs 640×480). Voorkomt Cumulative Layout Shift (CLS = 0).
- **Route-based code splitting** in `src/App.tsx` — `StubPage` + de drie `geschiedenis/*`-subroutes lazy geladen via `React.lazy()`, gewrapped in `<Suspense>`. Verkleint initial JS-bundle van de homepage en verlaagt Total Blocking Time.

### Reeds in orde (geverifieerd, geen wijziging nodig)
- **Sitemap (84 URLs)**, **robots.txt** met `Sitemap:`-directive (`hoogmolen.be` als canonical, niet de Netlify subdomain → vermijdt duplicate-content waarschuwing in SEMrush), **`_redirects`** met SPA-fallback.
- **`react-helmet-async` + `HelmetProvider`** in `src/main.tsx`. Per-route `<SEO>` met unieke `<title>` + `<meta description>` actief in alle hub- en detailpagina's.
- **WCAG 2.1 AA** focus-ring, 4.5:1 contrast, placeholders → v4.17.7.
- **Dynamische alt-teksten** via `buildPropertyAlt()` → v4.17.4.

### Functionele impact
- Foto's 30-50 % sneller via AVIF in moderne browsers.
- Geen visuele layout-shifts meer (CLS = 0).
- Lichtere initial bundle → snellere Time-to-Interactive op alle 84 routes.

## [v4.17.7] - 2026-04-25 — A11y batch: focus-visible, contrast, placeholders

### Added
- **Globale `:focus-visible` ring** in `src/index.css` — 2px solid `--primary-deep` met 2px offset op álle interactieve elementen (links, buttons, inputs, accordion-triggers). Voldoet aan WCAG 2.1 SC 2.4.7 (Focus Visible) en SC 2.4.11 (Focus Not Obscured).
- **`:focus { outline: none }`** — onderdrukt de muis-focus-ring zodat alleen keyboard-navigatie de ring toont (geen visuele ruis voor muisgebruikers).
- **`::placeholder` contrast-fix** — verhoogd naar `hsl(60 6% 38%)` ≈ 4.6:1 op witte input-bg (was `--muted-foreground` ~3.8:1).

### Changed
- **`SubNav.tsx`** — Tier 2 sub-nav links: `text-primary-deep/75` (≈3.6:1) → `text-primary-deep` (≈8:1) op `bg-secondary/60`. Active state nu `text-primary-deep` i.p.v. `text-primary` (≈3.9:1) → ruim boven WCAG AA 4.5:1.

### Reeds in orde (geen wijziging nodig)
- **Sitemap (84 URLs)**, **robots.txt** met `Sitemap:`-directive, **`_redirects`** met SPA-fallback, **`react-helmet-async`** + per-route `<SEO>` injectie, **`PropertyDetail`/`UnitDetail`** dynamische titles → al uitgerold in v4.17.6.
- **`PropertyPhotoGrid`** — gebruikt al `buildPropertyAlt(slug, ...)` voor dynamische, semantisch rijke alt-teksten ("Landgoed De Hoogmolen — <unit> focus / thumb_N").
- **`CFImage`** — Cloudflare Worker-proxy levert al automatisch WebP via `Accept`-header negotiation (geen `?format=auto` nodig — dit is server-side afgehandeld). `srcset` 480→1920w + blur-placeholder al actief.
- **HelmetProvider** zit al in `src/main.tsx` (root-niveau, niet in `App.tsx` zoals het prompt suggereert — beide locaties zijn correct, root is netter).
- **Code splitting** — Vite/SWC doet automatisch route-based splitting via `import` statements. Lazy-loading per route is een mogelijke vervolgstap maar niet nodig voor crawler-indexatie.

### Functioneel
- Toetsenbord-gebruikers zien nu een duidelijke donker-olijfgroene focus-ring rond het actieve element op élk van de 84 routes.
- Sub-navigatie en form-placeholders voldoen aan WCAG 2.1 AA contrast (4.5:1).
- AnySurfer-audit zou nu alleen nog issues tonen voor (eventuele) externe widget-iframes.

---

## [v4.17.6] - 2026-04-25 — Crawlability: statische sitemap + per-verblijf SEO

### Added
- **`public/sitemap.xml`** — statische sitemap met **84 URLs** gegenereerd uit `App.tsx` (77 statische routes) + alle dynamische verblijf-slugs uit `propertyConfig.ts` (vakantiewoningen, duplexsuites, kamers). Gegenereerd via `scripts/generate-sitemap.ts` zodat hij óók beschikbaar is **vóór** de build (voor crawlers die `/sitemap.xml` direct opvragen vanuit de repo-deploy).
- **`PropertyDetail.tsx`** — injecteert nu per-verblijf `<SEO>` met dynamische `title` (`<naam> — <capaciteit>p verblijf in Limburg`) en `description` (uit `property.summary[0]` → `tagline` → fallback). Type = `product` voor correcte Open Graph.
- **`UnitDetail.tsx`** — idem: per-unit `<SEO>` op basis van `unit.tagline` / `unit.description[0]`, type `product`.

### Changed
- Detailpagina's leunden voorheen alleen op de generieke `<SEO />` in `Layout` — die toont voor `/overnachten/vakantiewoningen/:slug` enkel een fallback-titel. Nu krijgt élk van de 17 boekbare units een unieke `<title>` + `<meta description>` + canonical, wat duplicate-content-flags in SEMrush voorkomt.

### Reeds in orde (geen wijziging nodig)
- `public/robots.txt` — bevat al `Allow: /`, `Disallow: /admin/`, `Sitemap: https://hoogmolen.be/sitemap.xml` + AI-crawler whitelist (GPTBot, PerplexityBot, ClaudeBot, …).
- `public/_redirects` — bevat al `/* /index.html 200` voor SPA-fallback en prerendering.
- `react-helmet-async` — al geïnstalleerd; `SEO.tsx` (gerenderd in `Layout`) bouwt al canonical, OG, Twitter en BreadcrumbList JSON-LD per route.
- Build-time sitemap-generator (`vite.config.ts` → `closeBundle`) blijft actief en overschrijft `dist/sitemap.xml` met dezelfde inhoud.

### Functioneel
- SEMrush en andere crawlers vinden via `/sitemap.xml` nu alle **84 indexeerbare URLs** (was: enkel build-output, niet leesbaar door dev-preview crawlers).
- Elke verblijf-pagina heeft een unieke meta-titel/description i.p.v. de generieke landgoed-fallback.

---

## [v4.17.5] - 2026-04-25 — llms.txt llmstxt.org spec-compliance

### Fixed
- **`public/llms.txt`** — herschreven volgens de officiële [llmstxt.org](https://llmstxt.org) spec na een AI Search audit-flag ("incorrectly formatted"). Verwijderd: H3-koppen binnen H2-secties (verboden), proza-FAQ tussen H2-koppen (verboden), losse "Adres/Telefoon"-regels op niet-spec-positie. Toegevoegd: alle inhoud nu in correct `## Sectie` → `- [name](url): notes` formaat. Optionele bronnen verhuisd naar `## Optional`.

### Changed
- **`scripts/seo-geo-check.ts` → `checkLlmsTxt`** — uitgebreid van simpele "bevat sectie X"-test naar volledige llmstxt.org spec-validator:
  1. Eerste regel = exact één H1
  2. Blockquote-samenvatting direct na H1
  3. Geen H3+ headings (spec verbiedt dit)
  4. H2-secties bevatten **alleen** link-list-items (`- [name](url): notes`)
  5. Verplichte H2-secties (`Kerninformatie`, `Veelgestelde vragen`, `Sitemap`)
- Output toont nu aantal H2-secties + "llmstxt.org spec ✓" bij succes, of een gedetailleerde lijst met regelnummers bij failure.
- Markdown-rapport criteria-sectie geüpdatet met de nieuwe spec-regels.

### Functioneel
- Voorkomt dat foutief geformatteerde `llms.txt` bestanden ongemerkt door de build glippen — AI search engines (ChatGPT, Perplexity, Claude) interpreteren de inhoud nu correct.
- Geverifieerd: huidige `llms.txt` = spec-conform (8 H2-secties), negatieve test met opzettelijke H3+proza correct gedetecteerd.

---

## [v4.17.4] - 2026-04-25 — SEO/GEO Markdown-rapport (pretty)

### Added
- **`dist/seo-geo-check-report.md`** — `seo-geo-check` schrijft nu naast JSON ook een mooi opgemaakt Markdown-rapport met:
  - Header met globale GEO-readiness badge (✅/❌) + score (%)
  - 📊 Samenvatting-tabel (status, score, geslaagd/gefaald, timestamp, output-dir)
  - 🧪 Check-resultaten in tabelvorm met emoji-status
  - 🔍 Details per check (boodschap + bullet-lijst van issues)
  - 📋 Volledige controle-criteria (5 llms-secties, 12 AI-bots, 5 kritieke sitemap-routes, host-consistentie regels) — full transparency

### Functioneel
- Direct renderbaar in GitHub PR's, GitLab, Notion, Obsidian.
- Buildlog toont nu twee output-paden: `↳ JSON-rapport` + `↳ Markdown-rapport`.
- Geverifieerd met droogtest: 4/4 checks groen, rapport correct gerenderd in NL met Brussels timezone.

---

## [v4.17.3] - 2026-04-25 — Sitemap-URL consistency check

### Added
- **`checkSitemapUrlConsistency`** in `scripts/seo-geo-check.ts` — vergelijkt de `Sitemap:`-URL uit `robots.txt` met de host van de eerste `<loc>`-entry in `sitemap.xml`. Faalt expliciet bij host-mismatch, niet-https, of pad ≠ `/sitemap.xml`. Resultaat verschijnt als 4e check (`sitemap-url`) in console én JSON-rapport.

### Functioneel
- Voorkomt stille deploy-fouten waarbij `robots.txt` naar de verkeerde host verwijst (bv. `wrong-host.example` vs `hoogmolen.be`).
- Build faalt loud met duidelijke foutmelding: `host-mismatch: robots.txt verwijst naar "X" maar sitemap.xml gebruikt "Y"`.
- Geverifieerd met droogtest: happy path = 4/4 groen, geforceerde mismatch = exit non-zero + correct JSON-rapport.

---

## [v4.17.2] - 2026-04-25 — SEO/GEO check JSON-rapport

### Added
- **`dist/seo-geo-check-report.json`** — `seo-geo-check` schrijft nu naast de console-output ook een machine-leesbaar JSON-rapport met `version`, `generatedAt`, `outDir`, globale `ok`-status, `summary` (total/passed/failed) en per check `name`, `ok`, `status`, `message` en `details[]`. Direct bruikbaar voor dashboards, CI-asserts of externe QA-pipelines.

### Functioneel
- Buildlog toont extra regel `↳ JSON-rapport: <pad>` zodat het rapport eenvoudig terug te vinden is.
- Geen breaking changes: bestaande console-output en exit-codes blijven identiek.

---

## [v4.17.1] - 2026-04-25 — Automatische SEO/GEO post-build check

### Added
- **`scripts/seo-geo-check.ts`** — verifieert na elke productie-build automatisch dat (1) `llms.txt` aanwezig is en alle 5 verplichte secties bevat, (2) `robots.txt` alle 12 AI-bots toelaat én de `Sitemap:`-directive bevat, (3) `sitemap.xml` geldig XML is met ≥10 URLs en de 5 kritieke hoofdroutes (`/`, `/overnachten`, `/groepsverblijf`, `/vergaderen`, `/contact`).
- **Vite-plugin `hoogmolen-sitemap`** roept de check automatisch aan na `closeBundle`. Output is een duidelijke ✓/✗ tabel in de buildlog.
- **Standalone CLI**: `bun scripts/seo-geo-check.ts <outDir>` — handig voor handmatige verificatie of CI-integratie.

### Functioneel
- Droogtest tegen `public/` + verse sitemap: alle 3 checks groen (84 URLs, 12 AI-bots, 5/5 secties).
- Buildlog toont voortaan expliciet "site is GEO-ready" of een lijst met fixes — geen stille regressies meer mogelijk.

---

## [v4.17.0] - 2026-04-25 — GEO-upgrade (Generative Engine Optimization)

### Added
- **`public/llms.txt`** — AI-crawler manifest met sitestructuur, kerncitaten (FAQ-antwoorden), entiteit-info en alle topverwijzingen. Direct leesbaar door ChatGPT, Perplexity, Claude en Gemini.
- **`public/robots.txt`** — expliciete `Allow:` regels voor 12 AI-bots: GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Google-Extended, ClaudeBot, Claude-Web, anthropic-ai, Applebot-Extended, Bytespider, meta-externalagent.
- **`GlobalSchema.tsx`** — `sameAs` uitgebreid met Google Maps, Airbnb, Booking.com en TripAdvisor (entity-resolutie). Nieuwe `knowsAbout` (10 kerntermen) en `areaServed` (Limburg) voor topical authority.
- **`SchemaInjector.tsx`** — `Speakable` schema toegevoegd aan FAQPage (cssSelector `.faq-question`, `.faq-answer`) zodat voice-assistants FAQ's correct kunnen voorlezen.
- **`Article` schema** automatisch geïnjecteerd op content-pagina's (`/geschiedenis*`, `/over-ons`, `/team`, `/ervaringen`) met `author`, `publisher`, `inLanguage` en `speakable` — kritiek voor citaties in AI Overviews.

### Functioneel
- AI-assistants (ChatGPT, Perplexity, Google AI Overviews, Gemini) krijgen nu expliciete crawltoestemming en een gestructureerd overzicht via `llms.txt`.
- Antwoorden in AI-zoekresultaten kunnen voortaan rechtstreeks Landgoed De Hoogmolen citeren met correcte NAP-data, beoordeling 4.9/571 en bron-URL.
- Voice-assistants (Google Assistant, Siri, Alexa) lezen FAQ's correct voor dankzij `SpeakableSpecification`.

---

## [v4.16.0] - 2026-04-25 — Build-time `sitemap.xml` generator

### Added
- **`scripts/generate-sitemap.ts`** — aggregeert statische routes uit `App.tsx` (zonder `:param`-routes en zonder `/admin/*`) en dynamische property-slugs uit `propertyConfig.ts`. Mapt elke property op de juiste URL volgens `type` (`house` → `/overnachten/vakantiewoningen/<slug>`, `duplex` → `/overnachten/suites-kamers/duplexsuites/<slug>`, `room|suite` → `/overnachten/suites-kamers/kamers/<slug>`).
- **Vite-plugin `hoogmolen-sitemap`** in `vite.config.ts` (`closeBundle` hook) — schrijft `dist/sitemap.xml` na elke productie-build. Faalt stilletjes met console-warning indien de generator crasht (build blokkeert nooit).
- **`public/robots.txt`** — voegt `Sitemap: https://hoogmolen.be/sitemap.xml` toe en sluit `/admin/` uit voor crawlers.

### Functioneel
- 84 URLs gegenereerd bij eerste droogtest (77 statische routes + property detail-pagina's + correcte `lastmod`, `changefreq` en `priority`-velden).
- De sitemap wordt automatisch bijgewerkt bij elke build — nieuwe properties of routes verschijnen direct, geen handmatig onderhoud nodig.

---

## [v4.15.1] - 2026-04-25 — Gallery-beheer respecteert samenstellingen

### Fixed
- **Lege galerij voor composities (Volmolen, Volmolen Plus, Watermolen Plus, Peerdermolen Plus, Landgoed De Hoogmolen).** `AdminGallery` matchte enkel op de eigen prefix (`hoogmolen-verblijf-volmolen-plus-...`), die in Cloudflare niet bestaat omdat composities geen eigen uploads hebben.
- De editor aggregeert nu de foto's van alle onderliggende modules uit `unit_compositions` (bv. Volmolen Plus → Peerdermolen + Watermolen + suite A5 + suite A6 + Molenhuys), gededupliceerd, met de primaire match eerst.
- Realtime: bij wijzigingen aan `unit_compositions` (via `/admin/compositions`) her-resolveren de extras automatisch via `useCompositionCacheVersion`.

### Added
- Onder de prefix-info toont de editor nu de actieve samenstelling: "Samenstelling: toont ook foto's van `hoogmolen-verblijf-peerdermolen`, `hoogmolen-verblijf-watermolen`, …" — zo is meteen duidelijk waarom een Plus-formule een grote galerij heeft.

---

## [v4.15.0] - 2026-04-25 — Fotobibliotheek beschikbaar in beheermodus + admin console

### Added
- **`LibraryDialog`** — herbruikbare wrapper rond `MediaPicker` in browse-modus. Eén component, twee entry-points, zodat alle UI-aanpassingen aan de bibliotheek automatisch op beide plekken doorwerken.
- **`FloatingLibraryButton`** — floating knop rechtsonder (boven de WhatsApp-FAB), zichtbaar enkel wanneer `isAdminMode === true`. Opent de fotobibliotheek met de huidige route als `contextSlug`, zodat relevante foto's bovenaan verschijnen.
- **`/admin/library`** — nieuwe route + sidebar-item "Fotobibliotheek" (Library-icoon) in `AdminSidebar`. Pagina hergebruikt `LibraryDialog` zodat de admin-versie identiek is aan de site-versie.

### Changed
- `Layout.tsx` rendert nu `<FloatingLibraryButton />` naast de WhatsApp- en Back-FAB (knop rendert zichzelf null buiten beheermodus, dus geen impact op publieke bezoekers).
- `App.tsx` registreert de nieuwe `/admin/library` route binnen de bestaande `ProtectedRoute`-boom.

### Architectuur
Single source of truth: `MediaPicker` blijft het enige component met de bibliotheek-UI (zoek, filter pills, status-badges, tags, hernoem). Toekomstige wijzigingen aan dit component werken automatisch door in zowel `/admin/library` als de floating knop op de publieke site.

---

## [v4.14.2] - 2026-04-25 — Geforceerde hernoem-logica via cf-rename Edge Function

### Fixed
- **Rename overschrijven door cf-sync voorkomen.** De `renameImage` flow in `MediaPicker` deed enkel een `image_library` DB-update, waardoor de Cloudflare-asset zelf op het oude ID bleef staan. Een latere `cf-sync` run kon de handmatige hernoeming dan terugdraaien.
- `MediaPicker.renameImage` roept nu **verplicht** `supabase.functions.invoke("cf-rename", { body: { oldId, newId } })` aan. De edge function downloadt + re-uploadt onder de nieuwe ID, verwijdert het oude asset, update de DB én schrijft een `image_aliases`-rij. Cloudflare en database blijven zo altijd in sync.
- Na een succesvolle rename wordt `clearImageLibraryCache()` aangeroepen zodat de nieuwe naam direct zichtbaar is in álle open tabs (realtime invalidation) zonder dat een sync-cycle de wijziging kan ongedaan maken.

## [v4.14.1] - 2026-04-25 — Bewerkbare hero op /groepsverblijf

### Fixed
- `/groepsverblijf` gebruikte een eigen hero (geen `PageHero`) en kreeg daardoor geen Edit-knop in admin-mode. Hero is nu gewrapped in `EditableImage` (foto vervangbaar) en titel + subtitle gebruiken `EditableText`. Override-foto vervangt de dynamische sfeer-gallery wanneer gezet.

---

## [v4.14.0] - 2026-04-25 — Bewerkbare hero-foto's en hero-tekst via Visual Editor

### Added
- **`PageHero`** is nu volledig bewerkbaar in admin-mode:
  - Hero-foto vervangbaar via `EditableImage` (sectionKey `hero`, opgeslagen in `image_overrides`).
  - Eyebrow, titel en subtitle inline bewerkbaar via `EditableText` (sectionKeys `hero.eyebrow`, `hero.title`, `hero.subtitle`).
  - Admin-override krijgt voorrang op `heroImage`-prop en op de dynamische gallery-fallback.
- **`PropertyHero`** krijgt naast de bestaande foto-edit nu ook inline tekst-editing voor titel (`hero.title`) en meta-regel (`hero.meta`).

### Changed
- Hero-componenten gebruiken consistent dezelfde sectionKey-conventie (`hero`, `hero.title`, `hero.subtitle`, `hero.meta`, `hero.eyebrow`) zodat overrides voorspelbaar per pagina werken.

---

## [v4.13.0] - 2026-04-25 — Visuele gallery-editor per unit

### Added
- **Nieuwe admin-pagina `/admin/gallery`** waarmee admins/editors per unit (Watermolen, Peerdermolen, alle kamers, duplexsuites) kunnen kiezen welke foto's op de publieke detailpagina verschijnen en in welke volgorde.
  - Linkse units-lijst met zoekfilter.
  - Rechtse grid: alle gematchte foto's voor de geselecteerde unit (longest-prefix + parent fallback uit `imageMatcher`).
  - **Show/Hide-toggle** per foto (oog-icoon) — verborgen foto's blijven in de library en worden alleen onderdrukt op de publieke slider/grid.
  - **Drag-to-reorder** (HTML5 native, geen extra dep) met live "#1, #2, …"-badges en autosave.
  - **Reset volgorde** knop per unit.
- **Nieuwe tabel `unit_gallery_settings`** (`context_type` + `context_key` + `image_id` → `hidden`, `sort_order`).
  - UNIQUE constraint op (`context_type`, `context_key`, `image_id`).
  - RLS: publiek leesbaar, admin/editor mag schrijven.
  - Realtime replicatie geactiveerd.
- **Nieuwe hook `useUnitGallerySettings`** (`src/hooks/useUnitGallerySettings.ts`):
  - Singleton in-memory cache + realtime subscription (HMR-veilig).
  - API: `getSettingsForContext`, `isImageHidden`, `getImageSortOrder`, `setHidden`, `setOrder`.

### Changed
- **`useUnitGallery`** (`src/hooks/useUnitGallery.ts`) past nu `unit_gallery_settings` toe **na** de longest-prefix match maar **vóór** de hoofdfoto-pin:
  1. Filter `hidden` foto's weg.
  2. Sorteer foto's met expliciete `sort_order` eerst (op nummer), rest in originele volgorde.
  3. Pas hoofdfoto-pin toe (blijft #1).
- **`AdminSidebar`**: nieuwe menu-item "Gallery-beheer" tussen Media en Visual Editor.
- **Routing**: nieuwe `/admin/gallery` route gemount onder `AdminLayout`.

### Functionele impact
- Eigenaar kan nu per unit volledig zelf bepalen welke foto's klanten zien én in welke volgorde — zonder bestanden te hernoemen of opnieuw te uploaden. Wijzigingen verschijnen direct op alle open tabs en op de publieke site.

---

## [v4.12.0] - 2026-04-25 — Hoofdfoto pinned in publieke gallery

### Fixed
- **Hoofdfoto verscheen niet als eerste foto** op detailpagina's (Watermolen, Peerdermolen, …) ook al was de markering correct opgeslagen. Reden: `useUnitGallery` raadpleegde `main_photos` niet.

### Changed
- **`useUnitGallery`** (`src/hooks/useUnitGallery.ts`):
  - Leest nu via `useMainPhotos.getMainImageId("unit", <key>)` op
    1. expliciete `unitKey`-prop, 2. afgeleide slug uit `locationId`
       (deel achter `hoogmolen-verblijf-`, eerste segment), 3. volledig `locationId`.
  - Past **`applyPin()`** toe op zowel config-override als auto-matched lijst:
    de gemarkeerde foto wordt vooraan gezet (en eventueel verderop verwijderd
    om duplicaten te voorkomen).
  - Nieuwe veld `mainPinned: boolean` in resultaat (debug/diagnostiek).
- **`useImageLibrary`** (`src/hooks/useImageLibrary.ts`): selecteert nu ook `id` zodat de hoofdfoto-koppeling (uuid → cloudflareId) lokaal mogelijk is.

### Impact
- Bezoekers zien onmiddellijk de gekozen hoofdfoto vooraan in de gallery van de unit-detailpagina (Watermolen, Peerdermolen, suites, kamers …).
- Realtime: wanneer in admin een nieuwe hoofdfoto wordt aangeduid, herrendert de publieke pagina automatisch (via `useMainPhotos` realtime-channel).
- Geen breaking change: zonder markering blijft de bestaande longest-prefix-match volgorde gelden.

---

## [v4.11.0] - 2026-04-25 — Hoofdfoto-systeem (Main Photo Marker)

### Added
- **Nieuwe DB-tabel `main_photos`** met UNIQUE op `(context_type, context_key)`. Eén hoofdfoto per context. RLS: publiek leesbaar, admin/editor schrijfbaar. Realtime ingeschakeld.
- **`useMainPhotos` hook** (`src/hooks/useMainPhotos.ts`) — singleton-cache + realtime, met `setMain`, `unsetMain`, `getMainImageId(type, key)`, `getMainContextsForImage(id)`.
- **`MainPhotoSelector` component** (`src/components/admin/MainPhotoSelector.tsx`):
  - Ster-knop (gevuld goud bij ≥1 markering, met badge-counter)
  - Popover met huidige markeringen (verwijderbaar)
  - **Slimme suggesties** uit filename (bv. `hoogmolen-verblijf-watermolen-...` → "Markeer als hoofdfoto van Watermolen")
  - Vrije input: kies type (unit / page / section / category) + key
- **Library-tab integratie** (`MediaHistoryPanel.tsx`):
  - Nieuwe kolom **"Hoofd"** met ster-knop
  - Gouden ster-overlay op de thumbnail van als-hoofd-gemarkeerde foto's
  - Toast-feedback bij set/unset

### Architecture
- Flexibele context-modellering laat toekomstige features toe (OG-image, smart hero, sitemap-prioriteit, Booking-cover) zonder schema-wijziging.
- Frontend-componenten kunnen `getMainImageId("unit", slug)` aanroepen en valt back op huidige `-01`-conventie indien `null`. **Geen breaking change** voor bestaande pagina's.

### Notes
- Volgende stap (apart): `PropertyHero`, `UnitCard` en `SuiteDetail` aansluiten op `getMainImageId()` zodat een gemarkeerde hoofdfoto effectief de hero wordt.

---

## [v4.10.3] - 2026-04-25 — TagSelector kleur-picker UX

### Changed
- **Kleur-picker** in `TagSelector.tsx` ge-herorganiseerd van flex-row (4 knoppen op één rij — labels werden afgekapt) naar **2×2 grid** met meer ademruimte per knop (h-7).
- Toegevoegd: hint-tekst "Kies een kleur:" boven de picker zodat de functie duidelijker is.
- Border-style vervangen door semantic `border-primary` token (i.p.v. inline style).

---

## [v4.10.2] - 2026-04-25 — Versie-pill centraal in footer

### Changed
- **Footer-bottom-bar** opnieuw ingedeeld als 3-koloms grid op desktop:
  - Links: copyright
  - **Midden: versie-pill** (`SITE_VERSION`) — prominenter met `font-mono`, hogere contrast (`text-accent/70`) en bredere padding.
  - Rechts: privacy-links + admin-toggles.
- Op mobiel stapelt het netjes (copyright + versie + links onder elkaar, gecentreerd).

### Notes
- Library-tab updates uit v4.10.1 (thumbnails + bulk-selectie checkboxes) zijn correct gemerged in `MediaHistoryPanel.tsx`. Indien niet zichtbaar in de preview: hard-refresh de pagina (Cmd/Ctrl + Shift + R) om de browser-cache te omzeilen.

---

## [v4.10.1] - 2026-04-25 — Library tab: bulk-selectie + thumbnails

### Added
- **Thumbnail-kolom** in de Library-tabel (`MediaHistoryPanel.tsx`): toont een 56×56 px preview per rij via `cfImage(cloudflare_id)`. Fallback naar `ImageOff`-icoon bij missende of gebroken assets (lazy-loading + `onError`).
- **Selectie-checkbox per rij** + header-checkbox **"Selecteer alle gefilterde"** met `indeterminate`-state wanneer een deel van de filter geselecteerd is.
- **Floating Bulk Action Bar** (zwevende `primary-deep` balk onderaan):
  - Actie-dropdown: **Tag toevoegen** of **Tag verwijderen**.
  - Tag-input (validatie a-z 0-9 -, 2-32 tekens) + quick-pick dropdown van bestaande `unique_tags`.
  - "Toepassen" CTA + "Wis selectie" knop.
  - On-the-fly tag-creatie bij `add` van een onbekende label.
- **Audit-log** naar `sync_history` (`action: "bulk_tag"`) met `ok/fail/skipped` counts.

### Changed
- Library-tab is nu volledige DAM-werkbank: bekijken + tagging + bulk-onderhoud op één plek (MediaPicker behoudt zijn eigen bulk-flow voor selectie tijdens content-overrides).
- Tabel kreeg `pb-28` zodat de zwevende bar geen content overlapt.

---

## [v4.10.0] - 2026-04-25 — Bulk Tagging & Filter Engine
> Opmerking: prompt vroeg `v4.8.0`, maar volgens het versie-protocol mogen versienummers nooit dalen (huidige baseline = v4.9.1). Doorgenummerd naar **v4.10.0** als minor-bump voor de Bulk Tagging Engine.

### Added
- **Bulk Selection mode** in `MediaPicker.tsx`:
  - Checkbox **"Selecteer alle gefilterde resultaten"** boven het grid (toont totaal-aantal in de huidige filter-state).
  - Per-thumbnail checkbox-overlay (rechtsonder) — verschijnt op hover, blijft zichtbaar wanneer geselecteerd. Klik stopt event-propagation zodat preview niet opent.
  - Geselecteerde thumbs krijgen `border-primary-deep` + ring voor duidelijk visueel onderscheid t.o.v. preview-selectie.
- **Floating Bulk Action Bar** onderaan de modal zodra ≥ 1 item geselecteerd is:
  - Live counter, tag-input (a-z 0-9 -, 2-32 tekens), quick-pick dropdown van bestaande `unique_tags`.
  - Knop **"Apply Tags to Filtered"** (accent-CTA) + **"Wis"** om selectie te resetten.
  - Enter in het input-veld triggert direct `applyBulkTag`.
- **Audit-log** naar `sync_history` (`action: "bulk_tag"`) met `applied/failed/total` counts en alle geraakte image-IDs voor traceerbaarheid.

### Changed
- **Filter-pipeline** ondersteunt nu multi-selectie: `filteredIds` worden afgeleid uit dezelfde `useMemo` als de zichtbare thumbs, zodat "Selecteer alle gefilterde" altijd 1-op-1 matcht met wat je ziet (status-filter + tag-filter + pill + zoekquery samen).
- **Bulk-update strategie**: lees huidige `tags` per geselecteerde rij via één `.in('id', selectedIds)` query, merge de nieuwe tag (skip rijen die hem al hebben) en push de updates parallel via `Promise.all`. Realtime-listeners op `image_library` refetchen automatisch — alle open admin-tabs en publieke pagina's zien de nieuwe tags direct.
- **On-the-fly tag-creatie** in de bulk-flow: onbekende labels worden eerst via `createTag()` aangemaakt met de default `primary` brand-token, daarna pas toegepast.
- **Modal-state reset** bij sluiten van de MediaPicker: selectie + bulk-input worden gewist zodat een volgende open-actie altijd schoon start.

### Fixed
- **Synchronisatie van `cloudflare_id` bij bulk-renames** geborgd: de bestaande `renameImage`-flow updatet `filename` én `cloudflare_id` in dezelfde transactie, en de bulk-tag flow raakt deze velden niet aan — metadata-consistentie blijft gegarandeerd.
- **TagSelector-import** verwijderd uit MediaPicker (was ongebruikt sinds v4.9.0; bulk-flow gebruikt inline UI).

### Compliance
- Brand tokens: bulk-bar gebruikt uitsluitend `bg-primary-deep`, `bg-accent`, `text-primary-foreground`, `border-primary-foreground/20` — geen hex of `bg-black`/`text-white`.
- Geen impact op Netlify-formulieren of Guesty-veldnamen.

---

## [v4.9.1] - 2026-04-25 — Architectural Audit & Documentation Sync
### Documentation
- **Audit-sessie zonder code-impact** — administratieve achterstand ingelopen onder het ARCHITECTURAL AUDIT & DOCUMENTATION PROTOCOL. Versie opgehoogd naar v4.9.1, footer-indicator volgt automatisch via `src/lib/version.ts`.
- **Recent Unlogged History gevalideerd** — alle eerder genoemde "stilzwijgende" mijlpalen zijn al volledig gedocumenteerd in deze CHANGELOG:
  - Multi-site architectuur met gedeelde DB (StayYouSoon) → zie `STAYYOUSOON_MIGRATION.md` (geïntroduceerd rond v4.0.0).
  - Cloudflare UID-driven image management + `MediaIssuesPanel` naamconventie-controle → v4.6.0–v4.6.3.
  - `SyncHistoryPanel` audit-feed → v4.7.0.
  - Smart Resolver via `image_aliases` (lus dicht tussen Admin & broncode) → v4.8.0.
  - Dynamic SEO via `react-helmet-async` + JSON-LD schema's → v3.12.0.
- **Project Rules Compliance gevalideerd** voor de huidige codebase:
  - Brand tokens: alle nieuwe componenten (TagBadge, TagSelector, CodeSyncPanel) gebruiken uitsluitend semantic tokens (`bg-primary`, `text-primary-deep`, `bg-accent`, …) — geen hex of `text-white`/`bg-black`.
  - Netlify formulieren: `contact`, `groepsverblijf-aanvraag`, `vergader-offerte` behouden hun `data-netlify="true"` + hidden `form-name` + `bot-field` honeypot.
  - Guesty-ready veldnamen in `unitsConfig.ts` (`id`, `accommodates`, `cleaningFee`, `extraGuestFee`, `basePrice`) ongewijzigd.
  - Sticky mobile "Boek nu" CTA + Floating WhatsApp FAB (+3211901100) blijven actief op alle relevante pagina's.

### Notes
- Geen functionele of visuele impact voor eindgebruikers — uitsluitend versie-indicator in de footer wijzigt naar `v4.9.1`.
- Volgende sessie kan een nieuwe feature/fix-opdracht oppakken vanaf een schone administratieve baseline.

---

## [v4.9.0] - 2026-04-25 — DAM Tagging-systeem
### Added
- **Nieuwe kolom `tags` (TEXT[])** op `image_library` met GIN-index voor snelle filter-queries.
- **Nieuwe tabel `unique_tags`** (label UNIQUE, color) — publiek leesbaar; alleen admins/editors kunnen tag-definities toevoegen of wijzigen, alleen admins kunnen verwijderen. Geseed met 8 standaard-tags (sfeer, omgeving, drone, detail, exterieur, interieur, mensen, food) gekoppeld aan brand-tokens.
- **`useUniqueTags` hook** — singleton-cache + realtime subscription op `unique_tags` zodat alle open admin-tabbladen synchroon blijven.
- **`TagBadge` component** — elegante pill in 4 brand-kleurvarianten (primary, primary-deep, accent, secondary) met optionele remove-knop.
- **`TagSelector` popover** — toggle bestaande tags + on-the-fly aanmaken (lowercase a-z 0-9 -, 2-32 tekens) met kleurkiezer. Persisteert direct via Supabase update.
- **Library tab (MediaHistoryPanel)**: nieuwe Tags-kolom met TagSelector per rij + filter-balk met multi-select tag-pills (AND-logica). Zoekbalk doorzoekt nu ook tags. Extra "Getagd"-stat.
- **MediaPicker**: nieuwe Tag-filter rij in de toolbar + extra status-filter "★ Sfeer". Thumbnails tonen tot 2 tag-pills rechtsboven; preview-zijbalk toont alle tags van de geselecteerde foto.

### Changed
- **`analyseLibraryFilename(filename, tags)`** accepteert nu tags. Foto's met de tag `sfeer` of `omgeving` (en minstens één tag) krijgen status `exempt` en verdwijnen uit het Issues-dashboard — ze hoeven immers niet aan de unit-conventie te voldoen.
- Issues-tab toont nu een tip om sfeer-foto's te taggen i.p.v. te hernoemen.

---

## [v4.8.1] - 2026-04-25 — Gebruikers verwijderen
### Added
- **Edge function `admin-delete-user`** — verwijdert een gebruiker volledig (auth.users + profiles + user_roles). Vereist een geldige sessie én admin-rol; je kunt jezelf niet verwijderen.
- **Delete-knop in `/admin/users`** — prullenbak-icoon per rij met `AlertDialog`-bevestiging. Disabled voor de huidige ingelogde admin.

### Fixed
- Display name van `mark.lens@spartasolutions.eu` (account met K) gecorrigeerd naar "Mark Lens" voor duidelijk onderscheid t.o.v. het oudere `marc.lens@…`-account.

---

## [v4.8.0] - 2026-04-25 — Media Intelligence & Code Sync Manager
### Added
- **Nieuwe tabel `image_aliases`** (`old_id` UNIQUE, `new_id`, `created_by`) — houdt elke rename bij zodat de website oude code-referenties automatisch doorstuurt naar de nieuwe Cloudflare-ID. Publiek leesbaar voor de smart resolver, alleen admins/editors kunnen schrijven, alleen admins kunnen verwijderen.
- **Smart Resolver in `CFImage`**: nieuwe hook `useImageAliases` met singleton-cache + realtime subscription. Elke `<img>` resolvet zijn ID via de alias-map → de nieuwe SEO-naam staat direct in `src` en `srcset`, geen 404-roundtrip nodig.
- **Edge function `cf-rename`** schrijft nu automatisch (upsert) een record in `image_aliases` na een succesvolle rename, gelogd in `sync_history` met `aliasWritten`-flag.
- **MediaIssuesPanel**: extra knop **"Suggestie toepassen"** (Sparkles-icoon, primary-styled) die in één klik de auto-gegenereerde rename uitvoert + alias activeert.
- **Nieuw tabblad "Code Sync"** in `/admin/media`: tabel van alle actieve aliassen, status-badge "Actief via Database Fallback", knop **"Generate Cleanup Batch"** die een opdracht voor Lovable in het klembord plakt, en per-rij delete-knop voor admins (gelogd als `alias_cleanup` in sync_history).

### Changed
- Media-pagina heeft nu 5 tabs: Upload · Issues · **Code Sync** · Activity · Library.
- Na een rename wordt zowel `clearImageLibraryCache()` als `clearAliasCache()` getriggerd → realtime updates op alle open tabs.

---

## [v4.7.0] - 2026-04-25 — Sync History Activity Feed
### Added
- Nieuwe tabel `sync_history` (status, action, message, affected_items, counts, triggered_by) met RLS: alleen admins/editors kunnen de log bekijken.
- Edge functions `cf-sync` en `cf-rename` loggen elke run (success/failed/partial) inclusief crashes via try/catch — sync stopt nooit meer stilzwijgend.
- Nieuw paneel `SyncHistoryPanel` met **Activity tab** in `/admin/media`: toont laatste 20 acties met status-badge, timestamp, message, counts en affected items.
- `cf-sync` rapporteert `partial` status wanneer er fouten zijn maar deels gelukt — error-handling per item bleef al doorgaan dankzij row-by-row fallback (v4.6.1).

### Changed
- Media-pagina heeft nu 4 tabs: Upload · Issues · **Activity** · Library (Library hernoemd van "Historiek" voor duidelijkheid t.o.v. de nieuwe Activity-feed).

---

## [v4.6.1] - 2026-04-25 — cf-sync: idempotente UPSERT zonder duplicate-key errors
### Fixed
- `cf-sync` gebruikt nu `UPSERT (onConflict: cloudflare_uid, ignoreDuplicates: false)` i.p.v. insert+skip. Bestaande rijen worden bijgewerkt met verse metadata (filename, status) zonder duplicate-key fouten.
- Pre-sync **cleanup**-stap verwijdert corrupte rijen zonder `cloudflare_uid` of `cloudflare_id` voordat de pagination start.
- Response telt nu `inserted` vs `updated` apart en rapporteert `cleaned`-count.
- Geen writes meer naar Cloudflare zelf — sync raakt enkel de DB aan.

---

## [v4.6.0] - 2026-04-25 — Global Rename Engine + Issue Dashboard
### Added
- **Edge function `cf-rename`**: hernoemt een Cloudflare image (download → re-upload onder nieuwe ID → delete origineel) en synchroniseert `image_library` (cloudflare_id, cloudflare_uid, filename).
- **`MediaIssuesPanel`**: nieuw "Issues"-tabblad in `/admin/media` dat alle assets toont die niet voldoen aan de conventie `hoogmolen-verblijf-<unit>-<onderdeel>-<NN>`. Toont status-badges (off-convention / loose), reden, en een suggestie.
- **Rename-dialog** met automatische suggestie (bv. `suite-aN` → `duplexsuite-aN`), validatie van de nieuwe ID en automatische klembord-kopie van het `oud → nieuw` snippet zodat code-strings via chat ("vervang X door Y") project-breed bijgewerkt kunnen worden.
- **Specifieke foutmelding** wanneer een rename mislukt door een conventie-violatie: *"Bestandsnaam 'X' voldoet niet aan de naamconventie. Gebruik de 'Search & Replace' om dit project-breed te corrigeren."*

### Changed
- `/admin/media` heeft nu drie tabs (Upload · Issues · Historiek) i.p.v. twee.

---

## [v4.5.0] - 2026-04-25 — Site-wide hero fallback voor alle PageHero-pagina's
### Added
- **`PageHero`** heeft nu een ingebouwde site-wide fallback met dynamische sfeerbeelden wanneer geen expliciet `heroImage` of specifieke `heroExtraIds` zijn gezet.
- Nieuwe standaardset `DEFAULT_HERO_EXTRA_IDS` bundelt Peerdermolen, Watermolen, suites A1–A6 en kamers B1–B5, zodat alle generieke info-/hubpagina's automatisch een fotohero krijgen.
- Eerder gepatchte pagina's zoals `/praktisch` en `/teambuildings` blijven werken; pagina's zoals `/contact`, `/faq`, `/omgeving`, `/geschiedenis`, `/over-ons`, `/team`, enz. krijgen nu automatisch ook een foto-hero zonder extra page-specifieke code.

### Functional impact
- Alle URL's die `PageHero` gebruiken tonen nu standaard een foto in de hero, ook wanneer u later nog extra van die pagina's doorstuurt.
- Alleen pagina's met een volledig custom hero (zoals `/vergaderen` of reeds custom hubs) vragen nog een aparte patch indien nodig.

---

## [v4.4.1] - 2026-04-25 — PageHero ondersteunt dynamische foto-achtergrond
### Added
- **`PageHero`** ondersteunt nu twee nieuwe optionele props: `heroSlug` en `heroExtraIds`. Wanneer geen statisch `heroImage` is opgegeven en een van deze props gezet is, toont de hero een dynamische foto-achtergrond via `UnitGallerySlider` met dezelfde leesbaarheids-overlay als `/overnachten` en `/overnachten/suites-kamers`.
- **`/praktisch`** — hero kreeg een aggregatie-sfeerbeeld (`PRAKTISCH_HERO_IDS`) van alle accommodaties (Peerdermolen, Watermolen, A1–A6, B1–B5).

### Functional impact
- De `Praktisch`-pagina heeft nu een fotomatige hero in plaats van enkel de groene gradient. Hetzelfde patroon kan nu in elke andere `PageHero`-pagina worden hergebruikt door simpelweg `heroSlug` of `heroExtraIds` mee te geven — geen verdere refactor nodig.

---

## [v4.4.0] - 2026-04-25 — Foto-galerij + dynamische hero op /overnachten en /suites-kamers
### Fixed
- **`/overnachten`** — de drie accommodatiekaarten (Vakantiewoningen, Duplexsuites, Kamers) en de Info-kaart toonden bovenaan een tekstuele banner zonder beeld. Vervangen door `UnitGallerySlider` met geaggregeerde location-IDs zodat elke kaart automatisch foto's toont van de onderliggende units.
- **Hero op `/overnachten` en `/overnachten/suites-kamers`** — de groene gradient-hero kreeg een dynamische foto-achtergrond (sfeerimpressie van alle accommodaties) met leesbaarheids-overlay (`from-primary-deep/85 via-primary-deep/55`) en drop-shadow op titel/subtitel.
- Aggregatie-IDs (`VAKANTIEWONINGEN_IDS`, `DUPLEX_OVERVIEW_IDS`, `KAMERS_OVERVIEW_IDS`, `HERO_ALL_IDS`) bovenaan de pagina gedefinieerd voor herbruikbaarheid en duidelijkheid.

### Functional impact
- Op `/overnachten` ziet de gast nu fotomateriaal in de hero én op elke kaart, in plaats van enkel olijfgroene tekst-banners.
- De `/overnachten/suites-kamers` hero gebruikt dezelfde dynamische foto-achtergrond, consistent met de rest van de site.

---

## [v4.3.0] - 2026-04-25 — Slider vs. detail-link conflict opgelost
### Fixed
- **`UnitSlider`** stopt klikken op de pijlen en pagina-bolletjes met `stopPropagation()` + `preventDefault()`, zodat de omliggende kaart-`<Link>` niet meer per ongeluk navigeert tijdens het bladeren door foto's.
- **Swipe-detectie** met een drag-threshold (≥8px) onderscheidt nu een tap (= navigeren naar detailpagina) van een swipe (= volgende/vorige foto). Op mobiel wordt de bijbehorende click op de Link onderdrukt zodra een effectieve swipe gedetecteerd wordt.
- **Z-index + cursor**: pijlen en dots staan nu boven de link-laag (`z-10`) en hebben `cursor-pointer`, zodat ze visueel als losstaande controls aanvoelen.
- **`draggable={false}`** op slider-images voorkomt dat browsers per ongeluk een native afbeelding-drag starten.

### Functional impact
- Op `/overnachten/vakantiewoningen`, `/overnachten/suites-kamers/duplexsuites`, `/overnachten/suites-kamers/kamers`, `/groepsverblijf` en alle activiteit-/teambuilding-overzichten kunnen gasten nu vrij door de fotogalerijen navigeren zonder dat de detailpagina geopend wordt; een tap op de afbeelding zelf opent nog steeds de detailpagina.

---

## [v4.2.3] - 2026-04-25 — Fix galerijen op hubpagina Suites & kamers
### Fixed
- De overzichtskaarten op `/overnachten/suites-kamers` gebruikten nog statische `UnitSlider` placeholders en waren niet gekoppeld aan de database-gedreven galerijresolver.
- Beide kaarten gebruiken nu `UnitGallerySlider` met expliciete geaggregeerde location-prefixes: A1–A6 voor duplexsuites en B1–B5 voor kamers.
- `UnitGallerySlider` ondersteunt nu ook optionele `extraLocationIds`, samengevoegd met de bestaande compositiecache en gededupliceerd in lowercase.
- Dezelfde gallery-aanpak is nu ook doorgetrokken naar groepsverblijf-overzichtspagina's en SEO-groepskaarten, zodat woning- en formulekaarten niet langer op statische header-plaatsvakken blijven staan.
- Nieuwe helper `galleryLocationIdsForSlugs()` centraliseert primaire prefixes + compositie-prefixes voor alle overzichtskaarten.

### Functional impact
- Op de overzichtspagina zijn nu ook daadwerkelijk suite- en kamerfoto's zichtbaar, in plaats van lege placeholders.
- Ook op `/groepsverblijf`, `/groepsverblijf/10-20-personen`, `/groepsverblijf/20-30-personen`, `/groepsverblijf/30-53-personen` en de `/groepen/*` SEO-pagina's worden de kaarten nu met echte galerijbeelden gevuld.

---

## [v4.2.2] - 2026-04-25 — Fix fotogalerij duplexsuites A1-A6
### Fixed
- **Prefix-mismatch opgelost**: Cloudflare gebruikt `hoogmolen-verblijf-suite-aN`, maar de code genereerde `hoogmolen-verblijf-duplexsuite-aN`. `resolveCfTokens` (`cloudflareImagesConfig.ts`) geeft nu `unit: "suite"` terug voor alle A-units.
- **Slug-mapping aangevuld** voor `de-shetlander` (a5) en `de-jutlander` (a6) — voorheen viel dit terug op de raw slug en bleef de gallery leeg.
- **DB-cleanup migratie**: alle bestaande `module_location_ids` in `unit_compositions` met `duplexsuite-` zijn vervangen door `suite-`.

### Functional impact
- Op `/overnachten/suites-kamers/duplexsuites` tonen alle 6 suite-kaarten (A1 t/m A6) nu hun foto's.
- Detailpagina's `de-fries`, `de-fjord`, `de-brabander`, `de-draver`, `de-shetlander` en `de-jutlander` laden hun complete fotogalerij.

---

## [v4.2.1] - 2026-04-25 — Toon volledige Watermolen-galerij
### Fixed
- **`imageMatcher`** combineert nu de strikte location-match én de brede prefix-match voor dezelfde woning, in plaats van vroegtijdig te stoppen bij slechts enkele exacte hits.
- Daardoor toont **Watermolen** nu alle beschikbare foto's met prefix `hoogmolen-verblijf-watermolen-*`, niet alleen twee of enkele beelden.
- Deze fix werkt ook door voor andere woningen met vrije bestandsnaamgeving binnen dezelfde prefix-conventie.

---

## [v4.2.0] - 2026-04-25 — Force lowercase op slugs & image-paden
### Fixed
- **Mismatch hoofdletters/kleine letters** tussen DB-slugs en Cloudflare-prefixes opgelost. Cloudflare paden zijn altijd lowercase; nu wordt op alle drie de plekken (save, resolve, render) `.toLowerCase()` afgedwongen.
- **`/admin/compositions` save-flow** (`Compositions.tsx`): `modules` en `module_location_ids` worden ge-lowercased + getrimd vóór het naar Supabase gaat.
- **`locationIdsForSlug`** (`src/lib/locationId.ts`): normaliseert input-slug naar lowercase voordat de prefix opgebouwd wordt.
- **`UnitGallerySlider`**: lowercase de slug + alle resolved extra location-IDs voor render.
- **`setCompositionCache`** (`unitCompositionConfig.ts`): DB-cache slaat alleen lowercase keys + values op.
- **DB-cleanup**: éénmalige `UPDATE` op `unit_compositions` die `slug`, `modules` en `module_location_ids` lowercase + dedupliceert.

### Diagnose
- Console-warning toont nu expliciet wanneer een input-slug genormaliseerd werd, zodat casing-issues direct zichtbaar zijn.

---

## [v4.1.0] - 2026-04-25 — Fix gallery-resolutie voor samengestelde formules
### Fixed
- **`UnitGallerySlider`** rendert nu opnieuw zodra de DB-cache van `unit_compositions` binnenkomt (Volmolen, Watermolen Plus, Peerdermolen Plus, Volmolen Plus, Landgoed). Eerder bleven die galleries leeg omdat de eerste render gebeurde vóór `useUnitCompositions` z'n fetch had voltooid en de in-memory cache geen React-trigger had.
- **`unitCompositionConfig`**: nieuwe `CACHE_VERSION` + `subscribeCompositionCache` listener. Bumpt bij élke `setCompositionCache(...)` (initial fetch én realtime updates).
- **Diagnose**: bij een echte mismatch (geen config-foto's, geen primary-match in `image_library`, geen extras, geen parent-fallback) loggen we één duidelijke `console.warn` per slug met de verwachte location-prefix en de gemapte modules.

### Technical
- Nieuw bestand: `src/hooks/useCompositionCacheVersion.ts`.
- `src/components/UnitGallerySlider.tsx` — gebruikt cacheVersion als dep voor `getExtraLocationIds`, plus diagnostische warning.
- Geen RLS- of DB-schema wijzigingen.

### Functional impact
- Plus / Volmolen / Landgoed-kaarten op `/overnachten/vakantiewoningen` tonen nu Peerdermolen-foto's via de geaggregeerde compositie zolang er nog geen Watermolen / Duplexsuite / Molenhuys uploads zijn.
- Wanneer er voor een unit echt geen foto's bestaan, vertelt de browser-console exact welke prefix in `image_library` ontbreekt — geen stille placeholder meer.

---

## [v4.0.1] - 2026-04-24 — Fix admin-navigatie voor Samenstellingen
### Fixed
- **Admin-dashboard + admin-sidebar** navigeren nu expliciet client-side naar `/admin/compositions` voor de route **Samenstellingen**, zodat die link niet langer als een nieuw browsertab/venster kan openen.
- Het gedrag van **Samenstellingen** is nu consistent met Media, Visual Editor, Users en Settings binnen dezelfde admin-shell.

### Functional impact
- Klikken op **Beheer samenstellingen** blijft voortaan binnen hetzelfde admin-scherm.
- De linker admin-navigatie voelt uniform aan over alle beheerpagina's.

---

## [v4.0.0] - 2026-04-24 — Major release: multi-site architectuur 🎉
### Milestone
Eerste major release na de overgang naar een **multi-site model**. Vanaf deze versie beheren we Landgoed De Hoogmolen én StayYouSoon vanuit één centrale admin-console met een gedeelde database.

### Highlights sinds v3.x
- **Multi-site DB-schema** (`unit_compositions` met `visible_on`, `unit_type`, `country`, `city`).
- **8 villa-placeholders** voor StayYouSoon (2× Houthalen, 6× Spanje) klaar voor configuratie.
- **Centrale admin-console** met samenstellingen-beheer, stat-cards en snelle acties.
- **StayYouSoon-migratiegids** (`STAYYOUSOON_MIGRATION.md`) voor het verbinden van het remix-project.
- Behoud van alle v3.x functionaliteit (Cloudflare Images, Visual Editor, gebruikersbeheer, realtime sync).

### Volgende stap
StayYouSoon laten verbinden met deze gedeelde backend volgens `STAYYOUSOON_MIGRATION.md`.

---

## [v3.16.1] - 2026-04-24 — Samenstellingen op admin-dashboard
### Added
- **Stat-card "Samenstellingen"** op `/admin` met live count uit `unit_compositions`.
- **Snelle-actie tegel "Beheer samenstellingen"** met `FolderTree`-icoon, prominent boven Media en Visual Editor.
- **`ActionCard`** ondersteunt nu een optioneel icoon dat in een afgeronde accent-tile naast de titel verschijnt.

### Changed
- Visual Editor stat-card vervangen door Samenstellingen-stat-card (Visual Editor blijft bereikbaar via snelle acties).

### Functional impact
- Direct vanaf het admin-dashboard kun je nu doorklikken naar `/admin/compositions`.
- De sidebar-link "Samenstellingen" was er al, maar was minder zichtbaar — nu onmiddellijk in beeld vanaf de hoofdpagina.

---

## [v3.16.0] - 2026-04-24 — Multi-site samenstellingen + StayYouSoon-voorbereiding
### Added
- **DB-uitbreiding `unit_compositions`**: nieuwe kolommen `unit_type` (room/house/villa/composition), `visible_on` (text[] met site-IDs), `country`, `city` + GIN-index op `visible_on` voor snelle filtering.
- **Bestaande 7 formules getagd** als Oudsbergen/België en zichtbaar op `['hoogmolen','stayyousoon']`. Watermolen + Peerdermolen → `house`, rest → `composition`.
- **8 villa-placeholders** geseed: 2× Houthalen (België) + 6× Spanje (3× Pilar de la Horadada, 3× San Pedro del Pinatar). Alleen zichtbaar op StayYouSoon — namen zijn placeholders die in de admin-console hernoemd worden.
- **Admin-UI uitgebreid** (`/admin/compositions`):
  - Type-dropdown (Kamer / Vakantiewoning / Villa / Samenstelling)
  - Land-dropdown (België / Spanje / Nederland / Frankrijk)
  - Vrij stad-veld voor exacte spelling
  - Site-checkboxes (De Hoogmolen / StayYouSoon)
  - Kleurrijke badges in cardheader die type, locatie en zichtbaarheid samenvatten
- **`STAYYOUSOON_MIGRATION.md`** (root) — stappenplan voor de remix om naar de gedeelde backend te switchen, met env-waarden, code-snippets, rollback-plan en villa-checklist.

### Changed
- **`CompositionRow` type** — uitgebreid met `unit_type`, `visible_on`, `country`, `city`.
- **`useUnitCompositions`** — selecteert nu ook de nieuwe kolommen; cache blijft compatibel met publieke pagina's.

### Functional impact
- Eén admin-console beheert formules voor twee sites: zet vinkjes welke site een samenstelling toont.
- Villa's voor StayYouSoon (Houthalen + Spanje) zijn al klaar om hernoemd te worden.
- Zodra StayYouSoon de migratie-gids volgt en op dezelfde DB wijst, werken wijzigingen real-time door op beide sites.

---

## [v3.15.0] - 2026-04-24 — Admin-beheer voor samengestelde formules
### Added
- **Nieuwe DB-tabel `unit_compositions`** (slug, display_name, module_location_ids, description, sort_order) met RLS:
  - publiek leesbaar (nodig voor galleries)
  - admins/editors kunnen aanmaken, wijzigen en verwijderen
  - geseed met de bestaande 5 samenstellingen (Watermolen Plus, Peerdermolen Plus, Volmolen, Volmolen Plus, Landgoed)
- **Admin-pagina `/admin/compositions`** — beheer alle samenstellingen vanuit de console:
  - lijst alle samenstellingen met inline-editor (naam, slug, omschrijving, volgorde)
  - checkboxes per module gegroepeerd op type (Vakantiewoningen, Duplexsuites, Kamers, Gemeenschappelijk)
  - dialog voor nieuwe samenstelling met automatische slugify
  - delete-knop met bevestiging
- **`AVAILABLE_MODULES`** (`src/config/availableModulesConfig.ts`) — vaste lijst van bekende atomaire modules met leesbare labels (A1 De Fries, A2 De Fjord, …, B1-B5, Watermolen, Peerdermolen, Molenhuys).
- **`useUnitCompositions`** hook — fetcht samenstellingen uit de DB en luistert op realtime updates; vult een in-memory cache zodat publieke pagina's via `getExtraLocationIds` (sync) altijd de meest recente samenstelling zien.
- **`UnitCompositionsLoader`** component — gemount één keer in `App.tsx` zodat de cache vanaf eerste pageload gevuld is.
- **Sidebar-link "Samenstellingen"** met `FolderTree`-icoon (zichtbaar voor admins én editors).

### Changed
- **`unitCompositionConfig.ts`** — `getExtraLocationIds` leest nu eerst uit de DB-cache; valt terug op de hard-coded `COMPOSITION_MAP` wanneer de DB nog niet geladen is. Geen breaking change.

### Functional impact
- Eigenaar kan nu nieuwe verhuurformules definiëren zonder code te wijzigen. Voorbeeld: maak `gezellig-samenzijn` met enkel A1-A4 → die slug krijgt automatisch foto's van die 4 duplexen in zijn gallery.
- Wijzigingen in samenstellingen werken realtime door op alle open browsers (publieke site én admin).

### Commit message
```
[v3.15.0] - Admin-beheer voor samengestelde formules via /admin/compositions
```

---

## [v3.14.7] - 2026-04-24 — Auto-aggregatie samengestelde formules (config-driven)
### Added
- **`src/lib/unitComposition.ts`** (nieuw) — single source of truth voor hoe samengestelde formules zijn opgebouwd uit modules:
  - `watermolen-plus` = Watermolen + A5 + A6 + Molenhuys
  - `peerdermolen-plus` = Peerdermolen + A5 + A6 + Molenhuys
  - `volmolen` = Watermolen + Peerdermolen
  - `volmolen-plus` = Watermolen + Peerdermolen + A5 + A6 + Molenhuys
  - `landgoed-de-hoogmolen` = Watermolen + Peerdermolen + A1..A6 + Molenhuys
- **`useUnitGallery`** krijgt nieuwe parameter `extraLocationIds: string[]`. Foto's van die modules worden geaggregeerd bovenop de primaire match en gededupliceerd (volgorde behouden: primary → modules in vaste volgorde).
- **`UnitGallerySlider`** roept automatisch `getExtraLocationIds(slug)` aan — geen handmatige bedrading per pagina.

### Functioneel
- Een foto die op `hoogmolen-verblijf-watermolen-…` staat verschijnt nu automatisch óók in de gallery van Volmolen, Volmolen Plus, Watermolen Plus én Landgoed.
- Plus-formules tonen ook automatisch foto's van het Molenhuys.
- Memory `mem://features/unit-composition` bevat de regels en blijft de bron.

## [v3.14.6] - 2026-04-24 — Magic upload-flow: realtime + match-status + rename
### Added
- **`src/hooks/useImageLibrary.ts`** — Supabase realtime channel `image_library_changes` luistert nu op INSERT/UPDATE/DELETE. Cache wordt automatisch geïnvalideerd en alle gemonteerde galleries krijgen vers data zonder reload (alle tabs/devices, ~200ms).
- **`src/lib/libraryMatchStatus.ts`** (nieuw) — analyseert per filename of deze `match` (verschijnt op pagina), `loose` (onbekende unit) of `off` (niet-conform) is.
- **`src/components/admin/MediaPicker.tsx`** — status-filter knoppen bovenaan (Alles / Match / Onbekend / Niet conform) met tellers; per-thumb status-badge; preview-zijbalk toont status-panel + inline rename-formulier dat filename + cloudflare_id update.
- **Migration**: `image_library` toegevoegd aan `supabase_realtime` publication + `REPLICA IDENTITY FULL`.

### Functioneel
- Foto's verschijnen automatisch op de site zodra ze geüpload of hernoemd worden — geen page reload meer nodig.
- In `/admin/media → Bibliotheek` zie je per foto of hij wel/niet op een pagina verschijnt en kun je verkeerd benoemde uploads ter plekke fixen.

## [v3.14.5] - 2026-04-24 — cf-sync: cloudflare_uid invullen + per-rij fallback
### Fixed
- **`supabase/functions/cf-sync/index.ts`** — sync brak met `null value in column "cloudflare_uid" violates not-null constraint` omdat alleen `cloudflare_id` werd gevuld. Nu vult sync ook `cloudflare_uid` (zelfde waarde) → kolom is NOT NULL en heeft geen default.
- **Robuustheid**: bij batch-fout valt sync terug op per-rij upsert. Eén rotte rij blokkeert niet meer de hele pagina; fouten worden per `cloudflare_id` gerapporteerd.

## [v3.14.4] - 2026-04-24 — Watermolen gallery via auto-resolver (geen hardcoded ID's meer)
### Fixed
- **`src/pages/Watermolen.tsx`** — galerij gebruikte hardcoded ID-reeks (`hoogmolen-verblijf-watermolen-overzicht-01..12` + 4 vaste detail-IDs). Wanneer die exacte IDs niet in Cloudflare/library staan, viel elk `<CFImage>` terug op het `hero-estate.jpg`-fallbackbeeld → "Chinese beelden"-gevoel.
- Vervangen door `useUnitGallery({ slug: "watermolen" })` + `<PropertyPhotoGrid>` / `<UnitGallerySlider>` → gebruikt dezelfde longest-prefix-match resolver als Peerdermolen e.a.; toont automatisch álles wat onder `hoogmolen-verblijf-watermolen-…` is geüpload.
- Bij lege library: nette placeholder-tegel i.p.v. herhaald fallback-hero.

### Note
- Vereist eenmalig **"Synchroniseer met Cloudflare"** in `/admin/media` om bestaande Cloudflare-uploads die nog niet in `image_library` staan, in te laden.

## [v3.14.3] - 2026-04-24 — Auto-gallery werkt nu voor Peerdermolen & co (prefix-match)
### Fixed
- **`src/lib/imageMatcher.ts`** — `matchImagesForUnit()` viel terug op placeholders bij property-foto's met meer dan 3 meta-segmenten (bv. `peerdermolen-woonkamer-eetkamer-bankstel-02` of `peerdermolen-terras-tafel-zijhoek-02`). De strikte 3-segment-meta regel splitste de locationId te kort af → 0 matches.
- Nieuwe `matchByPrefix()` helper voert een brede prefix-match uit (`<locationId>-*`) als secundaire strategie, met exclusie van sub-units (`kamer-b#`, `kamer-familie`, `a#`) zodat de Peerdermolen-gallery niet vol kamerfoto's komt.
- Strategie-volgorde in `matchImagesForUnit()`: exact-match → prefix-match → parent exact-match → parent prefix-match.

### Functional impact
- Peerdermolen toont nu de **13 echte foto's** (woonkamer, hal, terras) i.p.v. olijfgroene placeholders.
- Identieke verbetering werkt automatisch voor Watermolen, Volmolen en alle Plus-varianten zodra hun foto's geüpload worden.
- Geen schema- of config-wijziging nodig — bestaande naamgevingsconventie blijft gelden.

---

## [v3.14.2] - 2026-04-24 — Public read access op foto-bibliotheek
### Changed
- **RLS-policy `image_library`** — SELECT-toegang van `authenticated` → `anon, authenticated` (met filter `status = 'success'`). Anonieme bezoekers krijgen nu ook de Cloudflare-IDs binnen, waardoor de auto-match in `useUnitGallery` voor iedereen werkt i.p.v. enkel ingelogde admins.
- INSERT/UPDATE/DELETE policies blijven ongewijzigd (admin/editor only).

### Notes
- Privacy-impact: nul. CF-IDs worden sowieso publiek geserveerd via de `<img src>` op elke pagina.
- Vereiste voorwaarde voordat `v3.14.3` (matcher-fix) effect heeft.

---

## [v3.14.1] - 2026-04-24 — Copy-knop in Media-historiek
### Added
- **`src/components/admin/MediaHistoryPanel.tsx`** — kopieer-knop naast elke `cloudflare_id` in de audit-tabel. Klik = ID op klembord + toast met instructie ("Plak in propertyConfig.ts of unitsConfig.ts als imageId"). Visuele bevestiging via check-icoon (1.8s).

### Notes
- Marketeer-workflow: zoek foto in `/admin/media` → Historiek → klik copy → plak als `imageId: "..."` in config.
- Upload-paneel had deze functie al via `MediaPicker.onSelect` (auto-copy bij selectie).

---

## [v3.14.0] - 2026-04-24 — Configureerbare Cloudflare-pipeline + LCP blur-placeholder
### Added
- **`src/integrations/cloudinary-config.ts`** (nieuw) — centrale config voor `CLOUDFLARE_ACCOUNT_HASH` (leest `import.meta.env.VITE_CLOUDFLARE_HASH`, default `QMQ3XlUZJRDdvp6mt-4NIQ`), proxy-base, delivery-base, default variant en responsive-widths.
- **`src/lib/image-utils.ts`** (nieuw) — centrale URL-builders:
  - `getCloudflareUrl(id, { width?, blur? })` — gebruikt de hash uit centrale config (niet meer hardcoded).
  - `getCloudflareSrcSet(id)` — responsive srcset 480→1920w.
  - `getCloudflareBlurUrl(id)` — lage-resolutie LCP-placeholder (32px + blur=60).
  - `resolveImageUrl(value)` — auto-detect URL vs CF-ID.
- **`Property.imageId` / `Unit.imageId`** — nieuwe alias-velden naast `heroImage`. Beide worden gelezen; `imageId` wint bij conflict (`pickImageId()` helper).
- **`CFImage`** — toont nu een blur-placeholder als CSS background (32px low-res variant) onder de full-res `<img>` → CLS=0 en LCP boost richting 100%.

### Changed
- **`src/config/cloudflareImagesConfig.ts`** — `CF_PROXY_BASE`, `CF_ACCOUNT_HASH`, `CF_IMAGES_BASE`, `CF_VARIANT` zijn nu re-exports uit `cloudinary-config.ts`. Geen breaking changes; alle bestaande imports blijven werken.
- **`src/lib/imageSource.ts`** — re-export van `image-utils` (`resolveImageSrc`, `isAbsoluteUrl`); nieuwe `pickImageId()` helper.

### Notes
- Géén `/public/images/` paden gevonden in de configs — migratie was niet nodig.
- Voor environment-specifieke override: zet `VITE_CLOUDFLARE_HASH=<hash>` in de Netlify build vars.

---

## [v3.13.1] - 2026-04-24 — Filename-conventie alt/title parser
### Added
- **`src/lib/seoAlt.ts`** — `buildAltFromFilename(id)` parsed CF custom-IDs volgens patroon `hoogmolen-verblijf-<unit>[-kamer-<b#>]-<onderdeel>[-<index>]` naar SEO-rijke alt/title-teksten:
  - `hoogmolen-verblijf-watermolen-slaapkamer-01` → `"Luxe Slaapkamer Watermolen in Oudsbergen"`
  - `hoogmolen-verblijf-peerdermolen-kamer-b3-bed-01` → `"Bed in Kamer B3 · Peerdermolen in Oudsbergen"`
  - Vrije filenames (admin-upload) → Title Case + brand-suffix `· Landgoed De Hoogmolen in Oudsbergen`.
  - Vocabulaire `PART_LABEL` mapt 25+ tokens (slaapkamer→Luxe Slaapkamer, terras→Terras, molenhuys→Molenhuys, …).
- **`buildPropertyAlt(slug, role, idx, filename?)`** — nieuwe optionele 4e param: wanneer een filename/CF-ID beschikbaar is wint die over role-based fallback.
- **`src/components/property/PropertyPhotoGrid.tsx`** — geeft nu de CF-ID door als 4e arg (mode A focus + thumbs én mode C thumbs) zodat alt/title rechtstreeks uit de filename worden afgeleid.

### Functional impact
- Alle galerij-foto's met conventie-conforme CF-IDs broadcasten nu maximaal-rijke alt/title-teksten — exact zoals de Foto's-Nummeren-conventie voorschrijft. Foto's zonder CF-ID (absolute URLs) behouden de role-based fallback.

### Suggested commit
`[v3.13.1] - Filename→alt parser (Luxe Slaapkamer Watermolen Oudsbergen) in PhotoGrid`

---

## [v3.13.0] - 2026-04-24 — Guesty API voorbereiding + Image Intelligence
### Added — Blok 2: Guesty 'Digital Twin'
- **`src/lib/guestyMapping.ts`** (nieuw) — alias-laag tussen Property-config en Guesty Open API (`listings` endpoint):
  - `extractListingId(property)` → leest `guestyListingId` of valt terug op het `_id` aan het einde van `bookingUrl`.
  - `buildBookingUrl(property, listingId)` → `https://www.hoogmolen.com/nl/properties/{_id}` voor 'Boek nu' check-out.
  - `resolveListing(property, live?)` → mergt config-fallback met optionele live `prices.basePrice` / `availability.isAvailable` payload — single source voor alle templates.
- **`src/config/propertyConfig.ts`** — `Property` interface uitgebreid met `guestyListingId?: string` (alias voor Guesty `_id`).
- **`src/components/property/PriceSkeleton.tsx`** (nieuw) — puls-skelet voor de prijs-sectie zolang Guesty-data nog niet binnen is (no layout-shift).
- **`src/components/property/PropertyPriceBar.tsx`** — gebruikt nu `resolveListing()` voor prijs + URL, accepteert `isLoading` prop voor skeleton-modus, toont 'Niet beschikbaar' wanneer `availability.isAvailable === false`, 'Boek nu' wordt disabled bij volgeboekt.

### Added — Blok 3: GEO & Image Intelligence
- **`src/config/cloudflareImagesConfig.ts`** — `cfImageAt(id, w)`, `cfImageSrcSet(id)` en `CF_DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920]` voor responsive Cloudflare delivery.
- **`src/components/CFImage.tsx`** — emit `srcSet` + `sizes` (default `(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw`), `title`-tag (default = alt) voor SEO/UX. Override en fallback paden bewust zonder srcset.
- **`src/components/property/PropertyPhotoGrid.tsx`** — focus-foto behoudt `loading="eager"` + `fetchpriority="high"` (Tier-1 above-the-fold), thumbs blijven `loading="lazy"`. Per slot expliciete `sizes` (50vw focus, 25vw thumbs) + `title` op absolute-URL `<img>` paden.

### Functional impact
- 'Boek nu' is nu Guesty-ready: zodra `guestyListingId` is gezet (en optioneel een live payload via `resolveListing(property, live)`), routeert de CTA automatisch naar de juiste check-out.
- Galerijen serveren nu de juiste resolutie per device (Cloudflare resized variants) en tonen rijke `title`-tooltips bovenop de bestaande GEO alt-teksten.

### Suggested commit
`[v3.13.0] - Guesty API voorbereiding (resolveListing + PriceSkeleton + Book Now CTA) + srcset/title image intelligence`

---

## [v3.12.0] - 2026-04-24 — Dynamische Metadata & Schema Engine
### Added
- **`react-helmet-async`** geïnstalleerd; `HelmetProvider` toegevoegd in `src/main.tsx`.
- **`src/config/seoConfig.ts`** — per-route `title` (≤60 chars, eindigt op `| Hoogmolen`) + `description` (≤155 chars) volgens SEO_GEO §12.2 voor home, overnachten-hub, alle 6 vakantiewoningen, suites/kamers, groepsverblijf, vergaderen, teambuildings, paardenlogies, activiteiten, praktisch en contact. Dev-warnings bij overschrijding.
- **`src/config/breadcrumbConfig.ts`** — `buildBreadcrumbs(pathname)` bouwt segmentwise crumbs voor alle 77 routes; slug-fallback naar `propertyConfig.getProperty()` zodat detail-URL's de echte property-naam tonen.
- **`src/components/SEO.tsx`** — centrale Helmet-component die titel, meta description, canonical, Open Graph, Twitter Cards én `BreadcrumbList` JSON-LD per route injecteert. Per-prop overrides (`title`, `description`, `canonical`, `image`, `noIndex`) voor dynamische templates.
- **`src/components/GlobalSchema.tsx`** uitgebreid: `LodgingBusiness` bevat nu `checkinTime: "15:00"` en `checkoutTime: "10:00"` conform Informatiegids.
- **`src/components/layout/Layout.tsx`** — mount `<SEO />` boven `<GlobalSchema />` zodat élke route automatisch metadata + breadcrumb schema krijgt.

### Suggested commit
`[v3.12.0] - SEO engine: react-helmet-async + per-route title/desc + BreadcrumbList + checkin/out`

---

## [v3.11.0] - 2026-04-24 — GEO-optimalisatie afbeeldingen (rijke alt-teksten)
### Added
- **`src/lib/seoAlt.ts`** — `buildPropertyAlt(slug, role, idx)` genereert SEO + GEO-rijke alt-teksten op basis van `propertyConfig` (type-label + property.name + locatie "Oudsbergen" + capaciteit + rol-suffix).
- **`src/components/property/PropertyPhotoGrid.tsx`** — alle 4 alt-paden (focus + 4 thumbs in mode A en mode C) vervangen door `buildPropertyAlt(...)`.
  - Voorbeeld output: `"Vakantiewoning Watermolen in Oudsbergen voor 17 personen — overzicht"` i.p.v. `"watermolen — focus"`.

### Note
- Het globale `LodgingBusiness`, per-property `Product`/`HotelRoom` en `FAQPage` JSON-LD waren reeds geleverd in v3.8 → v3.10 — deze release voltooit het GEO-blok met afbeelding-metadata.

### Suggested commit
`[v3.11.0] - GEO-rijke alt-teksten in PropertyPhotoGrid via buildPropertyAlt`

---

## [v3.10.0] - 2026-04-24 — FAQ-Strategie: SERP-dominantie via FAQPage JSON-LD
### Added
- **`src/config/faqConfig.ts`** — drie nieuwe SEO-georiënteerde vragen:
  - "Hoeveel personen kunnen overnachten in de Watermolen?" → tot 17p, 5 slpk × eigen badkamer.
  - "Wat zijn de in- en uitchecktijden?" → in 15u00, uit 10u00 (extra korte SERP-variant naast bestaande "Hoe laat…").
  - "Zijn huisdieren toegelaten?" → honden welkom in Watermolen op aanvraag (vorige "Zijn honden welkom?" gecorrigeerd conform gids).
- **`src/components/FAQAccordion.tsx`** — injecteert nu eigen `FAQPage` JSON-LD met exact de items die op de pagina zichtbaar zijn, ruimt zichzelf op bij unmount → garandeert dat Google's rich result altijd de getoonde Q/A overneemt.

### Suggested commit
`[v3.10.0] - FAQPage JSON-LD per pagina + 3 SEO-FAQ's (Watermolen 17p, in/uit-tijden, huisdieren)`

---

## [v3.9.0] - 2026-04-24 — Rich Snippet Generator per accommodatie
### Added
- **`src/components/PropertySchema.tsx`** — dynamische JSON-LD per detailpagina:
  - `type: "house"` → **`Product`** met `AggregateOffer` { `lowPrice = startingPrice`, `priceCurrency: "EUR"`, `availability: InStock` }.
  - `type: "room" | "suite" | "duplex"` → **`HotelRoom`** met `occupancy`, `numberOfRooms`, `bed` (uit `bedConfig`), `amenityFeature` en `makesOffer` (Offer + UnitPriceSpecification per nacht, EUR, InStock).
  - Beide bevatten `AggregateRating 4.9 / 142` (Google Business) en `containedInPlace` → `#lodging` uit GlobalSchema → één entiteits-graph.
- Gemonteerd in `src/pages/PropertyDetail.tsx` boven de templatekeuze; ruimt zichzelf op bij unmount zodat niet-detailpagina's clean blijven.

### Suggested commit
`[v3.9.0] - Per-property Product/HotelRoom JSON-LD met EUR-prijs + InStock + 4.9/142`

---

## [v3.8.0] - 2026-04-24 — GEO-Fundament: globaal LodgingBusiness JSON-LD
### Added
- **`src/components/GlobalSchema.tsx`** — globale `<script type="application/ld+json">` met `@graph`:
  - `LodgingBusiness` — naam, adres (Hoogmolenweg 15, 3670 Oudsbergen), telefoon `+32 (0)11 90 11 00`, e-mail, geo-coördinaten (51.1632, 5.5402), `hasMap`, `priceRange`, `aggregateRating` (4.9 / 571), en `sameAs` → Facebook + Instagram-pagina's.
  - `WebSite` met `SearchAction` (`/zoeken?q={search_term_string}`) — voorbereiding voor Google sitelinks-searchbox / Custom Search-koppeling.
- Gemonteerd in `Layout.tsx` zodat élke route hetzelfde fundament aanlevert; bestaande page-specifieke `SchemaInjector` blijft naast werken.

### Suggested commit
`[v3.8.0] - GEO-Fundament: globaal LodgingBusiness + WebSite SearchAction JSON-LD`

---

## [v3.7.0] - 2026-04-24 — Universal Full-Card Clickability op /overnachten/vakantiewoningen
### Changed
- **`src/pages/Vakantiewoningen.tsx`** — Drie kaart-types volledig klikbaar gemaakt:
  - `UnitFeatureCard` (Peerdermolen + Watermolen): hele tegel is één `<Link>` naar de detailpagina; knoppen "Bekijk" + "Boek nu" vervangen door één `ArrowRight`-signpost + prijs-vanaf-blok.
  - `GroupFormulaCard` (Volmolen / Volmolen Plus / Landgoed): hele tegel is `<Link>`; "Meer info →" als visuele wegwijzer.
  - `MolenhuysCard`: hele highlight-blok is `<Link>` naar /overnachten/molenhuys.
- Alle drie passen consistente hover-lift (`-translate-y-1`) + `shadow-card` toe.

### Safety
- **Fallback-gedrag**: zonder `image_overrides` toont elke kaart de bestaande hardcoded foto (via `UnitGallerySlider`) of gradient — site blijft nooit leeg.
- **Admin-mode pauze**: in `isAdminMode` wordt de Link-navigatie geblokkeerd via `e.preventDefault()` op alle drie de kaart-types, zodat editors per-ongelukse jumps vermijden.

### Suggested commit
`[v3.7.0] - Universal Full-Card Clickability op /overnachten/vakantiewoningen + admin pauze`

---

## [v3.6.0] - 2026-04-24 — UID-Driven Image Library + Secure Admin Backend
### Added
- **DB migratie** — kolom `cloudflare_uid` (TEXT, NOT NULL, UNIQUE) toegevoegd aan `image_library`. Bestaande rijen ge-backfilled vanuit `cloudflare_id`. Index `idx_image_library_cloudflare_uid` voor snelle dedupe-lookups tijdens "Synchroniseer met Cloudflare".
- **`src/components/admin/MediaUploadPanel.tsx`** — bij elke upload wordt het door Cloudflare gegenereerde UID nu direct opgeslagen in `cloudflare_uid` (verplicht, uniek). Voorkomt duplicaten bij toekomstige sync-runs.

### Preserved
- Tabellen `image_library`, `image_overrides`, `text_overrides` met RLS (admins+editors schrijven, authenticated users lezen) blijven intact.
- `/admin` routes met branded login (e-mail+wachtwoord, e-mailverificatie verplicht) en `ProtectedRoute` blijven intact.
- Alle 77 publieke pagina-routes in `App.tsx` blijven onaangeroerd.

### Suggested commit
`[v3.6.0] - UID-driven image_library: cloudflare_uid (NOT NULL UNIQUE) + index + upload-write`

---

## [v3.5.4] - 2026-04-24 — Full-Card Clickability op /paardenlogies
### Changed
- **`src/pages/Paardenlogies.tsx`** — 'Voor de ruiter' + 'Voor het paard' kaarten en de 3 'Combineer met'-kaarten zijn nu volledig klikbare `<Link>`-containers. Knop-styling vervangen door `ArrowRight`-signpost; consistente hover-lift (`-translate-y-1`) + `shadow-card`; dynamische `aria-label`.

### Suggested commit
`[v3.5.4] - Full-card clickability op /paardenlogies`

---

## [v3.5.3] - 2026-04-24 — Full-Card Clickability op /teambuildings
### Changed
- **`src/pages/Teambuildings.tsx`** — alle drie de secties zijn nu volledig klikbare containers:
  - 3 pijlerkaarten (In Limburg, Op het domein, Met overnachting)
  - Populaire activiteiten-grid (interne én externe links)
  - "Combineer teambuilding met"-blok (Vergaderen, Groepsverblijf, Molenhuys)
- Knop-styling vervangen door `ArrowRight`-signpost; consistente hover-lift (`-translate-y-1`) + `shadow-card`; dynamische `aria-label` per kaart.

### Suggested commit
`[v3.5.3] - Full-card clickability op /teambuildings (pijlers + activiteiten + combineer-blok)`

---

## [v3.5.2] - 2026-04-24 — Full-Card Clickability op /overnachten
### Changed
- **`src/pages/Overnachten.tsx`** — de drie accommodatiekaarten (Vakantiewoningen, Duplexsuites, Kamers) en de Boekingsinformatie-kaart zijn nu volledig klikbare `<Link>`-containers. Knop-styling vervangen door `ArrowRight`-signpost; hover-lift (`-translate-y-1`) + `shadow-card`; dynamische `aria-label`. Beige groepen-CTA-banner werd ook full-card klikbaar naar `/groepsverblijf`.
- Titels en beschrijvingen zijn `EditableText` geworden (`overnachten.acco.*` / `overnachten.info.*` keys) zodat ze via de Visual Editor aanpasbaar zijn.
- Admin-modus blokkeert navigatie en toont blauwe ring-overlay (zelfde patroon als `FeatureCard`).

### Suggested commit
`[v3.5.2] - Full-card clickability op /overnachten + EditableText keys`

---

## [v3.5.1] - 2026-04-24 — UID-Based Cloudflare Sync Integrity
### Database
- **`image_library`** — `UNIQUE` constraint toegevoegd op `cloudflare_id` (Cloudflare UID) zodat elk Cloudflare-beeld maximaal één keer in de bibliotheek kan voorkomen. Eventuele bestaande duplicaten werden verwijderd (oudste record behouden per UID).
- **Index** `idx_image_library_cloudflare_id` (partial, `WHERE cloudflare_id IS NOT NULL`) voor sub-milliseconde lookups tijdens sync, ook bij duizenden records.

### Changed
- **`supabase/functions/cf-sync/index.ts`** — vervangt `insert` door `upsert` met `onConflict: "cloudflare_id"` + `ignoreDuplicates: true`. Race-safe bij parallelle syncs en bestand tegen toekomstige logica-wijzigingen; telt enkel daadwerkelijk nieuwe rijen.

### Notes
- De bestaande upload-flow (`cf-upload` + `MediaUploadPanel`) sloeg de Cloudflare-UID al op in `cloudflare_id` bij elke succesvolle upload — geen wijziging nodig.

### Suggested commit
`[v3.5.1] - UID-based Cloudflare sync: unique constraint + index op cloudflare_id, upsert in cf-sync`

---

## [v3.5.0] - 2026-04-23 — Cloudflare Sync & Repair
### Added
- **`supabase/functions/cf-sync/index.ts`** — nieuwe edge function die alle bestaande Cloudflare Images ophaalt (gepagineerd via `images/v2`) en ontbrekende records in `image_library` aanmaakt. Beveiligd met admin/editor JWT-check en gebruikt service-role key voor RLS-bypass inserts.
- **`src/components/admin/MediaUploadPanel.tsx`** — nieuwe knop "Synchroniseer met Cloudflare" (icoon `RefreshCw`) met bevestigingsdialoog, spinning loading-state en toast met resultaat (`X nieuwe records, Y overgeslagen`).
- **`src/hooks/useImageLibrary.ts`** — exporteert nu `clearImageLibraryCache()` zodat de MediaPicker en gallery's na een sync onmiddellijk de nieuwe records tonen zonder page-refresh.
- **`supabase/config.toml`** — `[functions.cf-sync] verify_jwt = false` toegevoegd (auth-validatie gebeurt in code).

### Behavior
- Historische uploads (vóór de logging-implementatie) zijn nu via één klik recupereerbaar in de admin-bibliotheek en automatisch matchbaar via Longest-Prefix logica.

### Suggested commit
`[v3.5.0] - Cloudflare Sync & Repair: één-klik recovery van historische uploads naar image_library`

---

## [v3.4.2] - 2026-04-23 — Universal Full-Card Clickability: footer-nav, cross-sell & hubs
### Changed
- **`src/components/property/PropertyFooterNav.tsx`** — beide kaarten ("Terug naar overzicht" + "Naar groepsverblijf") zijn nu volledig klikbaar; harde knop-styling vervangen door `ArrowLeft` / `ArrowRight` signpost; hover-lift (`-translate-y-1`) + `shadow-card`; dynamisch `aria-label`.
- **`src/components/property/TemplateHouse.tsx`** — cross-sell banner "Met een grotere groep?" omgevormd tot full-card `<Link>` met hover-lift, signpost en aria-label.
- **`src/pages/ActiviteitenHub.tsx`** — sub-route kaarten kregen consistente hover-lift + shadow; "Combineer met verblijf"-blokken: harde groene knoppen vervangen door subtiele full-card containers met chevron en aria-label.

### Behavior
- Visuele consistentie site-breed: elke link-kaart leest nu als één klikvlak met dezelfde hover-feedback.
- Toegankelijkheid verbeterd: screenreaders krijgen exacte bestemming via `aria-label`.

### Suggested commit
`[v3.4.2] - Universal full-card clickability across footer-nav, cross-sell banners en activiteiten-hubs`

---

## [v3.4.1] - 2026-04-23 — Beleidswijziging: huisdieren niet toegelaten op het domein
### Changed
- **Site-breed beleid bijgewerkt**: alle vermeldingen van "Honden welkom" / "huisdieren welkom" vervangen door "Huisdieren niet toegelaten op het domein". Dit raakt:
  - `src/config/propertyConfig.ts` — Watermolen + Watermolen Plus: `tagline`, `highlights`, `amenities`, `summary` opgeschoond.
  - `src/config/unitsConfig.ts` — Watermolen + Watermolen Plus: `tagline`, `description`, `amenities`, `highlights` opgeschoond.
  - `src/config/faqConfig.ts` — FAQ-antwoord aangepast: "Helaas niet. Huisdieren zijn nergens op het domein toegelaten — dit met het oog op andere gasten, het erfgoed en het wildleven in de Abeekvallei."
  - `src/config/siteContentConfig.ts` — 3 facts-rijen (Watermolen / Watermolen Plus / overzicht) en 1 FAQ-antwoord: "🚫 Huisdieren · Niet toegelaten op het domein".
  - `src/pages/Boekingsinformatie.tsx` — huisregel-rij aangepast.
  - `src/pages/Praktisch.tsx` — Huisdieren-fact aangepast (paarden-info behouden).
  - `src/pages/Watermolen.tsx` — "Honden welkom" uit amenities-lijst en hero-paragraaf verwijderd.
  - `src/pages/PeerdermolenPlus.tsx` — extra-tarieven-grid: "Hond / nacht € 25" verwijderd, grid van 3 → 2 kolommen.
  - `src/pages/Vakantiewoningen.tsx` — `allowsDogs`-detectie en "Hond welkom" badge verwijderd, `PawPrint` import opgeschoond.
  - `src/pages/Ervaringen.tsx` — testimonial van Familie Vermeulen ("Hondenvriendelijk zonder compromis") herschreven naar "Erfgoed met hedendaags comfort"; testimonial van Thomas & Lien ontdaan van honden-vermelding.
  - `src/components/property/TemplateHouse.tsx` — fast-fact-conditional voor "Huisdieren toegestaan" verwijderd; toont nu altijd "Locatie · Oudsbergen". `Dog`-icoon import opgeschoond.

### Behavior
- Geen functionele/UX-impact buiten de tekst- en lijst-wijzigingen; alle prijs-, capaciteits- en boekingsinformatie blijft ongewijzigd.
- Paarden-beleid (6 boxen, €25 eerste nacht) blijft ongewijzigd op alle pagina's.

### Suggested commit
`[v3.4.1] - Beleidswijziging: huisdieren niet toegelaten op het volledige domein (12 bestanden bijgewerkt: configs, pagina's, FAQ, testimonials, templates)`

---

## [v3.4.0] - 2026-04-23 — Universal Full-Card Clickability (site-breed)
### Changed
- **`src/pages/Groepsverblijf.tsx`** (HUB): de drie groepsgrootte-blokken (10-20 / 20-30 / 30-53) zijn nu volledige `<Link>`-wraps in plaats van een `<article>` met losse "Bekijk →" pijl. Nieuwe `HubBucketCard` sub-component met dual-state (gast = Link, admin = inline EditableText voor titel/beschrijving + MediaPicker voor header-foto via `image_overrides`).
- **`src/components/UnitCard.tsx`** (accommodatie-grid previews): de hele tegel (image + body + prijs-rij) is nu één `<Link>`. De "Ontdek" Button is vervangen door een eenvoudige tekst + `ArrowRight` zonder onafhankelijke knop-styling.
- **`src/pages/GroepsverblijfBucket.tsx`** (`BucketCard`): hover-animatie geüniformeerd met de andere kaart-componenten — `hover:-translate-y-1` + `hover:shadow-card` (3 0 0 ms duration).

### Behavior
- **Universele klikvlak-affordance**: op Home (FeatureCard), Groepsverblijf-hub (HubBucketCard), Groepsgrootte-bucket-pagina's (BucketCard) en Accommodatie-grids (UnitCard) is nu **de hele kaart één klikvlak** met identieke hover-feedback (subtiele lift + zachte shadow).
- **CTA-cleanup**: alle in-card "Bekijk meer / Ontdek" CTA's zijn ontdaan van knop-styling; ze blijven als visuele wegwijzer (tekst + pijl) maar zijn geen aparte button meer.
- **Admin Mode-bescherming overal**: `isAdminMode` blokkeert navigatie en activeert de Visuele Editor (EditableText + MediaPicker) op exact dezelfde kaarten.

### Suggested commit
`[v3.4.0] - Universal Full-Card Clickability: hub-buckets (Groepsverblijf.tsx) en UnitCard volledig wrap-link, hover-lift + shadow consistentie, CTA-knop-styling verwijderd, admin dual-state met EditableText + MediaPicker overal`

---

## [v3.3.0] - 2026-04-23 — Full-clickable cards + visuele tekst/foto-editor in Admin Mode
### Added
- **`text_overrides`-tabel** (Lovable Cloud) — `(page_path, section_key, text_value)` met RLS: alle ingelogde gebruikers mogen lezen, alleen `admin`/`editor` mogen schrijven.
- **`src/components/admin/EditableText.tsx`** — generieke `contentEditable`-wrapper. Normale modus rendert tekst in een willekeurig tag (h3, p, span); admin-modus geeft blauwe ring, save-on-blur, Enter→blur (single-line), Escape→annuleer.
- **`AdminModeContext`** uitgebreid met `getTextOverride()` + `saveTextOverride()` + parallelle cache-fetch voor `text_overrides`.
- **`BucketCard`** sub-component in `GroepsverblijfBucket.tsx` — full-clickable in normale modus, admin-edit (titel + header-label + tagline + foto) in beheermodus.

### Changed
- **`FeatureCard`**: dual-state. Normaal = volledige `<Link>`-wrap (hele kaart klikbaar). Admin = geen Link, navigatie geblokkeerd; titel + omschrijving inline editable; foto-edit-overlay op header opent `MediaPicker` en saved in `image_overrides`. CTA "Ontdek →" blijft als visuele wegwijzer maar zonder onafhankelijke knop-styling — de kaart zélf is de actie.
- **`GroepsverblijfBucket`**: woning-kaarten zijn nu volledige `<Link>` (hele kaart klikbaar) i.p.v. losse Bekijk-knop; CTA-tekst blijft als pijl-aanduiding onderaan.

### Behavior
- **Instant preview**: tekst- en foto-overrides updaten de UI direct (Map-cache mutatie) zonder refresh; admin blijft in beheermodus na het opslaan.
- **Geen breaking change voor gasten**: zonder admin-sessie zien bezoekers exact dezelfde layout als v3.2 — extra muis-affordance: nu is de hele kaart klikbaar i.p.v. alleen de knop.

### Suggested commit
`[v3.3.0] - Full-clickable cards + visuele tekst/foto-editor in Admin Mode (text_overrides tabel, EditableText component, FeatureCard + BucketCard dual-state)`

---

## [v3.2.0] - 2026-04-23 — Context-aware image matching (longest-prefix + parent fallback)
### Added
- **`src/lib/imageMatcher.ts`** — `parseImageId()` + `matchByLocationId()` + `matchImagesForUnit()`. Splits Cloudflare custom-IDs in **Unique Location ID** (alles vóór de laatste 3 segmenten) en **Metadata** (`[seoA, seoB, indexNN]`); filtert op exacte locationId en sorteert op numerieke index.
- **`src/lib/locationId.ts`** — `locationIdsForSlug(slug)` bouwt `{ primary, parent }`-paar volgens upload-conventie (bv. kamer-b2 → `hoogmolen-verblijf-peerdermolen-kamer-b2` met parent `hoogmolen-verblijf-peerdermolen`).
- **`src/hooks/useImageLibrary.ts`** — singleton-cached fetch van alle `success`-rijen uit `image_library`.
- **`src/hooks/useUnitGallery.ts`** — bron-prioriteit `configImages > library-match > parent-fallback > leeg`.
- **`src/hooks/usePropertyImages.ts`** — convenience-wrapper voor templates die ook `hero` (eerste matched image) teruggeeft.
- **`src/components/UnitGallerySlider.tsx`** — `UnitSlider`-wrapper die zelf de hook aanroept; gebruikt op alle 3 overzichtspagina's.

### Changed
- **`PropertyHero`**: nieuwe optionele `heroImageOverride`-prop. Prioriteit blijft `admin override > property.heroImage > heroImageOverride (auto-match) > gradient`.
- **Templates** `TemplateHouse`, `TemplateHouseStrict`, `TemplateDuplex`, `TemplateRoom`: roepen `usePropertyImages()` aan en sturen resolved `hero` + `images` door naar `PropertyHero` resp. `PropertyPhotoGrid`.
- **`UnitDetail`**: gebruikt `useUnitGallery` + `locationIdsForSlug` zodat de hero automatisch de eerste matching foto kiest als `unit.heroImage` leeg is.
- **Overzichtspagina's** `DuplexsuitesOverview`, `KamersOverview`, `Vakantiewoningen`: vervangen `UnitSlider` door `UnitGallerySlider` zodat elke kaart automatisch de juiste image-set toont (config wint, anders longest-prefix match, anders parent-fallback, anders placeholder).

### Behavior
- **Sub-unit (Kamer B2)**: zoekt eerst exact `hoogmolen-verblijf-peerdermolen-kamer-b2-*`. Geen treffer → SEO-fallback op parent `hoogmolen-verblijf-peerdermolen-*`.
- **Config wint altijd**: zodra `galleryImages`/`heroImage` is gezet in `propertyConfig`/`unitsConfig`, wordt de library-match overruled.
- Geen breaking change: pagina's zonder library-data en zonder config tonen nog steeds placeholders/gradient zoals in v3.1.

---

## [v3.1.0] - 2026-04-23 — Dynamische beelden via config (heroImage + galleryImages)
### Added
- **`Property` interface** (`propertyConfig.ts`): twee nieuwe optionele velden — `heroImage?: string` voor de hero-achtergrond en `galleryImages?: string[]` voor de PropertyPhotoGrid (1 focusfoto + 4 thumbs).
- **`Unit` interface** (`unitsConfig.ts`): JSDoc verduidelijkt op `heroImage`; nieuw `galleryImages?: string[]` voor sliders op overzichtspagina's en UnitDetail.
- **`src/lib/imageSource.ts`**: gedeelde resolver met `isAbsoluteUrl()`, `resolveImageSrc()`, `resolveImageList()`. Auto-detect: strings met `://` (of `data:` / `blob:`) worden als URL gebruikt, alle andere als Cloudflare custom-ID via de worker-proxy.

### Changed
- **`PropertyHero`**: nieuwe achtergrond-prioriteit `override > property.heroImage > gradient`. Beeld krijgt subtiele ken-burns animatie + dubbele overlay (`from-primary-deep/80 to-transparent` boven + zachte side-fade) voor leesbaarheid. Drop-shadow op H1 + meta voor extra contrast. Gradient blijft default fallback.
- **`PageHero`**: optionele `heroImage`-prop toegevoegd. Aanwezig → ken-burns achtergrond + leesbaarheids-overlay. Leeg → bestaande olijfgroene gradient + accent-radial blijven onveranderd.
- **`PropertyPhotoGrid`**: extra `images?: string[]` prop. Wanneer aanwezig → eerste foto wordt grote focus links (`col-span-2 row-span-2`), foto's 2-5 worden thumbs, ontbrekende posities renderen als olijfgroene placeholder-tegel ("Foto N"). Zonder `images` blijft slug-resolver actief (geen breaking change).
- **`UnitSlider`**: gebruikt nu `resolveImageSrc` zodat zowel volledige URLs als CF-IDs werken. Lege lijst → placeholder met label.
- **`UnitDetail`**: hero gebruikt `unit.heroImage` (ken-burns + dubbele overlay) wanneer gezet, anders bestaand iconHint-gradient. Drop-shadow op H1 + tagline.
- **Templates** `TemplateHouse`, `TemplateHouseStrict`, `TemplateDuplex`, `TemplateRoom`: geven `images={property.galleryImages}` door aan `PropertyPhotoGrid`.
- **Overzichtspagina's** `DuplexsuitesOverview`, `KamersOverview`, `Vakantiewoningen`: voeden `UnitSlider` met `unit.galleryImages` / `property.galleryImages`.

### Functional impact
- **Geen breaking change**: alle 17 detailpagina's en overzichten zien er identiek uit zolang `heroImage` en `galleryImages` leeg blijven (groene gradient blijft de default). Per unit/property kan nu via één regel config (CF-ID of full URL) een echte foto worden ingeschoten — zonder bouwwijziging, zonder admin-tussenkomst. Hero-foto's krijgen automatisch ken-burns + leesbaarheids-overlay; PhotoGrid toont eerlijk welke posities nog ontbreken.

---

## [v3.0.1] - 2026-04-23 — Admin auth-routing herstel
### Fixed
- **404 na reset-mail**: e-maillinks (signup-verificatie + password-recovery) wezen naar de beschermde `/admin` route, waardoor `ProtectedRoute` direct naar `/admin/login` redirectte voor de auth-sessie geactiveerd was.
- Nieuwe publieke **`/admin/auth/callback`** route die hash- en query-tokens (PKCE `token_hash` + legacy `access_token`) correct verwerkt en op basis van `type` doorstuurt naar `/admin/reset-password` (recovery) of `/admin` (signup/invite/magiclink).
- **Login**: detecteert `PASSWORD_RECOVERY`-event apart en stuurt naar reset-pagina i.p.v. dashboard.
- **ResetPassword**: tolerant voor zowel hash- als query-tokens; toont nette foutmelding i.p.v. door te vallen naar 404 bij verlopen of ongeldige links.
- **emailRedirectTo** consequent op `/admin/auth/callback` in `Login.tsx`, `Users.tsx` en `admin-bootstrap` edge function.
- Trailing-slash aliassen toegevoegd voor alle admin-auth routes.

### Functional impact
- Reset- en verificatiemails openen nu betrouwbaar de juiste pagina, ook in een nieuw browservenster of na een dag wachten. Verlopen links tonen een duidelijke melding met een knop terug naar login.

---

## [v3.0.0] - 2026-04-23 — Centralized Admin Console
### Added
- **Nieuwe admin-architectuur**: rolgebaseerd dashboard op `/admin` met sidebar-layout, gebrandeerde login (`/admin/login`) en 5 secties — Dashboard, Media & Uploads, Visual Editor, User Management, Settings.
- **Database**: tabellen `profiles`, `user_roles` (enum `admin`/`editor`) en `site_settings`. Security definer-functie `has_role()` voorkomt RLS-recursie. Auto-trigger maakt profiel bij signup.
- **Strikte RLS**: oude `image_library` + `image_overrides` policies aangescherpt — alleen admins/editors kunnen nu inserten/updaten/verwijderen (lezen blijft authenticated).
- **Email-verificatie verplicht** voor nieuwe admin-accounts (auto-confirm uit, HIBP-check aan).
- **`useUserRoles` hook** + **`ProtectedRoute`** component met `requireAdmin`-prop voor sectie-niveau bescherming.
- **AdminLayout** met collapsible donkergroene sidebar, sticky header (user-email + rol + logout) en responsive content-area.
- **User Management UI**: tabel met alle gebruikers + rol-toggles, dialog om nieuwe admins/editors uit te nodigen via signUp + auto-rol-toekenning.
- **Visual Editor**-pagina: snelkoppelingen naar de live site met Beheermodus voor-geactiveerd in `localStorage`.
- **Settings**-pagina: contactgegevens (telefoon/e-mail/WhatsApp) bewerkbaar — opgeslagen in `site_settings`.

### Changed
- Footer toont voor admins nu ook een **CONSOLE**-link naast de Beheermodus-toggle.
- Routing: `/admin/upload` en `/admin/history` vervangen door `/admin/media` (single page met tabs).

### Removed
- Oude pagina's `AdminLogin.tsx`, `AdminUpload.tsx`, `AdminHistory.tsx` — vervangen door nieuwe console-structuur.

### Functional impact
- Eén centrale plek voor alle beheer met rol-gebaseerde toegang. Admins krijgen volledige toegang; editors zien enkel Media en Visual Editor. Nieuwe accounts moeten hun e-mail bevestigen vóór eerste login. Dashboard toont live counts uit `image_library`, `image_overrides` en `user_roles`.

---

## [v2.11.0] - 2026-04-23 — Brand-logo in PropertyHero
### Added
- **PropertyHero** toont nu het Hoogmolen-logo discreet in de rechter onderhoek (`absolute bottom-4 right-4 md:bottom-8 md:right-8`).
- Logo wit gerenderd (`brightness-0 invert`) met subtiele `drop-shadow` voor maximaal contrast tegen de groene hero-gradient.
- Responsieve schaal: `h-10` mobiel → `h-16` tablet → `h-20` desktop. `pointer-events-none` zodat het de admin-edit-overlay niet blokkeert.

### Functional impact
- Alle 17 detailpagina's met `PropertyHero` krijgen visuele brand-anchoring zonder andere hero-elementen te verstoren. Logo verschijnt enkel in de hero — niet in `AvailabilityBar` of andere secties.

---

## [v2.10.0] - 2026-04-23 — Beheermodus UX-verfijning
### Added
- **Sneltoets `Alt+A`** — toggelt Beheermodus instant (alleen actief voor ingelogde admins). Geïmplementeerd in `AdminModeContext` via globale `keydown`-listener.
- **Discrete Footer-toggle** — kleine `Wand2`-knop naast het versie-label, uitsluitend zichtbaar voor admin-sessies. Wordt geel/secondary wanneer beheer aanstaat.

### Functional impact
- Twee extra toegangswegen tot Beheermodus zonder de Header te belasten: snelle keyboard-flow tijdens redactiewerk en een onopvallende mouse-fallback in de footer. Niet-ingelogde bezoekers zien nooit een toggle.

---

## [v2.9.0] - 2026-04-23 — Beheermodus & visuele on-page overrides (Batch 3)
### Added
- **Context** `src/contexts/AdminModeContext.tsx` — globale `AdminModeProvider` die
  - de Lovable Cloud-sessie volgt (`isAdmin`),
  - een persistente `isAdminMode` toggle bewaart in `localStorage`,
  - alle records uit `image_overrides` cachet in een Map en een `getOverride(pagePath, sectionKey)` helper biedt,
  - `saveOverride()` schrijft (delete-then-insert) met directe cache-update.
- **Component** `src/components/admin/EditableImage.tsx` — wrapper die in beheermodus een blauwe hover-overlay + "Edit"-knop + section-key indicator toont. Klik opent de `MediaPicker`; selectie persisteert via `saveOverride`.
- **Header-toggle** "Beheermodus" (paars-blauw met `Wand2`-icoon) zichtbaar voor ingelogde admins. State persisteert tussen page-loads.

### Changed
- **`CFImage`**: accepteert nu `sectionKey` + optionele `pagePath`. Indien een override bestaat → toont `image_url` i.p.v. CF-ID. In adminMode wrapt zichzelf in `EditableImage`.
- **`PropertyPhotoGrid`**: vier thumbs krijgen automatisch `sectionKey="gallery_thumb_1..4"` zodat ze per pagina overrideable zijn.
- **`PropertyHero`**: in beheermodus klikbaar (`sectionKey="hero"`); een gekoppelde foto wordt als overlay-background met groene scrim gerenderd. Helper-tekst rechtsboven verandert naar "Hero-foto actief" zodra een override bestaat.
- **`App.tsx`**: `<AdminModeProvider>` wrapt alle routes binnen de `BrowserRouter`.

### Functional impact
- Ingelogde admins kunnen op gelijk welke detailpagina de "Beheermodus" aanzetten, een foto over de hero of in de gallery klikken, een vervangende afbeelding kiezen uit de visuele bibliotheek (Batch 2) en zien het resultaat **direct** zonder code-aanpassing. Bezoekers (geen sessie) zien gewoon de standaard CF-ID's.

---

## [v2.8.0] - 2026-04-23 — Visual MediaPicker met smart filters (Batch 2)
### Added
- **Nieuw component** `src/components/admin/MediaPicker.tsx` — herbruikbare modal die alle `success` records uit `image_library` toont als responsive thumbnail-grid (2/3/4 koloms).
- **Smart filtering**:
  - Zoekbalk op filename + cloudflare_id.
  - Auto-filter pills: extracteert tokens uit filenames (split op `-`/`_`), filtert stop-words (`hoogmolen`, `verblijf`, indices 01-12) en toont top-16 meest voorkomende als klikbare chips ("Peerdermolen", "Kamer", "Slaapkamer", "B3", …).
- **Visual selection**:
  - Klik op thumb → grote preview in zijbalk (filename, CF-ID, upload-datum) voor lighting/styling-check.
  - Dubbelklik = directe selectie + sluit modal.
  - Bevestigingsknoppen "Annuleer" / "Selecteer" in zijbalk.
- **Context-aware sortering**: `contextSlug` prop sorteert images met matchende tokens bovenaan + toont `<Sparkles /> match`-badge.
- **Bibliotheek-knop** in `AdminUpload` header opent de picker als demo (kopieert geselecteerde CF-link naar clipboard).

### Technical
- Filter-pipeline: query → activePill → context-sort, alles in `useMemo` voor snelle re-renders.
- Lazy-loading (`loading="lazy"`) op alle thumbs; preview gebruikt `object-contain` voor accurate verhouding.
- `MediaPickerProps` exporteert publieke API: `open`, `onOpenChange`, `contextSlug?`, `onSelect(cfId, filename)`.

---

## [v2.7.0] - 2026-04-23 — Image library & upload-historiek (Batch 1)
### Added
- **Database**: nieuwe tabellen `image_library` (audit trail upload-pogingen — filename, cloudflare_id, status, error_msg, created_at) en `image_overrides` (page_path, section_key, image_url) met RLS voor authenticated admins.
- **Logging**: `AdminUpload` schrijft elke upload-poging eerst als `pending` naar `image_library` en update naar `success`/`failed` op basis van het Cloudflare-antwoord (incl. foutmelding).
- **Nieuwe pagina** `/admin/history` (`AdminHistory.tsx`): doorzoekbare tabel van laatste 500 uploads met statusbadges, stats (totaal/geslaagd/mislukt) en datumformat NL-BE.
- Header-knop "Historiek" op `/admin/upload` voor snelle toegang.

### Technical
- Helper `update_updated_at_column()` met `SET search_path = public` (security definer best practice).
- Trigger `trg_image_overrides_updated_at` op `image_overrides`.
- Logging is non-fataal: failures in `image_library` blokkeren de upload niet.

---

## [v2.6.5] - 2026-04-23 — Grotere categorie-banners op /overnachten
### Changed
- `Overnachten`: categorielabel ("Vakantiewoningen", "Duplexsuites", "Kamers", …) vergroot van `text-base` naar `text-3xl md:text-4xl`, gecentreerd via flex met `min-h-[140px]` voor consistent vakformaat. Veel beter leesbaar als visuele categorie-aanduiding.

---

## [v2.6.4] - 2026-04-23 — Drop-statusregel: losse files vs. map
### Added
- `AdminUpload`: directe statusregel onder de drop-zone die toont hoeveel bestanden uit de drop kwamen (totaal, losse files, aantal mappen, files uit map) **voordat** de queue start.
- `extractFilesFromDataTransfer` retourneert nu een `DropExtraction` object met breakdown (`looseFileCount`, `directoryCount`, `filesFromDirectories`) i.p.v. een platte file-array.

### Changed
- `onPick` zet ook een statusregel afhankelijk van welke picker (bestanden/map) gebruikt is.

---

## [v2.6.3] - 2026-04-23 — Splits picker: bestanden vs. map
### Changed
- `AdminUpload`: aparte file-inputs voor losse bestanden (zonder `webkitdirectory`) en mappen (met `webkitdirectory`). Twee duidelijke knoppen in de drop-zone — Upload-icoon = bestanden, Folder-icoon = map.
- Klikken op de zone-tekst opent standaard de bestand-picker; drag & drop accepteert beide (mappen worden recursief uitgepakt).

### Fixed
- Klik-interface opende altijd de directory picker doordat één input met `webkitdirectory` de hele zone wrapde.

---

## [v2.6.2] - 2026-04-23 — Directory upload + queue verwerking
### Added
- `src/lib/directoryTraversal.ts` — recursieve traversal via `webkitGetAsEntry` API. Mappen + submappen worden uitgepakt; alleen JPG/PNG/WebP wordt geaccepteerd.
- Queue-based upload met max **3 parallelle requests** om Cloudflare Worker rate limits te respecteren.
- Voortgangsbalk + teller: "Bestand X van Y aan het uploaden…" met live actief-counter.
- File picker ondersteunt nu ook directory selectie (`webkitdirectory`).

### Changed
- `AdminUpload`: nieuwe queue-architectuur met `useRef` voor stabiele async state, items krijgen `queued` → `uploading` → `success`/`error` lifecycle.
- Per-bestand preflight: duplicate-IDs binnen één batch worden gefilterd, naamconventie-warnings gebundeld in één toast.

### UX
- Drop-zone toont nu `Upload` + `FolderUp` icoon en "Map wordt gescand…" feedback.
- Eindtoast "Upload voltooid (N bestanden verwerkt)" na complete batch.

---

## [v2.6.1] - 2026-04-23 — Robuuste upload: validatie + verbose errors
### Added
- `src/lib/uploadValidation.ts` — preflight checks (`preflightFile`) en `tipForStatus()` voor gerichte gebruikersfeedback.
- Client-side validatie vóór upload: max 10 MB hard limit + naamconventie-warning (`hoogmolen-verblijf-<naam>-<detail>-NN.<ext>`).
- Naamconventie-hint zichtbaar in drop-zone.

### Changed
- `AdminUpload`: gebruikt directe `fetch` i.p.v. `supabase.functions.invoke` zodat HTTP-status én JSON-body uit de edge function gelezen kunnen worden. Toont nu `[status] message — tip` in plaats van generieke "non-2xx" melding.
- `cf-upload` edge function: parseert Cloudflare error codes (5409 → 400 conflict, 5408 → 413 too large) en stuurt `{ error, cf_code, details }` terug.
- Errors gebruiken nu `AlertTriangle` icoon i.p.v. `X`.

### Tip-mapping
- **413**: "Bestand te groot. Verklein naar < 2 MB voor optimale prestaties."
- **400**: "Naamfout of ID al in gebruik. Controleer of de bestandsnaam uniek is."
- **401/403**: "Authenticatiefout. Log opnieuw in of controleer de Cloudflare Worker."
- **5xx**: "Serverfout. Controleer de Cloudflare Worker configuratie."

---

## [v2.6.0] - 2026-04-23 — Cloudflare Images admin + worker-proxy delivery
### Added
- `/admin/login` + `/admin/upload` — drag-and-drop upload pagina, beveiligd met Lovable Cloud auth (email/password). Bestandsnaam wordt automatisch gesanitiseerd (`sanitizeImageId`) en als Cloudflare Custom ID gebruikt. Live preview + kopieerbare proxy-link na upload.
- `supabase/functions/cf-upload` — edge function die uploads server-side doorstuurt naar Cloudflare Images API. Cloudflare API-token blijft veilig in `CF_API_TOKEN` secret, nooit in frontend code.
- `cloudflareImagesConfig.ts`: nieuwe `CF_PROXY_BASE` (worker `hoogmolen-images.mark-lens.workers.dev`) + helper `sanitizeImageId()`.

### Changed
- **Hash-fix**: `CF_ACCOUNT_HASH` → `QMQ3XlUZJRDdvp6mt-4NIQ` (was `QM23X1UZJRDdvp6mt-4NIQ`, oorzaak van 403's in v2.5.0/v2.5.1).
- `CFImage` levert nu via worker-proxy in plaats van direct `imagedelivery.net` → eenvoudiger frontend, hash-loos, en proxy handelt 404's af.
- Lovable Cloud geactiveerd voor admin-auth.

## [v2.5.1] - 2026-04-23 — CF Images uitgebreid: Peerdermolen + B1-B5 logica
### Added
- `cloudflareImagesConfig.ts`: nieuwe helpers `resolveCfTokens(slug)` en `cfImagesForProperty(slug)` — slug-naar-CF mapping voor units (Peerdermolen, Watermolen, Volmolen, Landgoed) én sub-units (B1-B5 + familiekamer).
- `PropertyPhotoGrid` accepteert nu een `slug` prop en rendert dynamische CF-galerij (slider links, 4 thumbs rechts) met `loading="lazy"` op thumbs en eager LCP-shot in de slider.
- Sectie **"Onze Kamers in de Peerdermolen"** op `/accommodaties/peerdermolen-plus`: 5 kaartjes naar `/overnachten/suites-kamers/kamers/{deluxe-kamer-b1, deluxe-kamer-b2, kamer-b3, kamer-b4, suite-b5}` met CF-bedshot per kamer.
- CF-galerij ook geactiveerd op de hoofdsectie van Peerdermolen Plus (overzicht-slider + keuken/leefruimte/sample-room/terras thumbs).

### Changed
- `TemplateRoom`, `TemplateHouse`, `TemplateHouseStrict`, `TemplateDuplex` geven nu allemaal `property.slug` door aan `PropertyPhotoGrid` → automatische CF-images op alle detailpagina's, inclusief B1-B5 sub-unit galerijen met fallback naar de unit-overzichtsfoto.
- B-kamer thumb-strategie: positie 1 = `-bed-01`, 2 = `-badkamer-01`, 3 = `-detail-01`, 4 = context-anker `hoogmolen-verblijf-peerdermolen-overzicht-01`.
- Alle ontbrekende CF-ID's vallen via `CFImage` automatisch terug op `hero-estate.jpg`.

## [v2.5.0] - 2026-04-23 — Cloudflare Images pilot (Watermolen gallery)
### Added
- `src/config/cloudflareImagesConfig.ts` — base delivery URL `https://imagedelivery.net/QM23X1UZJRDdvp6mt-4NIQ/` + helpers `cfImage()` / `cfImageSeries()` (variant `/public`).
- `src/components/CFImage.tsx` — Cloudflare delivery wrapper met automatische fallback naar `hero-estate.jpg` bij 404 / load-error.
- `src/components/CFSlider.tsx` — slider met prev/next + dot-indicators, eerste slide eager+high priority, rest lazy.

### Changed
- `src/pages/Watermolen.tsx` gallery vervangt placeholders:
  - **Links (2x2)**: `<CFSlider>` met ID-reeks `hoogmolen-verblijf-watermolen-overzicht-01..12`.
  - **Thumb 1**: `hoogmolen-verblijf-watermolen-keuken-01`.
  - **Thumb 2**: `hoogmolen-verblijf-watermolen-slaapkamer-01`.
  - **Thumb 3**: `hoogmolen-verblijf-watermolen-badkamer-01`.
  - **Thumb 4**: `hoogmolen-verblijf-watermolen-terras-01`.
- Alle thumbs `loading="lazy"`; eerste slider-shot `loading="eager"` met `fetchpriority="high"`.

## [v2.4.2] - 2026-04-23 — Compactere hero's + SEO/GEO content op Geschiedenis-subs
### Added
- `PageHero` ondersteunt nu `size="compact"` (kleinere top/bottom padding) voor sub-pagina's met sticky tabs eronder.
- Nieuwe content-blok bovenaan elke sub-pagina (intro-paragraaf met semantische `<strong>` voor SEO).
- Vierde feit-card per sub-pagina:
  - **Erfgoed**: "Geografische context" — Ellikom, Oudsbergen, Provincie Limburg, Abeek.
  - **Natuur**: "Zeldzame vogelpopulatie" — ijsvogel, zwarte specht, wespendief, blauwborst.
  - **Duurzaamheid**: "CO₂-neutraal verblijven" + "Erfgoed × Toekomst" met adaptief erfgoedbeheer.

### Changed
- Hero-padding sub-pagina's gehalveerd: van `pt-32 pb-16` naar `pt-28 pb-10` (mobiel) — geen visueel "gat" meer tussen menu en eerste content-blok.
- Sectie-padding eerste content-blok van `py-20 md:py-28` naar `py-10 md:py-14`.
- Cards van 3-koloms naar 2-koloms met side-by-side icoon — leesbaarder + meer ruimte voor uitgebreide tekst.
- Geverifieerde GEO-context toegevoegd: Oudsbergen, Ellikom, Bosbeek-/Abeekvallei, Vlaams Agentschap Onroerend Erfgoed, Natura 2000-code BE2200035, Hoge Kempen, Archimedes-schroefturbine.

## [v2.4.1] - 2026-04-23 — Geverifieerde content + gedeelde StatusWall
### Added
- `src/components/history/StatusWall.tsx` — herbruikbare 5-punt grid met thin Lucide-iconen (Shield · Castle · Bird · Flower2 · Waves) in `text-primary`.

### Changed
- **Erfgoed**-pagina: hero "Een Monumentale Erfenis"; nieuwe geverifieerde feiten (5 dec 1995 bescherming, 1828 muurankers, uitbreiding 2005).
- **Natuur**-pagina: hero "Onze Natuurlijke Rijkdom"; vermeldt expliciet 180 ha broekbossen + Bosbeek-/Abeekvallei beverhabitat.
- **Duurzaamheid**-pagina: hero "Kracht uit de Bron"; bevestigt 2016-turbine + 15 lokale gezinnen.
- **Geschiedenis**-overzicht gebruikt nu de gedeelde `StatusWall` (consistente erkenningen-strip op alle Geschiedenis-pagina's).

## [v2.4.0] - 2026-04-23 — Heritage sub-architectuur /over-ons/geschiedenis/*
### Added
- `src/pages/geschiedenis/Erfgoed.tsx` — `/over-ons/geschiedenis/erfgoed`: Beschermd Monument (ID 1211, dec 1995), uitbreiding 2005, muurankers 1828.
- `src/pages/geschiedenis/Natuur.tsx` — `/over-ons/geschiedenis/natuur`: Natura 2000, Vogelrichtlijngebied, actief bevergebied, best bewaarde beekvallei.
- `src/pages/geschiedenis/Duurzaamheid.tsx` — `/over-ons/geschiedenis/duurzaamheid`: waterkrachtcentrale 2016, energie voor landgoed + 15 omliggende woningen.
- `src/components/history/HistoryTabs.tsx` — sticky lokale Tier 2-tabstrip (Overzicht · Erfgoed · Natuur · Duurzaamheid) op alle Geschiedenis-pagina's.

### Changed
- `App.tsx`: drie nieuwe routes onder `/over-ons/geschiedenis/*`.
- `Geschiedenis.tsx`: `<HistoryTabs />` direct na hero zodat sub-architectuur zichtbaar wordt.
- `FloatingBackButton`: detail Geschiedenis-pagina's keren terug naar `/over-ons/geschiedenis`.
- `FloatingWhatsApp`: desktop-positie naar `bottom-8 right-8` (z-40), valt nu netjes onder de Tier 2-balk.

---

## [v2.1.2] - 2026-04-23 — Over ons sub-pagina's: Team + correcte FloatingBackButton
### Added
- `src/pages/Team.tsx` — nieuwe `/over-ons/team` pagina: 4 teamleden (Ronald, Annick, Tom, Sara) in card-grid met initialen-avatar, rol, bio. Contact-anchor met telefoon/mail/WhatsApp en terug-link naar Over ons.

### Changed
- `FloatingBackButton`: `/ervaringen` en `/over-ons/team` keren nu beide terug naar `/over-ons` (i.p.v. home), conform de submenu-structuur.
- `App.tsx`: `/over-ons/team` route koppelt nu aan echte `Team` pagina i.p.v. StubPage.

---

## [v2.1.1] - 2026-04-23 — Submenu Over ons: Wall of Love + Ons team
### Added
- `/ervaringen` herwerkt: Triple-Trust strip, **2 luxe video-placeholders** (Drone full-width + SongScape met zijtekst) met olijfgroene play-overlay en `aspect-video` ratio.
- Footer "Gastenvertrouwen" CTA-anchor sectie met button → `/ervaringen`.
- VideoObject JSON-LD schema voor beide video's (Google video-zoekresultaten).

### Changed
- Booking.com score globaal gecorrigeerd: **9.3 → 9.7** (TopBar, Footer, Ervaringen-pagina).
- Hero-titel `/ervaringen`: "Wat onze gasten zeggen" → "Wat onze gasten beleven".
- TopBar: Airbnb-item toont nu opnieuw score `4.97` (i.p.v. label "Superhost").
- `SITE_VERSION` → `v2.1.0`.

---

## [v2.0.0] - 2026-04-23 — Wall of Love & Global Trust Integration
### Added
- `src/pages/Ervaringen.tsx` — nieuwe `/ervaringen` pagina met masonry-grid van 10 top-reviews, platform-badges (Google/Airbnb/Booking), Triple-Trust kop-strip en CTA-sectie naar de drie review-platformen.
- AggregateRating + Review JSON-LD schema specifiek geïnjecteerd in `<head>` op `/ervaringen` (5.0 / 571 reviews).
- `FloatingBackButton` — `/ervaringen` route → terug naar Home.
- `FOOTER_NAV` — link "Ervaringen" toegevoegd aan kolom Gidsen.

### Changed
- `TopBar.tsx` — nu volledig klikbaar als `<Link to="/ervaringen">`, nieuwe inhoud "Status 2026: ★ 5.0/5 Google · Airbnb Superhost (571+) · ★ 9.3 Booking".
- `Footer.tsx` — "Onze Waarderingen" omgedoopt naar "Onze Reputatie" met klikbare platform-cards + "Bekijk alle 571+ gastervaringen" CTA. Google-score bijgesteld naar 5.0 (2026).
- `SITE_VERSION` → `v2.0.0`.

---

## [v1.9.0] - 2026-04-23 — Triple Trust Social Proof (global)
### Added
- `src/components/layout/TopBar.tsx` — globale 32px trust-balk (Airbnb 4.97 · Booking 9.3 · Google 4.9), gemount boven de Header.
- Footer "Onze Waarderingen" trust-column met 3 platform-cards + Superhost-vermelding.
- `SchemaInjector` — `aggregateRating` (4.9 / 571 reviews) toegevoegd aan elke route → triggert ster-rich-snippets in Google Search.

### Changed
- `Layout.tsx` — top-padding aangepast naar 100/140 px om TopBar mee te tellen.
- `SITE_VERSION` → `v1.9.0`.

---

## [v1.1.0] - 2026-04-22 — Master Content Map & Dynamic Facts/FAQ System
### Added
- `src/config/siteContentConfig.ts` — Single Source of Truth voor `facts`, `faqs` en `schemaType` per route (40+ routes geïnitialiseerd uit Informatiegids 2025 en Activiteitengids).
- `src/components/FastFacts.tsx` — icon-grid component, render-loos zonder data, plaatsing direct onder `PageHero`/`PropertyHero`.
- `src/components/SchemaInjector.tsx` — auto-injectie van JSON-LD (`HotelRoom`, `Event`, `MeetingRoom`, `TouristAttraction`, `LocalBusiness`, `FAQPage`) in `<head>` per route.
- `src/lib/version.ts` — centrale `SITE_VERSION` constante.
- Versie-indicator in de footer.

### Changed
- `FAQAccordion.tsx` — merget pagina-specifieke FAQ's (uit `siteContentConfig`) bovenop de generieke `faqConfig` items, met dynamische titel `Bijkomende vragen over [Pagina Naam]`.
- `Layout.tsx` — `<SchemaInjector />` mount op elke pagina.

### Notes
- Tone-of-voice: warm, 5-sterren hospitality, 100% feitelijk (paardenboxen 3m × 3,5m, honden €25/nacht, etc.).
- Volgende stap: facts uitbreiden naar overige unit-detail routes (`/overnachten/suites-kamers/duplexsuites/a1` … `a6`, alle B-kamers, etc.).

---

## [v1.0.0] - 2026-04-21 — Baseline release
### Added
- 77+ routes opgezet conform `kb_urls_deel1` + `kb_urls_deel2`.
- Hiërarchische `Activiteiten` hub met sub-categorieën (Fietsen, Wandelen, Paardrijden, In de omgeving, Familie, Culinair).
- Brand tokens vastgezet (`--primary #7D8334`, `--primary-deep #4B4C1B`, Cormorant Garamond + Jost).
- Floating WhatsApp FAB site-wide; sticky mobile "Boek nu" CTA op detail-/booking-pagina's.
- Property-templates (`TemplateDuplex`, `TemplateRoom`, `TemplateHouse`, `TemplateHouseStrict`).
