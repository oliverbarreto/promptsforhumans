"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown, Play } from "lucide-react"
import { Workflow } from "@/types/workflow"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface WorkflowStepsProps {
  workflow: Workflow
}

export function WorkflowSteps({ workflow }: WorkflowStepsProps) {
  return (
    <div className="space-y-4">
      {workflow.steps.map((step, index) => (
        <div key={step.id} className="space-y-4">
          <Card
            className={cn(
              "relative",
              index === workflow.steps.length - 1 ? "mb-8" : ""
            )}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Run step
                  </Button>
                </div>
                {step.prompt && (
                  <div className="pl-12">
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {step.prompt.title}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {step.prompt.content}
                          </p>
                          {step.prompt.tags && step.prompt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {step.prompt.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {index < workflow.steps.length - 1 && (
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <Button disabled={workflow.steps.length === 0}>
          <Play className="h-4 w-4 mr-2" />
          Run workflow
        </Button>
      </div>
    </div>
  )
}
