"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Mock data
const mockTemplates = [
  { id: 1, name: "Blog Post Outline", description: "Create a structured outline for a blog post" },
  { id: 2, name: "Product Description", description: "Generate a compelling product description" },
  { id: 3, name: "Email Newsletter", description: "Design an engaging email newsletter template" },
]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [templates, setTemplates] = useState(mockTemplates)

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Templates</h1>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Button>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

