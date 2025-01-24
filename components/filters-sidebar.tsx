"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import type { Prompt, PromptVersion } from "@/types/prompt"
import { Button } from "@/components/ui/button"

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

function FilterGroup({
  title,
  options,
  selectedValues,
  onChange
}: FilterGroupProps) {
  const handleCheckedChange = (
    checked: boolean | "indeterminate",
    value: string
  ) => {
    if (typeof checked === "boolean") {
      const newSelectedValues = checked
        ? [...selectedValues, value]
        : selectedValues.filter((v) => v !== value)
      onChange(newSelectedValues)
    }
  }

  return (
    <AccordionItem value={title}>
      <AccordionTrigger className="text-sm hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between py-1.5 text-sm hover:bg-accent rounded-md px-2 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(checked, option.value)
                  }
                />
                <span>{option.label}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                {option.count}
              </span>
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
  selectedFilters: Record<string, string[]>
}

export function FiltersSidebar({
  prompts,
  onFilterChange,
  selectedFilters
}: FiltersSidebarProps) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const filterSections = ["Use Cases", "Type", "Language", "Models", "Tools"]

  const getUniqueValuesWithCount = (key: string): FilterOption[] => {
    const valueCount = new Map<string, number>()

    prompts.forEach((prompt) => {
      if (key === "useCases" || key === "models" || key === "tools") {
        const values = prompt.versions[0][key as keyof PromptVersion]
        if (Array.isArray(values)) {
          values.forEach((value: string) => {
            valueCount.set(value, (valueCount.get(value) || 0) + 1)
          })
        }
      } else if (Array.isArray(prompt[key as keyof Prompt])) {
        const values = prompt[key as keyof Prompt] as string[]
        values.forEach((value: string) => {
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
        count
      }))
      .sort((a, b) => b.count - a.count)
  }

  const useCaseOptions = getUniqueValuesWithCount("useCases")
  const typeOptions = getUniqueValuesWithCount("type")
  const languageOptions = getUniqueValuesWithCount("language")
  const modelOptions = getUniqueValuesWithCount("models")
  const toolOptions = getUniqueValuesWithCount("tools")

  const handleFilterChange = (filterName: string) => (values: string[]) => {
    onFilterChange({
      ...selectedFilters,
      [filterName]: values
    })
  }

  const handleAccordionChange = (value: string[]) => {
    setOpenItems(value)
  }

  const toggleAllSections = () => {
    setOpenItems(
      openItems.length === filterSections.length ? [] : filterSections
    )
  }

  const clearFilters = () => {
    onFilterChange({
      useCases: [],
      type: [],
      language: [],
      models: [],
      tools: []
    })
  }

  return (
    <div className="w-full rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-sm"
          >
            Clear all
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAllSections}
            title={
              openItems.length === filterSections.length
                ? "Collapse all"
                : "Expand all"
            }
          >
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Accordion
        type="multiple"
        className="w-full"
        value={openItems}
        onValueChange={handleAccordionChange}
      >
        <FilterGroup
          title="Use Cases"
          options={useCaseOptions}
          selectedValues={selectedFilters.useCases || []}
          onChange={handleFilterChange("useCases")}
        />
        <FilterGroup
          title="Type"
          options={typeOptions}
          selectedValues={selectedFilters.type || []}
          onChange={handleFilterChange("type")}
        />
        <FilterGroup
          title="Language"
          options={languageOptions}
          selectedValues={selectedFilters.language || []}
          onChange={handleFilterChange("language")}
        />
        <FilterGroup
          title="Models"
          options={modelOptions}
          selectedValues={selectedFilters.models || []}
          onChange={handleFilterChange("models")}
        />
        <FilterGroup
          title="Tools"
          options={toolOptions}
          selectedValues={selectedFilters.tools || []}
          onChange={handleFilterChange("tools")}
        />
      </Accordion>
    </div>
  )
}
