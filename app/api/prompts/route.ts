import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, tags } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const prompt = await db.prompt.create({
      data: {
        title,
        content,
        tags: {
          create: tags.map((tag: string) => ({ name: tag })),
        },
        author: {
          connect: { id: session.user.id },
        },
      },
    })

    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    console.error("Error creating prompt:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

