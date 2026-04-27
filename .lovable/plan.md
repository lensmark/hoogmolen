
## Plan — Stap 2: Cloudflare "Sync & Repair" knop

### Status van uw drie prompts

| Onderdeel | Status | Toelichting |
|---|---|---|
| **Prompt 2.1** Sync-knop | ❌ Ontbreekt | Wordt nu gebouwd |
| **Prompt 2.2** Longest Prefix Match (filename → page link) | ✅ Bestaat | `src/lib/imageMatcher.ts` (v3.2.0) |
| **Prompt 2.3** Media Picker met grid + zoek + filter pills | ✅ Bestaat | `src/components/admin/MediaPicker.tsx` — incl. preview-zijbalk, context-match badges, auto-pills uit filename-tokens |
| **Prompt 3.1** Full-Card Click + ArrowRight | ✅ Bestaat | v3.4.0 — `FeatureCard`, `UnitCard`, `BucketCard`, `HubBucketCard`, `PropertyFooterNav` |
| **Prompt 3.2** Admin-toggle in Header + `e.preventDefault()` | ✅ Bestaat | `Header.tsx` (Wand2-knop, alleen zichtbaar voor ingelogde admins) + Alt+A sneltoets |
| **Prompt 3.3** On-Page Editing (foto + tekst overrides) | ✅ Bestaat | `EditableText` (contentEditable) + `EditableImage` + `image_overrides`/`text_overrides` tabellen |

➡️ **Enkel actie:** de Cloudflare Sync-knop bouwen. Al de rest is reeds productie-klaar.

---

### Wat we gaan bouwen

**1. Edge Function `cf-sync`** (nieuw — `supabase/functions/cf-sync/index.ts`)
- Beveiligd: vereist ingelogde admin/editor (zelfde JWT-check als `cf-upload`).
- Roept Cloudflare Images API: `GET /accounts/{CF_ACCOUNT_ID}/images/v2?per_page=100` (gepaginieerd via `continuation_token`).
- Voor elk Cloudflare-image:
  - Lookup of `cloudflare_id` reeds in `image_library` staat → skip.
  - Anders: `INSERT` met `status='success'`, `filename = image.filename || image.id`, `cloudflare_id = image.id`, `created_at = image.uploaded`.
- Returnt JSON: `{ scanned, inserted, skipped, errors }`.
- Gebruikt `SUPABASE_SERVICE_ROLE_KEY` server-side voor de inserts (RLS-bypass), na JWT-validatie.

**2. UI-knop in `MediaUploadPanel.tsx`**
- Nieuwe knop **"Synchroniseer met Cloudflare"** (icoon `RefreshCw`) naast de bestaande **"Bibliotheek"** knop in de toolbar.
- Bij klik: bevestigingsdialoog → `supabase.functions.invoke('cf-sync')` → toast met resultaat (`X nieuwe records, Y bestaande overgeslagen`).
- Loading-state met spinning icoon zolang sync loopt.
- Na success: ververst de lokale `image_library` (zodat MediaPicker meteen de nieuwe records toont via cache-invalidation).

**3. Cache-invalidation in `useImageLibrary`**
- Exporteer `clearImageLibraryCache()` zodat de sync-knop na succes de singleton-cache kan resetten — anders zien gallery's de nieuwe records pas na een refresh.

**4. Versie & docs**
- Bump naar **v3.5.0** in `src/lib/version.ts`.
- CHANGELOG-entry: "Cloudflare Sync & Repair".

---

### Technische details

**Cloudflare API endpoint:**
```
GET https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/images/v2
Authorization: Bearer {CF_API_TOKEN}   ← reeds in secrets
```

Response geeft `result.images[]` met `{ id, filename, uploaded, ... }`. We pagineren via `continuation_token` tot alle records binnen zijn.

**Bestaande secret check:** `CF_API_TOKEN` ✅ aanwezig — geen nieuwe secret nodig.

**Bestaande tabel:** `image_library` schema is al compatibel (`filename`, `cloudflare_id`, `status`, `created_at`).

**RLS-strategie:** Edge function gebruikt service-role key voor inserts, maar valideert eerst dat de caller een ingelogde admin/editor is via `has_role()` check.

---

### Bestanden

- ➕ `supabase/functions/cf-sync/index.ts` (nieuw)
- ✏️ `supabase/config.toml` — voeg `[functions.cf-sync] verify_jwt = false` toe (we doen JWT-check in code)
- ✏️ `src/components/admin/MediaUploadPanel.tsx` — sync-knop + handler
- ✏️ `src/hooks/useImageLibrary.ts` — exporteer `clearImageLibraryCache()`
- ✏️ `src/lib/version.ts` → v3.5.0
- ✏️ `CHANGELOG.md`

---

### Werkflow na publish

1. Ga naar `/admin/media`
2. Klik **"Synchroniseer met Cloudflare"**
3. Wacht (5-30 sec afhankelijk van aantal foto's)
4. Toast: `"Sync voltooid: 47 nieuwe records, 12 bestaande overgeslagen"`
5. Open MediaPicker → alle historische uploads zijn nu vindbaar + automatisch gematched aan de juiste pagina's via Longest-Prefix logica.
