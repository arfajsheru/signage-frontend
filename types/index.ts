export type LeadStatus = "HOT" | "WARM" | "COLD" | "FOLLOW_UP" | "CONVERTED" | "LOST"

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  source: string
  status: LeadStatus
  value?: number
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Enquiry {
  id: string
  leadId: string
  requirement: string
  specifications?: string
  siteVisitRequired: boolean
  status: "PENDING" | "VISITED" | "QUOTED" | "CLOSED"
  createdAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "SALES" | "PROJECT_MANAGER" | "DESIGNER" | "INSTALLER"
  avatar?: string
}
