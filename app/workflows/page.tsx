"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

import { WorkflowList } from "@/components/workflow/workflow-list"
import { WorkflowFilters } from "@/components/workflow/workflow-filters"

export default function WorkflowsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-12">
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

      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-1 min-w-0 space-y-6">
          <WorkflowList />
        </main>
        <aside className="w-full md:w-[300px]">
          <WorkflowFilters />
        </aside>
      </div>
    </div>
  )
}
