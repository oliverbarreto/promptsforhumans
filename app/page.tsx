"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { PromptCard } from "@/components/prompt-card"
import type { Prompt } from "@/types/prompt"
import { mockPrompts } from "@/data/mock-data"
import { Filter, FilterX, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

function PromptGrid({
  prompts,
  onUpdatePrompt
}: {
  prompts: Prompt[]
  onUpdatePrompt: (prompt: Prompt) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Record<string, string[]>>({
    useCases: [],
    type: [],
    language: [],
    models: [],
    tools: []
  })
  const [isFilterVisible, setIsFilterVisible] = useState(true)

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const storedPrompts = localStorage.getItem("prompts")
        if (storedPrompts) {
          const parsedPrompts = JSON.parse(storedPrompts)
          setPrompts(parsedPrompts)
          setFilteredPrompts(parsedPrompts)
        } else {
          setPrompts(mockPrompts)
          setFilteredPrompts(mockPrompts)
          localStorage.setItem("prompts", JSON.stringify(mockPrompts))
        }
      } catch (error) {
        console.error("Error fetching prompts:", error)
      }
    }

    fetchPrompts()
  }, [])

  const filterPrompts = useCallback(
    (term: string, sidebarFilters: Record<string, string[]>) => {
      return prompts.filter((prompt) => {
        // Apply search term filter
        const matchesSearch =
          term === "" || prompt.title.toLowerCase().includes(term.toLowerCase())

        // Apply sidebar filters
        const matchesFilters = Object.entries(sidebarFilters).every(
          ([key, values]) => {
            if (values.length === 0) return true
            if (key === "type")
              return prompt.type && values.includes(prompt.type)
            if (key === "language")
              return prompt.language && values.includes(prompt.language)
            if (key === "useCases")
              return prompt.versions[0].useCases.some((value) =>
                values.includes(value)
              )
            if (key === "models")
              return prompt.versions[0].models.some((value) =>
                values.includes(value)
              )
            if (key === "tools")
              return prompt.versions[0].tools.some((value) =>
                values.includes(value)
              )
            return true
          }
        )

        return matchesSearch && matchesFilters
      })
    },
    [prompts]
  )

  useEffect(() => {
    const newFilteredPrompts = filterPrompts(searchTerm.toLowerCase(), filters)
    setFilteredPrompts(newFilteredPrompts)
  }, [searchTerm, filters, filterPrompts])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSidebarFilterChange = useCallback(
    (newFilters: Record<string, string[]>) => {
      setFilters(newFilters)
    },
    []
  )

  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    const updatedPrompts = prompts.map((p) =>
      p.id === updatedPrompt.id ? updatedPrompt : p
    )
    setPrompts(updatedPrompts)
    setFilteredPrompts(filterPrompts(searchTerm.toLowerCase(), filters))
    localStorage.setItem("prompts", JSON.stringify(updatedPrompts))
  }

  return (
    <div className="flex flex-col">
      <div className="relative bg-[linear-gradient(135deg,#0033FF,#3366FF,#6699FF)] bg-[length:300%_300%] animate-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">A Prompt Hub for Humans</h1>
            <p className="text-xl text-blue-100">
              Explore and contribute prompts to the human community
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Explore the community</h1>
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

        <div className="flex gap-8 items-start">
          <div
            className={cn(
              "flex-1 space-y-8",
              isFilterVisible ? "max-w-[calc(100%-320px)]" : "max-w-full"
            )}
          >
            {prompts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">
                  There are no prompts!!!
                </h2>
                <Link href="/create">
                  <Button size="lg">Create your first prompt here</Button>
                </Link>
              </div>
            ) : (
              <>
                {filteredPrompts.length === 0 ? (
                  <p>
                    No prompts found. Try a different search term or adjust your
                    filters.
                  </p>
                ) : (
                  <PromptGrid
                    prompts={filteredPrompts}
                    onUpdatePrompt={handleUpdatePrompt}
                  />
                )}
              </>
            )}
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

          {isFilterVisible && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsFilterVisible(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
