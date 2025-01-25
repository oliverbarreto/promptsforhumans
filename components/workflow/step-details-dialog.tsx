"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { WorkflowStep } from "@/types/workflow"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface StepDetailsDialogProps {
  step: WorkflowStep
  stepNumber: number
}

export function StepDetailsDialog({
  step,
  stepNumber
}: StepDetailsDialogProps) {
  if (!step.prompt) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Show step
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Step {stepNumber}: {step.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full mt-4">
          <div className="space-y-6">
            {step.description && (
              <div>
                <h3 className="text-sm font-medium mb-2">Step Description</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Prompt Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Title</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.prompt.title}
                  </p>
                </div>

                {step.prompt.tags && step.prompt.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {step.prompt.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Content</h4>
                  <div className="rounded-lg bg-muted p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {step.prompt.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
