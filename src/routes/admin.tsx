import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
const supabase = supabaseTyped as any;
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { termToast as toast } from "@/lib/term-toast";
import { LogOut, Plus, Trash2, Pencil, Loader2, Calendar, LayoutDashboard, GitBranch, DollarSign, TrendingUp, Mail, CalendarClock, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { redirect } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel dos Sócios — Dreamscraft Code" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    try {
      await requireAdmin();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminPage,
});

// ---------- Types ----------
type ProjectStatus = "lead" | "proposta" | "em_andamento" | "pausado" | "concluido" | "cancelado";
type Priority = "baixa" | "media" | "alta" | "urgente";
type TaskStatus = "todo" | "em_andamento" | "em_revisao" | "concluido";

interface Project {
  id: string;
  name: string;
  description: string | null;
  client: string | null;
  status: ProjectStatus;
  priority: Priority;
  owner_id: string | null;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  budget: number | null;
  phase: string | null;
  progress: number;
  version_control: string | null;
  primary_email: string | null;
}

type MeetingStatus = "programada" | "concluida" | "cancelada" | "em_andamento";
type MeetingModality = "presencial" | "online" | "hibrida";
interface Meeting {
  id: string;
  title: string;
  project_id: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  modality: MeetingModality;
  status: MeetingStatus;
  participants: string | null;
  notes: string | null;
  assignments: string | null;
  created_at: string;
}
const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  programada: "Programada", em_andamento: "Em andamento",
  concluida: "Concluída", cancelada: "Cancelada",
};
const MEETING_MODALITY_LABELS: Record<MeetingModality, string> = {
  presencial: "Presencial", online: "Online", hibrida: "Híbrida",
};

interface Task {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
}

interface ProjectNote {
  id: string;
  project_id: string;
  content: string;
  author_id: string | null;
  created_at: string;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  email: string | null;
}

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  lead: "Lead", proposta: "Proposta", em_andamento: "Em andamento",
  pausado: "Pausado", concluido: "Concluído", cancelado: "Cancelado",
};
const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "A fazer", em_andamento: "Em andamento", em_revisao: "Em revisão", concluido: "Concluído",
};
const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: "Baixa", media: "Média", alta: "Alta", urgente: "Urgente",
};
const PRIORITY_VARIANT: Record<Priority, "secondary" | "default" | "destructive"> = {
  baixa: "secondary", media: "secondary", alta: "default", urgente: "destructive",
};

// ---------- Page ----------
function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-md py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Acesso negado</h1>
        <p className="mt-2 text-muted-foreground">
          Sua conta não tem permissão de admin. Fale com Gabrielle ou Evandro.
        </p>
        <Button onClick={() => supabase.auth.signOut()} className="mt-6" variant="outline">
          Sair
        </Button>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Painel dos Sócios</h1>
          <p className="text-sm text-muted-foreground">
            Conectado como <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/">Ver site</Link></Button>
          <Button onClick={() => supabase.auth.signOut()} size="sm" variant="ghost">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="dashboard">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="meetings">Reuniões</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6"><DashboardTab /></TabsContent>
        <TabsContent value="projects" className="mt-6"><ProjectsTab /></TabsContent>
        <TabsContent value="tasks" className="mt-6"><TasksTab /></TabsContent>
        <TabsContent value="meetings" className="mt-6"><MeetingsTab /></TabsContent>
        <TabsContent value="team" className="mt-6"><TeamTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ---------- Dashboard (visão geral) ----------
function DashboardTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, t, m] = await Promise.all([
        supabase.from("projects").select("*").order("progress", { ascending: false }),
        supabase.from("tasks").select("*"),
        supabase.from("meetings").select("*").order("scheduled_at", { ascending: false }).limit(5),
      ]);
      if (p.data) setProjects(p.data as Project[]);
      if (t.data) setTasks(t.data as Task[]);
      if (m.data) setMeetings(m.data as Meeting[]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loader2 className="mx-auto my-12 h-6 w-6 animate-spin text-muted-foreground" />;
  }

  const totalBudget = projects.reduce((s, p) => s + Number(p.budget || 0), 0);
  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length)
    : 0;
  const active = projects.filter((p) => p.status === "em_andamento").length;
  const openTasks = tasks.filter((t) => t.status !== "concluido").length;

  const fmtBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  const statusColor: Record<ProjectStatus, string> = {
    lead: "bg-muted text-muted-foreground",
    proposta: "bg-accent/20 text-accent-foreground",
    em_andamento: "bg-primary/20 text-primary-glow border-primary/40",
    pausado: "bg-brand-amarelo/15 text-brand-amarelo",
    concluido: "bg-brand-amarelo/15 text-brand-amarelo",
    cancelado: "bg-destructive/15 text-destructive",
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={LayoutDashboard} label="Projetos" value={projects.length.toString()} sub={`${active} em andamento`} />
        <KpiCard icon={DollarSign} label="Pipeline total" value={fmtBRL(totalBudget)} sub="Soma de orçamentos" />
        <KpiCard icon={TrendingUp} label="Progresso médio" value={`${avgProgress}%`} sub="Todos os projetos" />
        <KpiCard icon={Target} label="Tarefas abertas" value={openTasks.toString()} sub={`${tasks.length} no total`} />
      </div>

      {/* Project Portfolio */}
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display">Portfólio de Projetos</CardTitle>
              <p className="text-xs text-muted-foreground mt-1 font-mono">// {projects.length} módulos · ordenado por progresso</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nenhum projeto cadastrado.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-xl border border-primary/20 bg-background/40 backdrop-blur p-5 transition hover:border-primary-glow/60 hover:shadow-[0_0_30px_-10px_var(--color-primary)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-semibold truncate text-foreground">{p.name}</h4>
                      {p.client && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.client}</p>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider rounded px-2 py-0.5 border border-transparent ${statusColor[p.status]}`}>
                      {PROJECT_STATUS_LABELS[p.status]}
                    </span>
                  </div>

                  {p.description && (
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                      <span className="text-muted-foreground">progress</span>
                      <span className="text-primary-glow font-semibold">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1.5" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                    <DetailRow icon={Target} label="Fase" value={p.phase || "—"} />
                    <DetailRow icon={DollarSign} label="Budget" value={p.budget != null ? fmtBRL(Number(p.budget)) : "—"} />
                    <DetailRow icon={GitBranch} label="Repo" value={p.version_control || "—"} mono />
                    <DetailRow icon={CalendarClock} label="Prazo" value={p.due_date ? new Date(p.due_date).toLocaleDateString("pt-BR") : "—"} />
                    {p.primary_email && (
                      <DetailRow icon={Mail} label="E-mail" value={p.primary_email} className="col-span-2" />
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                    <Badge variant={PRIORITY_VARIANT[p.priority]} className="text-[9px]">
                      {PRIORITY_LABELS[p.priority]}
                    </Badge>
                    <span className="text-muted-foreground/60">
                      {tasks.filter((t) => t.project_id === p.id).length} tarefas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent meetings */}
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <CardTitle className="font-display">Reuniões recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma reunião registrada.</p>
          ) : (
            <div className="space-y-2">
              {meetings.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {new Date(m.scheduled_at).toLocaleString("pt-BR")} · {MEETING_MODALITY_LABELS[m.modality]}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{MEETING_STATUS_LABELS[m.status]}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold font-display text-soft-glow">{value}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary-glow" />
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon, label, value, mono, className = "",
}: { icon: any; label: string; value: string; mono?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 min-w-0 ${className}`}>
      <Icon className="h-3 w-3 text-muted-foreground/60 shrink-0" />
      <span className="text-muted-foreground/70 shrink-0">{label}:</span>
      <span className={`truncate text-foreground/90 ${mono ? "font-mono text-[10px]" : ""}`}>{value}</span>
    </div>
  );
}

