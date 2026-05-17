// src/features/business-types/types/business-type.type.ts

export interface BusinessType {
  id: number
  name: string
  created_at: string
}

export interface GetBusinessTypesResponse {
  success: boolean
  message: string
  data: BusinessType[]
}

// src/types/dropdown.types.ts
export interface StageType {
  id: number
  name: string
  stage_type: number
}

export interface GetStageTypesResponse {
  success: boolean
  message: string
  data: StageType[]
}




export interface ChannelPartner {
  id: number;
  vendor_id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  gst_number: string;
  opening_balance: number;
  credit_limit: number;
  payment_due_days: number;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetChannelPartnersResponse {
  success: boolean;
  message: string;
  data: ChannelPartner[];
}



export interface ProjectCategory {
  id: number
  business_type_id: number
  category_name: string
  is_active: boolean
  created_at: string
  updated_at: string

  business_type: {
    id: number
    name: string
    created_at: string
  }
}

export interface GetProjectCategoriesResponse {
  success: boolean
  message: string
  data: ProjectCategory[]
}