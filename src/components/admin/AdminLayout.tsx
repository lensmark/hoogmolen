/**
 * AdminLayout — wrapper voor alle /admin pagina's:
 * - Sidebar met menu (rol-gefilterd)
 * - Header met user-email + logout
 * - Outlet voor sub-pagina's
 */
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRoles";
import AdminSidebar from "./AdminSidebar";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { userEmail, isAdmin } = useUserRoles();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-primary-deep" />
              <div className="hidden md:block">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Management Console
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-primary-deep truncate max-w-[200px]">
                  {userEmail}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {isAdmin ? "Admin" : "Editor"}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
