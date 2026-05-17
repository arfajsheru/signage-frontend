"use client"

import { useState, useCallback } from "react"
import { Plus, Search, Trash2, Eye, Pencil, X, RefreshCw, MapPin, Calendar, Clock, Hash, User, Phone, Mail, Sparkles, ArrowLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

import ButtonShineHover from "@/components/shadcn-studio/button/button-41"
import { CreateProjectModal } from "@/components/production/create-project-modal"
import { DataTable, ColumnDef } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetProjects, useDeleteProject } from "@/hooks/use-project"
import { Project, GetProjectsParams } from "@/types/project.types"
import { cn } from "@/lib/utils"

// ── Status & Priority Config ──────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  CREATED:     { label: "Created",     className: "bg-blue-500/10 text-blue-600 border-blue-300/30" },
  ACTIVE:      { label: "Active",      className: "bg-emerald-500/10 text-emerald-600 border-emerald-300/30" },
  IN_PROGRESS: { label: "In Progress", className: "bg-amber-500/10 text-amber-600 border-amber-300/30" },
  COMPLETED:   { label: "Completed",   className: "bg-primary/10 text-primary border-primary/20" },
  CANCELLED:   { label: "Cancelled",   className: "bg-destructive/10 text-destructive border-destructive/20" },
  ON_HOLD:     { label: "On Hold",     className: "bg-orange-500/10 text-orange-600 border-orange-300/30" },
}

