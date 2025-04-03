"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { File, Code, User, Mail, MessageSquare, Info, Palette } from "lucide-react"

type CommandItem = {
  id: string
  name: string
  path: string
  icon: React.ReactNode
  section: string
}

const commands: CommandItem[] = [
  // Pages
  { id: "home", name: "Go to Home", path: "/", icon: <Code className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "about", name: "Go to About", path: "/about", icon: <Info className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "projects", name: "Go to Projects", path: "/projects/1", icon: <File className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "contact", name: "Go to Contact", path: "/contact", icon: <Mail className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "chat", name: "Open Chat", path: "/chat", icon: <MessageSquare className="h-4 w-4 mr-2" />, section: "Pages" },
  
  // Theme
  { id: "dark-theme", name: "Switch to Dark Theme", path: "", icon: <Palette className="h-4 w-4 mr-2" />, section: "Theme" },
  { id: "light-theme", name: "Switch to Light Theme", path: "", icon: <Palette className="h-4 w-4 mr-2" />, section: "Theme" },
  
  // Social Links
  { id: "github", name: "Open GitHub", path: "https://github.com/abhhijeet8080", icon: <User className="h-4 w-4 mr-2" />, section: "Social" },
  { id: "linkedin", name: "Open LinkedIn", path: "https://linkedin.com/in/abhijeetkadam21", icon: <User className="h-4 w-4 mr-2" />, section: "Social" },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filteredCommands, setFilteredCommands] = useState<CommandItem[]>(commands)
  
  // Filter commands based on search
  useEffect(() => {
    const filtered = commands.filter(command => 
      command.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredCommands(filtered)
  }, [search])
  
  const handleSelect = (command: CommandItem) => {
    if (command.path.startsWith("http")) {
      window.open(command.path, "_blank")
    } else if (command.path) {
      router.push(command.path)
    }
    
    if (command.id === "dark-theme") {
      document.documentElement.classList.add("dark")
    } else if (command.id === "light-theme") {
      document.documentElement.classList.remove("dark")
    }
    
    onOpenChange(false)
  }
  
  // Group commands by section
  const groupedCommands: Record<string, CommandItem[]> = {}
  filteredCommands.forEach(command => {
    if (!groupedCommands[command.section]) {
      groupedCommands[command.section] = []
    }
    groupedCommands[command.section].push(command)
  })
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border backdrop-blur-lg bg-background/90">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <Command className="rounded-lg border-none">
          <CommandInput 
            placeholder="Type a command or search..." 
            onValueChange={setSearch}
            value={search}
            className="h-12"
          />
          <CommandList className="max-h-[300px]">
            {Object.entries(groupedCommands).map(([section, items]) => (
              <React.Fragment key={section}>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {section}
                </div>
                {items.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={() => handleSelect(command)}
                    className="px-2 py-2.5 cursor-pointer"
                  >
                    <div className="flex items-center">
                      {command.icon}
                      <span>{command.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </React.Fragment>
            ))}
            
            {filteredCommands.length === 0 && (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No commands found.
              </div>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
} 