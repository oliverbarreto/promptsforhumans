"use client"

import { type Prompt } from "@/types/prompt"
import { PromptCard } from "@/components/prompt-card"

interface PromptListProps {
  prompts: Prompt[]
  onUpdatePrompt?: (prompt: Prompt) => void
}

export function PromptList({ prompts, onUpdatePrompt }: PromptListProps) {
  return (
    <div className="grid gap-4 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onUpdatePrompt={(updatedPrompt) => onUpdatePrompt?.(updatedPrompt)}
        />
      ))}
    </div>
  )
}
