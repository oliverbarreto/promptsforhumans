"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface WorkflowFiltersProps {
  sortBy: string
  onSortChange: (value: string) => void
}

export function WorkflowFilters({
  sortBy,
  onSortChange
}: WorkflowFiltersProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground/60 uppercase tracking-wider">
            Sort by
          </Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="steps">Number of steps</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
