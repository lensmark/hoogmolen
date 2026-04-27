/**
 * /over-ons/team — Ons team
 *
 * Vier-koppig team achter Landgoed De Hoogmolen.
 * Card-grid met portretkader, naam, rol en korte beschrijving.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { CONTACT } from "@/config/navigationConfig";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
  accent: "primary" | "deep";
}

const TEAM: TeamMember[] = [
  {
    name: "Mark",
    role: "Eigenaar & strateeg",
    initials: "MA",
    bio:
      "Mark is de drijvende kracht achter de langetermijnvisie en de maatschappelijke verankering van Landgoed De Hoogmolen. Met een achtergrond in serieel ondernemerschap richt hij zich op de strategische ontwikkeling van het domein als een 5-sterren bestemming. Als voorzitter van ‘Ondernemers Voor een Warm België’ integreert hij sociaal engagement in de bedrijfsvoering, waarbij hij de historische waarde van de molen verbindt met een duurzame en impactvolle toekomst.",
    accent: "deep",
  },
  {
    name: "Petra",
    role: "Eigenaar & director of estate management",
    initials: "PE",
    bio:
      "Petra voert de regie over het integrale beheer en de strategische ontwikkeling van het vastgoed. Zij bewaakt de juridische en infrastructurele integriteit van het landgoed, variërend van complexe vergunningstrajecten en verzekeringsportefeuilles tot de esthetische en technische supervisie bij verbouwingen. Met haar onfeilbare oog voor high-end hospitality en asset management waarborgt zij de continuïteit en de exclusieve kwaliteitsstandaard van Landgoed De Hoogmolen.",
    accent: "primary",
  },
  {
    name: "Annemie",
    role: "Finance, IT & Business Operations",
    initials: "AN",
    bio:
      "Annemie is de spil in de bedrijfsmatige en technologische werking van het landgoed. Zij beheert de financiële stromen, van budgettering tot rendementsanalyse, en bepaalt de koers op basis van data. Daarnaast optimaliseert zij de IT-processen en platformintegraties die de dagelijkse operatie ondersteunen. Van energiemanagement tot personeelszaken en het aansturen van technische leveranciers: Annemie zorgt dat de organisatie achter de schermen als een geoliede machine functioneert.",
    accent: "primary",
  },
  {
    name: "Britt",
    role: "Guest Relations & Marketing",
    initials: "BR",
    bio:
      "Britt is verantwoordelijk voor de beleving en zichtbaarheid van ons landgoed. Zij beheert alle gastcommunicatie, van eerste aanvraag tot review, en vertaalt onze strategie naar een uitnodigend merk. Naast het beheer van onze website en sociale media, ontwikkelt zij de digitale gidsen die onze gasten wegwijs maken. Achter de schermen zorgt Britt voor de strakke planning van de facilitaire teams en ondersteunt zij de operationele opvolging, zodat elke gast op een perfect voorbereid domein arriveert.",
    accent: "deep",
  },
];

const Team = () => (
  <Layout>
    <PageHero
      eyebrow="Over ons"
      title="Ons team"
      subtitle="Vier mensen, één passie: u laten thuiskomen op een eeuwenoud landgoed."
      align="center"
    />

    <section className="container-wide py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {TEAM.map((m) => (
          <article
            key={m.name}
            className="bg-surface border border-border rounded-lg p-6 md:p-8 shadow-soft hover:shadow-lg transition-shadow flex gap-5 md:gap-6"
          >
            {/* Initialen-avatar i.p.v. portretfoto (placeholder, te vervangen) */}
            <div
              className={`shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-display text-2xl md:text-3xl ${
                m.accent === "deep"
                  ? "bg-primary-deep text-secondary"
                  : "bg-primary text-secondary"
              }`}
              aria-hidden
            >
              {m.initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-2xl text-primary-deep leading-tight">
                {m.name}
              </h3>
              <div className="text-xs uppercase tracking-[0.15em] text-primary mt-1 mb-3">
                {m.role}
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">{m.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Contact-anchor */}
    <section className="bg-secondary/40 py-16 md:py-20">
      <div className="container-narrow text-center">
        <div className="eyebrow text-primary mb-2">Persoonlijk contact</div>
        <h2 className="heading-section text-primary-deep mb-4">
          Een team dat altijd bereikbaar is
        </h2>
        <p className="lead text-foreground/80 mb-8 max-w-2xl mx-auto">
          Omdat er geen receptie op het domein is, creëren we voor elk verblijf een
          persoonlijke WhatsApp-groep. Zo zijn we snel, vlot en menselijk bereikbaar — voor
          praktische vragen of een gezellige tip onderweg.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-primary hover:bg-primary-deep text-secondary">
            <a href={`tel:${CONTACT.phone}`}>
              <Phone className="w-4 h-4 mr-2" /> {CONTACT.phone}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-deep text-primary-deep">
            <a href={`mailto:${CONTACT.email}`}>
              <Mail className="w-4 h-4 mr-2" /> {CONTACT.email}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-deep text-primary-deep">
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
            </a>
          </Button>
        </div>
        <div className="mt-8">
          <Link
            to="/over-ons"
            className="text-sm text-primary-deep hover:text-primary underline underline-offset-4"
          >
            ← Terug naar Over ons
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Team;
