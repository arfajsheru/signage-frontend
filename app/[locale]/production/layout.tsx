import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Bell, HelpCircle, Plus, History, Calendar } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Hint } from "@/components/hint"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function ProductionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tDashboard = useTranslations("Dashboard")
  const tCommon = useTranslations("Common")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Hint label="Toggle Sidebar" side="right">
              <SidebarTrigger className="h-9 w-9 bg-muted/40 border border-border/50 hover:bg-primary/10 hover:text-primary transition-all rounded-md" />
            </Hint>
            
            <div className="flex flex-col justify-center hidden sm:flex">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Production</p>
            </div>

            <Breadcrumb className="hidden xl:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-xs hover:text-primary transition-colors bg-muted/30 px-2 py-1 rounded-md">
                    Overview
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-bold text-primary">Workflow</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative group hidden lg:block">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={tDashboard("searchPlaceholder")}
                className="w-40 xl:w-64 ltr:pl-9 rtl:pr-9 ltr:pr-12 rtl:pl-12 bg-muted/40 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-md h-9"
              />
              <div className="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </div>
            </div>

            <DropdownMenu>
              <Hint label={tCommon("quickActions")} side="bottom">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all rounded-md">
                    <Plus className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </DropdownMenuTrigger>
              </Hint>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel>{tCommon("quickActions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg">
                  <Plus className="mr-2 h-4 w-4 rtl:ml-2" /> New Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-[15px]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
