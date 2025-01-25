"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Workflow } from "@/types/workflow"
import Link from "next/link"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { deleteWorkflow } from "@/actions/workflow.action"
import { toast } from "sonner"

export function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    // Load workflows from localStorage
    const storedWorkflows = localStorage.getItem("workflows")
    if (storedWorkflows) {
      try {
        const parsedWorkflows = JSON.parse(storedWorkflows)
        setWorkflows(parsedWorkflows)
      } catch (error) {
        console.error("Error parsing workflows:", error)
      }
    }
  }, [])

  const handleDelete = async (workflowId: string, e: React.MouseEvent) => {
    e.preventDefault()

    try {
      const { success } = await deleteWorkflow(workflowId)

      if (success) {
        // Update local storage
        const updatedWorkflows = workflows.filter((w) => w.id !== workflowId)
        localStorage.setItem("workflows", JSON.stringify(updatedWorkflows))
        setWorkflows(updatedWorkflows)
        toast.success("Workflow deleted successfully")
      } else {
        toast.error("Failed to delete workflow")
      }
    } catch (error) {
      console.error("Error deleting workflow:", error)
      toast.error("Failed to delete workflow")
    }
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No workflows found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {workflows.map((workflow) => (
        <Link href={`/workflows/${workflow.id}`} key={workflow.id}>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div>
                  <CardTitle className="text-xl mb-2">
                    {workflow.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {workflow.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    {workflow.steps.length} steps
                  </span>
                  <span className="text-muted-foreground/60">•</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-accent"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => handleDelete(workflow.id, e)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
