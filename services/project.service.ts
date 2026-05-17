import apiClient from "@/lib/api-client"
import { CreateProjectPayload, CreateProjectResponse, GetProjectsParams, GetProjectsResponse } from "@/types/project.types"

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



  getProjects: async (
  params: GetProjectsParams
): Promise<GetProjectsResponse> => {
  const response = await apiClient.get(
    "/api/v1/projects/project-list",
    {
      params,
    }
  )

  return response.data
},


}