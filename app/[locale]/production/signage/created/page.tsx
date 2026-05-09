import { Button } from "@/components/ui/button"
import { Plus, Filter, Download } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignageCreatedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Signage Production: Created</h1>
          <p className="text-muted-foreground">
            Manage and start newly created signage projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create New Signage Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Ready for cutting</p>
          </CardContent>
        </Card>
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
              <h3 className="mt-4 text-lg font-semibold">No signage projects found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Start by creating a new signage production project.
              </p>
              <Button size="sm">Add New Signage Project</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
