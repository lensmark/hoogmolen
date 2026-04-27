# StayYouSoon — Migratie naar gedeelde database

> **Doel**: StayYouSoon laten praten met dezelfde Lovable Cloud backend als
> De Hoogmolen, zodat samenstellingen, beeldbank, tekst-overrides en villa's
> in één admin-console beheerd worden.
>
> **Resultaat**: één wijziging in `/admin/compositions` op De Hoogmolen
> verschijnt automatisch (realtime) op StayYouSoon, gefilterd op
> `visible_on = 'stayyousoon'`.

---

## Voor je begint

- ✅ Schema-wijzigingen op de **De Hoogmolen** database zijn al gedaan
  (`unit_type`, `visible_on`, `country`, `city` toegevoegd; bestaande units
  getagd; 8 villa-placeholders aangemaakt).
- ✅ Bevestigd dat StayYouSoon sinds gisteren **geen lokale data-wijzigingen**
  heeft die bewaard moeten worden — schoon switchen kan.
- ⚠️ Voer onderstaande stappen uit **in een aparte chat-sessie binnen het
  StayYouSoon project** (de AI-agent kan niet over projecten heen werken).

---

## Stap 1 — Verbinding ompoorten naar gedeelde backend

In het StayYouSoon project is `.env` automatisch beheerd door Lovable Cloud.
Vraag in een StayYouSoon-chat:

> "Disable de huidige Lovable Cloud-koppeling van dit project en koppel
> in de plaats aan de externe Supabase project met:
> - Project URL: `https://swzpbvoyorzmmlzrygxe.supabase.co`
> - Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3enBidm95b3J6bW1senJ5Z3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTMyMTksImV4cCI6MjA5MjQ2OTIxOX0.fhHFNIIPNwZEmuUYqnFX3Vl523NZHqK_6F_BsXZPHMw`
> - Project ref: `swzpbvoyorzmmlzrygxe`"

> ⚠️ **Alternatief** als Lovable disconnect niet werkt: gebruik de
> "Connect Supabase" optie en geef bovenstaande credentials op. De
> `client.ts` en `types.ts` worden dan automatisch geregenereerd.

---

## Stap 2 — Frontend filter aanzetten

Voeg een vaste **site-ID constante** toe en gebruik die overal waar
samenstellingen geladen worden.

### 2a. Nieuwe constante

```ts
// src/config/siteConfig.ts
export const SITE_ID = "stayyousoon" as const;
```

### 2b. `useUnitCompositions` filter toevoegen

```ts
// src/hooks/useUnitCompositions.ts
import { SITE_ID } from "@/config/siteConfig";

const fetchAll = async () => {
  const { data, error } = await supabase
    .from("unit_compositions")
    .select("id, slug, display_name, module_location_ids, description, sort_order, unit_type, visible_on, country, city")
    .contains("visible_on", [SITE_ID])      // ← NIEUW
    .order("sort_order", { ascending: true });
  // ... rest blijft gelijk
};
```

> Voor De Hoogmolen geldt `SITE_ID = "hoogmolen"`. De filter `.contains("visible_on", [SITE_ID])`
> toont een rij enkel als de site-ID in de array staat.

---

## Stap 3 — Kamer-pagina's verwijderen

StayYouSoon toont enkel woningen + villa's. Verwijder of verberg:

- `src/pages/KamersOverview.tsx`
- `src/pages/SuitesKamers.tsx` (kamer-secties)
- Navigatie-items "Kamers" / "Suites" in `src/config/navigationConfig.ts`
- Eventuele kamer-routes in `src/App.tsx`

> **Tip**: laat ze staan en filter dynamisch met
> `unit_type !== 'room'` als je later toch wilt switchen.

---

## Stap 4 — Admin-console open laten

`/admin/compositions` werkt out-of-the-box op StayYouSoon zodra de DB
verbinding gelegd is. Wel even controleren:

- ✅ Login werkt (gedeelde users-tabel)
- ✅ Admin/editor rol blijft geldig (zelfde `user_roles` tabel)
- ✅ Wijzigingen zijn realtime zichtbaar op De Hoogmolen

---

## Stap 5 — Villa-namen invullen

Op StayYouSoon (of De Hoogmolen — maakt niet uit, zelfde DB) ga naar
`/admin/compositions` en open elke villa-placeholder:

| Placeholder | Te corrigeren |
|---|---|
| Villa Houthalen 1 | Naam, omschrijving, modules |
| Villa Houthalen 2 | Naam, omschrijving, modules |
| Villa Spanje 1 | Naam → echte naam, stad bevestigen |
| Villa Spanje 2 | idem |
| Villa Spanje 3 | idem |
| Villa Spanje 4 | idem (San Pedro del Pinatar) |
| Villa Spanje 5 | idem |
| Villa Spanje 6 | idem |

---

## Rollback-plan

Mocht er iets misgaan met de switch:
1. In StayYouSoon: Lovable Cloud opnieuw activeren (geeft nieuwe lege DB).
2. `.env` wordt automatisch teruggezet.
3. Frontend werkt weer met eigen data (leeg).

De Hoogmolen-data blijft sowieso veilig — dit is een **read+write share**,
geen migratie van data zelf.

---

## Checklist samenvatting

- [ ] `.env` ompoorten naar shared Supabase URL + anon key
- [ ] `SITE_ID = "stayyousoon"` constante toevoegen
- [ ] `useUnitCompositions` filter `.contains("visible_on", [SITE_ID])`
- [ ] Eventuele andere queries op `unit_compositions` ook filteren
- [ ] Kamer-pagina's verwijderen of verbergen
- [ ] Login + admin-rol testen
- [ ] Villa-placeholders hernoemen via admin-console

---

_Versie: v3.16.0 — 2026-04-24_
