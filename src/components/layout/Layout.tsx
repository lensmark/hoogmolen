import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { FloatingBackButton } from "@/components/ui/FloatingBackButton";
import { FloatingLibraryButton } from "@/components/admin/FloatingLibraryButton";
import { SchemaInjector } from "@/components/SchemaInjector";
import { GlobalSchema } from "@/components/GlobalSchema";
import { SEO } from "@/components/SEO";

interface LayoutProps {
  children: ReactNode;
  /** disable top padding when hero is full-bleed transparent */
  transparentHeader?: boolean;
}

export const Layout = ({ children, transparentHeader = false }: LayoutProps) => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO />
      <GlobalSchema />
      <SchemaInjector />
      <Header />
      {/* TopBar (32px) + Tier1 (68px) + Tier2 (40px). Bij transparentHeader bouwt de pagina zelf top-padding in via hero pt-32. */}
      <main className={`flex-1 ${transparentHeader ? "" : "pt-[100px] lg:pt-[140px]"}`}>
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingBackButton />
      <FloatingLibraryButton />
    </div>
  );
};
