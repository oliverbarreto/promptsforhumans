import { type Prompt, type Author } from "@/types/prompt"
import { type Group } from "@/types/group"

// Mock Authors
export const mockAuthors: Author[] = [
  {
    id: "user1",
    name: "John Doe",
    avatar: "/placeholder-avatar.png"
  },
  {
    id: "user2",
    name: "Jane Smith",
    avatar: "/placeholder-avatar.png"
  },
  {
    id: "user3",
    name: "Alice Wonderland",
    avatar: "/placeholder-avatar.png"
  },
  {
    id: "user4",
    name: "Bob Builder",
    avatar: "/placeholder-avatar.png"
  },
  {
    id: "user5",
    name: "Charlie Marketer",
    avatar: "/placeholder-avatar.png"
  },
  {
    id: "user6",
    name: "Dana Analyst",
    avatar: "/placeholder-avatar.png"
  },
  {
    id: "user7",
    name: "Eva Educator",
    avatar: "/placeholder-avatar.png"
  }
]

// Mock Prompts
export const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "GPT-4 System Message Template",
    description: "A template for creating effective system messages for GPT-4",
    content: "You are a helpful AI assistant...",
    category: "Templates",
    tags: ["gpt-4", "system-message", "template"],
    author: mockAuthors[0],
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-01").toISOString(),
    likes: 42,
    views: 156,
    currentVersion: "1.0.0",
    versions: [
      {
        id: "v1",
        version: "1.0.0",
        content: "You are a helpful AI assistant...",
        details: "Initial version",
        useCases: ["General assistance", "Task automation"],
        type: "system",
        language: "en",
        models: ["gpt-4"],
        tools: [],
        createdAt: new Date("2024-03-01").toISOString()
      }
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: true
  },
  {
    id: "2",
    title: "Code Review Assistant",
    description: "A specialized prompt for code review and suggestions",
    content: "You are an expert code reviewer...",
    category: "Development",
    tags: ["code-review", "programming", "best-practices"],
    author: mockAuthors[1],
    createdAt: new Date("2024-03-02").toISOString(),
    updatedAt: new Date("2024-03-02").toISOString(),
    likes: 28,
    views: 94,
    currentVersion: "1.0.0",
    versions: [
      {
        id: "v1",
        version: "1.0.0",
        content: "You are an expert code reviewer...",
        details: "Initial version",
        useCases: ["Code review", "Code improvement suggestions"],
        type: "instruction",
        language: "en",
        models: ["gpt-4", "gpt-3.5"],
        tools: [],
        createdAt: new Date("2024-03-02").toISOString()
      }
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: false
  },
  {
    id: "3",
    title: "Creative Story Starter",
    author: mockAuthors[2],
    tags: ["creative", "writing", "fantasy"],
    likes: 120,
    views: 250,
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
    currentVersion: "1",
    description: "A creative writing prompt to spark imagination",
    content: "You are a storyteller in a world where dreams come to life...",
    category: "Writing",
    versions: [
      {
        id: "1-1",
        version: "1",
        content:
          "You are a storyteller in a world where dreams come to life. Describe the most vivid dream that has manifested in reality.",
        details:
          "This prompt is designed to spark creativity and encourage imaginative storytelling. It combines elements of fantasy with the familiar concept of dreams to create a unique narrative starting point.",
        useCases: [
          "Creative Writing",
          "World Building",
          "Character Development"
        ],
        type: "ChatPromptTemplate",
        language: "English",
        models: ["GPT-4", "Claude-2", "PaLM-2"],
        tools: ["Midjourney", "DALL-E"],
        createdAt: "2023-05-15T10:30:00Z"
      }
    ],
    visibility: "public",
    isArchived: false,
    isFavorite: false
  }
]

// Mock Groups
export const mockGroups: Group[] = [
  {
    id: "group1",
    name: "Development Prompts",
    description: "Collection of prompts for software development",
    promptCount: 5,
    isFavorite: true,
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-01").toISOString(),
    authorId: "user1",
    visibility: "public"
  },
  {
    id: "group2",
    name: "Writing Assistants",
    description: "Prompts for content creation and writing",
    promptCount: 3,
    isFavorite: false,
    createdAt: new Date("2024-03-02").toISOString(),
    updatedAt: new Date("2024-03-02").toISOString(),
    authorId: "user1",
    visibility: "public"
  }
]
