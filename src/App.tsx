import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminModeProvider } from "@/contexts/AdminModeContext";
import UnitCompositionsLoader from "@/components/UnitCompositionsLoader";

// ── EAGER (kritisch / hub-routes / detail LCP) ─────────────────────
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Overnachten from "./pages/Overnachten";
import Vakantiewoningen from "./pages/Vakantiewoningen";
import SuitesKamers from "./pages/SuitesKamers";
import Groepsverblijf from "./pages/Groepsverblijf";
import Vergaderen from "./pages/Vergaderen";
import Teambuildings from "./pages/Teambuildings";
import ActiviteitenHub from "./pages/ActiviteitenHub";
import Activiteiten from "./pages/Activiteiten";
import Praktisch from "./pages/Praktisch";
import OverOns from "./pages/OverOns";
import Contact from "./pages/Contact";
import PropertyDetail from "./pages/PropertyDetail";
import UnitDetail from "./pages/UnitDetail";

// ── LAZY (low-priority detail- en info-routes) ──────────────────────
// v4.17.9: aggressieve route-splitting → lagere TBT en kleinere initial bundle.
const Boekingsinformatie = lazy(() => import("./pages/Boekingsinformatie"));
const TeambuildingInLimburg = lazy(() => import("./pages/TeambuildingInLimburg"));
const TeambuildingMetOvernachting = lazy(() => import("./pages/TeambuildingMetOvernachting"));
const TeambuildingOpDomein = lazy(() => import("./pages/TeambuildingOpDomein"));
const Team = lazy(() => import("./pages/Team"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const GroepsverblijfAanvragen = lazy(() => import("./pages/GroepsverblijfAanvragen"));
const VergaderAanvraagPage = lazy(() => import("./pages/VergaderAanvraag"));
const GroepsverblijfBucket = lazy(() => import("./pages/GroepsverblijfBucket"));
const GroepenSEO = lazy(() => import("./pages/GroepenSEO"));
const PeerdermolenPlus = lazy(() => import("./pages/PeerdermolenPlus"));
const DuplexsuitesOverview = lazy(() => import("./pages/DuplexsuitesOverview"));
const KamersOverview = lazy(() => import("./pages/KamersOverview"));
const Paardenlogies = lazy(() => import("./pages/Paardenlogies"));
const InDeOmgeving = lazy(() => import("./pages/InDeOmgeving"));
const ActiviteitenFietsen = lazy(() => import("./pages/ActiviteitenFietsen"));
const ActiviteitenWandelen = lazy(() => import("./pages/ActiviteitenWandelen"));
const ActiviteitenPaardrijden = lazy(() => import("./pages/ActiviteitenPaardrijden"));
const ActiviteitenFamilie = lazy(() => import("./pages/ActiviteitenFamilie"));
const FamilieDetail = lazy(() => import("./pages/FamilieDetail"));
const ActiviteitenCulinair = lazy(() => import("./pages/ActiviteitenCulinair"));
const FietsHistorischeWatermolens = lazy(() => import("./pages/FietsHistorischeWatermolens"));
const FietsenDoorHetWater = lazy(() => import("./pages/FietsenDoorHetWater"));
const FietsenDoorDeBomen = lazy(() => import("./pages/FietsenDoorDeBomen"));
const FietsKnooppunt01 = lazy(() => import("./pages/FietsKnooppunt01"));
const WandelDetail = lazy(() => import("./pages/WandelDetail"));
const PaardrijdenDetail = lazy(() => import("./pages/PaardrijdenDetail"));
const OmgevingDetail = lazy(() => import("./pages/OmgevingDetail"));
const Ervaringen = lazy(() => import("./pages/Ervaringen"));
const StubPage = lazy(() => import("./pages/StubPage").then((m) => ({ default: m.StubPage })));
const Geschiedenis = lazy(() => import("./pages/Geschiedenis"));
const GeschiedenisErfgoed = lazy(() => import("./pages/geschiedenis/Erfgoed"));
const GeschiedenisNatuur = lazy(() => import("./pages/geschiedenis/Natuur"));
const GeschiedenisDuurzaamheid = lazy(() => import("./pages/geschiedenis/Duurzaamheid"));
import AdminLoginPage from "./pages/admin/Login";
import AdminResetPassword from "./pages/admin/ResetPassword";
import AdminAuthCallback from "./pages/admin/AuthCallback";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMedia from "./pages/admin/Media";
import AdminVisualEditor from "./pages/admin/VisualEditor";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import AdminCompositions from "./pages/admin/Compositions";
import AdminGallery from "./pages/admin/Gallery";
import AdminLibrary from "./pages/admin/Library";

const queryClient = new QueryClient();

/**
 * Routing — Authoritative 77-URL map (kb_urls_deel1 + kb_urls_deel2).
 * Page-ID per route in comment. Trailing slashes uit kb worden door React Router
 * automatisch gematched (path zonder trailing slash).
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminModeProvider>
          <UnitCompositionsLoader />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
          {/* #home */}
          <Route path="/" element={<Index />} />

          {/* ───── OVERNACHTEN (21) ───── */}
          {/* #overnachten */}
          <Route path="/overnachten" element={<Overnachten />} />
          {/* #vakwon */}
          <Route path="/overnachten/vakantiewoningen" element={<Vakantiewoningen />} />
          {/* ─── HOUSES — vakantiewoningen & groepsformules ─── */}
          <Route path="/overnachten/vakantiewoningen/:slug" element={<PropertyDetail />} />

          {/* #sk-main + #boekingsinfo */}
          <Route path="/overnachten/suites-kamers" element={<SuitesKamers />} />
          <Route path="/overnachten/boekingsinformatie" element={<Boekingsinformatie />} />

          {/* #ds-cat */}
          <Route path="/overnachten/suites-kamers/duplexsuites" element={<DuplexsuitesOverview />} />
          {/* DUPLEXSUITES A1-A6 */}
          <Route path="/overnachten/suites-kamers/duplexsuites/:slug" element={<PropertyDetail />} />

          {/* KAMERS B1-B5 + Familiekamer */}
          <Route path="/overnachten/suites-kamers/kamers" element={<KamersOverview />} />
          <Route path="/overnachten/suites-kamers/kamers/:slug" element={<PropertyDetail />} />

          {/* Korte-URL alias /overnachten/:slug → zelfde router */}
          <Route path="/overnachten/:slug" element={<PropertyDetail />} />

          {/* #molenhuys */}
          <Route path="/overnachten/molenhuys" element={<StubPage eyebrow="Entertainment" title="Het Molenhuys" description="Professionele ontspanningsruimte met bar, keuken en haard." />} />

          {/* ───── GROEPSVERBLIJF (4) ───── */}
          {/* #groep */}
          <Route path="/groepsverblijf" element={<Groepsverblijf />} />
          {/* #g10 / #g20 / #g30 — dynamisch via :bucket */}
          <Route path="/groepsverblijf/10-20-personen" element={<GroepsverblijfBucket />} />
          <Route path="/groepsverblijf/20-30-personen" element={<GroepsverblijfBucket />} />
          <Route path="/groepsverblijf/30-53-personen" element={<GroepsverblijfBucket />} />
          {/* extra: aanvraagformulier (bestaande pagina) */}
          <Route path="/groepsverblijf/aanvragen" element={<GroepsverblijfAanvragen />} />

          {/* ───── VERGADEREN (4) ───── */}
          {/* #vergaderen */}
          <Route path="/vergaderen" element={<Vergaderen />} />
          {/* #vergformules */}
          <Route path="/vergaderen/vergaderformules" element={<StubPage eyebrow="Vergaderen" title="Vergaderformules" />} />
          {/* #vergfacil */}
          <Route path="/vergaderen/faciliteiten" element={<StubPage eyebrow="Vergaderen" title="Faciliteiten" />} />
          {/* #vergovernight */}
          <Route path="/vergaderen/vergaderen-met-overnachting" element={<StubPage eyebrow="Vergaderen" title="Met overnachting" />} />

          {/* ───── TEAMBUILDINGS (4) ───── */}
          {/* #teambuilding-v2 */}
          <Route path="/teambuildings" element={<Teambuildings />} />
          {/* #team-limburg-v2 */}
          <Route path="/teambuildings/in-limburg" element={<TeambuildingInLimburg />} />
          {/* #team-overnight-v2 */}
          <Route path="/teambuildings/met-overnachting" element={<TeambuildingMetOvernachting />} />
          {/* #team-domein-v2 */}
          <Route path="/teambuildings/activiteiten-op-en-rond-het-domein" element={<TeambuildingOpDomein />} />

          {/* ───── PAARDENLOGIES (1) ───── */}
          {/* #paardenlogies */}
          <Route path="/paardenlogies" element={<Paardenlogies />} />

          {/* ───── ACTIVITEITEN (29) ───── */}
          {/* #omgeving-v2 */}
          <Route path="/activiteiten" element={<Activiteiten />} />
          {/* #fietsen-v2 — pixel-aligned image-51 */}
          <Route path="/activiteiten/fietsen" element={<ActiviteitenFietsen />} />
          {/* Fietsroutes */}
          <Route path="/activiteiten/fietsen/10-historische-watermolens" element={<FietsHistorischeWatermolens />} />
          <Route path="/activiteiten/fietsen/fietsen-door-het-water" element={<FietsenDoorHetWater />} />
          <Route path="/activiteiten/fietsen/fietsen-door-de-bomen" element={<FietsenDoorDeBomen />} />
          <Route path="/activiteiten/fietsen/bruegelfietsroute" element={<StubPage eyebrow="Fietsroute" title="Bruegelfietsroute" />} />
          <Route path="/activiteiten/fietsen/duinengordel" element={<StubPage eyebrow="Fietsroute" title="Duinengordel" />} />
          <Route path="/activiteiten/fietsen/hoeveweelde" element={<StubPage eyebrow="Fietsroute" title="Hoeveweelde" />} />
          <Route path="/activiteiten/fietsen/ronde-van-oudsbergen" element={<StubPage eyebrow="Fietsroute" title="Ronde van Oudsbergen" />} />
          <Route path="/activiteiten/fietsen/knooppunt-01" element={<FietsKnooppunt01 />} />
          {/* #wandelen-v2 — pixel-aligned */}
          <Route path="/activiteiten/wandelen" element={<ActiviteitenWandelen />} />
          {/* Wandelroutes */}
          <Route path="/activiteiten/wandelen/:slug" element={<WandelDetail />} />
          {/* #paardrijden-v2 — pixel-aligned */}
          <Route path="/activiteiten/paardrijden" element={<ActiviteitenPaardrijden />} />
          <Route path="/activiteiten/paardrijden/:slug" element={<PaardrijdenDetail />} />
          {/* #in-de-omgeving */}
          <Route path="/activiteiten/in-de-omgeving" element={<InDeOmgeving />} />
          <Route path="/activiteiten/in-de-omgeving/:slug" element={<OmgevingDetail />} />
          {/* #familie — pixel-aligned */}
          <Route path="/activiteiten/familie" element={<ActiviteitenFamilie />} />
          <Route path="/activiteiten/familie/:slug" element={<FamilieDetail />} />
          {/* #culinair — pixel-aligned */}
          <Route path="/activiteiten/culinair" element={<ActiviteitenCulinair />} />

          {/* ───── GROEPEN SEO (4, niet in menu) ───── */}
          {/* #groep-20 / #groep-30 / #groep-40 / #groep-flex */}
          <Route path="/groepen/groepsaccommodatie-20-personen" element={<GroepenSEO />} />
          <Route path="/groepen/groepsaccommodatie-30-personen" element={<GroepenSEO />} />
          <Route path="/groepen/groepsaccommodatie-40-personen" element={<GroepenSEO />} />
          <Route path="/groepen/flexibele-modules-8-tot-53-personen" element={<GroepenSEO />} />

          {/* ───── PRAKTISCH (5) ───── */}
          {/* #praktisch */}
          <Route path="/praktisch" element={<Praktisch />} />
          {/* #gidsen */}
          <Route path="/praktisch/download-gidsen" element={<StubPage eyebrow="Praktisch" title="Download gidsen" description="Fiets-, wandel- en activiteitengids als PDF." />} />
          {/* #faq-real */}
          <Route path="/faq" element={<FAQPage />} />
          {/* #overons */}
          <Route path="/over-ons" element={<OverOns />} />
          <Route path="/over-ons/team" element={<Team />} />
          {/* #jobs */}
          <Route path="/jobs" element={<StubPage eyebrow="Werken bij" title="Jobs op het landgoed" />} />
          {/* #contact */}
          <Route path="/contact" element={<Contact />} />
          {/* Vergader-offerteformulier (apart van algemeen contact) */}
          <Route path="/vergader-offerte" element={<VergaderAanvraagPage />} />

          {/* ───── EXTRA (niet-genummerd; bestaande templates behouden) ───── */}
          <Route path="/verblijf/:slug" element={<UnitDetail />} />
          <Route path="/accommodaties/peerdermolen-plus" element={<PeerdermolenPlus />} />

          {/* ───── ERVARINGEN — Wall of Love ───── */}
          <Route path="/ervaringen" element={<Ervaringen />} />
          <Route path="/wall-of-love" element={<Ervaringen />} />
          <Route path="/over-ons/geschiedenis" element={<Geschiedenis />} />
          <Route path="/over-ons/geschiedenis/erfgoed" element={<GeschiedenisErfgoed />} />
          <Route path="/over-ons/geschiedenis/natuur" element={<GeschiedenisNatuur />} />
          <Route path="/over-ons/geschiedenis/duurzaamheid" element={<GeschiedenisDuurzaamheid />} />

          {/* ───── JURIDISCH ───── */}
          <Route path="/privacy" element={<StubPage eyebrow="Juridisch" title="Privacybeleid" />} />
          <Route path="/algemene-voorwaarden" element={<StubPage eyebrow="Juridisch" title="Algemene voorwaarden" />} />
          <Route path="/cookies" element={<StubPage eyebrow="Juridisch" title="Cookiebeleid" />} />

          {/* ───── ADMIN CONSOLE ───── */}
          {/* Publieke admin-auth routes (e-maillinks landen hier — NIET op /admin) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/login/" element={<AdminLoginPage />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin/reset-password/" element={<AdminResetPassword />} />
          <Route path="/admin/auth/callback" element={<AdminAuthCallback />} />
          <Route path="/admin/auth/callback/" element={<AdminAuthCallback />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="visual-editor" element={<AdminVisualEditor />} />
            <Route path="compositions" element={<AdminCompositions />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="library" element={<AdminLibrary />} />
            <Route path="users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </AdminModeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
