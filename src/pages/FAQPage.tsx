import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { FAQAccordion } from "@/components/FAQAccordion";

const FAQPage = () => (
  <Layout>
    <PageHero eyebrow="FAQ" title="Veelgestelde vragen" subtitle="Vindt u het antwoord niet? Stuur ons een bericht — wij helpen u graag verder." />
    <FAQAccordion />
  </Layout>
);

export default FAQPage;
