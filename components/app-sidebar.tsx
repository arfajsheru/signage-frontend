"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/use-auth"
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Hammer,
  Printer,
  Workflow,
  FileCode,
  Box,
  CreditCard,
  BarChart,
  Settings,
  Users,
  Palette,
  ChevronDown,
  GalleryVerticalEnd,
  AudioLines,
  BadgeCheckIcon,
  BellIcon,
  LogOutIcon,
  ChevronsUpDownIcon,
  SparklesIcon,
  PlusIcon,
  CheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Nav Data ──────────────────────────────────────────────────────────────────
const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "DXF Extractor", url: "/production/quotation-generator", icon: FileText },
  {
    title: "Projects",
    url: "/production/projects",
    icon: Briefcase,
    items: [
      { title: "All Projects", url: "/production/projects" },
      { title: "Active Production", url: "/production/projects/active" },
      { title: "Timeline", url: "/production/projects/timeline" },
    ],
  },
  {
    title: "Signage Production",
    url: "/production/signage",
    icon: Hammer,
    items: [
      { title: "Created", url: "/production/signage/created" },
      { title: "Designing", url: "/production/signage/designing" },
      { title: "Cutting", url: "/production/signage/cutting" },
      { title: "Bending", url: "/production/signage/bending" },
      { title: "Packing", url: "/production/signage/packing" },
      { title: "Delivered", url: "/production/signage/delivered" },
    ],
  },
  {
    title: "Print Production",
    url: "/production/print",
    icon: Printer,
    items: [
      { title: "Created", url: "/production/print/created" },
      { title: "Designing", url: "/production/print/designing" },
      { title: "Printing", url: "/production/print/printing" },
      { title: "Packing", url: "/production/print/packing" },
      { title: "Delivered", url: "/production/print/delivered" },
    ],
  },
  {
    title: "Workflow",
    url: "/workflow",
    icon: Workflow,
    items: [
      { title: "Business Types", url: "/workflow/business-types" },
      { title: "Stage Types", url: "/workflow/stage-types" },
      { title: "Workflow Setup", url: "/workflow/setup" },
      { title: "Document Types", url: "/workflow/document-types" },
    ],
  },
  { title: "Files & Designs", url: "/files", icon: FileCode },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Box,
    items: [
      { title: "Materials List", url: "/inventory/materials" },
      { title: "Stock Management", url: "/inventory/stock" },
      { title: "Vendors", url: "/inventory/vendors" },
    ],
  },
  {
    title: "Finance",
    url: "/finance",
    icon: CreditCard,
    items: [
      { title: "Invoices", url: "/finance/invoices" },
      { title: "Payments", url: "/finance/payments" },
      { title: "Expenses", url: "/finance/expenses" },
    ],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart,
    items: [
      { title: "Production Analytics", url: "/reports/production" },
      { title: "Financial Reports", url: "/reports/finance" },
    ],
  },
]

const bottomItems = [
  { title: "Team Management", url: "/team", icon: Users },
  { title: "Theme Showcase", url: "/theme", icon: Palette },
  { title: "Settings", url: "/settings", icon: Settings },
]

const teams = [
  { name: "Signage Pro", plan: "Production ERP", icon: GalleryVerticalEnd },
  { name: "Signage Lite", plan: "Manufacturing", icon: AudioLines },
]

