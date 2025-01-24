export interface Group {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  promptCount: number
  authorId: string
  visibility: "public" | "private"
}

