import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StubProps {
  title: string;
  eyebrow?: string;
  description?: string;
}

export const StubPage = ({ title, eyebrow = "Binnenkort", description }: StubProps) => (
  <Layout>
    <PageHero eyebrow={eyebrow} title={title} subtitle={description ?? "Deze pagina wordt momenteel uitgewerkt. Neem gerust contact op voor meer informatie."} />
    <section className="py-20">
      <div className="container-narrow text-center space-y-5">
        <p className="text-muted-foreground">
          Heeft u een specifieke vraag? We staan voor u klaar.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Button asChild className="bg-primary hover:bg-primary-deep"><Link to="/contact">Contacteer ons</Link></Button>
          <Button asChild variant="outline" className="border-primary-deep text-primary-deep"><Link to="/">Terug naar home</Link></Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default StubPage;
