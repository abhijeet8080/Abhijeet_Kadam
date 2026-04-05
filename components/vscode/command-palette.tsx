"use client"

import React, { useState, useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { File, Code, User, Mail, MessageSquare, Info, Palette, Briefcase, Bug, Mic, Sparkles } from "lucide-react"
import { useColorTheme } from "@/components/color-theme-provider"
import type { ColorThemeId } from "@/lib/color-themes"
import { RESUME_PDF_HREF } from "@/lib/site"
import {
  EASTER_EGG_EVENT,
  EASTER_EGG_ID_TO_COMMAND,
  EASTER_EGG_PALETTE,
  PENDING_TERMINAL_CMD_KEY,
} from "@/lib/easterEggs"

type CommandItemType = {
  id: string
  name: string
  path?: string
  icon: React.ReactNode
  section: string
  /** When set, selecting applies this color theme */
  colorThemeId?: ColorThemeId
  /** When set, toggles light/dark via next-themes */
  setThemeMode?: "light" | "dark"
  /** Runs command in the home terminal (see lib/easterEggs.ts) */
  easterEggId?: string
}

const baseCommands: CommandItemType[] = [
  { id: "home", name: "Go to Home", path: "/", icon: <Code className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "about", name: "Go to About", path: "/about", icon: <Info className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "experience", name: "Go to Experience", path: "/about/experience", icon: <Briefcase className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "projects", name: "Go to Projects", path: "/projects/voice-agent", icon: <File className="h-4 w-4 mr-2" />, section: "Pages" },
  {
    id: "resume",
    name: "Download Resume",
    path: RESUME_PDF_HREF,
    icon: <File className="h-4 w-4 mr-2" />,
    section: "Pages",
  },
  { id: "bugbot", name: "Go to BugBot", path: "/projects/bugbot", icon: <Bug className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "voice-agent", name: "Go to Voice Agent", path: "/projects/voice-agent", icon: <Mic className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "contact", name: "Go to Contact", path: "/contact", icon: <Mail className="h-4 w-4 mr-2" />, section: "Pages" },
  { id: "chat", name: "Open Chat", path: "/chat", icon: <MessageSquare className="h-4 w-4 mr-2" />, section: "Pages" },

  { id: "dark-theme", name: "Switch to Dark Theme", icon: <Palette className="h-4 w-4 mr-2" />, section: "Appearance", setThemeMode: "dark" },
  { id: "light-theme", name: "Switch to Light Theme", icon: <Palette className="h-4 w-4 mr-2" />, section: "Appearance", setThemeMode: "light" },

  { id: "github", name: "Open GitHub", path: "https://github.com/abhijeet8080", icon: <User className="h-4 w-4 mr-2" />, section: "Social" },
  { id: "linkedin", name: "Open LinkedIn", path: "https://linkedin.com/in/abhijeetkadam21", icon: <User className="h-4 w-4 mr-2" />, section: "Social" },
]

const easterEggCommands: CommandItemType[] = EASTER_EGG_PALETTE.map((p) => ({
  id: p.id,
  name: p.name,
  section: p.section,
  icon: <Sparkles className="h-4 w-4 mr-2 opacity-90" />,
  easterEggId: p.id,
}))

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { setColorTheme, themesForCurrentMode } = useColorTheme()
  const [search, setSearch] = useState("")

  const commands = useMemo(() => {
    const colorCommands: CommandItemType[] = themesForCurrentMode.map((t) => ({
      id: `color-theme-${t.id}`,
      name: `Color Theme: ${t.label}`,
      icon: <Palette className="h-4 w-4 mr-2" />,
      section: "Color theme",
      colorThemeId: t.id,
    }))
    return [...baseCommands, ...easterEggCommands, ...colorCommands]
  }, [themesForCurrentMode])

  const [filteredCommands, setFilteredCommands] = useState<CommandItemType[]>(commands)

  useEffect(() => {
    setFilteredCommands(commands)
  }, [commands])

  useEffect(() => {
    const filtered = commands.filter(command =>
      command.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredCommands(filtered)
  }, [search, commands])

  const handleSelect = (command: CommandItemType) => {
    if (command.easterEggId) {
      const cmd = EASTER_EGG_ID_TO_COMMAND[command.easterEggId]
      if (cmd) {
        if (pathname === "/") {
          window.dispatchEvent(
            new CustomEvent(EASTER_EGG_EVENT, { detail: { command: cmd } })
          )
        } else {
          sessionStorage.setItem(PENDING_TERMINAL_CMD_KEY, cmd)
          router.push("/")
        }
      }
      onOpenChange(false)
      return
    }
    if (command.colorThemeId) {
      setColorTheme(command.colorThemeId)
      onOpenChange(false)
      return
    }
    if (command.setThemeMode) {
      setTheme(command.setThemeMode)
      onOpenChange(false)
      return
    }
    if (command.path?.startsWith("http")) {
      window.open(command.path, "_blank", "noopener,noreferrer")
    } else if (command.path?.toLowerCase().endsWith(".pdf")) {
      /* Static PDF in /public — full navigation, not client route transition */
      window.open(command.path, "_blank", "noopener,noreferrer")
    } else if (command.path) {
      router.push(command.path)
    }
    onOpenChange(false)
  }

  const groupedCommands: Record<string, CommandItemType[]> = {}
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
          <CommandList className="max-h-[min(420px,70vh)]">
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