const PRIORITY_MAP: Record<string, { label: string; className: string }> = {
  LOW:    { label: "Low",    className: "bg-slate-500/10 text-slate-500 border-slate-300/30" },
  MEDIUM: { label: "Medium", className: "bg-amber-500/10 text-amber-600 border-amber-300/30" },
  HIGH:   { label: "High",   className: "bg-rose-500/10 text-rose-600 border-rose-300/30" },
  URGENT: { label: "Urgent", className: "bg-red-600/10 text-red-700 border-red-300/30" },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? { label: status, className: "" }
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", cfg.className)}>
      {cfg.label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_MAP[priority] ?? { label: priority, className: "" }
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", cfg.className)}>
      {cfg.label}
    </span>
  )
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

// ── Column Definitions ────────────────────────────────────────────────────────

const columns: ColumnDef<Project>[] = [
  {
    key: "project_code",
    header: "Code",
    sortable: true,
    accessorFn: (row) => (
      <span className="font-mono text-[12px] font-semibold text-primary tracking-wide">{row.project_code}</span>
    ),
  },
  {
    key: "name",
    header: "Project",
    sortable: true,
    accessorFn: (row) => (
      <div className="max-w-[200px]">
        <p className="font-medium text-foreground truncate">{row.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{row.client_name}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    accessorFn: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    accessorFn: (row) => <PriorityBadge priority={row.priority} />,
  },
  {
    key: "site_map_link",
    header: "Map",
    accessorFn: (row) => {
      if (!row.site_map_link) return <span className="text-muted-foreground text-xs">—</span>
      return (
        <a
          href={row.site_map_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-md border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-150 shadow-sm"
        >
          <MapPin className="h-3 w-3" />
          Open Map
        </a>
      )
    },
  },
  {
    key: "deadline",
    header: "Deadline",
    sortable: true,
    accessorFn: (row) => {
      const isPast = row.deadline && new Date(row.deadline) < new Date() && row.status !== "COMPLETED"
      return (
        <span className={cn("text-sm", isPast ? "text-destructive font-medium" : "text-foreground")}>
          {formatDate(row.deadline)}
        </span>
      )
    },
  },
  {
    key: "total_amount",
    header: "Amount",
    sortable: true,
    accessorFn: (row) => (
      <div>
        <p className="text-sm font-semibold text-foreground">{formatAmount(row.total_amount)}</p>
        <p className="text-[11px] text-muted-foreground">Adv: {formatAmount(row.advance_paid)}</p>
      </div>
    ),
  },
  {
    key: "project_source",
    header: "Source",
    accessorFn: (row) => (
      <span className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        row.project_source === "DIRECT"
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-violet-500/10 text-violet-600 border-violet-300/30"
      )}>
        {row.project_source === "DIRECT" ? "Direct" : "Channel"}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    sortable: true,
    accessorFn: (row) => <span className="text-xs text-muted-foreground">{formatDate(row.created_at)}</span>,
  },
]

// ── Filter Bar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  search: string; onSearchChange: (v: string) => void
  status: string; onStatusChange: (v: string) => void
  priority: string; onPriorityChange: (v: string) => void
  source: string; onSourceChange: (v: string) => void
  onReset: () => void; activeFilterCount: number
}

function FilterBar({ search, onSearchChange, status, onStatusChange, priority, onPriorityChange, source, onSourceChange, onReset, activeFilterCount }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input placeholder="Search projects, clients..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-8 h-9 text-sm border-border/60 bg-background" />
        {search && (
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => onSearchChange("")}>
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className={cn("h-9 w-[145px] text-sm border-border/60 bg-background", status && status !== "all" && "border-primary/50 text-primary")}>
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className={cn("h-9 w-[145px] text-sm border-border/60 bg-background", priority && priority !== "all" && "border-primary/50 text-primary")}>
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {Object.entries(PRIORITY_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={source} onValueChange={onSourceChange}>
        <SelectTrigger className={cn("h-9 w-[130px] text-sm border-border/60 bg-background", source && source !== "all" && "border-primary/50 text-primary")}>
          <SelectValue placeholder="All Sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="DIRECT">Direct</SelectItem>
          <SelectItem value="CHANNEL_PARTNER">Channel Partner</SelectItem>
        </SelectContent>
      </Select>
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground hover:text-foreground border border-border/60" onClick={onReset}>
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
          <Badge variant="secondary" className="ml-0.5 h-4 min-w-[16px] rounded-full px-1 text-[10px]">{activeFilterCount}</Badge>
        </Button>
      )}
    </div>
  )
}

// ── Action Buttons ────────────────────────────────────────────────────────────

function ActionButtons({ project, onView, onEdit, onDelete }: { project: Project; onView: (p: Project) => void; onEdit: (p: Project) => void; onDelete: (p: Project) => void }) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary" onClick={() => onView(project)} title="View Project">
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-amber-500/10 hover:text-amber-600" onClick={() => onEdit(project)} title="Edit Project">
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(project)} title="Delete Project">
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

// ── Project Detail Full Page ───────────────────────────────────────────────────

function ProjectDetailView({ project, onBack }: { project: Project; onBack: () => void }) {
  const statusCfg = STATUS_MAP[project.status] ?? { label: project.status, className: "" }
  const priorityCfg = PRIORITY_MAP[project.priority] ?? { label: project.priority, className: "" }

  const infoCards = [
    { icon: User,     label: "Client",   value: project.client_name },
    { icon: Phone,    label: "Phone",    value: project.client_phone || "—" },
    { icon: Mail,     label: "Email",    value: project.client_email || "—" },
    { icon: Calendar, label: "Deadline", value: formatDate(project.deadline) },
    { icon: Hash,     label: "Amount",   value: formatAmount(project.total_amount) },
    { icon: Clock,    label: "Advance",  value: formatAmount(project.advance_paid) },
  ]

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 ease-out space-y-0">
      {/* Back Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>All Projects</span>
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
        <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{project.name}</span>
      </div>

      {/* Project Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm mb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded px-2 py-0.5">
                  {project.project_code}
                </span>
                <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", statusCfg.className)}>
                  {statusCfg.label}
                </span>
                <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", priorityCfg.className)}>
                  {priorityCfg.label}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground leading-tight">{project.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{project.client_name}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Amount</p>
              <p className="text-xl font-bold text-foreground">{formatAmount(project.total_amount)}</p>
              <p className="text-xs text-muted-foreground">Adv: {formatAmount(project.advance_paid)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {infoCards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border/60 bg-card px-4 py-3.5 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
              <p className="text-sm font-semibold text-foreground truncate mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Site Map */}
      {project.site_map_link && (
        <div className="mb-5">
          <a
            href={project.site_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 shadow-sm"
          >
            <MapPin className="h-4 w-4" />
            Open Site Location on Map
          </a>
        </div>
      )}

      {/* Coming Soon Section */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="relative mb-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
              <Sparkles className="h-9 w-9 text-primary/60" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary/30 animate-ping" />
            <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary/50" />
          </div>
          <p className="text-base font-bold text-foreground">Project Details — Coming Soon</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-sm">
            Full production tracking, stage timelines, documents, team assignments, and financials will be available here soon.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AllProjectsPage() {
  const [modalType, setModalType] = useState<"signage" | "print" | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Filters & pagination state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [sourceFilter, setSourceFilter] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const params: GetProjectsParams = {
    page, limit,
    ...(search && { search }),
    ...(statusFilter && statusFilter !== "all" && { status: statusFilter as GetProjectsParams["status"] }),
    ...(priorityFilter && priorityFilter !== "all" && { priority: priorityFilter as GetProjectsParams["priority"] }),
    ...(sourceFilter && sourceFilter !== "all" && { project_source: sourceFilter as GetProjectsParams["project_source"] }),
    sortBy, sortOrder,
  }

  const { data, isLoading } = useGetProjects(params)
  const { mutate: deleteProject } = useDeleteProject()

  const projects = data?.data ?? []
  const meta = data?.meta

  const activeFilterCount = [
    search,
    statusFilter && statusFilter !== "all" ? statusFilter : "",
    priorityFilter && priorityFilter !== "all" ? priorityFilter : "",
    sourceFilter && sourceFilter !== "all" ? sourceFilter : "",
  ].filter(Boolean).length

  const handleReset = useCallback(() => { setSearch(""); setStatusFilter(""); setPriorityFilter(""); setSourceFilter(""); setPage(1) }, [])

  const handleSort = useCallback((key: string, direction: "asc" | "desc" | null) => {
    if (!direction) { setSortBy("created_at"); setSortOrder("desc") }
    else { setSortBy(key); setSortOrder(direction) }
    setPage(1)
  }, [])

  const handleView = useCallback((project: Project) => { setSelectedProject(project) }, [])
  const handleEdit = useCallback((project: Project) => { toast.info(`Editing: ${project.name}`) }, [])
  const handleDelete = useCallback((project: Project) => {
    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return
    deleteProject(project.id, {
      onSuccess: () => toast.success("Project deleted successfully"),
      onError: () => toast.error("Failed to delete project"),
    })
  }, [deleteProject])

  // ── If a project is selected, show full-page detail view ──────────────────
  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  // ── Otherwise show the list ───────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {modalType && (
        <CreateProjectModal isOpen={!!modalType} onClose={() => setModalType(null)} type={modalType} />
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">All Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all production projects.
            {meta && <span className="ml-1 font-medium text-foreground">{meta.total} total</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonShineHover className="h-10">
                <Plus className="mr-2 h-4 w-4" />
                Create New Job
              </ButtonShineHover>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Select Job Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setModalType("signage")} className="cursor-pointer gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Signage Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModalType("print")} className="cursor-pointer gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Print Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search} onSearchChange={(v) => { setSearch(v); setPage(1) }}
        status={statusFilter} onStatusChange={(v) => { setStatusFilter(v); setPage(1) }}
        priority={priorityFilter} onPriorityChange={(v) => { setPriorityFilter(v); setPage(1) }}
        source={sourceFilter} onSourceChange={(v) => { setSourceFilter(v); setPage(1) }}
        onReset={handleReset}
        activeFilterCount={activeFilterCount}
      />

      {/* Table */}
      <DataTable<Project>
        data={projects}
        columns={columns}
        isLoading={isLoading}
        rowKey={(row) => row.id}
        emptyMessage="No projects found"
        emptyDescription="Try adjusting your filters or create a new project to get started."
        sortKey={sortBy}
        sortDirection={sortOrder}
        onSort={handleSort}
        pagination={meta ? { page: meta.page, limit: meta.limit, total: meta.total, totalPages: meta.totalPages } : undefined}
        onPageChange={setPage}
        onLimitChange={(v) => { setLimit(v); setPage(1) }}
        renderActions={(row) => (
          <ActionButtons project={row} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      />
    </div>
  )
}
