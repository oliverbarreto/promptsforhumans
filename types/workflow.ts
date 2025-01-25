import { type ReactNode } from "react"
import { Prompt } from "./prompt"

export interface WorkflowStep {
  id: string
  title: string
  description: string
  prompt: Prompt | null
}

export interface Workflow {
  id: string
  title: string
  description: string
  steps: WorkflowStep[]
  createdAt: string
  updatedAt: string
  isPublic: boolean
  isFavorite: boolean
}
