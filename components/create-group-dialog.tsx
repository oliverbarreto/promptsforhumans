"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Group } from "@/types/group"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (group: Group) => void
  initialGroup?: Group
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  onSubmit,
  initialGroup
}: CreateGroupDialogProps) {
  const [name, setName] = useState(initialGroup?.name || "")
  const [description, setDescription] = useState(
    initialGroup?.description || ""
  )
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  // Reset form when dialog opens/closes or initialGroup changes
  useEffect(() => {
    if (initialGroup) {
      setName(initialGroup.name)
      setDescription(initialGroup.description)
    } else {
      setName("")
      setDescription("")
      setVisibility("public")
    }
  }, [initialGroup, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (initialGroup) {
      // Update existing group
      const updatedGroup: Group = {
        ...initialGroup,
        name,
        description,
        updatedAt: new Date()
      }
      onSubmit(updatedGroup)
    } else {
      // Create new group
      const newGroup: Group = {
        id: String(Date.now()),
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        visibility,
        prompts: [], // Initialize empty prompts array
        title: "",
        promptCount: 0,
        userId: "",
        isPublic: false
      }
      onSubmit(newGroup)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialGroup ? "Edit group" : "Create new group"}
          </DialogTitle>
          <DialogDescription>
            {initialGroup
              ? "Edit your group details. Groups can be public or private."
              : "Create a new group to organize your prompts. Groups can be public or private."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter group description"
              />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup
                value={visibility}
                onValueChange={(value: "public" | "private") =>
                  setVisibility(value)
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
          </div>
          <DialogFooter>
            <Button type="submit">
              {initialGroup ? "Save changes" : "Create group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
