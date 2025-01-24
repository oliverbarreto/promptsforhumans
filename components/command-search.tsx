"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CommandSearchProps {
  onSearch: (term: string) => void
  onFilterChange: (filter: string) => void
  initialSearchTerm?: string
  currentFilter: string
}

export function CommandSearch({ onSearch, onFilterChange, initialSearchTerm = "", currentFilter }: CommandSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState(initialSearchTerm)

  const filters = [
    { label: "All Prompts", value: "all" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
    { label: "Archived", value: "archived" },
    { label: "Favorites", value: "favorites" },
  ]

  React.useEffect(() => {
    setSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[150px] justify-between">
            {filters.find((filter) => filter.value === currentFilter)?.label || "All Prompts"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0">
          <Command>
            <CommandGroup>
              {filters.map((filter) => (
                <CommandItem
                  key={filter.value}
                  value={filter.value}
                  onSelect={(value) => {
                    onFilterChange(value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", currentFilter === filter.value ? "opacity-100" : "opacity-0")} />
                  {filter.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="relative flex-1">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search prompt names, type, use cases..."
            value={searchTerm}
            onValueChange={handleSearch}
          />
        </Command>
      </div>
    </div>
  )
}

