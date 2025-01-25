"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, ArrowDown, X } from "lucide-react"
import { Workflow, WorkflowStep } from "@/types/workflow"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PromptSelectorDialog } from "@/components/workflow/prompt-selector-dialog"
import { Prompt } from "@/types/prompt"
import { Badge } from "@/components/ui/badge"

export default function EditWorkflowPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (workflow) {
      setWorkflow({ ...workflow, title: e.target.value })
    }
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (workflow) {
      setWorkflow({ ...workflow, description: e.target.value })
    }
  }

  const handleAddStep = () => {
    if (workflow) {
      const newStep = {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        prompt: null
      }
      setWorkflow({
        ...workflow,
        steps: [...workflow.steps, newStep]
      })
    }
  }

  const handleRemoveStep = (stepId: string) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        steps: workflow.steps.filter((step) => step.id !== stepId)
      })
    }
  }

  const handleStepTitleChange = (
    stepId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        steps: workflow.steps.map((step) =>
          step.id === stepId ? { ...step, title: e.target.value } : step
        )
      })
    }
  }

  const handleStepDescriptionChange = (
    stepId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        steps: workflow.steps.map((step) =>
          step.id === stepId ? { ...step, description: e.target.value } : step
        )
      })
    }
  }

  const handlePromptSelect = (stepId: string, prompt: Prompt | null) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        steps: workflow.steps.map((step) =>
          step.id === stepId ? { ...step, prompt } : step
        )
      })
    }
  }

  const handleSave = async () => {
    if (!workflow) return

    setIsSaving(true)

    try {
      // Validate workflow
      if (!workflow.title.trim()) {
        toast.error("Please enter a workflow title")
        return
      }

      // Get existing workflows
      const storedWorkflows = localStorage.getItem("workflows") || "[]"
      const workflows = JSON.parse(storedWorkflows)

      // Update the workflow
      const updatedWorkflow = {
        ...workflow,
        updatedAt: new Date().toISOString(),
        // Ensure steps have all required fields
        steps: workflow.steps.map((step) => ({
          ...step,
          title: step.title.trim(),
          description: step.description.trim()
        }))
      }

      const updatedWorkflows = workflows.map((w: Workflow) =>
        w.id === workflow.id ? updatedWorkflow : w
      )

      // Save to localStorage
      localStorage.setItem("workflows", JSON.stringify(updatedWorkflows))
      console.log("Saved workflow:", updatedWorkflow) // Debug log

      toast.success("Workflow updated successfully")
      router.push(`/workflows/${workflow.id}`)
    } catch (error) {
      console.error("Error saving workflow:", error)
      toast.error("Failed to update workflow")
    } finally {
      setIsSaving(false)
    }
  }

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/workflows/${workflow.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Workflow</h1>
            <p className="text-muted-foreground">
              Add and configure steps for your workflow
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                Workflow Name
              </div>
              <Input
                placeholder="Workflow title"
                value={workflow.title}
                onChange={handleTitleChange}
                className="text-lg font-medium"
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground/60 uppercase tracking-wider">
                Description
              </div>
              <Textarea
                placeholder="Describe what this workflow does..."
                value={workflow.description}
                onChange={handleDescriptionChange}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="space-y-4">
                <Card
                  className={cn(
                    "relative",
                    index === workflow.steps.length - 1 ? "mb-8" : ""
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleRemoveStep(step.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <Input
                          placeholder="Step title"
                          value={step.title}
                          onChange={(e) => handleStepTitleChange(step.id, e)}
                        />
                      </div>
                      <Textarea
                        placeholder="Step description"
                        value={step.description}
                        onChange={(e) =>
                          handleStepDescriptionChange(step.id, e)
                        }
                        className="resize-none"
                        rows={2}
                      />
                      {step.prompt ? (
                        <div className="rounded-lg border p-4 bg-muted/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground font-medium">
                              Prompt
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePromptSelect(step.id, null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div>
                            <h4 className="font-medium text-lg mb-1">
                              {step.prompt.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {step.prompt.content}
                            </p>
                          </div>
                          {step.prompt.tags && step.prompt.tags.length > 0 && (
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
                          )}
                          <div className="pt-2">
                            <Link href={`/prompts/${step.prompt.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                View Prompt Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <PromptSelectorDialog
                          onPromptSelect={(prompt) =>
                            handlePromptSelect(step.id, prompt)
                          }
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
                {index < workflow.steps.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowDown className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddStep}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add step
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <Link href={`/workflows/${workflow.id}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
