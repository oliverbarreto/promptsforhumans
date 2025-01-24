"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Compass,
  Library,
  FileText,
  GitBranch,
  Settings,
  Bell,
  Mail,
  Moon,
  Sun,
  User,
  LogIn,
  HomeIcon,
  SearchIcon
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Explore", icon: Compass, href: "/explore" },
  { name: "Library", icon: Library, href: "/library" },
  { name: "Templates", icon: FileText, href: "/templates" },
  { name: "Workflows", icon: GitBranch, href: "/workflows" }
]

const bottomNavItems = [{ name: "Settings", icon: Settings, href: "/settings" }]

interface SidebarProps {
  isAuthenticated: boolean
}

export function Sidebar({ isAuthenticated }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex flex-col h-screen bg-background border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <h1 className="text-xl font-bold">PromptHub</h1>}
          <Button variant="ghost" size="icon" onClick={toggleCollapse}>
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isCollapsed && "justify-center"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && (
                          <span className="ml-2">{item.name}</span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-2 space-y-2">
          {bottomNavItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-2">{item.name}</span>}
                  </Button>
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">{item.name}</TooltipContent>
              )}
            </Tooltip>
          ))}
          <WhatsNewButton isCollapsed={isCollapsed} />
          <ContactButton isCollapsed={isCollapsed} />
          <ThemeToggle isCollapsed={isCollapsed} />
          <ProfileButton
            isCollapsed={isCollapsed}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </aside>
    </TooltipProvider>
  )
}

function WhatsNewButton({ isCollapsed }: { isCollapsed: boolean }) {
  // Implement What's New modal logic here
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center"
          )}
        >
          <Bell className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">What's New</span>}
        </Button>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">What's New</TooltipContent>}
    </Tooltip>
  )
}

function ContactButton({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href="/contact">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center"
            )}
          >
            <Mail className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Contact</span>}
          </Button>
        </Link>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">Contact</TooltipContent>}
    </Tooltip>
  )
}

function ProfileButton({
  isCollapsed,
  isAuthenticated
}: {
  isCollapsed: boolean
  isAuthenticated: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={isAuthenticated ? "/profile" : "/signin"}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center"
            )}
          >
            {isAuthenticated ? (
              <User className="h-5 w-5" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
            {!isCollapsed && (
              <span className="ml-2">
                {isAuthenticated ? "Profile" : "Sign In"}
              </span>
            )}
          </Button>
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">
          {isAuthenticated ? "Profile" : "Sign In"}
        </TooltipContent>
      )}
    </Tooltip>
  )
}
