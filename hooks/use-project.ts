// hooks/use-project.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { projectService } from "@/services/project.service"
import { CreateProjectPayload, GetProjectsParams } from "@/types/project.types"

export const PROJECT_QUERY_KEYS = {
  create: ["create-project"],
  delete: (id: number) => ["delete-project", id],
  update: (id: number) => ["update-project", id],
  list: (params: GetProjectsParams) => ["projects", params],
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: PROJECT_QUERY_KEYS.create,
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export const useGetProjects = (params: GetProjectsParams) => {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.list(params),
    queryFn: () => projectService.getProjects(params),
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateProjectPayload> }) =>
      projectService.updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
