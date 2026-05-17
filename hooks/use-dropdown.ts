import { useQuery } from "@tanstack/react-query"

import { dropdownService } from "@/services/dropdown.service"

export const DROPDOWN_QUERY_KEYS = {
  businessTypes: ["business-types"],
  stageTypes: ["stage-types"],

  channelPartners: (vendor_id: number) => ["channel-partners", vendor_id],

  projectCategories: (business_type_id: number) => [
    "project-categories",
    business_type_id,
  ],
}

export const useGetBusinessTypes = () => {
  return useQuery({
    queryKey: DROPDOWN_QUERY_KEYS.businessTypes,
    queryFn: dropdownService.getBusinessTypes,
  })
}

export const useGetStageTypes = () => {
  return useQuery({
    queryKey: DROPDOWN_QUERY_KEYS.stageTypes,
    queryFn: dropdownService.getStageTypes,
  })
}

export const useGetChannelPartners = (vendor_id: number) => {
  return useQuery({
    queryKey: DROPDOWN_QUERY_KEYS.channelPartners(vendor_id),

    queryFn: () => dropdownService.getChannelPartners(vendor_id),

    enabled: !!vendor_id,
  })
}

export const useGetProjectCategories = (business_type_id: number) => {
  return useQuery({
    queryKey: DROPDOWN_QUERY_KEYS.projectCategories(business_type_id),

    queryFn: () => dropdownService.getProjectCategories(business_type_id),

    enabled: !!business_type_id,
  })
}
