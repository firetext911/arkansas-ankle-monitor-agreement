import React, { useMemo, useState, useEffect, useRef, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogIn, LogOut, User, Settings, FileText, Shield, Users, Download, BarChart3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Import the Agreement form
import Agreement from "@/pages/Agreement";

// --- Supabase client (NO mock data) ---
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*********************************************************
 * Auth + Roles from REAL Supabase
 *********************************************************/
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
      setLoading(false);
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProfile = async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, phone, role")
      .eq("id", uid)
      .maybeSingle();
    if (!error) setProfile(data);
  };

  const loginWithEmailLink = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) throw error;
  };

  const loginWithPassword = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const value = { user, profile, loading, loginWithEmailLink, loginWithPassword, logout, reloadProfile: () => user && loadProfile(user.id) };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function currency(n) { return (n ?? 0).toLocaleString(undefined, { style: "currency", currency: "USD" }); }

/*********************************************************
 * Navbar + Login
 *********************************************************/
function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <div className="sticky top-0 z-40 border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/AAMlogo.png" alt="Arkansas Ankle Monitor" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className={`text-sm px-3 py-2 rounded-xl ${location.pathname === "/" ? "bg-black text-white" : "hover:bg-black/5"}`}>Form</Link>
          {user && (
            <>
              <Link to="/dashboard" className={`text-sm px-3 py-2 rounded-xl ${location.pathname === "/dashboard" ? "bg-black text-white" : "hover:bg-black/5"}`}>Dashboard</Link>
              <Link to="/submissions" className={`text-sm px-3 py-2 rounded-xl ${location.pathname.startsWith("/submissions") ? "bg-black text-white" : "hover:bg-black/5"}`}>Submissions</Link>
              <Link to="/admin" className={`text-sm px-3 py-2 rounded-xl ${location.pathname.startsWith("/admin") ? "bg-black text-white" : "hover:bg-black/5"}`}>Admin</Link>
            </>
          )}
          <AuthTray />
        </div>
      </div>
    </div>
  );
}

function AuthTray() {
  const { user, profile, logout } = useAuth();
  return (
    <div className="ml-2">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-xl"><User className="h-4 w-4 mr-2" />{profile?.name || user.email}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuLabel className="text-xs">Signed in as</DropdownMenuLabel>
            <div className="px-3 pb-2 text-sm">{user.email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile"><Settings className="mr-2 h-4 w-4"/>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4"/>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LoginDialog />
      )}
    </div>
  );
}

function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("magic");
  const [submitting, setSubmitting] = useState(false);
  const { loginWithEmailLink, loginWithPassword } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "magic") {
        await loginWithEmailLink(email.trim());
        alert("Check your email for the sign‑in link.");
      } else {
        await loginWithPassword(email.trim(), password);
      }
      setOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl"><LogIn className="h-4 w-4 mr-2"/>Login</Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>Sign in to view submissions and admin tools.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@company.com" className="rounded-xl"/>
          </div>
          {mode === "password" && (
            <div className="space-y-2">
              <Label>Password</Label>
              <Input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="rounded-xl"/>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <button type="button" onClick={()=>setMode(mode==="magic"?"password":"magic")} className="underline">
              Use {mode==="magic"?"password":"magic link"} instead
            </button>
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-xl w-full" disabled={submitting}>{submitting?"Working…":"Continue"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/*********************************************************
 * Route Guard
 *********************************************************/
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace/>;
  return children;
}

function LoginPage() {
  return (
    <div className="mx-auto max-w-md p-6">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>Log in to view submissions and dashboards.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginDialog />
        </CardContent>
      </Card>
    </div>
  );
}

/*********************************************************
 * Dashboard – REAL data from Supabase
 *********************************************************/
function Dashboard() {
  const [totals, setTotals] = useState({ totalSubs: 0, install: 0, other: 0, grand: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: subCount }, installSum, otherSum] = await Promise.all([
        supabase.from("submissions").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("kind", "install"),
        supabase.from("payments").select("amount").eq("kind", "other"),
      ]);
      const install = (installSum.data || []).reduce((s, r) => s + Number(r.amount || 0), 0);
      const other = (otherSum.data || []).reduce((s, r) => s + Number(r.amount || 0), 0);
      setTotals({ totalSubs: subCount ?? 0, install, other, grand: install + other });
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total submissions" value={totals.totalSubs} icon={<FileText className="h-4 w-4"/>} />
        <StatCard title="Install fees" value={currency(totals.install)} icon={<Shield className="h-4 w-4"/>} />
        <StatCard title="Other payments" value={currency(totals.other)} icon={<BarChart3 className="h-4 w-4"/>} />
        <StatCard title="Total income" value={currency(totals.grand)} icon={<BarChart3 className="h-4 w-4"/>} />
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Recent submissions</CardTitle>
          <CardDescription>Click a card to view full submission and export PDF.</CardDescription>
        </CardHeader>
        <CardContent>
          <SubmissionList limit={8} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="text-xl font-semibold mt-1">{value}</div>
          </div>
          <div className="p-2 rounded-xl bg-black/5">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/*********************************************************
 * Submissions – REAL data
 *********************************************************/
function SubmissionsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("id, created_at, name, phone, court, device_number, status, install_fee, other_payments")
        .order("created_at", { ascending: false });
      if (!error) setItems(data);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const txt = `${s.name ?? ""} ${s.phone ?? ""} ${s.court ?? ""} ${s.device_number ?? ""}`.toLowerCase();
      const hits = !q || txt.includes(q.toLowerCase());
      const ok = status === "all" || s.status === status;
      return hits && ok;
    });
  }, [items, q, status]);

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Input className="rounded-xl pl-9" placeholder="Search name, phone, court, device…" value={q} onChange={(e)=>setQ(e.target.value)} />
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Tabs value={status} onValueChange={setStatus} className="w-full md:w-auto">
            <TabsList className="rounded-2xl">
              <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
              <TabsTrigger value="new" className="rounded-xl">New</TabsTrigger>
              <TabsTrigger value="review" className="rounded-xl">Review</TabsTrigger>
              <TabsTrigger value="approved" className="rounded-xl">Approved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <SubmissionList items={filtered} />
    </div>
  );
}

