/**
 * AdminGallery — visuele gallery-editor per unit.
 *
 * Voor elke unit (uit PROPERTIES) toont het:
 *   - alle gematchte foto's uit image_library (longest-prefix + parent fallback)
 *   - per foto: tonen/verbergen toggle (oog-icoon)
 *   - drag-to-reorder (HTML5 native — geen extra dep)
 *   - "Reset volgorde" knop per unit
 *
 * Wijzigingen worden upserted naar `unit_gallery_settings` (context_type = "unit",
 * context_key = unit-slug) en realtime gepropageerd naar publieke pagina's.
 */
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, GripVertical, RotateCcw, Loader2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PROPERTIES } from "@/config/propertyConfig";
import { locationIdsForSlug } from "@/lib/locationId";
import { matchImagesForUnit } from "@/lib/imageMatcher";
import { useImageLibrary } from "@/hooks/useImageLibrary";
import { useUnitGallerySettings } from "@/hooks/useUnitGallerySettings";
import { resolveImageSrc } from "@/lib/imageSource";
import { getExtraLocationIds } from "@/config/unitCompositionConfig";
import { useCompositionCacheVersion } from "@/hooks/useCompositionCacheVersion";

interface UnitOption {
  slug: string;
  name: string;
  locationId: string;
  parentLocationId?: string;
  /** Extra location-IDs voor samengestelde formules (Volmolen, Plus, Landgoed). */
  extraLocationIds: string[];
}

