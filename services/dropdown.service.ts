import apiClient from "@/lib/api-client"
import {
  GetBusinessTypesResponse,
  GetChannelPartnersResponse,
  GetStageTypesResponse,
} from "@/types/dropdown.types"

export const dropdownService = {
  getBusinessTypes: async (): Promise<GetBusinessTypesResponse> => {
    const response = await apiClient.get("/api/v1/business-types")

    return response.data
  },

  getStageTypes: async (): Promise<GetStageTypesResponse> => {
    const response = await apiClient.get("/api/v1/stage-types/stage-types")

    return response.data
  },


  
  
 getChannelPartners: async (
    vendor_id: number
  ): Promise<GetChannelPartnersResponse> => {
    const response = await apiClient.get(
      `/api/v1/channel-partners/list?vendor_id=${vendor_id}`
    )

    return response.data
  },
}
