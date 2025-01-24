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

export interface Prompt {
  id: number
  title: string
  author: {
    name: string
    avatar: string
  }
  groupId?: number
  tags: string[]
  likes: number
  createdAt: string
  currentVersion: string
  versions: PromptVersion[]
  visibility: "public" | "private"
  isArchived: boolean
  isFavorite: boolean
}

