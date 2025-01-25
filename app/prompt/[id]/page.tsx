"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Edit,
  Plus,
  Globe,
  Lock
} from "lucide-react"
import { VersionSelector } from "@/components/version-selector"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PromptActions } from "@/components/prompt-actions"
import { UserAvatar } from "@/components/user-avatar"
import type { Prompt, PromptVersion } from "@/types/prompt"
import type { Group } from "@/types/group"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { mockPrompts } from "@/data/mock-data"

interface EditedPromptData extends Partial<PromptVersion> {
  groupId?: string
  tags?: string[]
}

export default function PromptDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const searchParams = new URLSearchParams(window.location.search)
  const sourceRoute = searchParams.get("from") || "explore"
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedVersion, setEditedVersion] = useState<EditedPromptData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(prompt?.title || "")

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch groups
        const storedGroups = localStorage.getItem("groups")
        if (storedGroups) {
          const parsedGroups = JSON.parse(storedGroups)
          setGroups(parsedGroups)
        }

        // Fetch prompt
        const storedPrompts = localStorage.getItem("prompts")
        if (!storedPrompts) {
          // If no prompts in localStorage, use mock data
          const foundPrompt = mockPrompts.find((p) => p.id === id)
          if (foundPrompt) {
            setPrompt(foundPrompt)
            setSelectedVersion(foundPrompt.currentVersion)
            // Store mock data in localStorage
            localStorage.setItem("prompts", JSON.stringify(mockPrompts))
          } else {
            setError("Prompt not found")
          }
        } else {
          // If prompts exist in localStorage, use them
          const prompts: Prompt[] = JSON.parse(storedPrompts)
          const foundPrompt = prompts.find((p) => p.id === id)
          if (foundPrompt) {
            setPrompt(foundPrompt)
            setSelectedVersion(foundPrompt.currentVersion)
          } else {
            // If not found in localStorage, check mock data
            const mockPrompt = mockPrompts.find((p) => p.id === id)
            if (mockPrompt) {
              setPrompt(mockPrompt)
              setSelectedVersion(mockPrompt.currentVersion)
              // Update localStorage with mock data
              localStorage.setItem(
                "prompts",
                JSON.stringify([...prompts, mockPrompt])
              )
            } else {
              setError("Prompt not found")
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const currentVersionData =
    prompt?.versions?.find((v) => v.version === selectedVersion) || null

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version)
    setIsEditing(false)
  }

  const handleCreateNewVersion = () => {
    if (!prompt || !currentVersionData) return

    const newVersionNumber = String((prompt.versions?.length || 0) + 1)
    const newVersion: PromptVersion = {
      id: `${prompt.id}-${newVersionNumber}`,
      version: newVersionNumber,
      content: currentVersionData.content,
      details: currentVersionData.details,
      useCases: [...currentVersionData.useCases],
      type: currentVersionData.type,
      language: currentVersionData.language,
      models: [...currentVersionData.models],
      tools: [...currentVersionData.tools],
      createdAt: new Date().toISOString(),
      visibility: currentVersionData.visibility
    }

    const updatedPrompt = {
      ...prompt,
      currentVersion: newVersionNumber,
      versions: [...(prompt.versions || []), newVersion]
    }

    updatePromptInStorage(updatedPrompt)
    setPrompt(updatedPrompt)
    setSelectedVersion(newVersionNumber)
    setIsEditing(true)
    setEditedVersion(newVersion)
  }

  const handleEdit = () => {
    if (!currentVersionData) return
    setEditedVersion(currentVersionData)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!prompt || !currentVersionData || !selectedVersion) return

    const updatedVersion: PromptVersion = {
      ...currentVersionData,
      ...editedVersion
    }

    const updatedPrompt = {
      ...prompt,
      visibility: editedVersion.visibility || prompt.visibility,
      tags: editedVersion.tags || prompt.tags,
      versions: prompt.versions.map((v) =>
        v.version === selectedVersion ? updatedVersion : v
      )
    }

    // If group has changed, update both old and new group's prompt lists
    if (editedVersion.groupId && editedVersion.groupId !== prompt.groupId) {
      const storedGroups = localStorage.getItem("groups")
      if (storedGroups) {
        const groups: Group[] = JSON.parse(storedGroups)
        const updatedGroups = groups.map((group) => {
          if (group.id === prompt.groupId) {
            // Remove prompt from old group
            return {
              ...group,
              promptCount: Math.max(0, (group.promptCount || 0) - 1),
              prompts: (group.prompts || []).filter((p) => p !== prompt.id)
            }
          }
          if (group.id === editedVersion.groupId) {
            // Add prompt to new group
            return {
              ...group,
              promptCount: (group.promptCount || 0) + 1,
              prompts: [...(group.prompts || []), prompt.id]
            }
          }
          return group
        })
        localStorage.setItem("groups", JSON.stringify(updatedGroups))
      }
    }

    updatePromptInStorage(updatedPrompt)
    setPrompt(updatedPrompt)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedVersion({})
  }

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } },
    field: keyof PromptVersion | "groupId" | "visibility" | "tags"
  ) => {
    const { name, value } = e.target
    setEditedVersion((prev) => ({
      ...prev,
      [field]:
        field === "models" ||
        field === "tools" ||
        field === "useCases" ||
        field === "tags"
          ? value.split(",").map((item) => item.trim())
          : value
    }))
  }

  const handleEditName = () => {
    setIsEditingName(true)
    setEditedName(prompt?.title || "")
  }

  const handleSaveName = () => {
    if (!prompt) return
    const updatedPrompt = {
      ...prompt,
      title: editedName
    }
    updatePromptInStorage(updatedPrompt)
    setPrompt(updatedPrompt)
    setIsEditingName(false)
  }

  const handleCancelEditName = () => {
    setIsEditingName(false)
    setEditedName(prompt?.title || "")
  }

  const updatePromptInStorage = (updatedPrompt: Prompt) => {
    const storedPrompts = localStorage.getItem("prompts")
    if (storedPrompts) {
      const prompts: Prompt[] = JSON.parse(storedPrompts)
      const updatedPrompts = prompts.map((p) =>
        p.id === updatedPrompt.id ? updatedPrompt : p
      )
      localStorage.setItem("prompts", JSON.stringify(updatedPrompts))
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!prompt || !currentVersionData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href={sourceRoute === "home" ? "/" : `/${sourceRoute}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {sourceRoute.charAt(0).toUpperCase() + sourceRoute.slice(1)}
          </Button>
        </Link>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">{error || "Prompt not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={sourceRoute === "home" ? "/" : `/${sourceRoute}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {sourceRoute.charAt(0).toUpperCase() + sourceRoute.slice(1)}
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Versions</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCreateNewVersion}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <VersionSelector
            versions={prompt.versions || []}
            currentVersion={selectedVersion || prompt.currentVersion}
            onVersionSelect={handleVersionSelect}
          />
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <UserAvatar
                    src={prompt.author.avatar}
                    alt={prompt.author.name}
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{prompt.author.name}</p>
                      {prompt.visibility === "public" ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Version
                  </Button>
                )}
              </div>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold"
                  />
                  <Button onClick={handleSaveName} size="sm">
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEditName}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl">{prompt.title}</CardTitle>
                  <Button onClick={handleEditName} size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2 mb-4">
                    <Label>Visibility</Label>
                    <RadioGroup
                      value={
                        editedVersion.visibility ||
                        currentVersionData.visibility
                      }
                      onValueChange={(value) =>
                        handleInputChange(
                          { target: { name: "visibility", value } } as any,
                          "visibility"
                        )
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
                  <div className="space-y-2">
                    <Label>Group</Label>
                    <Select
                      value={editedVersion.groupId || prompt?.groupId || "none"}
                      onValueChange={(value) =>
                        handleInputChange(
                          {
                            target: {
                              name: "groupId",
                              value: value === "none" ? undefined : value
                            }
                          } as any,
                          "groupId"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No group</SelectItem>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={
                        editedVersion.content || currentVersionData.content
                      }
                      onChange={(e) => handleInputChange(e, "content")}
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="details">Details</Label>
                    <Textarea
                      id="details"
                      value={
                        editedVersion.details || currentVersionData.details
                      }
                      onChange={(e) => handleInputChange(e, "details")}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="useCases">
                      Use Cases (comma-separated)
                    </Label>
                    <Input
                      id="useCases"
                      value={
                        editedVersion.useCases?.join(", ") ||
                        currentVersionData.useCases.join(", ")
                      }
                      onChange={(e) => handleInputChange(e, "useCases")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      value={editedVersion.type || currentVersionData.type}
                      onChange={(e) => handleInputChange(e, "type")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={
                        editedVersion.language || currentVersionData.language
                      }
                      onChange={(e) => handleInputChange(e, "language")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="models">Models (comma-separated)</Label>
                    <Input
                      id="models"
                      value={
                        editedVersion.models?.join(", ") ||
                        currentVersionData.models.join(", ")
                      }
                      onChange={(e) => handleInputChange(e, "models")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tools">Tools (comma-separated)</Label>
                    <Input
                      id="tools"
                      value={
                        editedVersion.tools?.join(", ") ||
                        currentVersionData.tools.join(", ")
                      }
                      onChange={(e) => handleInputChange(e, "tools")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={
                        editedVersion.tags?.join(", ") ||
                        prompt?.tags?.join(", ") ||
                        ""
                      }
                      onChange={(e) => handleInputChange(e, "tags")}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="content" className="w-full">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">
                        {currentVersionData.content}
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-8">
                    {/* Details Section */}
                    <div className="prose dark:prose-invert max-w-none">
                      <h3 className="text-lg font-semibold mb-2">
                        Description
                      </h3>
                      <p>{currentVersionData.details}</p>
                    </div>

                    {/* Use Cases Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Use Cases</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {currentVersionData.useCases.map((useCase, index) => (
                          <li key={index}>{useCase}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Type</h3>
                          <Badge variant="outline">
                            {currentVersionData.type}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Language
                          </h3>
                          <Badge variant="outline">
                            {currentVersionData.language}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Visibility
                          </h3>
                          <Badge variant="outline">
                            {currentVersionData.visibility}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Models</h3>
                          <div className="flex flex-wrap gap-2">
                            {currentVersionData.models.map((model, index) => (
                              <Badge key={index} variant="secondary">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Tools</h3>
                          <div className="flex flex-wrap gap-2">
                            {currentVersionData.tools.map((tool, index) => (
                              <Badge key={index} variant="secondary">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            {!isEditing && (
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  {prompt.likes} Likes
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Discuss
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
