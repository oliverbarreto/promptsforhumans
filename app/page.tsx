"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CommandSearch } from "@/components/command-search"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { PromptCard } from "@/components/prompt-card"
import { useDebounce } from "@/hooks/use-debounce"
import type { Prompt } from "@/types/prompt"
import { Input } from "@/components/ui/input"
import { mockPrompts } from "@/data/mock-data"
import { Filter, FilterX } from "lucide-react"
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
  const [currentFilter, setCurrentFilter] = useState("all")
  const [filters, setFilters] = useState<Record<string, string[]>>({
    useCases: [],
    type: [],
    language: [],
    models: [],
    tools: []
  })
  const [error, setError] = useState<string | null>(null)
  const [isFilterVisible, setIsFilterVisible] = useState(true)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

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
        setError("Failed to load prompts. Please try refreshing the page.")
      }
    }

    fetchPrompts()
  }, [])

  const filterPrompts = useCallback(
    (
      term: string,
      filter: string,
      sidebarFilters: Record<string, string[]>
    ) => {
      let filtered = prompts

      // Apply visibility/status filter
      switch (filter) {
        case "public":
          filtered = filtered.filter(
            (p) => p.visibility === "public" && !p.isArchived
          )
          break
        case "private":
          filtered = filtered.filter(
            (p) => p.visibility === "private" && !p.isArchived
          )
          break
        case "archived":
          filtered = filtered.filter((p) => p.isArchived)
          break
        case "favorites":
          filtered = filtered.filter((p) => p.isFavorite)
          break
        default:
          // "all" - show all non-archived prompts
          filtered = filtered.filter((p) => !p.isArchived)
          break
      }

      // Apply search term filter
      if (term !== "") {
        const lowercasedSearchTerm = term.toLowerCase()
        filtered = filtered.filter((prompt) => {
          const titleMatch = prompt.title
            .toLowerCase()
            .includes(lowercasedSearchTerm)
          const contentMatch = prompt.versions[0].content
            .toLowerCase()
            .includes(lowercasedSearchTerm)
          const tags = prompt.tags as string[]
          const tagsMatch = tags.some((tag) =>
            tag.toLowerCase().includes(lowercasedSearchTerm)
          )
          return titleMatch || contentMatch || tagsMatch
        })
      }

      // Apply sidebar filters
      Object.entries(sidebarFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          filtered = filtered.filter((prompt) => {
            if (key === "useCases" || key === "models" || key === "tools") {
              return prompt.versions[0][
                key as keyof (typeof prompt.versions)[0]
              ].some((value: string) => values.includes(value))
            } else if (Array.isArray(prompt[key as keyof Prompt])) {
              return (prompt[key as keyof Prompt] as string[]).some((value) =>
                values.includes(value)
              )
            } else {
              return values.includes(prompt[key as keyof Prompt] as string)
            }
          })
        }
      })

      return filtered
    },
    [prompts]
  )

  useEffect(() => {
    const newFilteredPrompts = filterPrompts(
      debouncedSearchTerm,
      currentFilter,
      filters
    )
    setFilteredPrompts(newFilteredPrompts)
  }, [debouncedSearchTerm, currentFilter, filters, filterPrompts])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter)
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
    setFilteredPrompts(
      filterPrompts(debouncedSearchTerm, currentFilter, filters)
    )
    localStorage.setItem("prompts", JSON.stringify(updatedPrompts))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">A Prompt Hub for Humans</h1>
            <p className="text-xl text-blue-100">
              Explore and contribute prompts to the human community
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <CommandSearch
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            initialSearchTerm={searchTerm}
            currentFilter={currentFilter}
          />
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/create">
              <Button>Create Prompt</Button>
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
