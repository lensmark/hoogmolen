import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";

const OverOns = () => (
  <Layout>
    <PageHero eyebrow="Over ons" title="Vijf eeuwen molengeschiedenis" />
    <section className="py-20">
      <div className="container-narrow prose-lg space-y-6 text-muted-foreground leading-relaxed">
        <p className="lead text-foreground">
          Landgoed De Hoogmolen draagt zijn geschiedenis met zachte vanzelfsprekendheid.
          Reeds vóór 1500 werd hier graan gemalen aan de Abeek — eeuwenlang het kloppende
          economische hart van de regio Oudsbergen.
        </p>
        <p>
          Vandaag is het molenerf zorgvuldig gerestaureerd tot een eigentijds verblijf waar
          erfgoed en hospitality elkaar in stilte ontmoeten. Bakstenen muren, eikenhouten balken
          en het zachte ruisen van het water vormen het decor voor uw verblijf, terwijl modern
          comfort — high-speed wifi, airconditioning en self check-in — onzichtbaar aanwezig is.
        </p>
        <p>
          We werken vanuit één heldere overtuiging: <em className="text-primary-deep not-italic font-medium">u
          mag even niets meer hoeven</em>. Daarom is alles vooraf geregeld, ontbreken er geen
          essentiële comfortelementen, en blijven wij steeds bereikbaar via een persoonlijke
          WhatsApp-groep.
        </p>
        <p>
          Of u nu komt met twee, met uw familie van twintig, of het volledige domein voor
          drieënvijftig gasten exclusief voor uzelf reserveert — bij De Hoogmolen bent u de
          eerstvolgende in een lange rij gasten die hier de tijd lieten vertragen.
        </p>
      </div>
    </section>
  </Layout>
);

export default OverOns;
