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
  email: string
  avatar?: string
}

export interface Prompt {
  id: string
  title: string
  content: string
  group: string
  groupId?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  author: Author
  versions: PromptVersion[]
  currentVersion: string
  visibility: "public" | "private"
  isArchived: boolean
  isFavorite: boolean
  likes: number
}
