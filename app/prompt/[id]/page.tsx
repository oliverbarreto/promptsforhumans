"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, ArrowLeft, Edit, Plus } from "lucide-react"
import { VersionSelector } from "@/components/version-selector"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Prompt, PromptVersion } from "@/types/prompt"

export default function PromptDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedVersion, setEditedVersion] = useState<Partial<PromptVersion>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(prompt?.title || "")

  useEffect(() => {
    const fetchPrompt = () => {
      setIsLoading(true)
      setError(null)
      if (!id) {
        setError("Invalid prompt ID")
        setIsLoading(false)
        return
      }
      try {
        const storedPrompts = localStorage.getItem("prompts")
        if (storedPrompts) {
          const prompts: Prompt[] = JSON.parse(storedPrompts)
          const foundPrompt = prompts.find((p) => p.id === Number(id))
          if (foundPrompt) {
            setPrompt(foundPrompt)
            setSelectedVersion(foundPrompt.currentVersion)
          } else {
            setError("Prompt not found")
          }
        } else {
          setError("No prompts found")
        }
      } catch (error) {
        console.error("Error fetching prompt:", error)
        setError("Failed to load prompt")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrompt()
  }, [id])

  const currentVersionData = prompt?.versions?.find((v) => v.version === selectedVersion) || null

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
      visibility: currentVersionData.visibility,
    }

    const updatedPrompt = {
      ...prompt,
      currentVersion: newVersionNumber,
      versions: [...(prompt.versions || []), newVersion],
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
      ...editedVersion,
    }

    const updatedPrompt = {
      ...prompt,
      visibility: editedVersion.visibility || prompt.visibility,
      versions: prompt.versions.map((v) => (v.version === selectedVersion ? updatedVersion : v)),
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } },
    field: keyof PromptVersion | "visibility",
  ) => {
    const { name, value } = e.target
    setEditedVersion((prev) => ({
      ...prev,
      [field]:
        field === "models" || field === "tools" || field === "useCases"
          ? value.split(",").map((item) => item.trim())
          : value,
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
      title: editedName,
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
      const updatedPrompts = prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
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
        <Link href="/explore">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
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
      <Link href="/explore">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Explore
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Versions</h3>
            <Button size="sm" variant="outline" onClick={handleCreateNewVersion}>
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
                  <Image
                    src={prompt.author.avatar || "/placeholder.svg"}
                    alt={prompt.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{prompt.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Version {currentVersionData.version} •{" "}
                      {format(new Date(currentVersionData.createdAt), "MMM d, yyyy")}
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
                  <Button onClick={handleCancelEditName} size="sm" variant="outline">
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
                      value={editedVersion.visibility || currentVersionData.visibility}
                      onValueChange={(value) =>
                        handleInputChange({ target: { name: "visibility", value } } as any, "visibility")
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
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={editedVersion.content || currentVersionData.content}
                      onChange={(e) => handleInputChange(e, "content")}
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="details">Details</Label>
                    <Textarea
                      id="details"
                      value={editedVersion.details || currentVersionData.details}
                      onChange={(e) => handleInputChange(e, "details")}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="useCases">Use Cases (comma-separated)</Label>
                    <Input
                      id="useCases"
                      value={editedVersion.useCases?.join(", ") || currentVersionData.useCases.join(", ")}
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
                      value={editedVersion.language || currentVersionData.language}
                      onChange={(e) => handleInputChange(e, "language")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="models">Models (comma-separated)</Label>
                    <Input
                      id="models"
                      value={editedVersion.models?.join(", ") || currentVersionData.models.join(", ")}
                      onChange={(e) => handleInputChange(e, "models")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tools">Tools (comma-separated)</Label>
                    <Input
                      id="tools"
                      value={editedVersion.tools?.join(", ") || currentVersionData.tools.join(", ")}
                      onChange={(e) => handleInputChange(e, "tools")}
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
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{currentVersionData.content}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{currentVersionData.details}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Use Cases</h3>
                      <ul className="list-disc list-inside">
                        {currentVersionData.useCases.map((useCase, index) => (
                          <li key={index}>{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="metadata" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Type</h3>
                        <p>{currentVersionData.type}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Language</h3>
                        <p>{currentVersionData.language}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Models</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentVersionData.models.map((model, index) => (
                            <Badge key={index} variant="secondary">
                              {model}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Tools</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentVersionData.tools.map((tool, index) => (
                            <Badge key={index} variant="secondary">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Visibility</h3>
                        <p>{currentVersionData.visibility}</p>
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

