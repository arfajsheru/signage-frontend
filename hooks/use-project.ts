// src/hooks/project.hooks.ts

import { useMutation } from "@tanstack/react-query"

import { projectService } from "@/services/project.service"

export const PROJECT_QUERY_KEYS = {
  create: ["create-project"],
}

export const useCreateProject = () => {
  return useMutation({
    mutationKey: PROJECT_QUERY_KEYS.create,
    mutationFn: projectService.createProject,
  })
}
