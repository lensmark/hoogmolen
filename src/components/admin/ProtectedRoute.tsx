/**
 * ProtectedRoute — schermt admin-routes af.
 * - Niet ingelogd → redirect naar /admin/login
 * - Ingelogd zonder rol → "Geen toegang" scherm
 * - requireAdmin: alleen admins door (editors geblokkeerd)
 */
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUserRoles } from "@/hooks/useUserRoles";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
  const { session, loading, isAdmin, hasAnyRole } = useUserRoles();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!hasAnyRole) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center bg-card border border-border rounded-md p-8 shadow-soft">
          <h1 className="font-display text-2xl text-primary-deep mb-3">Geen toegang</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Uw account is wel aangemaakt, maar er is nog geen rol toegekend.
            Vraag een bestaande beheerder om u admin- of editor-rechten te geven.
          </p>
          <a
            href="/admin/login"
            className="inline-block text-sm text-primary underline underline-offset-4"
          >
            Terug naar login
          </a>
        </div>
      </main>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center bg-card border border-border rounded-md p-8 shadow-soft">
          <h1 className="font-display text-2xl text-primary-deep mb-3">Alleen voor admins</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Deze sectie is enkel toegankelijk voor admins. U bent ingelogd als editor.
          </p>
          <a href="/admin" className="inline-block text-sm text-primary underline underline-offset-4">
            Terug naar dashboard
          </a>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
