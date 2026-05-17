"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import ButtonShineHover from "@/components/shadcn-studio/button/button-41"
import { CreateProjectModal } from "@/components/production/create-project-modal"

export default function PrintCreatedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="print"
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Print Production: Created
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage and start newly created print projects.
          </p>
        </div>
        <ButtonShineHover
           className="h-10"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Print Job
        </ButtonShineHover>
      </div>
    </div>
  )
}
