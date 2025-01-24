import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Star } from "lucide-react"
import type { Prompt } from "@/types/prompt"

interface PromptListProps {
  prompts: Prompt[]
}

export function PromptList({ prompts }: PromptListProps) {
  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <Link
          key={prompt.id}
          href={`/prompt/${prompt.id}`}
          className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-accent"
        >
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={prompt.author.avatar || "/placeholder.svg"}
              alt={prompt.author.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium truncate">{prompt.title}</h3>
              {prompt.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated {formatDistanceToNow(new Date(prompt.createdAt))} ago
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

