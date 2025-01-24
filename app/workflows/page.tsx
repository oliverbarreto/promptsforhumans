"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Mock data
const mockWorkflows = [
  { id: 1, name: "Content Creation Pipeline", description: "Generate, edit, and optimize content" },
  {
    id: 2,
    name: "Customer Support Flow",
    description: "Handle customer inquiries and route to appropriate departments",
  },
  { id: 3, name: "Data Analysis Workflow", description: "Clean, analyze, and visualize data" },
]

export default function WorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [workflows, setWorkflows] = useState(mockWorkflows)

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Workflows</h1>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search workflows..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Button>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <CardTitle>{workflow.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{workflow.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

