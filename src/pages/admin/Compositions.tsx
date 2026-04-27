import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { locationIdsForSlug } from "@/lib/locationId";
import { PROPERTIES } from "@/config/propertyConfig";
import { toast } from "sonner";

interface CompositionAdminRow {
  id: string;
  slug: string;
  display_name: string;
  modules: string[] | null;
  module_location_ids: string[] | null;
}

const AdminCompositions = () => {
  const [rows, setRows] = useState<CompositionAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const propertyOptions = useMemo(
    () =>
      PROPERTIES?.map((property) => ({
        slug: property.slug,
        name: property.name,
        locationId: locationIdsForSlug(property.slug).primary,
      })) ?? [],
    [],
  );

  const propertySlugToLocationId = useMemo(
    () => new Map(propertyOptions.map((property) => [property.slug, property.locationId])),
    [propertyOptions],
  );

  const propertyLocationIds = useMemo(
    () => new Set(propertyOptions.map((property) => property.locationId)),
    [propertyOptions],
  );

  const locationIdToPropertySlug = useMemo(
    () => new Map(propertyOptions.map((property) => [property.locationId, property.slug])),
    [propertyOptions],
  );

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("unit_compositions")
      .select("id, slug, display_name, modules, module_location_ids")
      .order("sort_order", { ascending: true })
      .order("display_name", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setRows([]);
      setLoading(false);
      return;
    }

    const normalized = ((data ?? []) as unknown as CompositionAdminRow[]).map((row) => ({
      ...row,
      modules: Array.from(new Set(row.modules ?? [])),
      module_location_ids: row.module_location_ids ?? [],
    }));

    console.log("[admin/compositions] loaded", normalized);
    setRows(normalized);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const toggleModule = (rowId: string, propertySlug: string) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== rowId) return row;

        const nextModules = row.modules?.includes(propertySlug)
          ? row.modules.filter((slug) => slug !== propertySlug)
          : [...(row.modules ?? []), propertySlug];

        return {
          ...row,
          modules: nextModules,
        };
      }),
    );
  };

  const updateDisplayName = (rowId: string, displayName: string) => {
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, display_name: displayName } : row)),
    );
  };

  const saveRow = async (row: CompositionAdminRow) => {
    setSavingId(row.id);

    // Force lowercase op slugs zodat ze altijd matchen met Cloudflare prefixes.
    const sanitizedModules = Array.from(
      new Set(
        (row.modules ?? [])
          .filter((slug): slug is string => Boolean(slug))
          .map((slug) => slug.toLowerCase().trim())
          .filter((slug) => propertySlugToLocationId.has(slug)),
      ),
    );
    const preservedExtras = Array.from(
      new Set(
        (row.module_location_ids ?? [])
          .filter((locationId): locationId is string => Boolean(locationId))
          .map((locationId) => locationId.toLowerCase().trim())
          .filter((locationId) => !propertyLocationIds.has(locationId)),
      ),
    );
    const nextLocationIds = Array.from(
      new Set([
        ...sanitizedModules
          .map((slug) => propertySlugToLocationId.get(slug))
          .filter((locationId): locationId is string => Boolean(locationId))
          .map((locationId) => locationId.toLowerCase()),
        ...preservedExtras,
      ]),
    );

    const payload = {
      display_name: row.display_name,
      modules: sanitizedModules,
      module_location_ids: nextLocationIds,
    };

    console.log("[admin/compositions] saving", row.id, payload);

    const { data, error } = await supabase
      .from("unit_compositions")
      .update(payload as never)
      .eq("id", row.id)
      .select("id, slug, display_name, modules, module_location_ids");

    console.log("Nieuwe database staat:", data);

    setSavingId(null);

    if (error) {
      console.error("[admin/compositions] save failed", error);
      toast.error("Opslaan mislukt", {
        description: error.message,
      });
      return;
    }

    console.log("[admin/compositions] saved", data);
    setRows((current) =>
      current.map((currentRow) =>
        currentRow.id === row.id
          ? {
              ...currentRow,
              display_name: data?.[0]?.display_name ?? payload.display_name,
              modules: data?.[0]?.modules ?? payload.modules,
              module_location_ids: data?.[0]?.module_location_ids ?? payload.module_location_ids,
            }
          : currentRow,
      ),
    );
    toast.success("Samenstelling opgeslagen");
    window.location.reload();
  };

  if (!PROPERTIES) {
    return <div>Data Load Error</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-3xl text-primary-deep">Samenstellingen</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Kies per samenstelling eenvoudig welke woningen uit de statische property-config erbij horen.
          </p>
        </div>
        <Button variant="outline" onClick={fetchRows} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Vernieuwen
        </Button>
      </header>

      {errorMessage ? (
        <Card className="border-destructive/40">
          <CardContent className="py-6">
            <p className="font-medium text-destructive">Supabase-connectie mislukt.</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Laden…
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Geen samenstellingen gevonden.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const preservedExtras = (row.module_location_ids ?? []).filter(
              (locationId) => !propertyLocationIds.has(locationId),
            );

            return (
              <Card key={row.id}>
                <CardHeader className="space-y-3">
                  <div className="space-y-1">
                    <CardTitle className="font-display text-2xl text-primary-deep">
                      {row.display_name || row.slug}
                    </CardTitle>
                    <p className="text-xs font-mono text-muted-foreground">/{row.slug}</p>
                  </div>
                  <div className="max-w-md space-y-2">
                    <Label htmlFor={`display-name-${row.id}`}>Naam van samenstelling</Label>
                    <Input
                      id={`display-name-${row.id}`}
                      value={row.display_name}
                      onChange={(event) => updateDisplayName(row.id, event.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-3 text-sm font-medium text-primary-deep">Woningen in deze samenstelling</p>
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {PROPERTIES?.map((property) => (
                        <label
                          key={`${row.id}-${property.slug}`}
                          className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={row.modules?.includes(property.slug) ?? false}
                            onChange={() => toggleModule(row.id, property.slug)}
                            className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
                          />
                          <span>{property.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p>
                        Geselecteerde slugs: {(row.modules ?? []).length > 0 ? (row.modules ?? []).join(", ") : "geen"}
                      </p>
                      {preservedExtras.length > 0 && (
                        <p>
                          Extra niet-property modules blijven behouden: {preservedExtras.join(", ")}
                        </p>
                      )}
                    </div>
                    <Button onClick={() => saveRow(row)} disabled={savingId === row.id}>
                      {savingId === row.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Opslaan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCompositions;
