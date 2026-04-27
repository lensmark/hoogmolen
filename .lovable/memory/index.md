# Project Memory — Landgoed De Hoogmolen

## Core
ALWAYS read `docs/project-rules.md` first — it is the Single Source of Truth.
Brand tokens FIXED: --primary #7D8334, --primary-deep #4B4C1B, --secondary #F5F6EA, --accent #E4E8BA, --background #EDEEE4. Use semantic tokens only, never hex.
Fonts FIXED: Cormorant Garamond (display), Jost (body). Never substitute.
Source-of-truth: hoogmolen-volledig_2.html (design) > De_Hoogmolen_Informatiegids PDF (content) > AI.
Site-wide: Floating WhatsApp FAB (+3211901100) on every page. Sticky mobile "Boek nu" CTA on detail/booking pages only.
All forms use Netlify markup (data-netlify="true" + hidden form-name + bot-field honeypot).
Booking buttons → unit.bookingUrl (hoogmolen.com/<slug>); unitsConfig fields are Guesty-compatible.
Pixel-aligned pages (don't restyle without approval): /, /accommodaties/peerdermolen-plus, /vergaderen.
Hero images NEVER hardcoded: every hero must read `getOverride(pathname,"hero")` first with a fallback const, and be wrapped in `<EditableImage sectionKey="hero">` in admin-mode. Pattern in src/pages/Index.tsx, Paardenlogies.tsx, UnitDetail.tsx. PageHero/PropertyHero already do this internally.

## Memories
(none yet — see docs/project-rules.md for all detail)
