"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import ButtonShineHover from "@/components/shadcn-studio/button/button-41"
import { CreateProjectModal } from "@/components/production/create-project-modal"

export default function SignageCreatedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="signage"
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Signage Production: Created
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and start newly created signage projects.
          </p>
        </div>
        <ButtonShineHover
          className="h-10 shrink-0"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Signage Job
        </ButtonShineHover>
      </div>
    </div>
  )
}
