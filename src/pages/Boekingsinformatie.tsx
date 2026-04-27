/**
 * /overnachten/boekingsinformatie
 * Tarieven, check-in/out, huisregels, FAQ.
 */
import { Layout } from "@/components/layout/Layout";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Clock, KeyRound, BedDouble, PawPrint, Cigarette, Moon, Euro } from "lucide-react";

const TARIEVEN = [
  { unit: "Duplexsuite (A1–A5)", from: "€150 / nacht", note: "1–4 pers., bedlinnen & handdoeken inbegrepen" },
  { unit: "Duplexsuite A6 (groot)", from: "€180 / nacht", note: "tot 6 pers." },
  { unit: "Kamer B1–B4", from: "€125 / nacht", note: "2 pers." },
  { unit: "Familiekamer B3+B4", from: "€180 / nacht", note: "tot 4 pers." },
  { unit: "Suite B5", from: "€150 / nacht", note: "tot 4 pers." },
  { unit: "Vakantiewoning Peerdermolen", from: "€450 / weekend", note: "8–12 pers., €40 p.p. extra, schoonmaak €350" },
  { unit: "Vakantiewoning Watermolen", from: "€750 / weekend", note: "8–17 pers., €40 p.p. extra, schoonmaak €450" },
  { unit: "Volledig landgoed", from: "€2 100 / weekend", note: "tot 53 pers., schoonmaak €600" },
];

const HUISREGELS = [
  { icon: Cigarette, text: "Niet roken binnen — buiten op terras toegestaan" },
  { icon: Moon, text: "Nachtrust tussen 22u00 en 08u00" },
  { icon: PawPrint, text: "Huisdieren niet toegelaten op het volledige domein" },
  { icon: BedDouble, text: "Paardenboxen beschikbaar (€25 eerste nacht, €10 volgende nachten)" },
];

const Boekingsinformatie = () => (
  <Layout>
    {/* HERO */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-16 md:py-20">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Boekingsinformatie
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Tarieven, check-in/out, huisregels en alle praktische details voor uw verblijf
        </p>
      </div>
    </section>

    {/* INTRO PLACEHOLDER */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-secondary/40 px-6 py-6 max-w-5xl">
          <p className="text-sm md:text-base text-primary-deep leading-relaxed">
            Reserveren doet u rechtstreeks via{" "}
            <a
              href="https://www.hoogmolen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-primary"
            >
              hoogmolen.com
            </a>
            . Heeft u liever persoonlijke ondersteuning? Mail of bel ons —
            wij regelen het graag voor u.
          </p>
        </div>
      </div>
    </section>

    {/* TARIEVEN */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <div className="mb-6">
          <div className="eyebrow mb-2">Tarieven</div>
          <h2 className="font-display text-2xl md:text-3xl text-primary-deep">
            Basisprijzen per eenheid
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Inclusief bed-, badgoed en huishoudpakket. Extra persoon vanaf €40,
            schoonmaak vanaf €350 (afhankelijk van eenheid).
          </p>
        </div>
        <div className="border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr>
                <th className="text-left font-medium text-primary-deep px-4 py-3">Eenheid</th>
                <th className="text-left font-medium text-primary-deep px-4 py-3">Vanaf</th>
                <th className="text-left font-medium text-primary-deep px-4 py-3 hidden md:table-cell">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {TARIEVEN.map((t, i) => (
                <tr
                  key={t.unit}
                  className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}
                >
                  <td className="px-4 py-3 font-medium text-primary-deep">{t.unit}</td>
                  <td className="px-4 py-3 text-primary inline-flex items-center gap-1">
                    <Euro className="w-3.5 h-3.5" /> {t.from.replace("€", "")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {t.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* CHECK-IN / OUT */}
    <section className="py-10 bg-background">
      <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="eyebrow">Check-in</span>
          </div>
          <h3 className="font-display text-xl text-primary-deep mb-2">Vanaf 15u00</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Self check-in via persoonlijke SALTO-pincode. Geen receptie, geen
            wachten — u opent zelf uw verblijf wanneer het u uitkomt.
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-4 h-4 text-primary" />
            <span className="eyebrow">Check-out</span>
          </div>
          <h3 className="font-display text-xl text-primary-deep mb-2">Voor 10u00</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sluit eenvoudig de deur achter u — uw pincode vervalt automatisch
            op de uitchecktijd.
          </p>
        </div>
      </div>
    </section>

    {/* HUISREGELS */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <div className="mb-5">
          <div className="eyebrow mb-2">Huisregels</div>
          <h2 className="font-display text-2xl md:text-3xl text-primary-deep">
            Voor een fijn verblijf voor iedereen
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HUISREGELS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-3 border border-border bg-card p-4"
            >
              <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-primary-deep">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <FAQAccordion context="praktisch" title="Veelgestelde vragen" />

    <AvailabilityBar />
  </Layout>
);

export default Boekingsinformatie;
