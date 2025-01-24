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

export interface Author {
  id: string
  name: string
  avatar?: string | null
}

export interface Prompt {
  id: string
  title: string
  description?: string
  content: string
  details?: string
  category?: string
  tags: string[]
  useCases: string[]
  type?: string
  language?: string
  model?: string
  author: Author
  createdAt: string
  updatedAt?: string
  likes: number
  views?: number
  currentVersion: string
  versions: PromptVersion[]
  visibility: "public" | "private"
  isArchived: boolean
  isFavorite: boolean
  groupId?: string
}
