"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import {
  EASTER_EGG_EVENT,
  getEasterEggStaticLines,
  matchEasterEggId,
  normalizeCommand,
  PENDING_TERMINAL_CMD_KEY,
} from "@/lib/easterEggs"

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(88, 255, 144, 0.5);
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(88, 255, 144, 0.8);
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(88, 255, 144, 0.5) rgba(0, 0, 0, 0.2);
  }
`

interface TerminalProps {
  welcomeMessage?: string
  className?: string
}

const defaultMessages = [
  { text: "$ whoami", delay: 300 },
  { text: "Abhijeet Kadam — Full Stack AI Engineer", delay: 800 },
  { text: "$ cat focus.txt", delay: 1400 },
  { text: "Voice AI · Backend Systems · Azure · TypeScript", delay: 1900 },
  { text: "$ ls projects/", delay: 2500 },
  { text: "voice-agent/    bugbot/    industrial-motion/", delay: 3000 },
  { text: "─────────────────────────────────────────────", delay: 3500 },
  { text: "Type 'help' for available commands.", delay: 3800 },
]

const VIM_SEED = [
  "// portfolio.tsx",
  "export function Page() {",
  "  return null;",
  "}",
]

export function Terminal({ welcomeMessage, className = "" }: TerminalProps) {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const [vimMode, setVimMode] = useState(false)
  const [vimLines, setVimLines] = useState<string[]>([])
  const [vimCurrentLine, setVimCurrentLine] = useState("")

  const [spotifyLine, setSpotifyLine] = useState<string | null>(null)
  const spotifyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const welcomeStartedRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, vimMode, vimLines, vimCurrentLine, spotifyLine])

  useEffect(() => {
    if (!document.getElementById("terminal-scrollbar-styles")) {
      const styleElement = document.createElement("style")
      styleElement.id = "terminal-scrollbar-styles"
      styleElement.innerHTML = scrollbarStyles
      document.head.appendChild(styleElement)
      return () => {
        document.getElementById("terminal-scrollbar-styles")?.remove()
      }
    }
  }, [])

  const clearSpotifyTimer = () => {
    if (spotifyTimerRef.current) {
      clearInterval(spotifyTimerRef.current)
      spotifyTimerRef.current = null
    }
  }

  const runEasterEgg = useCallback((rawCmd: string, id: string, skipEcho = false) => {
    const displayCmd = normalizeCommand(rawCmd)
    setSpotifyLine(null)
    clearSpotifyTimer()

    const echo = () => {
      if (!skipEcho) {
        setMessages((prev) => [...prev, `$ ${displayCmd}`])
      }
    }

    if (id === "ee-vim") {
      echo()
      setVimLines([...VIM_SEED])
      setVimCurrentLine("")
      setVimMode(true)
      return
    }

    if (id === "ee-spotify") {
      echo()
      let step = 0
      const total = 24
      setSpotifyLine("Now playing: Lo-fi beats to review PRs to 🎵\n[>                    ]")
      spotifyTimerRef.current = setInterval(() => {
        step += 1
        const filled = Math.min(20, Math.floor((step / total) * 20))
        const bar = "[" + "=".repeat(filled) + ">" + " ".repeat(Math.max(0, 19 - filled)) + "]"
        setSpotifyLine(`Now playing: Lo-fi beats to review PRs to 🎵\n${bar}`)
        if (step >= total) {
          clearSpotifyTimer()
          setMessages((prev) => [...prev, "Now playing: Lo-fi beats to review PRs to 🎵", bar, ""])
          setSpotifyLine(null)
        }
      }, 120)
      return
    }

    const lines = getEasterEggStaticLines(id)
    if (lines) {
      echo()
      setMessages((prev) => [...prev, ...lines])
    }
  }, [])

  useEffect(() => {
    const onEgg = (e: Event) => {
      const cmd = (e as CustomEvent<{ command: string }>).detail?.command
      if (!cmd) return
      const id = matchEasterEggId(cmd)
      if (id) runEasterEgg(cmd, id, false)
    }
    window.addEventListener(EASTER_EGG_EVENT, onEgg)
    return () => window.removeEventListener(EASTER_EGG_EVENT, onEgg)
  }, [runEasterEgg])

  const commands = {
    help: () =>
      "Available commands: help, about, skills, experience, contact, projects, clear — plus easter eggs from the command palette (Ctrl+Shift+P).",
    about: () =>
      "Abhijeet Kadam · Full Stack AI Engineer @ AEOS Labs · Building AI systems in production.",
    skills: () => "See skills.json under About — Azure, BullMQ, Hono, Prisma, Twilio, Gemini Live, and more.",
    experience: () =>
      "Open About → experience.ts in the sidebar (or /about/experience) for AEOS Labs — marketplace, RFQ AI, Azure, Graph, Prisma.",
    projects: () => "voice-agent/    bugbot/    (more coming soon)",
    contact: () => "Feel free to contact me through the Contact page or at kadamabhijeet021@gmail.com",
    clear: () => "",
  }

  useEffect(() => {
    if (welcomeMessage) {
      setMessages([welcomeMessage])
      return
    }

    const pending = sessionStorage.getItem(PENDING_TERMINAL_CMD_KEY)
    if (pending) {
      sessionStorage.removeItem(PENDING_TERMINAL_CMD_KEY)
      const id = matchEasterEggId(pending)
      if (id) {
        setMessages([])
        welcomeStartedRef.current = true
        setTimeout(() => runEasterEgg(pending, id, false), 120)
        return
      }
    }

    if (welcomeStartedRef.current) return
    welcomeStartedRef.current = true

    const timeouts: NodeJS.Timeout[] = []
    defaultMessages.forEach((message) => {
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, message.text])
      }, message.delay)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [welcomeMessage, runEasterEgg])

  const handleVimKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const line = vimCurrentLine.trim()
      if (line === ":wq") {
        setVimMode(false)
        setVimLines([])
        setVimCurrentLine("")
        setMessages((prev) => [...prev, "File written. Finally."])
        return
      }
      if (line === ":q!") {
        setVimMode(false)
        setVimLines([])
        setVimCurrentLine("")
        setMessages((prev) => [...prev, "Changes discarded. Coward."])
        return
      }
      if (line === ":help") {
        setMessages((prev) => [
          ...prev,
          "E149: Sorry, no help for vim users who don't know how to exit.",
        ])
        setVimCurrentLine("")
        return
      }
      setVimLines((prev) => [...prev, vimCurrentLine])
      setVimCurrentLine("")
      return
    }
    if (e.key === "Backspace") {
      e.preventDefault()
      setVimCurrentLine((prev) => prev.slice(0, -1))
      return
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      setVimCurrentLine((prev) => prev + e.key)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!vimMode) setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (vimMode) {
      handleVimKeyDown(e)
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      /* Read from the DOM — React state can lag one keystroke behind on Enter */
      const lineRaw = e.currentTarget.value.trim()
      if (!lineRaw) return

      const raw = normalizeCommand(lineRaw)
      const command = raw.toLowerCase()
      const displayLine = lineRaw

      if (command === "clear") {
        setMessages([])
        setCommandHistory((prev) => [displayLine, ...prev].slice(0, 10))
        setInput("")
        setHistoryIndex(-1)
        return
      }

      const eggId = matchEasterEggId(raw)
      if (eggId) {
        const newMessages = [...messages, `$ ${displayLine}`]
        setMessages(newMessages)
        setCommandHistory((prev) => [displayLine, ...prev].slice(0, 10))
        setInput("")
        setHistoryIndex(-1)
        runEasterEgg(raw, eggId, true)
        return
      }

      const newMessages = [...messages, `$ ${displayLine}`]

      if (command in commands) {
        const response = commands[command as keyof typeof commands]()
        if (response) {
          newMessages.push(response)
        }
      } else {
        newMessages.push(`Command not found: ${command}. Type 'help' for available commands.`)
      }

      setMessages(newMessages)
      setCommandHistory((prev) => [displayLine, ...prev].slice(0, 10))
      setInput("")
      setHistoryIndex(-1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  useEffect(() => {
    return () => clearSpotifyTimer()
  }, [])

  return (
    <motion.div
      className={`bg-black/90 rounded-md p-2 sm:p-4 text-green-400 font-mono text-xs sm:text-sm flex flex-col overflow-hidden min-h-0 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex shrink-0 items-center space-x-2 pb-2 border-b border-white/10">
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full" />
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-yellow-500 rounded-full" />
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full" />
        <div className="text-xs text-gray-400 ml-2">Terminal</div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-1 py-2">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-wrap">
            {message.startsWith("$") ? (
              <>
                <span className="text-blue-400">$</span>
                <span className="text-white">{message.substring(1)}</span>
              </>
            ) : message.startsWith("─") ? (
              <span className="text-gray-600">{message}</span>
            ) : (
              <span className="text-green-300 whitespace-pre-wrap break-all">{message}</span>
            )}
          </div>
        ))}

        {vimMode && (
          <div className="mt-2 rounded border border-amber-600/40 bg-black/40 p-2 text-xs">
            <div className="text-yellow-400 mb-1">-- INSERT --</div>
            {vimLines.map((line, i) => (
              <div key={i} className="text-green-200 whitespace-pre-wrap">
                {line}
              </div>
            ))}
            <div className="text-white flex">
              <span className="whitespace-pre-wrap break-all">{vimCurrentLine}</span>
              <span className="inline-block w-2 h-4 bg-green-400/80 animate-pulse ml-px" />
            </div>
          </div>
        )}

        {spotifyLine && (
          <div className="text-green-300 whitespace-pre-wrap mt-1">{spotifyLine}</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex shrink-0 items-center pt-2 border-t border-white/10">
        <ChevronRight className="h-4 w-4 mr-1 text-green-500 shrink-0" />
        <input
          type="text"
          value={vimMode ? vimCurrentLine : input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none border-none text-green-400"
          autoFocus
          readOnly={vimMode}
          aria-label={vimMode ? "Vim buffer line" : "Terminal input"}
        />
      </div>
    </motion.div>
  )
}
