"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, ExternalLink } from "lucide-react"
import { Workflow } from "@/types/workflow"
import { StepDetailsDialog } from "./step-details-dialog"
import Link from "next/link"

interface WorkflowStepsViewProps {
  workflow: Workflow
}

export function WorkflowStepsView({ workflow }: WorkflowStepsViewProps) {
  return (
    <div className="space-y-4">
      {workflow.steps.map((step, index) => (
        <Card key={step.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                {step.description && (
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StepDetailsDialog step={step} stepNumber={index + 1} />
                {step.prompt && (
                  <Link href={`/prompt/${step.prompt.id}?from=workflow`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Prompt Details
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
