"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, File } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { RESUME_PDF_HREF } from "@/lib/site"

type FileItem = {
  id: string
  name: string
  type: "file" | "folder"
  icon?: React.ReactNode
  path?: string
  children?: FileItem[]
  /** When true, folder starts expanded (top-level About / Projects) */
  defaultOpen?: boolean
}

// Sample file structure - these represent our portfolio sections
const files: FileItem[] = [
  {
    id: "about",
    name: "About",
    type: "folder",
    defaultOpen: true,
    children: [
      {
        id: "about-me",
        name: "about.md",
        type: "file",
        path: "/about",
        icon: <File className="h-4 w-4 text-blue-400" />
      },
      {
        id: "skills",
        name: "skills.json",
        type: "file",
        path: "/about/skills",
        icon: <File className="h-4 w-4 text-yellow-400" />
      },
      {
        id: "experience",
        name: "experience.ts",
        type: "file",
        path: "/about/experience",
        icon: <File className="h-4 w-4 text-cyan-400" />
      },
      {
        id: "resume",
        name: "Abhijeet.pdf",
        type: "file",
        path: RESUME_PDF_HREF,
        icon: <File className="h-4 w-4 text-rose-400" />
      },
    ]
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    defaultOpen: true,
    children: [
      {
        id: "project-voice-agent",
        name: "voice-agent.tsx",
        type: "file",
        path: "/projects/voice-agent",
        icon: <File className="h-4 w-4 text-yellow-400" />
      },
      {
        id: "project-bugbot",
        name: "bugbot.tsx",
        type: "file",
        path: "/projects/bugbot",
        icon: <File className="h-4 w-4 text-yellow-400" />
      },
      // {
      //   id: "project-convocloud",
      //   name: "convocloud.jsx",
      //   type: "file",
      //   path: "/projects/convocloud",
      //   icon: <File className="h-4 w-4 text-yellow-400" />
      // },
      // {
      //   id: "project-blockmind",
      //   name: "blockmind.jsx",
      //   type: "file",
      //   path: "/projects/blockmind",
      //   icon: <File className="h-4 w-4 text-yellow-400" />
      // },
      // {
      //   id: "project-bablue",
      //   name: "bablue.jsx",
      //   type: "file",
      //   path: "/projects/bablue",
      //   icon: <File className="h-4 w-4 text-yellow-400" />
      // },
      // {
      //   id: "project-chatapp",
      //   name: "chatapp.jsx",
      //   type: "file",
      //   path: "/projects/chatwave",
      //   icon: <File className="h-4 w-4 text-yellow-400" />
      // },
      // {
      //   id: "project-jarvis",
      //   name: "jarvis.jsx",
      //   type: "file",
      //   path: "/projects/jarvis",
      //   icon: <File className="h-4 w-4 text-yellow-400" />
      // },
    ]
  },
  
  {
    id: "contact",
    name: "contact.tsx",
    type: "file",
    path: "/contact",
    icon: <File className="h-4 w-4 text-blue-400" />
  },
  {
    id: "chatbot",
    name: "chat.tsx",
    type: "file",
    path: "/chat",
    icon: <File className="h-4 w-4 text-green-400" />
  }
]

interface FileItemProps {
  item: FileItem
  level?: number
}

const FileItemComponent = ({ item, level = 0 }: FileItemProps) => {
  const [isOpen, setIsOpen] = useState(
    () => item.type === "folder" && item.defaultOpen === true
  )
  const router = useRouter()
  const handleClick = () => {
    if (item.type === "folder") {
      setIsOpen(!isOpen)
    } else if (item.path) {
      if (item.path.toLowerCase().endsWith(".pdf")) {
        window.open(item.path, "_blank", "noopener,noreferrer")
      } else {
        router.push(item.path)
      }
    }
  }
  
  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-muted/50 cursor-pointer transition-colors duration-150`}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
        onClick={handleClick}
      >
        {item.type === "folder" ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
          )
        ) : (
          item.icon || <File className="h-4 w-4 mr-1 text-muted-foreground" />
        )}
        <span className="ml-1 text-sm">{item.name}</span>
      </div>
      
      {item.type === "folder" && isOpen && item.children?.map((child) => (
        <FileItemComponent key={child.id} item={child} level={level + 1} />
      ))}
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="w-[250px] h-full border-r border-border flex flex-col">
      <div className="p-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Explorer
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.map((file) => (
            <FileItemComponent key={file.id} item={file} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 