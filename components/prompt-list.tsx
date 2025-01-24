import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Heart, Eye } from "lucide-react"
import { type Prompt } from "@/types/prompt"

interface PromptListProps {
  prompts: Prompt[]
}

export function PromptList({ prompts }: PromptListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="group relative rounded-lg border p-4 hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={prompt.author?.avatar || "/placeholder-avatar.png"}
                alt={prompt.author?.name || "Anonymous"}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{prompt.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {prompt.author?.name || "Anonymous"} •{" "}
                {formatDistanceToNow(new Date(prompt.createdAt), {
                  addSuffix: true
                })}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {prompt.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Heart className="h-4 w-4" />
              <span>{prompt.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Eye className="h-4 w-4" />
              <span>{prompt.views}</span>
            </div>
          </div>
          <Link href={`/prompts/${prompt.id}`} className="absolute inset-0">
            <span className="sr-only">View prompt</span>
          </Link>
        </div>
      ))}
    </div>
  )
}
