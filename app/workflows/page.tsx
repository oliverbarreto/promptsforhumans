"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, FilterX } from "lucide-react"
import Link from "next/link"
import { WorkflowList } from "@/components/workflow/workflow-list"
import { WorkflowFilters } from "@/components/workflow/workflow-filters"
import { Workflow } from "@/types/workflow"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([])
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    // Load workflows from localStorage
    const storedWorkflows = localStorage.getItem("workflows")
    if (storedWorkflows) {
      const parsedWorkflows = JSON.parse(storedWorkflows)
      setWorkflows(parsedWorkflows)
    }
  }, [])

  useEffect(() => {
    let filtered = [...workflows]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (workflow) =>
          workflow.title.toLowerCase().includes(searchLower) ||
          workflow.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        case "name":
          return a.title.localeCompare(b.title)
        case "steps":
          return b.steps.length - a.steps.length
        default:
          return 0
      }
    })

    setFilteredWorkflows(filtered)
  }, [workflows, search, sortBy])

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="relative bg-[linear-gradient(135deg,#0033FF,#3366FF,#6699FF)] bg-[length:300%_300%] animate-gradient text-white py-16 mb-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Workflows</h1>
          <p className="text-xl">Create and manage your prompt workflows</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Explore workflows</h2>
        <div className="flex items-center gap-2">
          <Link href="/workflows/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            title={showFilters ? "Hide filters" : "Show filters"}
          >
            {showFilters ? (
              <FilterX className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="relative max-w-md w-full">
          <Input
            type="search"
            placeholder="Search workflows by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 border-2 focus:border-primary"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-1 min-w-0 space-y-6">
          <WorkflowList workflows={filteredWorkflows} />
        </main>
        {showFilters && (
          <aside className="w-full md:w-[300px]">
            <WorkflowFilters sortBy={sortBy} onSortChange={setSortBy} />
          </aside>
        )}
      </div>
    </div>
  )
}
