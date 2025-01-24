"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Filter, FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { GroupCard } from "@/components/group-card"
import { PromptList } from "@/components/prompt-list"
import Link from "next/link"
import type { Group } from "@/types/group"
import type { Prompt } from "@/types/prompt"

export default function LibraryPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [groupToEdit, setGroupToEdit] = useState<Group | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const storedGroups = localStorage.getItem("groups")
    const storedPrompts = localStorage.getItem("prompts")

    if (storedGroups) {
      setGroups(JSON.parse(storedGroups))
    }
    if (storedPrompts) {
      setPrompts(JSON.parse(storedPrompts))
    }
  }, [])

  const handleCreateGroup = (newGroup: Group) => {
    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
    setIsCreateGroupOpen(false)
  }

  const handleEditGroup = (updatedGroup: Group) => {
    const updatedGroups = groups.map((group) =>
      group.id === updatedGroup.id ? updatedGroup : group
    )
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
    setGroupToEdit(undefined)
  }

  const handleStartEditGroup = (group: Group) => {
    setGroupToEdit(group)
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

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = prompt.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesFilters = Object.entries(filters).every(([key, values]) => {
      if (values.length === 0) return true
      if (key === "type") return prompt.type && values.includes(prompt.type)
      if (key === "language")
        return prompt.language && values.includes(prompt.language)
      if (key === "model") return prompt.model && values.includes(prompt.model)
      if (key === "visibility")
        return prompt.visibility && values.includes(prompt.visibility)
      return true
    })
    return matchesSearch && matchesFilters
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Library</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsCreateGroupOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Button>
          <Link href="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Prompt
            </Button>
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

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search prompts and groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="flex gap-6">
        <div className={`flex-1 space-y-6`}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onDelete={handleDeleteGroup}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleStartEditGroup}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Prompts</h2>
            <PromptList
              prompts={filteredPrompts}
              onUpdatePrompt={handleUpdatePrompt}
            />
          </div>
        </div>

        <div
          className={`w-[300px] transition-all duration-200 ${
            isFilterVisible ? "block" : "hidden"
          }`}
        >
          <div className="sticky top-4">
            <FiltersSidebar
              prompts={prompts}
              selectedFilters={filters}
              onFilterChange={handleSidebarFilterChange}
            />
          </div>
        </div>
      </div>

      <CreateGroupDialog
        open={isCreateGroupOpen || groupToEdit !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateGroupOpen(false)
            setGroupToEdit(undefined)
          }
        }}
        onSubmit={groupToEdit ? handleEditGroup : handleCreateGroup}
        initialGroup={groupToEdit}
      />
    </div>
  )
}
