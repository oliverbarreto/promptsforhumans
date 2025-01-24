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
}

export interface Author {
  id: string
  name: string
  avatar?: string
}

export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  author: Author
  createdAt: string
  updatedAt: string
  likes: number
  views: number
  currentVersion: string
  versions: PromptVersion[]
  visibility: "public" | "private"
  isArchived: boolean
  isFavorite: boolean
}
