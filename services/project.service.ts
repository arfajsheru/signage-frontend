import apiClient from "@/lib/api-client"
import { CreateProjectPayload, CreateProjectResponse, GetProjectsParams, GetProjectsResponse, Project } from "@/types/project.types"

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

  deleteProject: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/api/v1/projects/${id}`)
    return response.data
  },

  updateProject: async (
    id: number,
    payload: Partial<CreateProjectPayload>
  ): Promise<{ success: boolean; message: string; data: Project }> => {
    const response = await apiClient.patch(`/api/v1/projects/${id}`, payload)
    return response.data
  },
}