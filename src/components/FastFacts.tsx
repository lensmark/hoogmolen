/**
 * FastFacts — icon-grid met "harde" feiten over de huidige pagina.
 * Leest pathname → SITE_CONTENT_MAP. Render-loos wanneer er geen facts zijn.
 *
 * Visueel: warme kaart-grid in 'Slow Luxury' stijl, semantische tokens.
 * Plaatsing: direct onder PageHero of PropertyHero.
 */
import { useLocation } from "react-router-dom";
import { getFacts, type FastFact } from "@/config/siteContentConfig";

interface Props {
  /** override pathname (bv. voor detailroutes met dynamische slug) */
  pathname?: string;
  /** custom facts (negeert pathname-lookup) */
  facts?: FastFact[];
  /** eyebrow boven het grid */
  eyebrow?: string;
  /** compactere variant zonder section-padding */
  inline?: boolean;
}

export const FastFacts = ({ pathname, facts, eyebrow = "In één oogopslag", inline = false }: Props) => {
  const { pathname: routePath } = useLocation();
  const data = facts ?? getFacts(pathname ?? routePath);
  if (!data || data.length === 0) return null;

  const Wrapper: React.ElementType = inline ? "div" : "section";

  return (
    <Wrapper className={inline ? "" : "py-12 md:py-16 bg-background"}>
      <div className="container-wide">
        {!inline && eyebrow && (
          <div className="eyebrow text-primary-deep/80 mb-5">{eyebrow}</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {data.map((f, i) => (
            <div
              key={`${f.label}-${i}`}
              className="bg-card border border-border rounded-md p-4 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="text-2xl leading-none mb-2" aria-hidden>{f.icon}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {f.label}
              </div>
              <div className="mt-1 text-sm font-medium text-primary-deep leading-snug">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};
