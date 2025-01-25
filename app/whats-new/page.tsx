import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

async function getWhatsNewContent() {
  const filePath = path.join(process.cwd(), "public", "content", "whats-new.md")
  const content = await fs.promises.readFile(filePath, "utf8")
  return content
}

export default async function WhatsNewPage() {
  const content = await getWhatsNewContent()

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <article
        className={cn(
          "prose prose-slate dark:prose-invert max-w-none",
          // Headers
          "prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8",
          "prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-primary/80 prose-h2:mb-6",
          "prose-h3:text-xl prose-h3:font-medium prose-h3:text-primary/70 prose-h3:mb-4",
          // Lists
          "prose-ul:my-6 prose-ul:space-y-3",
          "prose-li:text-muted-foreground prose-li:leading-relaxed",
          // Strong/Bold text
          "prose-strong:text-primary prose-strong:font-semibold",
          // Paragraphs
          "prose-p:text-muted-foreground prose-p:leading-relaxed",
          // Custom spacing
          "[&_h2+h3]:mt-6",
          "[&_h3+ul]:mt-4"
        )}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  )
}
