import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { mockPrompts, mockGroups } from "@/data/mock-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PromptHub",
  description: "The GitHub for AI prompts"
}

function initializeLocalStorage() {
  if (typeof window !== "undefined") {
    // Initialize prompts
    const storedPrompts = localStorage.getItem("prompts")
    if (!storedPrompts) {
      console.log("Initializing mock prompts...")
      localStorage.setItem("prompts", JSON.stringify(mockPrompts))
    } else {
      // Update existing prompts if needed
      try {
        const existingPrompts = JSON.parse(storedPrompts)
        if (!existingPrompts || existingPrompts.length === 0) {
          localStorage.setItem("prompts", JSON.stringify(mockPrompts))
        }
      } catch (error) {
        console.error("Error parsing stored prompts:", error)
        localStorage.setItem("prompts", JSON.stringify(mockPrompts))
      }
    }

    // Initialize groups
    const storedGroups = localStorage.getItem("groups")
    if (!storedGroups) {
      console.log("Initializing mock groups...")
      localStorage.setItem("groups", JSON.stringify(mockGroups))
    } else {
      // Update existing groups if needed
      try {
        const existingGroups = JSON.parse(storedGroups)
        if (!existingGroups || existingGroups.length === 0) {
          localStorage.setItem("groups", JSON.stringify(mockGroups))
        }
      } catch (error) {
        console.error("Error parsing stored groups:", error)
        localStorage.setItem("groups", JSON.stringify(mockGroups))
      }
    }
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex">
            <Sidebar isAuthenticated={false} />
            <main className="flex-1 p-8">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${initializeLocalStorage.toString()})();`
          }}
        />
      </body>
    </html>
  )
}
