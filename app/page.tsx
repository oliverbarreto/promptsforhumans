"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { PromptList } from "@/components/prompt-list"
import type { Prompt } from "@/types/prompt"
import { mockPrompts } from "@/data/mock-data"
import { Filter, FilterX, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const storedPrompts = localStorage.getItem("prompts")
    if (storedPrompts) {
      setPrompts(JSON.parse(storedPrompts))
    } else {
      setPrompts(mockPrompts)
      localStorage.setItem("prompts", JSON.stringify(mockPrompts))
    }
  }, [])

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

  const filteredPrompts = prompts.filter((prompt) => {
    // Apply search term filter
    const matchesSearch = prompt.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    // Apply sidebar filters
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
      {/* Hero Section */}
      <div className="relative bg-[linear-gradient(135deg,#0033FF,#3366FF,#6699FF)] bg-[length:300%_300%] animate-gradient text-white py-16 mb-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Prompt Hub for Humans</h1>
          <p className="text-xl">
            Explore and contribute prompts to the community hub
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Explore the community</h2>
        <div className="flex items-center gap-2">
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
          placeholder="Search prompts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar - First on mobile, right side on desktop */}
        <div
          className={cn(
            "w-full lg:w-[300px] transition-all duration-200 order-first lg:order-last",
            isFilterVisible ? "block" : "hidden"
          )}
        >
          <div className="lg:sticky lg:top-4">
            <FiltersSidebar
              prompts={prompts}
              selectedFilters={filters}
              onFilterChange={handleSidebarFilterChange}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {prompts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">
                There are no prompts yet!
              </h2>
              <Link href="/create">
                <Button size="lg">Create your first prompt</Button>
              </Link>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              No prompts found. Try adjusting your search or filters.
            </p>
          ) : (
            <PromptList
              prompts={filteredPrompts}
              onUpdatePrompt={handleUpdatePrompt}
            />
          )}
        </div>
      </div>
    </div>
  )
}
