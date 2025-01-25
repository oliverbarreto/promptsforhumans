export interface PromptVersion {
  id: string
  version: string
  content: string
  details: string
  useCases: string[]
  type: string
  language: string
  models: string[]
  tools: string[]
  createdAt: string
  visibility: "public" | "private"
}

export interface Prompt {
  id: string
  title: string
  content: string
  group: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export type Author = {
  id: string
  name: string
  email: string
  avatar?: string
}
