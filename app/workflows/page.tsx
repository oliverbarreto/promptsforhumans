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
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Create and manage your prompt workflows
          </p>
        </div>
        <Link href="/workflows/create">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className={cn(showFilters && "bg-muted")}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <FilterX className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </Button>
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
