"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Hammer,
  Printer,
  Workflow,
  FileCode,
  Box,
  CreditCard,
  BarChart,
  Settings,
  GalleryVerticalEnd,
  AudioLines,
} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "Arfaj Sheru",
    email: "admin@signage.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Signage Pro",
      logo: <GalleryVerticalEnd />,
      plan: "Production ERP",
    },
    {
      name: "Signage Lite",
      logo: <AudioLines />,
      plan: "Manufacturing",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
      isActive: true,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <Briefcase />,
      items: [
        {
          title: "All Projects",
          url: "/projects",
        },
        {
          title: "Active Production",
          url: "/projects/active",
        },
        {
          title: "Timeline",
          url: "/projects/timeline",
        },
      ],
    },
    {
      title: "Print Production",
      url: "#",
      icon: <Printer />,
      items: [
        {
          title: "Designing",
          url: "/production/print/designing",
        },
        {
          title: "Printing",
          url: "/production/print/printing",
        },
        {
          title: "Packing",
          url: "/production/print/packing",
        },
        {
          title: "Delivered",
          url: "/production/print/delivered",
        },
      ],
    },
    {
      title: "Signage Production",
      url: "#",
      icon: <Hammer />,
      items: [
        {
          title: "Designing",
          url: "/production/signage/designing",
        },
        {
          title: "Cutting",
          url: "/production/signage/cutting",
        },
        {
          title: "Bending",
          url: "/production/signage/bending",
        },
        {
          title: "Packing",
          url: "/production/signage/packing",
        },
        {
          title: "Delivered",
          url: "/production/signage/delivered",
        },
      ],
    },
    {
      title: "Workflow Management",
      url: "#",
      icon: <Workflow />,
      items: [
        {
          title: "Business Types",
          url: "/workflow/business-types",
        },
        {
          title: "Stage Types",
          url: "/workflow/stage-types",
        },
        {
          title: "Workflow Setup",
          url: "/workflow/setup",
        },
        {
          title: "Document Types",
          url: "/workflow/document-types",
        },
      ],
    },
    {
      title: "Files & Designs",
      url: "/files",
      icon: <FileCode />,
    },
    {
      title: "Inventory",
      url: "#",
      icon: <Box />,
      items: [
        {
          title: "Materials List",
          url: "/inventory/materials",
        },
        {
          title: "Stock Management",
          url: "/inventory/stock",
        },
        {
          title: "Vendors",
          url: "/inventory/vendors",
        },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: <CreditCard />,
      items: [
        {
          title: "Invoices",
          url: "/finance/invoices",
        },
        {
          title: "Payments",
          url: "/finance/payments",
        },
        {
          title: "Expenses",
          url: "/finance/expenses",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <BarChart />,
      items: [
        {
          title: "Production Analytics",
          url: "/reports/production",
        },
        {
          title: "Financial Reports",
          url: "/reports/finance",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Team Management",
      url: "/team",
      icon: <Users />,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: <Settings />,
    },
  ],
}

import { useLocale } from "next-intl"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale()

  return (
    <Sidebar
      collapsible="icon"
      side={locale === "ar" ? "right" : "left"}
      dir={locale === "ar" ? "rtl" : "ltr"}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
