"use client"

import { useState } from "react"
import { MoreVertical, Pencil, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Group } from "@/types/group"

interface GroupHeaderProps {
  group: Group
  promptCount: number
  onGroupUpdate: (group: Group) => void
}

export function GroupHeader({ group, promptCount, onGroupUpdate }: GroupHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(group.name)

  const handleSave = () => {
    const updatedGroup = { ...group, name: editedName }
    // Update in localStorage
    const storedGroups = localStorage.getItem("groups")
    if (storedGroups) {
      const groups: Group[] = JSON.parse(storedGroups)
      const updatedGroups = groups.map((g) => (g.id === group.id ? updatedGroup : g))
      localStorage.setItem("groups", JSON.stringify(updatedGroups))
    }
    onGroupUpdate(updatedGroup)
    setIsEditing(false)
  }

  const handleToggleFavorite = () => {
    const updatedGroup = { ...group, isFavorite: !group.isFavorite }
    // Update in localStorage
    const storedGroups = localStorage.getItem("groups")
    if (storedGroups) {
      const groups: Group[] = JSON.parse(storedGroups)
      const updatedGroups = groups.map((g) => (g.id === group.id ? updatedGroup : g))
      localStorage.setItem("groups", JSON.stringify(updatedGroups))
    }
    onGroupUpdate(updatedGroup)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl font-bold h-auto"
                />
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {group.name}
                {group.isFavorite && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Badge variant="secondary">{promptCount} prompts</Badge>
            <Badge variant="outline">{group.visibility}</Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleFavorite}>
              <Star className="mr-2 h-4 w-4" />
              {group.isFavorite ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                // Handle delete - you might want to add a confirmation dialog here
              }}
            >
              Delete group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {group.description && <p className="text-muted-foreground max-w-2xl">{group.description}</p>}
    </div>
  )
}

