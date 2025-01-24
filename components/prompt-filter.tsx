"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const filters = [
  { value: "all", label: "All Prompts" },
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "archived", label: "Archived" }
]

interface PromptFilterProps {
  value: string
  onValueChange: (value: string) => void
}

export function PromptFilter({ value, onValueChange }: PromptFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="All Prompts" />
      </SelectTrigger>
      <SelectContent>
        {filters.map((filter) => (
          <SelectItem key={filter.value} value={filter.value}>
            {filter.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
