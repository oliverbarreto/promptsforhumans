import Image from "next/image"
import { MessageCircleMore } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  src?: string | null
  alt?: string
  width?: number
  height?: number
  className?: string
}

export function UserAvatar({
  src,
  alt = "User avatar",
  width = 40,
  height = 40,
  className
}: UserAvatarProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-full",
          className
        )}
        style={{ width, height }}
      >
        <MessageCircleMore className="w-[60%] h-[60%] text-muted-foreground" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("rounded-full", className)}
    />
  )
}
