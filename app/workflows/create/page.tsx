import { Button } from "@/components/ui/button"
import { WorkflowBuilder } from "@/components/workflow/workflow-builder"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateWorkflowPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/workflows">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Workflow</h1>
          <p className="text-muted-foreground">
            Design your workflow by adding and connecting steps
          </p>
        </div>
      </div>

      <WorkflowBuilder />
    </div>
  )
}
