# Project Rules — Landgoed De Hoogmolen

> **Single Source of Truth.** Deze regels zijn leidend en mogen NOOIT worden afgeweken zonder expliciete goedkeuring van de eigenaar (Mark Lens). Doel: regressie voorkomen tussen sessies.

---

## 1. Bronbestanden (Source-of-Truth)

| Bron | Rol |
|------|-----|
| `user-uploads://hoogmolen-volledig_2.html` | **Design & layout-blauwdruk** voor alle pagina's. Sectie-volgorde, brand tokens, copy-blokken, navigatiestructuur. |
| `user-uploads://De_Hoogmolen_Informatiegids_2025_06_29_klein.pdf` | **Content & feiten**: kamerbeschrijvingen, bedindeling, prijzen (p.21), arrangementen (p.40-43), FAQ (p.37-38), huisregels. |
| `user-uploads://Activiteiten-nabij-Oudsbergen_3.pdf` | Bron voor `activitiesConfig.ts`. |

**Hiërarchie bij conflict**: HTML-wireframe → PDF-gids → AI-interpretatie. Wijk NOOIT af van originele marges, paddings, fonts of brand tokens.

---

## 2. Brand Tokens (FIXED — niet wijzigen)

```
--ol  / --primary       #7D8334  (olijf, accent 10%)
--old / --primary-deep  #4B4C1B  (donker merk, headings, hover)
--sg  / --secondary     #F5F6EA  (zachte vlakken 20%)
--lg  / --accent        #E4E8BA  (cards, callouts)
--neu                   #F8F8F8
--background            #EDEEE4  (paginabg)
--ww  / --surface       #FDFCFC
--bdr / --border        #d8dbbc → #AEABAA
```

Alle kleuren in `index.css` als HSL. Componenten gebruiken **uitsluitend** semantic tokens (`bg-primary`, `text-primary-deep`, `bg-secondary`, etc.) — nooit hex of `text-white`/`bg-black`.

---

## 3. Typografie (FIXED)

- **Display/headings**: `Cormorant Garamond` (serif), gewicht 600, letter-spacing −0.01em
- **Body/UI**: `Jost` (sans), gewicht 400 default
- **Eyebrow**: `Jost` 600, uppercase, tracking 0.2em, kleur `--primary`

H1 = `heading-display` (4xl→7xl). H2 sectie = `heading-section` (3xl→5xl).

---

## 4. Layout-architectuur

- **Atomic Design**: alle pagina's wrappen in `<Layout>`. Sticky `<Header>` + `<Footer>` zijn onveranderlijk site-breed.
- **Containers**: `container-narrow` (max-w-5xl) voor lange leestekst, `container-wide` (max-w-7xl) voor grids.
- **Section padding**: `py-20 md:py-28` voor hoofdsecties, `py-16` voor strips.
- **Radius**: 0.375rem (`--radius`). Geen ronde knoppen tenzij circulaire icon-button (FAB).

---

## 5. Vaste UI-elementen (site-breed)

| Element | Locatie | Trigger |
|---------|---------|---------|
| Header met dropdown-nav | Bovenaan elke pagina | Altijd |
| Footer met 5 kolommen | Onderaan elke pagina | Altijd |
| **Floating WhatsApp button** | Rechtsonder, fixed | Altijd (alle pagina's) |
| **Sticky Mobile "Boek Nu" CTA** | Onderaan, mobile only | Detailpagina's (`/verblijf/*`, `/duplexsuite/*`) + groepsverblijf-aanvraag |

WhatsApp-nummer: `+32 (0)11 90 11 00` → `https://wa.me/3211901100`.

---

## 6. Forms

Alle formulieren krijgen:
- `name="..."` (Netlify form name)
- `data-netlify="true"`
- `data-netlify-honeypot="bot-field"` (anti-spam)
- Hidden `<input type="hidden" name="form-name" value="..." />`
- `<input type="hidden" name="bot-field" />`

Bekende formulieren: `contact`, `groepsverblijf-aanvraag`, `vergader-offerte`.

---

## 7. Booking-logica

Alle "Boek nu"-knoppen linken naar `unit.bookingUrl` (legacy `https://www.hoogmolen.com/<slug>`). Toekomstige Guesty Open API-integratie vervangt deze URLs zonder componentwijziging — `unitsConfig.ts` veldnamen zijn al Guesty-compatible (`id`, `accommodates`, `cleaningFee`, `extraGuestFee`, `basePrice`).

---

## 8. Pagina's — actuele build-status

| Route | Status | Bron |
|-------|--------|------|
| `/` (Homepage) | ✅ **Pixel-aligned met wireframe** | HTML §index + gids p.3-5 |
| `/accommodaties/peerdermolen-plus` | ✅ **Pixel-aligned** | gids p.10 + p.21 |
| `/vergaderen` | ✅ **Pixel-aligned** | HTML §vergaderen + gids p.40-43 |
| `/verblijf/:slug` (UnitDetail) | ✅ Generieke template | unitsConfig |
| Overzichtspagina's (Overnachten, Groepsverblijf, Omgeving, Praktisch, Over ons, Contact, FAQ) | ✅ Volledig | gids |
| 60+ stub-routes | ✅ Met header/footer | StubPage |

**Niet aanraken zonder goedkeuring**: pages in tabel hierboven met status ✅ pixel-aligned.

---

## 9. Workflow-regels voor toekomstige sessies

1. **Lees eerst dit bestand.** Geen uitzonderingen.
2. Bij twijfel over design: refereer aan de wireframe-HTML, niet aan AI-creativiteit.
3. Bij twijfel over content/feiten: refereer aan de gids-PDF.
4. Wijzig `unitsConfig.ts` enkel om Guesty-velden toe te voegen of feiten te corrigeren — nooit voor copy-changes.
5. Documenteer elke nieuwe regel in dit bestand voordat je code commit.

---

*Laatst bijgewerkt: 2026-04-21 — vastgelegd na DESIGN RESET & CONTENT INJECTION protocol.*
