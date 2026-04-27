import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getFAQByContext, FAQ, FAQItem } from "@/config/faqConfig";
import { getPageFAQs, getPageName, type PageFAQ } from "@/config/siteContentConfig";

const FAQ_SCRIPT_ID = "ld-json-faq";

interface FAQAccordionProps {
  /** filter generieke FAQ-items op context (bv. "kamer", "verblijf") */
  context?: string;
  limit?: number;
  /** override titel; standaard: "Bijkomende vragen over [pageName]" wanneer page-FAQs aanwezig zijn */
  title?: string;
  /** override pathname (handig in detail-templates met dynamische slug) */
  pathname?: string;
}

type Merged = { question: string; answer: string };

const toMerged = (f: FAQItem | PageFAQ): Merged => ({ question: f.question, answer: f.answer });

export const FAQAccordion = ({ context, limit, title, pathname }: FAQAccordionProps) => {
  const { pathname: routePath } = useLocation();
  const path = pathname ?? routePath;

  // Page-specifieke (uit siteContentConfig) staan vóór de generieke contextuele
  const pageFaqs = getPageFAQs(path);
  const generic = context ? getFAQByContext(context) : FAQ;

  // Dedupliceer op question
  const seen = new Set<string>();
  const items: Merged[] = [...pageFaqs.map(toMerged), ...generic.map(toMerged)].filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });

  const limited = limit ? items.slice(0, limit) : items;

  // FAQPage JSON-LD: injecteer exact wat zichtbaar is op deze pagina → SERP-dominantie.
  useEffect(() => {
    if (limited.length === 0) return;
    const payload = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: limited.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    };
    let script = document.getElementById(FAQ_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = FAQ_SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
    return () => {
      const existing = document.getElementById(FAQ_SCRIPT_ID);
      if (existing) existing.remove();
    };
  }, [limited]);

  if (limited.length === 0) return null;

  const pageName = getPageName(path);
  const resolvedTitle =
    title ??
    (pageFaqs.length > 0 && pageName ? `Bijkomende vragen over ${pageName}` : undefined);

  return (
    <section className="py-16 md:py-24 bg-secondary/40">
      <div className="container-narrow">
        {resolvedTitle && (
          <div className="text-center mb-10">
            <div className="eyebrow mb-3">Veelgestelde vragen</div>
            <h2 className="heading-section text-primary-deep">{resolvedTitle}</h2>
          </div>
        )}
        <Accordion type="single" collapsible className="space-y-2">
          {limited.map((f, i) => (
            <AccordionItem
              key={`${f.question}-${i}`}
              value={`item-${i}`}
              className="border border-border bg-card rounded-md px-5 data-[state=open]:bg-secondary/30 transition-colors"
            >
              <AccordionTrigger className="text-left font-medium text-primary-deep hover:no-underline py-5">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
