import { Prompt } from "./prompt"

export type Group = {
  id: string
  title: string
  description: string
  prompts: Prompt[]
  createdAt: Date
  updatedAt: Date
  userId: string
  isPublic: boolean
  isFavorite: boolean
}
