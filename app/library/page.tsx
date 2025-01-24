"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MoreVertical, Plus, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptList } from "@/components/prompt-list"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import type { Group } from "@/types/group"
import type { Prompt } from "@/types/prompt"
import { PromptCard } from "@/components/prompt-card"
import { mockPrompts, mockGroups } from "@/data/mock-data"

export default function LibraryPage() {
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [prompts, setPrompts] = useState(mockPrompts)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Fetch groups and prompts from localStorage.  This will likely need to be updated to fetch from a backend
    const fetchData = () => {
      const storedGroups = localStorage.getItem("groups")
      const storedPrompts = localStorage.getItem("prompts")

      if (storedGroups) {
        setGroups(JSON.parse(storedGroups))
      }

      if (storedPrompts) {
        setPrompts(JSON.parse(storedPrompts))
      }
    }

    fetchData()
  }, [])

  const handleCreateGroup = (newGroup: Group) => {
    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
    setIsCreateGroupOpen(false)
  }

  const handleDeleteGroup = (groupId: number) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId)
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
  }

  const handleToggleFavorite = (groupId: number) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, isFavorite: !group.isFavorite } : group
    )
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
  }

  const filteredPrompts = searchTerm
    ? prompts.filter((prompt) =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : prompts

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCreateGroupOpen(true)}>
            Create group
          </Button>
          <Link href="/create">
            <Button>Create prompt</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Groups</h2>
          <Button variant="link">See less</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <Link
                    href={`/library/groups/${group.id}`}
                    className="hover:underline"
                  >
                    {group.name}
                  </Link>
                  {group.isFavorite && (
                    <Star className="inline-block ml-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleToggleFavorite(group.id)}
                    >
                      {group.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/library/groups/${group.id}/edit`}>
                        Edit group
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      Delete group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {group.promptCount} prompts
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All prompts</h2>
        <Tabs defaultValue="recent">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="owned">Owned by me</TabsTrigger>
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

          <TabsContent value="recent" className="mt-4">
            <PromptList prompts={filteredPrompts} />
          </TabsContent>
          <TabsContent value="favorites" className="mt-4">
            <PromptList prompts={filteredPrompts.filter((p) => p.isFavorite)} />
          </TabsContent>
          <TabsContent value="owned" className="mt-4">
            <PromptList prompts={filteredPrompts} />
          </TabsContent>
          <TabsContent value="templates" className="mt-4">
            <PromptList prompts={filteredPrompts} />
          </TabsContent>
        </Tabs>
      </div>

      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        onSubmit={handleCreateGroup}
      />
    </div>
  )
}