// ---------- Projects ----------
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, pr] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, display_name, email"),
    ]);
    if (p.data) setProjects(p.data as Project[]);
    if (pr.data) setProfiles(pr.data as Profile[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const profileName = (id: string | null) => {
    if (!id) return "—";
    const p = profiles.find((x) => x.user_id === id);
    return p?.display_name || p?.email || "—";
  };

  async function handleDelete(id: string) {
    if (!confirm("Excluir este projeto e suas tarefas/notas?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Projeto excluído");
    load();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projetos ({projects.length})</CardTitle>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Novo projeto</Button>
          </DialogTrigger>
          <ProjectFormDialog
            project={editing}
            profiles={profiles}
            onSaved={() => { setOpen(false); setEditing(null); load(); }}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="mx-auto my-8 h-5 w-5 animate-spin text-muted-foreground" />
        ) : projects.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum projeto cadastrado ainda. Clique em "Novo projeto" para começar.
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{p.name}</h3>
                    <Badge variant="outline">{PROJECT_STATUS_LABELS[p.status]}</Badge>
                    <Badge variant={PRIORITY_VARIANT[p.priority]}>{PRIORITY_LABELS[p.priority]}</Badge>
                  </div>
                  {p.client && <p className="mt-0.5 text-xs text-muted-foreground">Cliente: {p.client}</p>}
                  {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>Responsável: {profileName(p.owner_id)}</span>
                    {p.phase && <span>· Fase: <span className="text-primary-glow">{p.phase}</span></span>}
                    {p.budget != null && <span>· Orçamento: R$ {Number(p.budget).toLocaleString("pt-BR")}</span>}
                    {p.due_date && <span>· Prazo: {new Date(p.due_date).toLocaleDateString("pt-BR")}</span>}
                    {p.primary_email && <span>· {p.primary_email}</span>}
                    {p.version_control && <span>· {p.version_control}</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{p.progress}%</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <ProjectFormDialog project={p} profiles={profiles} onSaved={() => load()} />
                  </Dialog>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProjectFormDialog({
  project, profiles, onSaved,
}: { project: Project | null; profiles: Profile[]; onSaved: () => void }) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "lead");
  const [priority, setPriority] = useState<Priority>(project?.priority ?? "media");
  const [ownerId, setOwnerId] = useState<string>(project?.owner_id ?? "none");
  const [dueDate, setDueDate] = useState(project?.due_date ?? "");
  const [budget, setBudget] = useState<string>(project?.budget != null ? String(project.budget) : "");
  const [phase, setPhase] = useState(project?.phase ?? "");
  const [progress, setProgress] = useState<number>(project?.progress ?? 0);
  const [versionControl, setVersionControl] = useState(project?.version_control ?? "");
  const [primaryEmail, setPrimaryEmail] = useState(project?.primary_email ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Nome obrigatório"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      client: client.trim() || null,
      status, priority,
      owner_id: ownerId === "none" ? null : ownerId,
      due_date: dueDate || null,
      budget: budget.trim() ? Number(budget) : null,
      phase: phase.trim() || null,
      progress: Math.max(0, Math.min(100, Number(progress) || 0)),
      version_control: versionControl.trim() || null,
      primary_email: primaryEmail.trim() || null,
      created_by: user?.id ?? null,
    };
    const { error } = project
      ? await supabase.from("projects").update(payload).eq("id", project.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(project ? "Projeto atualizado" : "Projeto criado");
    onSaved();
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{project ? "Editar projeto" : "Novo projeto"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Nome *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Cliente</Label>
          <Input value={client} onChange={(e) => setClient(e.target.value)} />
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Responsável</Label>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.user_id} value={p.user_id}>
                    {p.display_name || p.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prazo</Label>
            <Input type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fase</Label>
            <Input value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="Fase 0, Descoberta, MVP…" />
          </div>
          <div>
            <Label>Orçamento (R$)</Label>
            <Input type="number" min="0" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
          <div>
            <Label>E-mail principal</Label>
            <Input type="email" value={primaryEmail} onChange={(e) => setPrimaryEmail(e.target.value)} />
          </div>
          <div>
            <Label>Controle de versão</Label>
            <Input value={versionControl} onChange={(e) => setVersionControl(e.target.value)} placeholder="github.com/org/repo" />
          </div>
        </div>
        <div>
          <Label>Progresso: {progress}%</Label>
          <Input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// ---------- Tasks ----------
function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [t, p, pr] = await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("name"),
      supabase.from("profiles").select("user_id, display_name, email"),
    ]);
    if (t.data) setTasks(t.data as Task[]);
    if (p.data) setProjects(p.data as Project[]);
    if (pr.data) setProfiles(pr.data as Profile[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const projectName = (id: string | null) =>
    id ? projects.find((p) => p.id === id)?.name ?? "—" : "—";
  const profileName = (id: string | null) => {
    if (!id) return "—";
    const p = profiles.find((x) => x.user_id === id);
    return p?.display_name || p?.email || "—";
  };

  async function updateStatus(task: Task, status: TaskStatus) {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", task.id);
    if (error) toast.error(error.message); else load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir tarefa?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tarefa excluída");
    load();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tarefas ({tasks.length})</CardTitle>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Nova tarefa</Button>
          </DialogTrigger>
          <TaskFormDialog
            task={editing} projects={projects} profiles={profiles}
            onSaved={() => { setOpen(false); setEditing(null); load(); }}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="mx-auto my-8 h-5 w-5 animate-spin text-muted-foreground" />
        ) : tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma tarefa.</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-medium ${t.status === "concluido" ? "line-through text-muted-foreground" : ""}`}>
                      {t.title}
                    </span>
                    <Badge variant={PRIORITY_VARIANT[t.priority]}>{PRIORITY_LABELS[t.priority]}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Projeto: {projectName(t.project_id)} · Responsável: {profileName(t.assignee_id)}
                    {t.due_date && ` · Prazo: ${new Date(t.due_date).toLocaleDateString("pt-BR")}`}
                  </p>
                  {t.description && <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Select value={t.status} onValueChange={(v) => updateStatus(t, v as TaskStatus)}>
                    <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(t)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <TaskFormDialog task={t} projects={projects} profiles={profiles} onSaved={() => load()} />
                  </Dialog>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TaskFormDialog({
  task, projects, profiles, onSaved,
}: { task: Task | null; projects: Project[]; profiles: Profile[]; onSaved: () => void }) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [projectId, setProjectId] = useState(task?.project_id ?? "none");
  const [assigneeId, setAssigneeId] = useState(task?.assignee_id ?? "none");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "media");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Título obrigatório"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      project_id: projectId === "none" ? null : projectId,
      assignee_id: assigneeId === "none" ? null : assigneeId,
      status, priority,
      due_date: dueDate || null,
      created_by: user?.id ?? null,
    };
    const { error } = task
      ? await supabase.from("tasks").update(payload).eq("id", task.id)
      : await supabase.from("tasks").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(task ? "Tarefa atualizada" : "Tarefa criada");
    onSaved();
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{task ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Título *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Projeto</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Responsável</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.user_id} value={p.user_id}>
                    {p.display_name || p.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prazo</Label>
            <Input type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {task ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// ---------- Team ----------
function TeamTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("user_id, display_name, email").then(({ data }: { data: any }) => {
      if (data) setProfiles(data as Profile[]);
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Equipe ({profiles.length})</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="mx-auto my-8 h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p) => (
              <div key={p.user_id} className="rounded-lg border border-border p-4">
                <p className="font-semibold">{p.display_name || "—"}</p>
                <p className="text-sm text-muted-foreground">{p.email}</p>
              </div>
            ))}
            {profiles.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                Nenhum membro ainda. Os 3 sócios aparecerão aqui quando criarem conta em /login.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- Meetings ----------
function MeetingsTab() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [m, p] = await Promise.all([
      supabase.from("meetings").select("*").order("scheduled_at", { ascending: false }),
      supabase.from("projects").select("*").order("name"),
    ]);
    if (m.data) setMeetings(m.data as Meeting[]);
    if (p.data) setProjects(p.data as Project[]);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const projectName = (id: string | null) =>
    id ? projects.find((p) => p.id === id)?.name ?? "—" : "—";

  async function handleDelete(id: string) {
    if (!confirm("Excluir reunião?")) return;
    const { error } = await supabase.from("meetings").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Reunião excluída"); load();
  }

  const statusVariant: Record<MeetingStatus, "default" | "secondary" | "outline" | "destructive"> = {
    programada: "outline", em_andamento: "default", concluida: "secondary", cancelada: "destructive",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reuniões ({meetings.length})</CardTitle>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Nova reunião</Button>
          </DialogTrigger>
          <MeetingFormDialog meeting={editing} projects={projects}
            onSaved={() => { setOpen(false); setEditing(null); load(); }} />
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="mx-auto my-8 h-5 w-5 animate-spin text-muted-foreground" />
        ) : meetings.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma reunião registrada. Documente alinhamentos, retros e calls aqui.
          </p>
        ) : (
          <div className="space-y-3">
            {meetings.map((m) => (
              <div key={m.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary-glow" />
                      <h3 className="font-semibold">{m.title}</h3>
                      <Badge variant={statusVariant[m.status]}>{MEETING_STATUS_LABELS[m.status]}</Badge>
                      <Badge variant="outline">{MEETING_MODALITY_LABELS[m.modality]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(m.scheduled_at).toLocaleString("pt-BR")}
                      {m.duration_minutes ? ` · ${m.duration_minutes} min` : ""}
                      {` · Projeto: ${projectName(m.project_id)}`}
                    </p>
                    {m.participants && <p className="mt-1 text-xs text-muted-foreground">Participantes: {m.participants}</p>}
                    {m.notes && <p className="mt-2 text-sm whitespace-pre-wrap">{m.notes}</p>}
                    {m.assignments && (
                      <div className="mt-2 rounded-md border border-primary/30 bg-primary/5 p-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-primary-glow">Atribuições</span>
                        <p className="mt-1 whitespace-pre-wrap">{m.assignments}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => setEditing(m)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <MeetingFormDialog meeting={m} projects={projects} onSaved={() => load()} />
                    </Dialog>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MeetingFormDialog({
  meeting, projects, onSaved,
}: { meeting: Meeting | null; projects: Project[]; onSaved: () => void }) {
  const [title, setTitle] = useState(meeting?.title ?? "");
  const [projectId, setProjectId] = useState(meeting?.project_id ?? "none");
  const [scheduledAt, setScheduledAt] = useState(
    meeting?.scheduled_at ? new Date(meeting.scheduled_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
  );
  const [duration, setDuration] = useState<string>(meeting?.duration_minutes ? String(meeting.duration_minutes) : "");
  const [modality, setModality] = useState<MeetingModality>(meeting?.modality ?? "presencial");
  const [status, setStatus] = useState<MeetingStatus>(meeting?.status ?? "programada");
  const [participants, setParticipants] = useState(meeting?.participants ?? "");
  const [notes, setNotes] = useState(meeting?.notes ?? "");
  const [assignments, setAssignments] = useState(meeting?.assignments ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Título obrigatório"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      title: title.trim(),
      project_id: projectId === "none" ? null : projectId,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: duration.trim() ? Number(duration) : null,
      modality, status,
      participants: participants.trim() || null,
      notes: notes.trim() || null,
      assignments: assignments.trim() || null,
      created_by: user?.id ?? null,
    };
    const { error } = meeting
      ? await supabase.from("meetings").update(payload).eq("id", meeting.id)
      : await supabase.from("meetings").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(meeting ? "Reunião atualizada" : "Reunião registrada");
    onSaved();
  }

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader><DialogTitle>{meeting ? "Editar reunião" : "Nova reunião"}</DialogTitle></DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Título *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Projeto</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {projects.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Data e hora</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
          <div>
            <Label>Duração (min)</Label>
            <Input type="number" min="0" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <div>
            <Label>Modalidade</Label>
            <Select value={modality} onValueChange={(v) => setModality(v as MeetingModality)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(MEETING_MODALITY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as MeetingStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(MEETING_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Participantes</Label>
          <Input value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="Gabrielle, Evandro…" />
        </div>
        <div>
          <Label>Notas da reunião</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </div>
        <div>
          <Label>Atribuições gerais</Label>
          <Textarea value={assignments} onChange={(e) => setAssignments(e.target.value)} rows={3}
            placeholder="CNPJ, Documentos, Financeiro, LGPD…" />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {meeting ? "Salvar" : "Registrar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
