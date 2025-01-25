"use client"

import Link from "next/link"
import { MoreVertical, Pencil, Star, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Group } from "@/types/group"
import { cn } from "@/lib/utils"

interface GroupCardProps {
  group: Group
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onEdit: (group: Group) => void
}

export function GroupCard({
  group,
  onDelete,
  onToggleFavorite,
  onEdit
}: GroupCardProps) {
  return (
    <Link href={`/library/groups/${group.id}`}>
      <Card
        className={cn(
          "h-full cursor-pointer",
          "hover:bg-muted/50 transition-colors"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/library/groups/${group.id}?from=${
                window.location.pathname.split("/")[1] || "library"
              }`}
              className="text-xl font-semibold hover:underline"
            >
              {group.name}
            </Link>
            <div className="flex items-center gap-2">
              {group.isFavorite && (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(group)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleFavorite(group.id)}>
                    <Star className="mr-2 h-4 w-4" />
                    {group.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(group.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {group.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {group.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">{group.promptCount} prompts</Badge>
            <Badge variant="outline">
              {group.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  )
}
