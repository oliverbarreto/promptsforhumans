"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Workflow } from "@/types/workflow"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function WorkflowBuilder() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const validateWorkflow = () => {
    if (!title.trim()) {
      toast.error("Please enter a workflow title")
      return false
    }

    if (!description.trim()) {
      toast.error("Please enter a workflow description")
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateWorkflow()) {
      return
    }

    setIsSaving(true)

    try {
      const workflow: Workflow = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        steps: [], // Start with empty steps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // userId: "1", // TODO: Get from auth
        isPublic: true,
        isFavorite: false
      }

      // Get existing workflows
      const storedWorkflows = localStorage.getItem("workflows")
      const existingWorkflows = storedWorkflows
        ? JSON.parse(storedWorkflows)
        : []

      // Add new workflow
      const updatedWorkflows = [...existingWorkflows, workflow]

      // Save to localStorage
      localStorage.setItem("workflows", JSON.stringify(updatedWorkflows))

      toast.success("Workflow created successfully")
      router.push("/workflows")
    } catch (error) {
      toast.error("Failed to create workflow")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Workflow title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>
          <div>
            <Textarea
              placeholder="Describe what this workflow does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Creating..." : "Create workflow"}
          </Button>
        </div>
      </div>
    </div>
  )
}
