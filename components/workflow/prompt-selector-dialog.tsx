"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Prompt } from "@/types/prompt"
import { Group } from "@/types/group"
import { AlertCircle, Check, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CreateGroupDialog } from "@/components/create-group-dialog"

interface PromptSelectorDialogProps {
  onPromptSelect: (prompt: Prompt) => void
}

export function PromptSelectorDialog({
  onPromptSelect
}: PromptSelectorDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadGroups()
      loadPrompts()
    } else {
      // Reset selections when dialog closes
      setSelectedGroup("")
      setSelectedPrompt(null)
    }
  }, [isOpen])

  const loadGroups = async () => {
    try {
      const storedGroups = localStorage.getItem("groups")
      if (storedGroups) {
        const parsedGroups = JSON.parse(storedGroups)
        // Transform the data to match Group type
        const formattedGroups = parsedGroups.map((group: any) => ({
          id: group.id,
          title: group.name, // Using name as title
          description: group.description
        }))
        setGroups(formattedGroups)
      }
    } catch (error) {
      console.error("Error loading groups:", error)
      setError("Failed to load groups")
    }
  }

  const loadPrompts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const storedPrompts = localStorage.getItem("prompts")
      if (storedPrompts) {
        const allPrompts: Prompt[] = JSON.parse(storedPrompts)
        setPrompts(allPrompts)
      } else {
        setError("No prompts found in the database")
      }
    } catch (error) {
      setError(`Error loading prompts: ${error}`)
      console.error("Error loading prompts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGroupSelect = (value: string) => {
    setSelectedGroup(value)
    setSelectedPrompt(null) // Reset prompt selection when group changes
  }

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
  }

  const handleCreateGroup = (newGroup: Group) => {
    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
    setSelectedGroup(newGroup.id)
    setIsCreateGroupOpen(false)
  }

  const handleConfirm = () => {
    if (selectedPrompt) {
      onPromptSelect(selectedPrompt)
      setIsOpen(false)
    }
  }

  // Filter prompts based on selected group
  const filteredPrompts = prompts.filter((prompt) => {
    if (!selectedGroup) return true // Show all prompts if no group selected
    return prompt.groupId === selectedGroup // Match based on groupId
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          Select prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select a prompt</DialogTitle>
          <DialogDescription>
            Choose a group and then select a prompt to associate with this step.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Group</Label>
              <div className="flex gap-2">
                <Select value={selectedGroup} onValueChange={handleGroupSelect}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.title}
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
              <Label>Select Prompt</Label>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm text-muted-foreground">
                        Loading prompts...
                      </p>
                    </div>
                  ) : filteredPrompts.length > 0 ? (
                    filteredPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={cn(
                          "rounded-lg border p-4 hover:bg-muted cursor-pointer transition-colors relative",
                          selectedPrompt?.id === prompt.id &&
                            "bg-muted border-primary"
                        )}
                        onClick={() => handlePromptSelect(prompt)}
                      >
                        {selectedPrompt?.id === prompt.id && (
                          <div className="absolute right-2 top-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <h3 className="font-medium mb-2">{prompt.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {prompt.content}
                        </p>
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {prompt.tags.map((tag) => (
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
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm text-muted-foreground">
                        No prompts found in this group
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedPrompt}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        onSubmit={handleCreateGroup}
      />
    </Dialog>
  )
}
