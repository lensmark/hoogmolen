/**
 * PropertyMolenhuys — extra USP-kaart voor Plus / Volmolen / Landgoed
 * waar exclusieve toegang tot het Molenhuys is inbegrepen.
 */
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PropertyMolenhuys = () => (
  <section className="py-10 bg-secondary/40 border-t border-border">
    <div className="container-wide">
      <div className="border border-border bg-card p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="eyebrow">Inclusief bij dit verblijf</span>
          </div>
          <h3 className="font-display text-2xl text-primary-deep mb-2">
            Het Molenhuys — uw exclusieve ontspanningsruimte
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Bij dit verblijf krijgt u exclusieve toegang tot het Molenhuys: een
            professioneel uitgeruste keuken, selfservice bar met tap, ping-pong,
            darts en kicker.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-primary-deep text-primary-deep hover:bg-primary-deep hover:text-secondary"
        >
          <Link to="/overnachten/molenhuys">Ontdek het Molenhuys</Link>
        </Button>
      </div>
    </div>
  </section>
);
