"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, ArrowDown } from "lucide-react"
import Link from "next/link"
import { Workflow } from "@/types/workflow"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function WorkflowPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load workflow from localStorage
    const storedWorkflows = localStorage.getItem("workflows")
    if (storedWorkflows) {
      try {
        const workflows = JSON.parse(storedWorkflows)
        const foundWorkflow = workflows.find(
          (w: Workflow) => w.id === params.id
        )
        if (foundWorkflow) {
          console.log("Found workflow:", foundWorkflow) // Debug log
          setWorkflow(foundWorkflow)
        } else {
          router.push("/workflows")
        }
      } catch (error) {
        console.error("Error loading workflow:", error)
      }
    }
    setIsLoading(false)
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading workflow...</p>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-bold">Workflow not found</h2>
        <p className="text-muted-foreground">
          The workflow you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/workflows">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to workflows
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                Workflow Name
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {workflow.title}
              </h1>
            </div>
            {workflow.description && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                  Description
                </div>
                <p className="text-foreground">{workflow.description}</p>
              </div>
            )}
          </div>
        </div>
        <Link href={`/workflows/${workflow.id}/edit`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Edit workflow
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {workflow.steps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No steps defined yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Edit this workflow to add steps
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workflow.steps.map((step, index) => (
              <div key={step.id}>
                <div className="bg-card rounded-lg border p-6">
                  <div className="space-y-6">
                    {/* Step Header */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                        {index + 1}
                      </div>
                      <div className="text-sm text-muted-foreground/60 font-medium uppercase tracking-wider">
                        Step
                      </div>
                    </div>

                    {/* Step Details */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                          Title
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      {step.description && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                            Description
                          </div>
                          <p className="text-foreground">{step.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Prompt Section */}
                    {step.prompt && (
                      <div className="space-y-4">
                        <div className="border-t pt-4">
                          <div className="text-sm text-muted-foreground/60 uppercase tracking-wider font-medium mb-3">
                            Prompt
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                                Title
                              </div>
                              <h4 className="font-medium text-lg text-foreground">
                                {step.prompt.title}
                              </h4>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                                Content
                              </div>
                              <p className="text-foreground line-clamp-3">
                                {step.prompt.content}
                              </p>
                            </div>
                            {step.prompt.tags &&
                              step.prompt.tags.length > 0 && (
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                                    Tags
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {step.prompt.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            <div className="pt-2">
                              <Link href={`/prompt/${step.prompt.id}`}>
                                <Button variant="outline" size="sm">
                                  View Prompt Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {index < workflow.steps.length - 1 && (
                  <div className="flex justify-center py-4">
                    <ArrowDown className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
