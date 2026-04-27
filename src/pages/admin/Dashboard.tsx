/**
 * AdminDashboard — overzicht van site-status: counts uit image_library,
 * image_overrides en user_roles + snelle acties.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Images, Replace, Users, ArrowRight, FolderTree } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRoles";
import { SITE_VERSION } from "@/lib/version";

interface Stats {
  totalUploads: number;
  successUploads: number;
  failedUploads: number;
  totalOverrides: number;
  totalUsers: number;
  totalCompositions: number;
}

const AdminDashboard = () => {
  const { isAdmin, userEmail } = useUserRoles();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [lib, ovr, usr, comp] = await Promise.all([
        supabase.from("image_library").select("status"),
        supabase.from("image_overrides").select("id"),
        isAdmin ? supabase.from("user_roles").select("user_id") : Promise.resolve({ data: [] }),
        supabase.from("unit_compositions").select("id"),
      ]);
      const libRows = (lib.data ?? []) as { status: string }[];
      setStats({
        totalUploads: libRows.length,
        successUploads: libRows.filter((r) => r.status === "success").length,
        failedUploads: libRows.filter((r) => r.status === "failed").length,
        totalOverrides: (ovr.data ?? []).length,
        totalUsers: new Set(((usr.data ?? []) as { user_id: string }[]).map((r) => r.user_id)).size,
        totalCompositions: (comp.data ?? []).length,
      });
      setLoading(false);
    })();
  }, [isAdmin]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-primary-deep">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welkom terug{userEmail ? `, ${userEmail}` : ""}. Site versie: <span className="font-mono">{SITE_VERSION}</span>
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Uploads totaal"
          value={loading ? "…" : String(stats?.totalUploads ?? 0)}
          sub={loading ? "" : `${stats?.successUploads ?? 0} ok · ${stats?.failedUploads ?? 0} fouten`}
          icon={Images}
        />
        <StatCard
          label="Image overrides"
          value={loading ? "…" : String(stats?.totalOverrides ?? 0)}
          sub="Visuele aanpassingen"
          icon={Replace}
        />
        {isAdmin && (
          <StatCard
            label="Gebruikers met rol"
            value={loading ? "…" : String(stats?.totalUsers ?? 0)}
            sub="Admins + editors"
            icon={Users}
          />
        )}
        <StatCard
          label="Samenstellingen"
          value={loading ? "…" : String(stats?.totalCompositions ?? 0)}
          sub="Verhuurformules + villa's"
          icon={FolderTree}
        />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="font-display text-xl text-primary-deep mb-4">Snelle acties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard
            to="/admin/compositions"
            title="Beheer samenstellingen"
            description="Watermolen, Volmolen, villa's… stel samen welke modules in elke formule zitten en op welke site ze tonen."
            icon={FolderTree}
          />
          <ActionCard
            to="/admin/media"
            title="Nieuwe foto's uploaden"
            description="Upload bestanden naar Cloudflare en bekijk de audit-historiek."
          />
          <ActionCard
            to="/admin/visual-editor"
            title="Open Visual Editor"
            description="Open de live website met Beheermodus aan om foto's te wisselen."
          />
          {isAdmin && (
            <>
              <ActionCard
                to="/admin/users"
                title="Beheer gebruikers"
                description="Voeg admins of editors toe en wijs rollen toe."
              />
              <ActionCard
                to="/admin/settings"
                title="Site-instellingen"
                description="Pas contactgegevens en WhatsApp-nummer aan."
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Images;
}) => (
  <div className="bg-card border border-border rounded-md p-5 shadow-soft">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="font-display text-3xl text-primary-deep leading-none">{value}</div>
    <div className="text-xs text-muted-foreground mt-2">{sub}</div>
  </div>
);

const ActionCard = ({
  to,
  title,
  description,
  icon: Icon,
}: {
  to: string;
  title: string;
  description: string;
  icon?: typeof Images;
}) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group w-full text-left bg-card border border-border rounded-md p-5 shadow-soft hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-md bg-accent/40 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary-deep" />
            </div>
          )}
          <div>
            <h3 className="font-display text-lg text-primary-deep mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
      </div>
    </button>
  );
};

export default AdminDashboard;
