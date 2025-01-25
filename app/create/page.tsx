"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import type { Prompt, PromptVersion } from "@/types/prompt"
import type { Group } from "@/types/group"

export default function CreatePromptPage() {
  const router = useRouter()
  const searchParams = new URLSearchParams(window.location.search)
  const groupId = searchParams.get("groupId")

  const [prompt, setPrompt] = useState<{
    title: string
    content: string
    tags: string[]
    type: string
    language: string
    model: string
    tools: string[]
    useCases: string[]
    visibility: "public" | "private"
    group: string
  }>({
    title: "",
    content: "",
    tags: [],
    type: "",
    language: "",
    model: "",
    tools: [],
    useCases: [],
    visibility: "public",
    group: groupId || ""
  })
  const [groups, setGroups] = useState<Group[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)

  useEffect(() => {
    const storedGroups = localStorage.getItem("groups")
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups))
    }
  }, [])

  // Update group when URL parameter changes
  useEffect(() => {
    setPrompt((prev) => ({
      ...prev,
      group: groupId || ""
    }))
  }, [groupId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setPrompt((prev) => ({
      ...prev,
      [name]:
        name === "useCases" || name === "tags" || name === "tools"
          ? value.split(",").map((item) => item.trim())
          : value
    }))
  }

  const handleVisibilityChange = (value: "public" | "private") => {
    setPrompt((prev) => ({ ...prev, visibility: value }))
  }

  const handleGroupChange = (value: string) => {
    setPrompt((prev) => ({
      ...prev,
      group: value || ""
    }))
  }

  const handleCreateGroup = (newGroup: Group) => {
    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
    setPrompt((prev) => ({ ...prev, group: newGroup.id }))
    setIsCreateGroupOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate required fields
    if (!prompt.title || !prompt.content) {
      setError("Title and content are required")
      setIsSubmitting(false)
      return
    }

    try {
      // Generate a unique ID for the new prompt
      const promptId = String(Date.now())

      const version: PromptVersion = {
        id: `${promptId}-1`,
        version: "1",
        content: prompt.content,
        models: [prompt.model || "gpt-4"],
        details: "",
        useCases: prompt.useCases || [],
        type: "completion",
        language: "en",
        tools: prompt.tools || [],
        createdAt: new Date().toISOString(),
        visibility: prompt.visibility
      }
      // Create the new prompt object
      const newPrompt: Prompt = {
        id: promptId,
        title: prompt.title,
        content: prompt.content,
        tags: prompt.tags,
        visibility: prompt.visibility,
        group: prompt.group,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentVersion: "1",
        versions: [version],
        author: {
          id: "current-user",
          name: "Current User",
          avatar: undefined,
          email: "user@example.com" // Added required email field
        },
        likes: 0,
        isFavorite: false,
        isArchived: false
      }

      // Get existing prompts from localStorage
      const storedPrompts = localStorage.getItem("prompts")
      const existingPrompts: Prompt[] = storedPrompts
        ? JSON.parse(storedPrompts)
        : []

      // Add new prompt to the array
      const updatedPrompts = [...existingPrompts, newPrompt]
      localStorage.setItem("prompts", JSON.stringify(updatedPrompts))

      // If a group was selected, update the group data
      if (prompt.group) {
        const storedGroups = localStorage.getItem("groups")
        if (storedGroups) {
          const groups: Group[] = JSON.parse(storedGroups)
          const updatedGroups = groups.map((group) => {
            if (group.id === prompt.group) {
              return {
                ...group,
                prompts: [...(group.prompts || []), promptId],
                updatedAt: new Date().toISOString()
              }
            }
            return group
          })
          localStorage.setItem("groups", JSON.stringify(updatedGroups))
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/library")
      }, 2000)
    } catch (err) {
      console.error("Error creating prompt:", err)
      setError("An error occurred while creating the prompt. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Prompt</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={prompt.title}
            onChange={handleInputChange}
            required
            placeholder="Enter a catchy title for your prompt"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Prompt Content</Label>
          <Textarea
            id="content"
            name="content"
            value={prompt.content}
            onChange={handleInputChange}
            required
            placeholder="Write your prompt here..."
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group">Group</Label>
          <div className="flex gap-2">
            <Select
              value={prompt.group?.toString()}
              onValueChange={handleGroupChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateGroupOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Group
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            name="type"
            value={prompt.type}
            onChange={handleInputChange}
            placeholder="e.g., ChatPromptTemplate"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            name="language"
            value={prompt.language}
            onChange={handleInputChange}
            placeholder="e.g., English"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={prompt.model}
            onChange={handleInputChange}
            placeholder="e.g., gpt-4, claude-3"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tools">Tools (comma-separated)</Label>
          <Input
            id="tools"
            name="tools"
            value={prompt.tools?.join(", ") || ""}
            onChange={handleInputChange}
            placeholder="e.g., codebase_search, edit_file, run_terminal_cmd"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={prompt.tags?.join(", ")}
            onChange={handleInputChange}
            placeholder="e.g., creative, coding, marketing"
          />
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <RadioGroup
            defaultValue={prompt.visibility}
            onValueChange={(value) =>
              handleVisibilityChange(value as "public" | "private")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">Public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">Private</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Prompt"}
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mt-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your prompt has been created successfully! Redirecting to library...
          </AlertDescription>
        </Alert>
      )}
      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        onSubmit={handleCreateGroup}
      />
    </div>
  )
}
