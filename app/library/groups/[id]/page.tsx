"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PromptList } from "@/components/prompt-list"
import type { Group } from "@/types/group"
import type { Prompt } from "@/types/prompt"

export default function GroupPage() {
  const { id } = useParams() as { id: string }
  const [group, setGroup] = useState<Group | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroupAndPrompts = () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch group
        const storedGroups = localStorage.getItem("groups")
        if (!storedGroups) {
          setError("No groups found")
          return
        }

        const groups: Group[] = JSON.parse(storedGroups)
        const foundGroup = groups.find((g) => g.id === id)
        if (!foundGroup) {
          setError("Group not found")
          return
        }
        setGroup(foundGroup)

        // Fetch prompts
        const storedPrompts = localStorage.getItem("prompts")
        if (!storedPrompts) {
          setError("No prompts found")
          return
        }

        const allPrompts: Prompt[] = JSON.parse(storedPrompts)
        // Filter prompts that belong to this group using groupId
        const groupPrompts = allPrompts.filter((p) => p.groupId === id)
        setPrompts(groupPrompts)
      } catch (err) {
        console.error("Error fetching group and prompts:", err)
        setError("Failed to load group and prompts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupAndPrompts()
  }, [id])

  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    const storedPrompts = localStorage.getItem("prompts")
    if (storedPrompts) {
      const allPrompts: Prompt[] = JSON.parse(storedPrompts)
      const updatedPrompts = allPrompts.map((p) =>
        p.id === updatedPrompt.id ? updatedPrompt : p
      )
      localStorage.setItem("prompts", JSON.stringify(updatedPrompts))

      // Update local state
      setPrompts((prevPrompts) =>
        prevPrompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
      )
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/library">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
        </Link>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">{error || "Group not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/library">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
        <p className="text-muted-foreground">{group.description}</p>
      </div>

      {prompts.length > 0 ? (
        <PromptList prompts={prompts} onUpdatePrompt={handleUpdatePrompt} />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">
            No prompts in this group yet
          </p>
        </div>
      )}
    </div>
  )
}
