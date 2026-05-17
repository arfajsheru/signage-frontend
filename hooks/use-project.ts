// src/hooks/project.hooks.ts

import { useMutation, useQuery } from "@tanstack/react-query"

import { projectService } from "@/services/project.service"
import { GetProjectsParams } from "@/types/project.types"

export const PROJECT_QUERY_KEYS = {
  create: ["create-project"],

  list: (params: GetProjectsParams) => ["projects", params],
}

export const useCreateProject = () => {
  return useMutation({
    mutationKey: PROJECT_QUERY_KEYS.create,
    mutationFn: projectService.createProject,
  })
}

export const useGetProjects = (params: GetProjectsParams) => {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.list(params),

    queryFn: () => projectService.getProjects(params),
  })
}
