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
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface WorkflowListProps {
  workflows: Workflow[]
}

export function WorkflowList({ workflows }: WorkflowListProps) {
  const [localWorkflows, setLocalWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    // Load workflows from localStorage
    const storedWorkflows = localStorage.getItem("workflows")
    if (storedWorkflows) {
      try {
        const parsedWorkflows = JSON.parse(storedWorkflows)
        setLocalWorkflows(parsedWorkflows)
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
        const updatedWorkflows = localWorkflows.filter(
          (w) => w.id !== workflowId
        )
        localStorage.setItem("workflows", JSON.stringify(updatedWorkflows))
        setLocalWorkflows(updatedWorkflows)
        toast.success("Workflow deleted successfully")
      } else {
        toast.error("Failed to delete workflow")
      }
    } catch (error) {
      console.error("Error deleting workflow:", error)
      toast.error("Failed to delete workflow")
    }
  }

  if (!workflows.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No workflows found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new workflow to get started
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {workflows.map((workflow) => (
        <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
          <Card className="p-6 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-semibold text-xl mb-1">{workflow.title}</h3>
                <p className="text-muted-foreground line-clamp-2">
                  {workflow.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {workflow.steps.length}{" "}
                    {workflow.steps.length === 1 ? "step" : "steps"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