const AdminGallery = () => {
  const { images: lib, loading: libLoading } = useImageLibrary();
  const { getSettingsForContext, setHidden, setOrder } = useUnitGallerySettings();
  // Re-resolve composition extras zodra de DB-cache binnenkomt (realtime).
  const cacheVersion = useCompositionCacheVersion();

  const units: UnitOption[] = useMemo(
    () =>
      PROPERTIES.map((p) => {
        const ids = locationIdsForSlug(p.slug);
        return {
          slug: p.slug,
          name: p.name,
          locationId: ids.primary,
          parentLocationId: ids.parent,
          extraLocationIds: getExtraLocationIds(p.slug),
        };
      }),
    // cacheVersion is een lookup-trigger; we lezen via getExtraLocationIds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cacheVersion],
  );

  const [filter, setFilter] = useState("");
  const [activeSlug, setActiveSlug] = useState<string>(() => units[0]?.slug ?? "");
  const activeUnit = units.find((u) => u.slug === activeSlug) ?? units[0];

  // Lijst van foto's voor de actieve unit (cfId-array, in DB-orde)
  const cfIds = useMemo(() => lib.map((r) => r.cloudflareId), [lib]);
  const cfIdToImageId = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of lib) m.set(r.cloudflareId, r.id);
    return m;
  }, [lib]);

  const matched = useMemo(() => {
    if (!activeUnit) return [] as string[];
    // 1. Primaire match (incl. parent fallback)
    const { matches: primary } = matchImagesForUnit(
      cfIds,
      activeUnit.locationId,
      activeUnit.parentLocationId,
    );
    // 2. Aggregeer foto's van alle samenstelling-modules (Volmolen, Plus, ...)
    const extras = activeUnit.extraLocationIds.flatMap((loc) => {
      const { matches } = matchImagesForUnit(cfIds, loc);
      return matches;
    });
    // 3. Dedupe (primary eerst, dan extras in volgorde)
    const seen = new Set<string>();
    const merged: string[] = [];
    for (const id of [...primary, ...extras]) {
      if (!seen.has(id)) {
        seen.add(id);
        merged.push(id);
      }
    }
    return merged;
  }, [cfIds, activeUnit]);

  // Pas opgeslagen sort_order toe (gefilterde unzichtbaar laten we ZICHTBAAR
  // in de admin — daar stuurt de toggle of ze publiek tonen).
  const settings = useMemo(
    () => (activeUnit ? getSettingsForContext("unit", activeUnit.slug) : []),
    [activeUnit, getSettingsForContext],
  );
  const settingsByImageId = useMemo(
    () => new Map(settings.map((s) => [s.imageId, s])),
    [settings],
  );

  // Lokale (drag) volgorde — initialiseer uit matched + opgeslagen sort_order
  const [orderLocal, setOrderLocal] = useState<string[]>([]);
  useEffect(() => {
    const indexed = matched.map((cfId, i) => {
      const imgId = cfIdToImageId.get(cfId);
      const so = imgId ? settingsByImageId.get(imgId)?.sortOrder : undefined;
      return { cfId, originalIdx: i, sort: so ?? null };
    });
    indexed.sort((a, b) => {
      if (a.sort !== null && b.sort !== null) return a.sort - b.sort;
      if (a.sort !== null) return -1;
      if (b.sort !== null) return 1;
      return a.originalIdx - b.originalIdx;
    });
    setOrderLocal(indexed.map((x) => x.cfId));
  }, [matched, settingsByImageId, cfIdToImageId]);

  // Filter (zoekbalk units)
  const filteredUnits = useMemo(
    () =>
      units.filter((u) =>
        `${u.name} ${u.slug}`.toLowerCase().includes(filter.toLowerCase()),
      ),
    [units, filter],
  );

  // Drag handlers
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const onDragStart = (idx: number) => (e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setOverIdx(idx);
  };
  const onDrop = (idx: number) => async (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx || !activeUnit) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...orderLocal];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setOrderLocal(next);
    setDragIdx(null);
    setOverIdx(null);

    setSavingOrder(true);
    const orderedImageIds = next
      .map((cfId) => cfIdToImageId.get(cfId))
      .filter((x): x is string => !!x);
    const ok = await setOrder("unit", activeUnit.slug, orderedImageIds);
    setSavingOrder(false);
    if (ok) toast.success("Volgorde opgeslagen");
    else toast.error("Volgorde kon niet worden opgeslagen");
  };

  // Toggle hidden
  const onToggleHidden = async (cfId: string, currentHidden: boolean) => {
    if (!activeUnit) return;
    const imgId = cfIdToImageId.get(cfId);
    if (!imgId) return;
    const ok = await setHidden("unit", activeUnit.slug, imgId, !currentHidden);
    if (ok) {
      toast.success(currentHidden ? "Foto wordt nu getoond" : "Foto verborgen");
    } else {
      toast.error("Kon niet opslaan");
    }
  };

  // Reset volgorde voor actieve unit
  const onResetOrder = async () => {
    if (!activeUnit) return;
    setSavingOrder(true);
    const orderedImageIds = matched
      .map((cfId) => cfIdToImageId.get(cfId))
      .filter((x): x is string => !!x);
    const ok = await setOrder("unit", activeUnit.slug, orderedImageIds);
    setSavingOrder(false);
    if (ok) toast.success("Volgorde teruggezet naar standaard");
  };

  const visibleCount = orderLocal.filter((cfId) => {
    const imgId = cfIdToImageId.get(cfId);
    return imgId && !settingsByImageId.get(imgId)?.hidden;
  }).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-primary-deep">Gallery-beheer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bepaal per unit welke foto's op de detailpagina verschijnen en in welke volgorde.
          Wijzigingen zijn direct live.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Units lijst */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Units</CardTitle>
            <div className="relative mt-2">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Zoeken..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[600px] overflow-y-auto">
            <div className="flex flex-col">
              {filteredUnits.map((u) => {
                const isActive = u.slug === activeSlug;
                return (
                  <button
                    key={u.slug}
                    onClick={() => setActiveSlug(u.slug)}
                    className={`text-left px-4 py-2.5 border-b border-border/50 transition-colors ${
                      isActive
                        ? "bg-primary-deep text-secondary"
                        : "hover:bg-accent/30"
                    }`}
                  >
                    <div className="font-medium text-sm">{u.name}</div>
                    <div
                      className={`text-[11px] mt-0.5 truncate ${
                        isActive ? "text-secondary/70" : "text-muted-foreground"
                      }`}
                    >
                      {u.slug}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{activeUnit?.name ?? "—"}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Prefix: <code className="bg-accent/40 px-1 rounded">{activeUnit?.locationId}</code>
                {" · "}
                {orderLocal.length} foto's ({visibleCount} zichtbaar)
                {savingOrder && (
                  <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />
                )}
              </p>
              {activeUnit && activeUnit.extraLocationIds.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-primary-deep">Samenstelling:</span>{" "}
                  toont ook foto's van{" "}
                  {activeUnit.extraLocationIds.map((id, i) => (
                    <span key={id}>
                      <code className="bg-accent/40 px-1 rounded">{id}</code>
                      {i < activeUnit.extraLocationIds.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetOrder}
              disabled={savingOrder}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset volgorde
            </Button>
          </CardHeader>
          <CardContent>
            {libLoading ? (
              <div className="py-12 text-center text-muted-foreground">
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                Foto's laden...
              </div>
            ) : orderLocal.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Geen foto's gevonden voor deze unit. Upload foto's met prefix{" "}
                <code className="bg-accent/40 px-1 rounded">{activeUnit?.locationId}-...</code>{" "}
                via Media &amp; Uploads.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {orderLocal.map((cfId, idx) => {
                  const imgId = cfIdToImageId.get(cfId);
                  const setting = imgId ? settingsByImageId.get(imgId) : undefined;
                  const hidden = setting?.hidden ?? false;
                  const isOver = overIdx === idx && dragIdx !== null && dragIdx !== idx;
                  return (
                    <div
                      key={cfId}
                      draggable
                      onDragStart={onDragStart(idx)}
                      onDragOver={onDragOver(idx)}
                      onDrop={onDrop(idx)}
                      onDragEnd={() => {
                        setDragIdx(null);
                        setOverIdx(null);
                      }}
                      className={`group relative rounded-md overflow-hidden border-2 transition-all ${
                        isOver
                          ? "border-primary scale-[1.02]"
                          : hidden
                            ? "border-destructive/40 opacity-50"
                            : "border-transparent"
                      }`}
                    >
                      <div className="aspect-[4/3] bg-accent/40">
                        <img
                          src={resolveImageSrc(cfId)}
                          alt={cfId}
                          loading="lazy"
                          draggable={false}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Sort badge */}
                      <Badge
                        variant="secondary"
                        className="absolute top-1.5 left-1.5 text-[10px] h-5 px-1.5"
                      >
                        #{idx + 1}
                      </Badge>
                      {/* Drag handle */}
                      <div className="absolute top-1.5 right-1.5 bg-surface/85 rounded p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-3.5 h-3.5 text-primary-deep" />
                      </div>
                      {/* Hide toggle */}
                      <button
                        type="button"
                        onClick={() => onToggleHidden(cfId, hidden)}
                        className="absolute bottom-1.5 right-1.5 bg-surface/90 hover:bg-surface rounded p-1.5 transition-colors"
                        title={hidden ? "Toon op publieke pagina" : "Verberg op publieke pagina"}
                      >
                        {hidden ? (
                          <EyeOff className="w-3.5 h-3.5 text-destructive" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-primary-deep" />
                        )}
                      </button>
                      {hidden && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Badge variant="destructive" className="text-[10px]">
                            Verborgen
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGallery;
