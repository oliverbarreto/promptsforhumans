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

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentFilter, setCurrentFilter] = useState("all")
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [error, setError] = useState<string | null>(null)

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
        filtered = filtered.filter(
          (prompt) =>
            prompt.title.toLowerCase().includes(lowercasedSearchTerm) ||
            prompt.versions[0].content
              .toLowerCase()
              .includes(lowercasedSearchTerm) ||
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

  const handleSidebarFilterChange = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters)
  }

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchTerm("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="flex gap-8 items-start">
      <div className="flex-grow space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Explore Prompts</h1>
          <Link href="/create">
            <Button>Create Prompt</Button>
          </Link>
        </div>
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
            <CommandSearch
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              initialSearchTerm={searchTerm}
              currentFilter={currentFilter}
            />
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
      <FiltersSidebar
        prompts={prompts}
        onFilterChange={handleSidebarFilterChange}
      />
    </div>
  )
}