function SubmissionList({ items = [], limit }) {
  const list = items.slice(0, limit || 999);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {list.map((s) => <SubmissionCard key={s.id} item={s} />)}
    </div>
  );
}

function SubmissionCard({ item }) {
  const navigate = useNavigate();
  return (
    <motion.div layout initial={{opacity:0, y:6}} animate={{opacity:1,y:0}}>
      <Card onClick={()=>navigate(`/submissions/${item.id}`)} className="rounded-3xl cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{item.name}</div>
            <Badge variant={ item.status === "approved" ? "default" : "secondary" } className="rounded-xl capitalize">{item.status}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleString()}</div>
          <div className="text-sm">Device: <span className="font-mono">{item.device_number}</span></div>
          <div className="text-sm">Court: {item.court}</div>
          <div className="text-sm">Install Fee: <span className="font-semibold">{currency(item.install_fee)}</span></div>
          <div className="text-sm">Other Payments: <span className="font-semibold">{currency(item.other_payments)}</span></div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/*********************************************************
 * Submission detail + PDF export (REAL fetch)
 *********************************************************/
function SubmissionDetail({ id }) {
  const [item, setItem] = useState(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("id, created_at, name, phone, email, dob, address, court, device_number, status, install_fee, other_payments, conditions")
        .eq("id", id)
        .maybeSingle();
      if (!error) setItem(data);
    };
    load();
  }, [id]);

  const exportPDF = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const node = pdfRef.current;
    const canvas = await html2canvas(node, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 64;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 32, 32, imgWidth, imgHeight);
    pdf.save(`submission-${id}.pdf`);
  };

  if (!item) return <div className="p-4">Loading…</div>;
  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Submission #{id}</h1>
        <div className="flex items-center gap-2">
          <Button onClick={exportPDF} className="rounded-xl"><Download className="h-4 w-4 mr-2"/>Download PDF</Button>
        </div>
      </div>

      <Card ref={pdfRef} className="rounded-3xl">
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>Submitted {new Date(item.created_at).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Status" value={<Badge className="rounded-xl capitalize">{item.status}</Badge>} />
          <Row label="Phone" value={item.phone} />
          <Row label="Email" value={item.email} />
          <Row label="DOB" value={item.dob} />
          <Row label="Address" value={item.address} />
          <Row label="Court" value={item.court} />
          <Row label="Device Number" value={<span className="font-mono">{item.device_number}</span>} />
          <Row label="Install Fee" value={currency(item.install_fee)} />
          <Row label="Other Payments" value={currency(item.other_payments)} />
          <Row label="Conditions" value={item.conditions} />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2">{value}</div>
    </div>
  );
}

