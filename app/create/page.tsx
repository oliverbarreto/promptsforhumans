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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import type { Prompt } from "@/types/prompt"
import type { Group } from "@/types/group"

export default function CreatePromptPage() {
  const [prompt, setPrompt] = useState<Partial<Prompt>>({
    title: "",
    content: "",
    tags: [],
    details: "",
    useCases: [],
    type: "",
    language: "",
    model: "",
    visibility: "public",
    groupId: undefined,
  })
  const [groups, setGroups] = useState<Group[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedGroups = localStorage.getItem("groups")
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPrompt((prev) => ({ ...prev, [name]: value }))
  }

  const handleVisibilityChange = (value: "public" | "private") => {
    setPrompt((prev) => ({ ...prev, visibility: value }))
  }

  const handleGroupChange = (value: string) => {
    setPrompt((prev) => ({ ...prev, groupId: value ? Number(value) : undefined }))
  }

  const handleCreateGroup = (newGroup: Group) => {
    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
    setPrompt((prev) => ({ ...prev, groupId: newGroup.id }))
    setIsCreateGroupOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      const storedPrompts = localStorage.getItem("prompts")
      const existingPrompts: Prompt[] = storedPrompts ? JSON.parse(storedPrompts) : []

      const newPrompt: Prompt = {
        ...(prompt as Prompt),
        id: existingPrompts.length + 1,
        author: {
          name: "Current User",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        likes: 0,
        createdAt: new Date().toISOString(),
        tags:
          prompt.tags
            ?.join(",")
            .split(",")
            .map((tag) => tag.trim()) || [],
        useCases:
          prompt.useCases
            ?.join(",")
            .split(",")
            .map((useCase) => useCase.trim()) || [],
        currentVersion: "1",
        versions: [
          {
            id: `${existingPrompts.length + 1}-1`,
            version: "1",
            content: prompt.content || "",
            details: prompt.details || "",
            useCases: prompt.useCases || [],
            type: prompt.type || "",
            language: prompt.language || "",
            models: [prompt.model || ""],
            tools: [],
            createdAt: new Date().toISOString(),
          },
        ],
        isArchived: false,
        isFavorite: false,
      }

      const updatedPrompts = [...existingPrompts, newPrompt]
      localStorage.setItem("prompts", JSON.stringify(updatedPrompts))

      // Update group prompt count if a group was selected
      if (prompt.groupId) {
        const updatedGroups = groups.map((group) =>
          group.id === prompt.groupId ? { ...group, promptCount: group.promptCount + 1 } : group,
        )
        setGroups(updatedGroups)
        localStorage.setItem("groups", JSON.stringify(updatedGroups))
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/library")
      }, 2000)
    } catch (err) {
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
          <Label htmlFor="details">Details</Label>
          <Textarea
            id="details"
            name="details"
            value={prompt.details}
            onChange={handleInputChange}
            placeholder="Provide additional details about your prompt..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group">Group</Label>
          <div className="flex gap-2">
            <Select value={prompt.groupId?.toString()} onValueChange={handleGroupChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={() => setIsCreateGroupOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Group
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="useCases">Use Cases (comma-separated)</Label>
          <Input
            id="useCases"
            name="useCases"
            value={prompt.useCases?.join(", ")}
            onChange={(e) =>
              setPrompt((prev) => ({ ...prev, useCases: e.target.value.split(",").map((s) => s.trim()) }))
            }
            placeholder="e.g., Summarization, Expanding, Creative Writing"
          />
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
          <Input id="model" name="model" value={prompt.model} onChange={handleInputChange} placeholder="e.g., GPT-4" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={prompt.tags?.join(", ")}
            onChange={(e) => setPrompt((prev) => ({ ...prev, tags: e.target.value.split(",").map((s) => s.trim()) }))}
            placeholder="e.g., creative, coding, marketing"
          />
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <RadioGroup
            defaultValue={prompt.visibility}
            onValueChange={(value) => handleVisibilityChange(value as "public" | "private")}
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
          <AlertDescription>Your prompt has been created successfully! Redirecting to library...</AlertDescription>
        </Alert>
      )}
      <CreateGroupDialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen} onSubmit={handleCreateGroup} />
    </div>
  )
}

