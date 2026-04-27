import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { ACTIVITIES, type Activity } from "@/config/activitiesConfig";
import { MapPin, Star } from "lucide-react";

const groups: { key: Activity["category"]; title: string }[] = [
  { key: "natuur", title: "Natuur" },
  { key: "fietsen", title: "Fietsen" },
  { key: "wandelen", title: "Wandelen" },
  { key: "avontuur", title: "Avontuur" },
  { key: "familie", title: "Familie" },
  { key: "culinair", title: "Culinair" },
  { key: "winter", title: "Winter" },
];

const Omgeving = () => (
  <Layout>
    <PageHero
      eyebrow="Omgeving"
      title="Limburg, in al zijn rijkdom"
      subtitle="Het Nationaal Park Hoge Kempen, fietsen door de bomen of het water, kasteelbrouwerijen, wintersport en familieparken — allemaal binnen een halfuur."
    />
    {groups.map((g) => {
      const items = ACTIVITIES.filter((a) => a.category === g.key);
      if (!items.length) return null;
      return (
        <section key={g.key} className="py-14 md:py-20 odd:bg-secondary/30">
          <div className="container-wide">
            <h2 className="heading-section text-primary-deep mb-8">{g.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((a) => (
                <article key={a.id} className="surface-card p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{a.icon}</span>
                    {a.rating && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary-deep">
                        <Star className="w-3 h-3 fill-primary text-primary" /> {a.rating}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl text-primary-deep mb-1">{a.name}</h3>
                  {a.distance && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" /> {a.distance}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    })}
  </Layout>
);

export default Omgeving;
