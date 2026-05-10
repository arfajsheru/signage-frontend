"use client"

import { useState } from "react"
import { Plus, Filter, Download } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import ButtonShineHover from "@/components/shadcn-studio/button/button-41"
import { CreateProjectModal } from "@/components/production/createProjectModal"
import { Button } from "@/components/ui/button"

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
          <p className="text-sm text-muted-foreground">
            Manage and start newly created signage projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="h-10">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <ButtonShineHover className="h-10" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Signage Job
          </ButtonShineHover>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Signage Queue</CardTitle>
          <CardDescription>
            You have 8 signage projects in the initial stage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <Plus className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No signage projects found
              </h3>
              <p className="mt-2 mb-4 text-sm text-muted-foreground">
                Start by creating a new signage production project.
              </p>
              <Button className="h-10" onClick={() => setIsModalOpen(true)}>Add New Signage Project</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
