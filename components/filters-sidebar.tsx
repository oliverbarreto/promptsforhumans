"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import type { Prompt, PromptVersion } from "@/types/prompt"

interface FilterOption {
  value: string
  label: string
  count: number
}

interface FilterGroupProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

function FilterGroup({ title, options, selectedValues, onChange }: FilterGroupProps) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger className="text-sm hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between py-1.5 text-sm hover:bg-accent rounded-md px-2 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newSelectedValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((value) => value !== option.value)
                    onChange(newSelectedValues)
                  }}
                />
                <span>{option.label}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{option.count}</span>
            </label>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

interface FiltersSidebarProps {
  prompts: Prompt[]
  onFilterChange: (filters: Record<string, string[]>) => void
}

export function FiltersSidebar({ prompts, onFilterChange }: FiltersSidebarProps) {
  const [filters, setFilters] = useState({
    useCases: [],
    type: [],
    language: [],
    models: [],
    tools: [],
  })

  const getUniqueValuesWithCount = (key: string): FilterOption[] => {
    const valueCount = new Map<string, number>()

    prompts.forEach((prompt) => {
      if (key === "useCases" || key === "models" || key === "tools") {
        prompt.versions[0][key as keyof PromptVersion].forEach((value: string) => {
          valueCount.set(value, (valueCount.get(value) || 0) + 1)
        })
      } else if (Array.isArray(prompt[key as keyof Prompt])) {
        prompt[key as keyof Prompt].forEach((value: string) => {
          valueCount.set(value, (valueCount.get(value) || 0) + 1)
        })
      } else if (prompt[key as keyof Prompt]) {
        const value = prompt[key as keyof Prompt] as string
        valueCount.set(value, (valueCount.get(value) || 0) + 1)
      }
    })

    return Array.from(valueCount.entries())
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }

  const useCaseOptions = getUniqueValuesWithCount("useCases")
  const typeOptions = getUniqueValuesWithCount("type")
  const languageOptions = getUniqueValuesWithCount("language")
  const modelOptions = getUniqueValuesWithCount("models")
  const toolOptions = getUniqueValuesWithCount("tools")

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleFilterChange = (filterName: string) => (values: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: values,
    }))
  }

  return (
    <div className="w-72 space-y-4">
      <h2 className="font-semibold text-lg">Filters</h2>
      <Accordion type="multiple" className="w-full">
        <FilterGroup
          title="Use Cases"
          options={useCaseOptions}
          selectedValues={filters.useCases}
          onChange={handleFilterChange("useCases")}
        />
        <FilterGroup
          title="Type"
          options={typeOptions}
          selectedValues={filters.type}
          onChange={handleFilterChange("type")}
        />
        <FilterGroup
          title="Language"
          options={languageOptions}
          selectedValues={filters.language}
          onChange={handleFilterChange("language")}
        />
        <FilterGroup
          title="Models"
          options={modelOptions}
          selectedValues={filters.models}
          onChange={handleFilterChange("models")}
        />
        <FilterGroup
          title="Tools"
          options={toolOptions}
          selectedValues={filters.tools}
          onChange={handleFilterChange("tools")}
        />
      </Accordion>
    </div>
  )
}

