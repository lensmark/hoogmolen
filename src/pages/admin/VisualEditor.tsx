/**
 * AdminVisualEditor — opent de live website in een nieuw tabblad.
 * Activeert vooraf "Beheermodus" zodat alle EditableImage-overlays direct werken.
 */
import { useEffect } from "react";
import { ExternalLink, Eye, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "hoogmolen.adminMode";

const AdminVisualEditor = () => {
  // Ensure admin-mode is active when the user opens the live site
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  const openLive = (path: string) => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.open(path, "_blank", "noopener");
  };

  const SHORTCUTS = [
    { label: "Homepage", path: "/" },
    { label: "Vakantiewoningen", path: "/overnachten/vakantiewoningen" },
    { label: "Suites & kamers", path: "/overnachten/suites-kamers" },
    { label: "Vergaderen", path: "/vergaderen" },
    { label: "Activiteiten", path: "/activiteiten" },
    { label: "Geschiedenis", path: "/over-ons/geschiedenis" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="font-display text-3xl text-primary-deep">Visual Editor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Open de live website met Beheermodus voor-geactiveerd, en wijzig foto's direct ter plaatse.
        </p>
      </header>

      <div className="bg-card border border-border rounded-md p-6 shadow-soft">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl text-primary-deep">Beheermodus is geactiveerd</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Op elke pagina verschijnen blauwe edit-overlays op alle vervangbare foto's.
              Klik erop om uit de mediabibliotheek te kiezen.
            </p>
          </div>
        </div>

        <Button onClick={() => openLive("/")} size="lg" className="w-full sm:w-auto">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open live site in nieuw tabblad
        </Button>
      </div>

      <section>
        <h3 className="font-display text-lg text-primary-deep mb-3">Snelkoppelingen</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SHORTCUTS.map((s) => (
            <button
              key={s.path}
              type="button"
              onClick={() => openLive(s.path)}
              className="text-left bg-card border border-border rounded-md p-4 hover:border-primary transition-colors text-sm font-medium text-primary-deep"
            >
              <ExternalLink className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <div className="bg-accent/30 border border-accent rounded-md p-4 flex gap-3 text-sm text-primary-deep">
        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <div>
          <strong>Tip:</strong> Sneltoets <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-xs">Alt + A</kbd> wisselt
          Beheermodus aan/uit op de live site. De toggle is ook discreet bereikbaar onderaan in de footer.
        </div>
      </div>
    </div>
  );
};

export default AdminVisualEditor;
