"use client"

import { type Prompt } from "@/types/prompt"
import { PromptCard } from "@/components/prompt-card"

interface PromptListProps {
  prompts: Prompt[]
  onUpdatePrompt?: (prompt: Prompt) => void
}

export function PromptList({ prompts, onUpdatePrompt }: PromptListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onUpdatePrompt={onUpdatePrompt}
        />
      ))}
    </div>
  )
}
