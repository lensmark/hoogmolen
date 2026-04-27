/**
 * AdminUsers — beheer admins en editors.
 * - Lijst alle gebruikers met rol uit user_roles (gejoined met profiles).
 * - Admin kan rol toekennen/intrekken.
 * - Nieuwe admin/editor uitnodigen via signUp + auto-rol toekennen.
 *
 * Note: Supabase staat geen client-side admin.listUsers toe; we lijsten op
 * basis van user_roles + profiles, dat dekt iedereen met een toegekende rol
 * of een aangemaakt profiel.
 */
import { useEffect, useState, useCallback } from "react";
import { UserPlus, ShieldCheck, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles, type AppRole } from "@/hooks/useUserRoles";
import { toast } from "@/hooks/use-toast";

interface UserRow {
  user_id: string;
  display_name: string | null;
  roles: AppRole[];
  created_at: string | null;
}

const AdminUsers = () => {
  const { userId: currentUserId } = useUserRoles();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, created_at"),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    const profiles = (profilesRes.data ?? []) as {
      user_id: string;
      display_name: string | null;
      created_at: string;
    }[];
    const roles = (rolesRes.data ?? []) as { user_id: string; role: AppRole }[];

    const map = new Map<string, UserRow>();
    profiles.forEach((p) => {
      map.set(p.user_id, {
        user_id: p.user_id,
        display_name: p.display_name,
        roles: [],
        created_at: p.created_at,
      });
    });
    roles.forEach((r) => {
      const existing = map.get(r.user_id);
      if (existing) {
        existing.roles.push(r.role);
      } else {
        map.set(r.user_id, {
          user_id: r.user_id,
          display_name: null,
          roles: [r.role],
          created_at: null,
        });
      }
    });

    setRows(Array.from(map.values()));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRole = async (userId: string, role: AppRole, hasIt: boolean) => {
    if (hasIt) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) {
        toast({ title: "Kon rol niet verwijderen", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: `Rol '${role}' verwijderd` });
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) {
        toast({ title: "Kon rol niet toekennen", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: `Rol '${role}' toegekend` });
    }
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-delete-user", {
        body: { user_id: deleteTarget.user_id },
      });
      if (error) throw error;
      if (data && data.ok === false) throw new Error(data.error ?? "Verwijderen mislukt");
      toast({ title: "Gebruiker verwijderd", description: deleteTarget.display_name ?? deleteTarget.user_id });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: "Verwijderen mislukt",
        description: err instanceof Error ? err.message : "Onbekende fout",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-primary-deep">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer admins en editors. Admins hebben volledige toegang; editors mogen enkel media en
            de visual editor gebruiken.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Nieuwe gebruiker
        </Button>
      </header>

      <div className="bg-card border border-border rounded-md shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Nog geen gebruikers. Voeg er een toe via "Nieuwe gebruiker".
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam / e-mail</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Editor</TableHead>
                <TableHead>Aangemaakt</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const isAdmin = r.roles.includes("admin");
                const isEditor = r.roles.includes("editor");
                const isSelf = r.user_id === currentUserId;
                return (
                  <TableRow key={r.user_id}>
                    <TableCell className="font-medium text-primary-deep">
                      {r.display_name ?? <span className="text-muted-foreground italic">(geen naam)</span>}
                      {isSelf && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide bg-accent text-primary-deep px-1.5 py-0.5 rounded">
                          jij
                        </span>
                      )}
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        {r.user_id.slice(0, 8)}…
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleToggle
                        active={isAdmin}
                        disabled={isSelf && isAdmin}
                        onClick={() => toggleRole(r.user_id, "admin", isAdmin)}
                      />
                    </TableCell>
                    <TableCell>
                      <RoleToggle
                        active={isEditor}
                        onClick={() => toggleRole(r.user_id, "editor", isEditor)}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString("nl-BE") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isSelf}
                        onClick={() => setDeleteTarget(r)}
                        title={isSelf ? "Je kunt jezelf niet verwijderen" : "Gebruiker verwijderen"}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onCreated={load} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gebruiker definitief verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt <strong>{deleteTarget?.display_name ?? deleteTarget?.user_id}</strong> volledig te
              verwijderen: account, profiel en toegekende rollen worden gewist. Deze actie kan niet ongedaan
              gemaakt worden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Bezig..." : "Definitief verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const RoleToggle = ({
  active,
  disabled,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-card text-muted-foreground border-border hover:border-primary"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    title={disabled ? "Je kunt je eigen admin-rol niet intrekken" : ""}
  >
    {active ? <ShieldCheck className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
    {active ? "Actief" : "Toekennen"}
  </button>
);

const InviteDialog = ({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<AppRole>("editor");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Land op publieke callback i.p.v. beschermde /admin route.
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
          data: { display_name: displayName || email },
        },
      });
      if (error) throw error;
      if (data.user) {
        const { error: roleErr } = await supabase
          .from("user_roles")
          .insert({ user_id: data.user.id, role });
        if (roleErr) throw roleErr;
      }
      toast({
        title: "Gebruiker aangemaakt",
        description: `Verificatiemail verstuurd naar ${email}. Rol: ${role}.`,
      });
      setEmail("");
      setPassword("");
      setDisplayName("");
      setRole("editor");
      onOpenChange(false);
      onCreated();
    } catch (err) {
      toast({
        title: "Aanmaken mislukt",
        description: err instanceof Error ? err.message : "Onbekende fout",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nieuwe gebruiker uitnodigen</DialogTitle>
          <DialogDescription>
            De gebruiker ontvangt een verificatiemail en moet die bevestigen voor de eerste login.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="invite-name">Volledige naam</Label>
            <Input
              id="invite-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="bv. Jan Janssens"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">E-mailadres</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-pwd">Tijdelijk wachtwoord</Label>
            <Input
              id="invite-pwd"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Minimaal 6 tekens.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="editor">Editor — alleen media + visual editor</SelectItem>
                <SelectItem value="admin">Admin — volledige toegang</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Annuleren
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Bezig..." : "Aanmaken"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUsers;
