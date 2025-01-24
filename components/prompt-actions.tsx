"use client"

import { Archive, Globe, Heart, Lock, MoreVertical, Star, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { Prompt } from "@/types/prompt"

interface PromptActionsProps {
  prompt: Prompt
  onUpdatePrompt: (updatedPrompt: Prompt) => void
}

export function PromptActions({ prompt, onUpdatePrompt }: PromptActionsProps) {
  const handleVisibilityChange = () => {
    const updatedPrompt = {
      ...prompt,
      visibility: prompt.visibility === "public" ? "private" : "public",
    }
    onUpdatePrompt(updatedPrompt)
    toast.success(`Prompt is now ${updatedPrompt.visibility === "public" ? "public" : "private"}`)
  }

  const handleArchiveToggle = () => {
    const updatedPrompt = {
      ...prompt,
      isArchived: !prompt.isArchived,
    }
    onUpdatePrompt(updatedPrompt)
    toast.success(updatedPrompt.isArchived ? "Prompt archived" : "Prompt restored from archive")
  }

  const handleFavoriteToggle = () => {
    const updatedPrompt = {
      ...prompt,
      isFavorite: !prompt.isFavorite,
    }
    onUpdatePrompt(updatedPrompt)
    toast.success(updatedPrompt.isFavorite ? "Added to favorites" : "Removed from favorites")
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFavoriteToggle}
        className={prompt.isFavorite ? "text-yellow-500" : ""}
      >
        <Star className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleVisibilityChange}>
        {prompt.visibility === "public" ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleFavoriteToggle}>
            <Heart className="mr-2 h-4 w-4" />
            {prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleVisibilityChange}>
            {prompt.visibility === "public" ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Make private
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Make public
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchiveToggle}>
            {prompt.isArchived ? (
              <>
                <Archive className="mr-2 h-4 w-4" />
                Restore from archive
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                Archive prompt
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

