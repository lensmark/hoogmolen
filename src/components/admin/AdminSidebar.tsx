/**
 * AdminSidebar — donkergroene sidebar voor /admin dashboard.
 * Items worden gefilterd op rol (editors zien geen User Management of Settings).
 */
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Images,
  Eye,
  Users,
  Settings as SettingsIcon,
  Globe,
  FolderTree,
  GalleryHorizontal,
  Library,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserRoles } from "@/hooks/useUserRoles";
import logo from "@/assets/hoogmolen-logo.png";

interface MenuItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
  external?: boolean;
}

const ITEMS: MenuItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Media & Uploads", url: "/admin/media", icon: Images },
  { title: "Fotobibliotheek", url: "/admin/library", icon: Library },
  { title: "Gallery-beheer", url: "/admin/gallery", icon: GalleryHorizontal },
  { title: "Visual Editor", url: "/admin/visual-editor", icon: Eye },
  { title: "Samenstellingen", url: "/admin/compositions", icon: FolderTree },
  { title: "User Management", url: "/admin/users", icon: Users, adminOnly: true },
  { title: "Settings", url: "/admin/settings", icon: SettingsIcon, adminOnly: true },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { isAdmin } = useUserRoles();
  const location = useLocation();
  const navigate = useNavigate();

  const visible = ITEMS.filter((i) => !i.adminOnly || isAdmin);

  return (
    <Sidebar collapsible="icon" className="border-r border-primary-deep/20">
      <SidebarContent className="bg-primary-deep text-secondary">
        {/* Brand header */}
        <div className="px-4 py-5 border-b border-secondary/15 flex items-center gap-3">
          <img
            src={logo}
            alt="Hoogmolen"
            className="h-9 w-9 rounded-full bg-secondary/95 p-1 shrink-0 object-contain"
          />
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display text-base text-secondary leading-tight truncate">
                Hoogmolen
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-accent/70">
                Admin Console
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-accent/60 text-[10px] uppercase tracking-[0.15em] px-3 pt-3">
              Beheer
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {visible.map((item) => {
                const isActive =
                  item.url === "/admin"
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      className={`hover:bg-secondary/10 hover:text-secondary ${
                        isActive
                          ? "bg-secondary text-primary-deep font-semibold hover:bg-secondary hover:text-primary-deep"
                          : "text-accent/85"
                      }`}
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* View live site */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-accent/70 hover:bg-secondary/10 hover:text-secondary">
                  <a href="/" target="_blank" rel="noopener">
                    <Globe className="w-4 h-4" />
                    {!collapsed && <span>Bekijk site</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
