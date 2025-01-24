import Image from "next/image"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart, MessageCircle, Globe, Lock } from "lucide-react"
import { PromptActions } from "./prompt-actions"
import { UserAvatar } from "./user-avatar"
import type { Prompt } from "@/types/prompt"

interface PromptCardProps {
  prompt: Prompt
  onUpdatePrompt: (updatedPrompt: Prompt) => void
}

export function PromptCard({ prompt, onUpdatePrompt }: PromptCardProps) {
  const handleFavoriteToggle = () => {
    const updatedPrompt = {
      ...prompt,
      isFavorite: !prompt.isFavorite
    }
    onUpdatePrompt(updatedPrompt)
  }

  return (
    <Card
      className={cn("h-full flex flex-col", prompt.isArchived && "opacity-60")}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <UserAvatar
              src={prompt.author.avatar}
              alt={prompt.author.name}
              width={40}
              height={40}
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{prompt.author.name}</p>
                {prompt.visibility === "public" ? (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(prompt.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <PromptActions prompt={prompt} onUpdatePrompt={onUpdatePrompt} />
        </div>
        <CardTitle className="mt-4">{prompt.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3">{prompt.versions[0].content}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={handleFavoriteToggle}>
          <Heart
            className={cn(
              "mr-2 h-4 w-4",
              prompt.isFavorite && "fill-current text-red-500"
            )}
          />
          {prompt.likes}
        </Button>
        <Link href={`/prompt/${prompt.id}`}>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
