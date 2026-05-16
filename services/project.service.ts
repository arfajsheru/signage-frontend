import apiClient from "@/lib/api-client"
import { CreateProjectPayload, CreateProjectResponse } from "@/types/project.types"

export const projectService = {
  createProject: async (
    payload: CreateProjectPayload
  ): Promise<CreateProjectResponse> => {
    const response = await apiClient.post(
      "/api/v1/projects/create-project",
      payload
    )

    return response.data
  },
}