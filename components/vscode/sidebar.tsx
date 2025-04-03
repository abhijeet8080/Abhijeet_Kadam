"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, File } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type FileItem = {
  id: string
  name: string
  type: "file" | "folder"
  icon?: React.ReactNode
  path?: string
  children?: FileItem[]
}

// Sample file structure - these represent our portfolio sections
const files: FileItem[] = [
  {
    id: "about",
    name: "About",
    type: "folder",
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
      
    ]
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder", 
    children: [
      {
        id: "project-1",
        name: "bablue.jsx",
        type: "file",
        path: "/projects/bablue",
        icon: <File className="h-4 w-4 text-yellow-400" />
      },
      {
        id: "project-2",
        name: "convocloud.jsx",
        type: "file",
        path: "/projects/convocloud",
        icon: <File className="h-4 w-4 text-yellow-400" />
      },
      {
        id: "project-3",
        name: "chatwave.jsx",
        type: "file",
        path: "/projects/chatwave",
        icon: <File className="h-4 w-4 text-yellow-400" />
      },
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
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  
  const handleClick = () => {
    if (item.type === "folder") {
      setIsOpen(!isOpen)
    } else if (item.path) {
      router.push(item.path)
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