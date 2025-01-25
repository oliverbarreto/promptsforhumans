import { Prompt } from "./prompt"

export type Group = {
  id: string
  title: string
  name: string
  description: string
  prompts: string[]
  promptCount: number
  createdAt: Date
  updatedAt: Date
  userId: string
  isPublic: boolean
  isFavorite: boolean
  visibility: "public" | "private"
}
