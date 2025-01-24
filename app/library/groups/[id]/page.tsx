"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptList } from "@/components/prompt-list"
import { GroupHeader } from "@/components/group-header"
import type { Group } from "@/types/group"
import type { Prompt } from "@/types/prompt"

export default function GroupPage() {
  const { id } = useParams() as { id: string }
  const [group, setGroup] = useState<Group | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = () => {
      try {
        // Fetch group data
        const storedGroups = localStorage.getItem("groups")
        const groups: Group[] = storedGroups ? JSON.parse(storedGroups) : []
        const foundGroup = groups.find((g) => g.id === Number(id))

        if (!foundGroup) {
          setError("Group not found")
          return
        }

        setGroup(foundGroup)

        // Fetch prompts data
        const storedPrompts = localStorage.getItem("prompts")
        const allPrompts: Prompt[] = storedPrompts ? JSON.parse(storedPrompts) : []
        const groupPrompts = allPrompts.filter((prompt) => prompt.groupId === Number(id))
        setPrompts(groupPrompts)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load group data")
      }
    }

    fetchData()
  }, [id])

  const filteredPrompts = searchTerm
    ? prompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.versions[0].content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : prompts

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link href="/library">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse w-full max-w-2xl">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/library">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </Link>
      </div>

      <GroupHeader
        group={group}
        promptCount={prompts.length}
        onGroupUpdate={(updatedGroup) => setGroup(updatedGroup)}
      />

      <div className="space-y-4">
        <Tabs defaultValue="recent" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <TabsContent value="recent" className="mt-6">
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No prompts in this group yet</h3>
                <p className="text-muted-foreground mb-4">Start adding prompts to this group to see them here.</p>
                <Link href="/create">
                  <Button>Create New Prompt</Button>
                </Link>
              </div>
            ) : (
              <PromptList prompts={filteredPrompts} />
            )}
          </TabsContent>
          <TabsContent value="favorites" className="mt-6">
            <PromptList prompts={filteredPrompts.filter((p) => p.isFavorite)} />
          </TabsContent>
          <TabsContent value="templates" className="mt-6">
            <PromptList prompts={filteredPrompts.filter((p) => p.tags.includes("template"))} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

