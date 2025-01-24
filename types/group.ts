export interface Group {
  id: string
  name: string
  description: string
  promptCount: number
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  authorId: string
  visibility: "public" | "private"
  prompts: string[]
}
