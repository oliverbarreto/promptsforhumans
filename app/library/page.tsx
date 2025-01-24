"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { MoreVertical, Plus, Search, Star, Filter, FilterX } from "lucide-react"
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
import { FiltersSidebar } from "@/components/filters-sidebar"
import { cn } from "@/lib/utils"
import type { Group } from "@/types/group"
import type { Prompt, PromptVersion } from "@/types/prompt"
import { mockPrompts, mockGroups } from "@/data/mock-data"

export default function LibraryPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const [filters, setFilters] = useState<Record<string, string[]>>({
    useCases: [],
    type: [],
    language: [],
    models: [],
    tools: []
  })

  useEffect(() => {
    // Fetch groups and prompts from localStorage
    const fetchData = () => {
      const storedGroups = localStorage.getItem("groups")
      const storedPrompts = localStorage.getItem("prompts")

      // Initialize groups
      if (!storedGroups || JSON.parse(storedGroups).length === 0) {
        localStorage.setItem("groups", JSON.stringify(mockGroups))
        setGroups(mockGroups)
      } else {
        try {
          const parsedGroups = JSON.parse(storedGroups)
          setGroups(parsedGroups)
        } catch (error) {
          console.error("Error parsing stored groups:", error)
          localStorage.setItem("groups", JSON.stringify(mockGroups))
          setGroups(mockGroups)
        }
      }

      // Initialize prompts
      if (!storedPrompts || JSON.parse(storedPrompts).length === 0) {
        localStorage.setItem("prompts", JSON.stringify(mockPrompts))
        setPrompts(mockPrompts)
      } else {
        try {
          const parsedPrompts = JSON.parse(storedPrompts)
          setPrompts(parsedPrompts)
        } catch (error) {
          console.error("Error parsing stored prompts:", error)
          localStorage.setItem("prompts", JSON.stringify(mockPrompts))
          setPrompts(mockPrompts)
        }
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

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId)
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
  }

  const handleToggleFavorite = (groupId: string) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, isFavorite: !group.isFavorite } : group
    )
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
  }

  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    const updatedPrompts = prompts.map((p) =>
      p.id === updatedPrompt.id ? updatedPrompt : p
    )
    setPrompts(updatedPrompts)
    localStorage.setItem("prompts", JSON.stringify(updatedPrompts))
  }

  const handleSidebarFilterChange = useCallback(
    (newFilters: Record<string, string[]>) => {
      setFilters(newFilters)
    },
    []
  )

  const filterPrompts = useCallback(
    (term: string, sidebarFilters: Record<string, string[]>) => {
      let filtered = prompts

      // Apply search term filter
      if (term) {
        const lowercasedSearchTerm = term.toLowerCase()
        filtered = filtered.filter(
          (prompt) =>
            prompt.title.toLowerCase().includes(lowercasedSearchTerm) ||
            (prompt.description?.toLowerCase() || "").includes(
              lowercasedSearchTerm
            ) ||
            prompt.tags.some((tag) =>
              tag.toLowerCase().includes(lowercasedSearchTerm)
            )
        )
      }

      // Apply sidebar filters
      Object.entries(sidebarFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          filtered = filtered.filter((prompt) => {
            if (key === "useCases" || key === "models" || key === "tools") {
              const value = prompt.versions[0][key as keyof PromptVersion]
              return (
                Array.isArray(value) &&
                value.some((v: string) => values.includes(v))
              )
            } else if (Array.isArray(prompt[key as keyof Prompt])) {
              return (prompt[key as keyof Prompt] as string[]).some((value) =>
                values.includes(value)
              )
            } else {
              const value = prompt[key as keyof Prompt]
              return values.includes(value as string)
            }
          })
        }
      })

      return filtered
    },
    [prompts]
  )

  const filteredPrompts = useMemo(() => {
    return filterPrompts(searchTerm, filters)
  }, [filterPrompts, searchTerm, filters])

  return (
    <div className="flex gap-8 items-start">
      <div
        className={cn(
          "flex-1 space-y-8",
          isFilterVisible ? "max-w-[calc(100%-320px)]" : "max-w-full"
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateGroupOpen(true)}
            >
              Create group
            </Button>
            <Link href="/create">
              <Button>Create prompt</Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              title={isFilterVisible ? "Hide filters" : "Show filters"}
            >
              {isFilterVisible ? (
                <FilterX className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
            </Button>
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
                      href={`/library/groups/${encodeURIComponent(group.id)}`}
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
                        <Link
                          href={`/library/groups/${encodeURIComponent(
                            group.id
                          )}/edit`}
                        >
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
            <PromptList
              prompts={filteredPrompts}
              onUpdatePrompt={handleUpdatePrompt}
            />
          </TabsContent>
          <TabsContent value="favorites" className="mt-4">
            <PromptList
              prompts={filteredPrompts.filter((p) => p.isFavorite)}
              onUpdatePrompt={handleUpdatePrompt}
            />
          </TabsContent>
          <TabsContent value="owned" className="mt-4">
            <PromptList
              prompts={filteredPrompts}
              onUpdatePrompt={handleUpdatePrompt}
            />
          </TabsContent>
          <TabsContent value="templates" className="mt-4">
            <PromptList
              prompts={filteredPrompts}
              onUpdatePrompt={handleUpdatePrompt}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div
        className={cn(
          "fixed md:relative inset-y-0 right-0 z-50 w-[300px] bg-background border-l md:border-none transition-transform duration-200 ease-in-out",
          "md:w-[300px] md:sticky md:top-8",
          isFilterVisible ? "translate-x-0" : "translate-x-full md:hidden"
        )}
      >
        <div className="relative h-full md:h-auto">
          <div className="p-4 md:p-0">
            <FiltersSidebar
              prompts={prompts}
              onFilterChange={handleSidebarFilterChange}
              selectedFilters={filters}
            />
          </div>
        </div>
      </div>

      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        onSubmit={handleCreateGroup}
      />
    </div>
  )
}
