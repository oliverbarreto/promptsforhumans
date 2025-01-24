"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, PlusCircle, Library } from "lucide-react"

export default function Header() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          PromptHub
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/library">
            <Button variant="ghost">
              <Library className="mr-2 h-4 w-4" />
              Library
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Prompt
            </Button>
          </Link>
          <Button variant="outline">Sign In</Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