/*********************************************************
 * Admin – REAL profiles (superadmin only); user creation via server endpoint
 *********************************************************/
function AdminPage() {
  const { profile } = useAuth();
  const isSuper = profile?.role === "superadmin";
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isSuper) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, phone, role")
        .order("role")
        .order("name");
      if (!error) setUsers(data);
    };
    load();
  }, [isSuper]);

  if (!isSuper) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Restricted</CardTitle>
            <CardDescription>You need superadmin permissions to access Admin.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const onChangeRole = async (id, role) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (!error) setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
  };

  const createUser = async (payload) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Not authenticated");
      return;
    }

    const res = await fetch(`${supabaseUrl}/functions/v1/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const error = await res.json();
      alert(`Create user failed: ${error.error || 'Unknown error'}`);
      return;
    }
    
    const { profile } = await res.json();
    setUsers((u) => [profile, ...u]);
  };

  const deleteUser = async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Not authenticated");
      return;
    }

    const res = await fetch(`${supabaseUrl}/functions/v1/delete-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ id })
    });
    
    if (!res.ok) {
      const error = await res.json();
      alert(`Delete user failed: ${error.error || 'Unknown error'}`);
      return;
    }
    
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="users" className="rounded-xl"><Users className="h-4 w-4 mr-2"/>Users</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-3">
          <UserTable users={users} onCreate={createUser} onDelete={deleteUser} onChangeRole={onChangeRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserTable({ users, onCreate, onDelete, onChangeRole }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Total: {users.length}</div>
        <Button onClick={()=>setOpen(true)} className="rounded-xl"><Plus className="h-4 w-4 mr-2"/>Invite user</Button>
      </div>

      <div className="rounded-2xl border">
        <div className="grid grid-cols-12 px-4 py-2 text-xs text-muted-foreground">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {users.map(u => (
          <div key={u.id} className="grid grid-cols-12 px-4 py-3 border-t items-center">
            <div className="col-span-3 font-medium">{u.name}</div>
            <div className="col-span-3 text-sm">{u.email}</div>
            <div className="col-span-2 text-sm">{u.phone}</div>
            <div className="col-span-2">
              <select className="rounded-xl border px-2 py-1 text-sm" value={u.role} onChange={(e)=>onChangeRole(u.id, e.target.value)}>
                <option value="user">user</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <Button variant="destructive" className="rounded-xl" onClick={()=>onDelete(u.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
            <DialogDescription>Creates the auth user server‑side and sends an invite email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} className="rounded-xl"/>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="rounded-xl"/>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e)=>setPhone(e.target.value)} className="rounded-xl"/>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select value={role} onChange={(e)=>setRole(e.target.value)} className="rounded-xl border px-3 py-2 w-full">
                <option value="user">User</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <div className="pt-2 flex gap-2 justify-end">
              <Button variant="outline" className="rounded-xl" onClick={()=>setOpen(false)}>Cancel</Button>
              <Button className="rounded-xl" onClick={()=>{ onCreate({ name, email, phone, role }); setOpen(false); setName(""); setEmail(""); setPhone(""); setRole("user"); }}>Send invite</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/*********************************************************
 * Profile – update own profile (REAL)
 *********************************************************/
function ProfilePage() {
  const { user, profile, reloadProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || user?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.name || "");
    setEmail(profile?.email || user?.email || "");
    setPhone(profile?.phone || "");
  }, [profile, user]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, name, email, phone, role: profile?.role || "user" });
    if (error) alert(error.message);
    await reloadProfile();
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Update your display name and contact info.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} className="rounded-xl"/>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="rounded-xl"/>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="(xxx) xxx-xxxx" className="rounded-xl"/>
          </div>
          <div className="pt-2">
            <Button disabled={saving} onClick={save} className="rounded-xl w-full">{saving?"Saving…":"Save changes"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/*********************************************************
 * Router
 *********************************************************/
function SubmissionDetailRoute() {
  const { pathname } = useLocation();
  const id = pathname.split("/").pop();
  return <SubmissionDetail id={id} />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Agreement />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
      <Route path="/submissions" element={<RequireAuth><SubmissionsPage/></RequireAuth>} />
      <Route path="/submissions/:id" element={<RequireAuth><SubmissionDetailRoute/></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth><AdminPage/></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage/></RequireAuth>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-neutral-50">
          <Navbar />
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
