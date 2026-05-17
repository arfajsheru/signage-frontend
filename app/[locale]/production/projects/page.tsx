"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import ButtonShineHover from "@/components/shadcn-studio/button/button-41"
import { CreateProjectModal } from "@/components/production/create-project-modal"

export default function AllProjectsPage() {
  const [modalType, setModalType] = useState<"signage" | "print" | null>(null)

  return (
    <div className="space-y-6">
      {modalType && (
        <CreateProjectModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            All Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and create all production projects.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ButtonShineHover
            className="h-10"
            onClick={() => setModalType("signage")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Job
          </ButtonShineHover>
      
        </div>
      </div>
    </div>
  )
}
