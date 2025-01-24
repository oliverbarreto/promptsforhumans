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

const mockPrompts: Prompt[] = [
  {
    id: 1,
    title: "Creative Story Starter",
    author: {
      name: "Alice Wonderland",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["creative", "writing", "fantasy"],
    likes: 120,
    createdAt: "2023-05-15T10:30:00Z",
    currentVersion: "1",
    versions: [
      {
        id: "1-1",
        version: "1",
        content:
          "You are a storyteller in a world where dreams come to life. Describe the most vivid dream that has manifested in reality.",
        details:
          "This prompt is designed to spark creativity and encourage imaginative storytelling. It combines elements of fantasy with the familiar concept of dreams to create a unique narrative starting point.",
        useCases: ["Creative Writing", "World Building", "Character Development"],
        type: "ChatPromptTemplate",
        language: "English",
        models: ["GPT-4", "Claude-2", "PaLM-2"],
        tools: ["Midjourney", "DALL-E"],
        createdAt: "2023-05-15T10:30:00Z",
      },
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: false,
  },
  {
    id: 2,
    title: "Code Refactoring Assistant",
    author: {
      name: "Bob Builder",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["coding", "refactoring", "best-practices"],
    likes: 95,
    createdAt: "2023-05-14T14:45:00Z",
    currentVersion: "2",
    versions: [
      {
        id: "2-1",
        version: "1",
        content:
          "Analyze this code snippet and suggest improvements for readability and efficiency: [Insert code snippet here]",
        details:
          "This prompt helps developers improve their code quality by providing specific suggestions for refactoring.",
        useCases: ["Code Review", "Learning Best Practices"],
        type: "CompletionPromptTemplate",
        language: "English",
        models: ["GPT-4", "CodeLlama"],
        tools: ["GitHub Copilot", "Amazon CodeWhisperer"],
        createdAt: "2023-05-14T14:45:00Z",
      },
      {
        id: "2-2",
        version: "2",
        content:
          "As an expert software developer, analyze the following code and provide specific recommendations for improving: 1) Code readability 2) Performance optimization 3) Best practices 4) Potential bugs. [Insert code snippet here]",
        details: "Enhanced version with more structured output and comprehensive code analysis categories.",
        useCases: ["Code Review", "Learning Best Practices", "Performance Optimization", "Bug Detection"],
        type: "CompletionPromptTemplate",
        language: "English",
        models: ["GPT-4", "CodeLlama", "Claude-2"],
        tools: ["GitHub Copilot", "Amazon CodeWhisperer", "SonarQube"],
        createdAt: "2023-05-16T09:30:00Z",
      },
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: false,
  },
  {
    id: 3,
    title: "Marketing Copy Generator",
    author: {
      name: "Charlie Marketer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["marketing", "copywriting", "advertising"],
    likes: 87,
    createdAt: "2023-05-17T08:15:00Z",
    currentVersion: "1",
    versions: [
      {
        id: "3-1",
        version: "1",
        content:
          "Create compelling marketing copy for a [product type] targeting [customer demographic]. Focus on the key benefits and unique selling points.",
        details:
          "This prompt assists in generating persuasive marketing content tailored to specific products and target audiences.",
        useCases: ["Ad Copywriting", "Product Descriptions", "Email Marketing"],
        type: "ChatPromptTemplate",
        language: "English",
        models: ["GPT-4", "Claude-2"],
        tools: ["Grammarly", "Hemingway Editor"],
        createdAt: "2023-05-17T08:15:00Z",
      },
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: false,
  },
  {
    id: 4,
    title: "Data Analysis Helper",
    author: {
      name: "Dana Analyst",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["data-analysis", "statistics", "visualization"],
    likes: 76,
    createdAt: "2023-05-18T11:20:00Z",
    currentVersion: "1",
    versions: [
      {
        id: "4-1",
        version: "1",
        content:
          "Given a dataset about [topic], perform the following analyses: 1) Descriptive statistics 2) Correlation analysis 3) Trend identification 4) Anomaly detection. Suggest appropriate visualizations for each analysis.",
        details:
          "This prompt guides data analysts through a structured approach to exploring and visualizing datasets.",
        useCases: ["Exploratory Data Analysis", "Business Intelligence", "Research"],
        type: "CompletionPromptTemplate",
        language: "English",
        models: ["GPT-4", "Claude-2"],
        tools: ["Python", "R", "Tableau", "Power BI"],
        createdAt: "2023-05-18T11:20:00Z",
      },
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: false,
  },
  {
    id: 5,
    title: "Language Learning Dialogue Creator",
    author: {
      name: "Eva Educator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["language-learning", "education", "dialogue"],
    likes: 65,
    createdAt: "2023-05-19T09:45:00Z",
    currentVersion: "1",
    versions: [
      {
        id: "5-1",
        version: "1",
        content:
          "Create a dialogue in [target language] between two people [context/situation]. Include common phrases and idiomatic expressions. Provide translations and explanations for difficult vocabulary or grammar points.",
        details:
          "This prompt helps language learners practice realistic conversations and learn new expressions in context.",
        useCases: ["Language Teaching", "Self-study", "Textbook Creation"],
        type: "ChatPromptTemplate",
        language: "Multilingual",
        models: ["GPT-4", "Claude-2", "PaLM-2"],
        tools: ["Duolingo", "Anki"],
        createdAt: "2023-05-19T09:45:00Z",
      },
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: false,
  },
]

function PromptGrid({ prompts, onUpdatePrompt }: { prompts: Prompt[]; onUpdatePrompt: (prompt: Prompt) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} onUpdatePrompt={onUpdatePrompt} />
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
    (term: string, filter: string, sidebarFilters: Record<string, string[]>) => {
      let filtered = prompts

      // Apply visibility/status filter
      switch (filter) {
        case "public":
          filtered = filtered.filter((p) => p.visibility === "public" && !p.isArchived)
          break
        case "private":
          filtered = filtered.filter((p) => p.visibility === "private" && !p.isArchived)
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
            prompt.versions[0].content.toLowerCase().includes(lowercasedSearchTerm) ||
            prompt.tags.some((tag) => tag.toLowerCase().includes(lowercasedSearchTerm)),
        )
      }

      // Apply sidebar filters
      Object.entries(sidebarFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          filtered = filtered.filter((prompt) => {
            if (key === "useCases" || key === "models" || key === "tools") {
              return prompt.versions[0][key as keyof (typeof prompt.versions)[0]].some((value: string) =>
                values.includes(value),
              )
            } else if (Array.isArray(prompt[key as keyof Prompt])) {
              return (prompt[key as keyof Prompt] as string[]).some((value) => values.includes(value))
            } else {
              return values.includes(prompt[key as keyof Prompt] as string)
            }
          })
        }
      })

      return filtered
    },
    [prompts],
  )

  useEffect(() => {
    const newFilteredPrompts = filterPrompts(debouncedSearchTerm, currentFilter, filters)
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
    const updatedPrompts = prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
    setPrompts(updatedPrompts)
    setFilteredPrompts(filterPrompts(debouncedSearchTerm, currentFilter, filters))
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
            <h2 className="text-2xl font-semibold mb-4">There are no prompts!!!</h2>
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
              <p>No prompts found. Try a different search term or adjust your filters.</p>
            ) : (
              <PromptGrid prompts={filteredPrompts} onUpdatePrompt={handleUpdatePrompt} />
            )}
          </>
        )}
      </div>
      <FiltersSidebar prompts={prompts} onFilterChange={handleSidebarFilterChange} />
    </div>
  )
}

