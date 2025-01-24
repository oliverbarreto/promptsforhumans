import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PromptVersion } from "@/types/prompt"

interface VersionSelectorProps {
  versions: PromptVersion[]
  currentVersion: string
  onVersionSelect: (version: string) => void
}

export function VersionSelector({ versions, currentVersion, onVersionSelect }: VersionSelectorProps) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-2">
        {versions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((version) => (
            <Button
              key={version.id}
              variant="ghost"
              className={cn(
                "w-full justify-start px-2 hover:bg-muted",
                version.version === currentVersion && "bg-muted",
              )}
              onClick={() => onVersionSelect(version.version)}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Version {version.version}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(version.createdAt), "MMM d, yyyy HH:mm")}
                </span>
              </div>
            </Button>
          ))}
      </div>
    </ScrollArea>
  )
}

