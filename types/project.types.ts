// src/types/project.types.ts

export interface CreateProjectPayload {
  name: string
  client_name: string
  business_type_id: number
  client_phone: string
  client_email: string
  site_address: string
  site_map_link: string
  notes: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  channel_partner_id: number
  total_amount: number
  advance_paid: number
  deadline: string
}

export interface Project {
  id: number
  vendor_id: number
  business_type_id: number
  channel_partner_id: number
  project_code: string
  name: string
  client_name: string
  client_phone: string
  client_email: string
  site_address: string
  site_map_link: string
  project_category_id: number | null
  notes: string
  priority: string
  status: string
  current_stage_id: number | null
  current_stage_status: string | null
  progress_percentage: number
  last_stage_updated_at: string | null
  total_amount: number
  advance_paid: number
  deadline: string
  created_by: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateProjectResponse {
  success: boolean
  message: string
  data: Project
}