const userData = {
  name: "Arfaj Sheru",
  email: "admin@signage.com",
  avatar: "/avatars/admin.jpg",
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Vendor / Company Header (same style as profile) ───────────────────────────
function CompanyHeader() {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const ActiveIcon = activeTeam.icon

  const trigger = (
    <button
      type="button"
      className={cn(
        "w-full flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-all duration-150",
        "hover:bg-sidebar-accent border border-transparent hover:border-sidebar-border",
        isCollapsed && "justify-center px-2"
      )}
    >
      {/* Brand logo icon */}
      <div className="relative shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30 border-2 border-primary/20">
          <ActiveIcon className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-semibold leading-tight truncate text-sidebar-foreground">
              {activeTeam.name}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight truncate">
              {activeTeam.plan}
            </p>
          </div>
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        </>
      )}
    </button>
  )

  return (
    <div className="px-2 pt-2 pb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60 rounded-xl shadow-xl"
          side={isMobile ? "bottom" : "right"}
          align="start"
          sideOffset={8}
        >
          {/* Header */}
          <DropdownMenuLabel className="p-0">
            <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
                <ActiveIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{activeTeam.name}</p>
                <p className="text-xs text-muted-foreground truncate">{activeTeam.plan}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* Team list */}
          <DropdownMenuGroup className="p-1">
            {teams.map((team, index) => {
              const Icon = team.icon
              const isActive = team.name === activeTeam.name
              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="rounded-lg gap-2.5 px-3 py-2 cursor-pointer"
                >
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-lg",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="flex-1">{team.name}</span>
                  <span className="text-[10px] text-muted-foreground">⌘{index + 1}</span>
                  {isActive && <CheckIcon className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <div className="p-1">
            <DropdownMenuItem className="rounded-lg gap-2.5 px-3 py-2 cursor-pointer text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-dashed border-border">
                <PlusIcon className="h-3.5 w-3.5" />
              </div>
              <span>Add workspace</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ── Nav Item ──────────────────────────────────────────────────────────────────
function NavItem({
  item,
  pathname,
}: {
  item: (typeof navItems)[0]
  pathname: string
}) {
  const Icon = item.icon
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const isParentActive =
    pathname === item.url ||
    item.items?.some((sub) => pathname === sub.url || pathname.startsWith(sub.url + "/")) ||
    pathname.startsWith(item.url + "/") ||
    false

  // Simple item (no children)
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <Link
          href={item.url}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150 w-full",
            isCollapsed && "justify-center px-0 w-9 h-9 mx-auto",
            isParentActive
              ? "bg-primary/10 text-primary font-semibold"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
          title={isCollapsed ? item.title : undefined}
        >
          <Icon className={cn("h-4 w-4 shrink-0", isParentActive ? "text-primary" : "text-muted-foreground")} />
          {!isCollapsed && <span className="flex-1 truncate">{item.title}</span>}
        </Link>
      </SidebarMenuItem>
    )
  }

  // Collapsible item (with children)
  return (
    <Collapsible defaultOpen={isParentActive} className="group/collapsible w-full">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150 w-full text-left",
              isCollapsed && "justify-center px-0 w-9 h-9 mx-auto",
              isParentActive
                ? "text-primary font-semibold"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            title={isCollapsed ? item.title : undefined}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isParentActive ? "text-primary" : "text-muted-foreground")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 truncate">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-muted-foreground ml-1 transition-transform duration-200",
                    "group-data-[state=open]/collapsible:rotate-0 group-data-[state=closed]/collapsible:-rotate-90"
                  )}
                />
              </>
            )}
          </button>
        </CollapsibleTrigger>
      </SidebarMenuItem>

      {/* Sub-items outside SidebarMenuItem to avoid nesting <li> inside <li> */}
      {!isCollapsed && (
        <CollapsibleContent>
          <ul className="ml-[22px] mt-0.5 mb-1.5 border-l-2 border-dashed border-sidebar-border pl-3 flex flex-col gap-0.5">
            {item.items.map((sub) => {
              const isSubActive = pathname === sub.url || pathname.startsWith(sub.url + "/")
              return (
                <li key={sub.url} className="relative">
                  {isSubActive && (
                    <span className="absolute left-[-13px] top-1/2 -translate-y-1/2 h-[16px] w-[3px] rounded-full bg-primary shadow-[0_0_8px_rgba(19,196,163,0.5)] z-10" />
                  )}
                  <Link
                    href={sub.url}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2.5 py-[6px] text-[13px] transition-all duration-150",
                      isSubActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <span>{sub.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

// ── Profile Footer (same style as CompanyHeader) ──────────────────────────────
function SidebarProfile() {
  const { isMobile, state } = useSidebar()
  const { logout } = useLogout()
  const isCollapsed = state === "collapsed"

  const trigger = (
    <button
      type="button"
      className={cn(
        "w-full flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-all duration-150",
        "hover:bg-sidebar-accent border border-transparent hover:border-sidebar-border",
        isCollapsed && "justify-center px-2"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-8 w-8 rounded-xl border-2 border-primary/20">
          <AvatarImage src={userData.avatar} alt={userData.name} />
          <AvatarFallback className="rounded-xl bg-primary/15 text-primary text-xs font-bold">
            {getInitials(userData.name)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-sidebar" />
      </div>
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-semibold leading-tight truncate text-sidebar-foreground">
              {userData.name}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight truncate">
              {userData.email}
            </p>
          </div>
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        </>
      )}
    </button>
  )

  return (
    <div className="border-t border-sidebar-border px-2 pt-2 pb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60 rounded-xl shadow-xl"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="p-0">
            <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
              <Avatar className="h-10 w-10 rounded-xl border-2 border-primary/20">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-xl bg-primary/15 text-primary text-sm font-bold">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{userData.name}</p>
                <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuGroup className="p-1">
            <DropdownMenuItem className="rounded-lg gap-2.5 px-3 py-2 cursor-pointer">
              <SparklesIcon className="h-4 w-4 text-amber-500" />
              <span>Upgrade to Pro</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup className="p-1">
            <DropdownMenuItem className="rounded-lg gap-2.5 px-3 py-2 cursor-pointer">
              <BadgeCheckIcon className="h-4 w-4 text-primary" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg gap-2.5 px-3 py-2 cursor-pointer">
              <BellIcon className="h-4 w-4 text-muted-foreground" />
              <span>Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <div className="p-1">
            <DropdownMenuItem
              onClick={logout}
              className="rounded-lg gap-2.5 px-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ── Main AppSidebar ───────────────────────────────────────────────────────────
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      side={locale === "ar" ? "right" : "left"}
      dir={locale === "ar" ? "rtl" : "ltr"}
      {...props}
    >
      {/* Header — no border, no search */}
      <SidebarHeader className="p-0 gap-0">
        <CompanyHeader />
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="pt-1 pb-1">
        <SidebarMenu className="px-2 gap-0.5">
          {navItems.map((item) => (
            <NavItem key={item.url} item={item} pathname={pathname} />
          ))}
        </SidebarMenu>

        <div className="mx-3 my-2 h-px bg-sidebar-border" />

        <SidebarMenu className="px-2 gap-0.5">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
            return (
              <SidebarMenuItem key={item.url}>
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150 w-full",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarProfile />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
