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
import { CreateProjectModal } from "@/components/production/create-project-modal"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/comman/BaseModal"

export default function PrintCreatedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="print"
      />
      <BaseModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Projects"
        description="Search and filter through your print production projects."
        size="lg"
        primaryButtonText="Apply Filters"
        secondaryButtonText="Reset"
        onPrimaryAction={() => {
          console.log("Filters applied")
          setIsFilterModalOpen(false)
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <input
                className="w-full rounded-md border p-2 text-sm"
                placeholder="Search by name..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select className="w-full rounded-md border p-2 text-sm">
                <option>All Status</option>
                <option>Pending</option>
                <option>Designing</option>
                <option>Printing</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Note: These filters are for demonstration purposes with the new
            BaseModal.
          </p>
        </div>
      </BaseModal>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Print Production: Created
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and start newly created print projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="h-10">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="h-10" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Print Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 since last hour</p>
          </CardContent>
        </Card>
        {/* Add more stats as needed */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>
            You have 12 projects waiting to be moved to designing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <Plus className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
              <p className="mt-2 mb-4 text-sm text-muted-foreground">
                You haven&apos;t created any print projects yet.
              </p>
              <Button className="h-10" onClick={() => setIsModalOpen(true)}>
                Add New Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
