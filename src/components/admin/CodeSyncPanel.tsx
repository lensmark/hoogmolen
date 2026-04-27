/**
 * CodeSyncPanel — System Health overzicht voor de Smart Resolver.
 *
 * Toont alle actieve aliassen (oud → nieuw), een status-indicator
 * "Actief via Database Fallback" en een knop om een Cleanup Batch te
 * genereren die je 1-op-1 in de Lovable-chat plakt om de broncode te
 * laten opschonen door de AI.
 *
 * Na een succesvolle code-sweep kun je individuele aliassen verwijderen
 * uit de DB (alleen admin) — daarna gebruikt de site enkel nog de nieuwe
 * IDs zonder fallback.
 */
import { useState } from "react";
import { Sparkles, Trash2, Copy, ShieldCheck, Loader2 } from "lucide-react";
import { useImageAliases, clearAliasCache } from "@/hooks/useImageAliases";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export const CodeSyncPanel = () => {
  const { aliases, loading } = useImageAliases();
  const [batch, setBatch] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const generateBatch = () => {
    if (aliases.length === 0) {
      toast({
        title: "Geen aliassen",
        description: "Er zijn momenteel geen actieve aliassen om te verwerken.",
      });
      return;
    }
    const lines = aliases.map((a) => `${a.oldId} -> ${a.newId}`).join("\n");
    const text = [
      "Onderhoudsbeurt: De volgende IDs zijn definitief hernoemd in de beeldbank.",
      "Vervang deze strings overal in de broncode (vooral in src/config/ bestanden)",
      "door hun nieuwe tegenhanger en verwijder daarna de aliassen uit de DB:",
      "",
      lines,
    ].join("\n");
    setBatch(text);
    void navigator.clipboard.writeText(text).catch(() => undefined);
    toast({
      title: "Cleanup Batch gegenereerd",
      description: "De opdracht staat in je klembord. Plak hem in de Lovable-chat.",
    });
  };

  const deleteAlias = async (oldId: string) => {
    setDeletingId(oldId);
    try {
      const { error } = await supabase
        .from("image_aliases")
        .delete()
        .eq("old_id", oldId);
      if (error) throw error;

      await supabase.from("sync_history").insert({
        status: "success",
        action: "alias_cleanup",
        message: `Alias verwijderd: ${oldId}`,
        affected_items: [oldId],
        counts: { deleted: 1 },
      });

      await clearAliasCache();
      toast({ title: "Alias verwijderd", description: oldId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Onbekende fout";
      toast({
        title: "Verwijderen mislukt",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary text-primary-foreground border-primary-deep gap-1.5 py-1 px-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Actief via Database Fallback
          </Badge>
          <span className="text-xs text-muted-foreground">
            {aliases.length} actieve {aliases.length === 1 ? "alias" : "aliassen"}
          </span>
        </div>
        <Button
          type="button"
          onClick={generateBatch}
          className="bg-primary-deep text-primary-foreground hover:bg-primary-deep/90"
          disabled={aliases.length === 0}
        >
          <Sparkles className="w-4 h-4 mr-2" /> Generate Cleanup Batch
        </Button>
      </div>

      <div className="rounded-md border border-accent bg-accent/30 px-4 py-3 text-xs text-primary-deep">
        <p className="font-semibold mb-1">Hoe werkt dit?</p>
        <p>
          Elke rename via de Issues-tab maakt automatisch een alias aan. De website
          stuurt oude verwijzingen door naar de nieuwe foto, dus niets breekt. Met
          "Generate Cleanup Batch" maak je een opdracht voor Lovable om de broncode
          definitief op te schonen — daarna kun je de alias hier verwijderen.
        </p>
      </div>

      <div className="bg-card rounded-md shadow-soft overflow-hidden border border-border">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Laden…</p>
        ) : aliases.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            ✨ Geen actieve aliassen — broncode is in sync met de beeldbank.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oude ID (in code)</TableHead>
                <TableHead>Nieuwe ID (op Cloudflare)</TableHead>
                <TableHead className="text-right">Actie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aliases.map((a) => (
                <TableRow key={a.oldId}>
                  <TableCell className="font-mono text-xs text-muted-foreground break-all max-w-xs">
                    {a.oldId}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary-deep break-all max-w-xs">
                    {a.newId}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAlias(a.oldId)}
                      disabled={deletingId === a.oldId}
                      title="Verwijder alias (alleen na cleanup van broncode)"
                    >
                      {deletingId === a.oldId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {batch && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary-deep">
              Cleanup Batch (geplakt in klembord)
            </h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                void navigator.clipboard.writeText(batch);
                toast({ title: "Gekopieerd" });
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-2" /> Kopieer
            </Button>
          </div>
          <Textarea
            value={batch}
            readOnly
            className="font-mono text-xs min-h-[200px] bg-secondary"
          />
        </div>
      )}
    </div>
  );
};

export default CodeSyncPanel;
