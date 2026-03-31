"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

// Custom scrollbar styles
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
`;

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

export function Terminal({ welcomeMessage, className = "" }: TerminalProps) {

  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Inject custom scrollbar styles
  useEffect(() => {
    // Add style element if it doesn't exist
    if (!document.getElementById('terminal-scrollbar-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'terminal-scrollbar-styles';
      styleElement.innerHTML = scrollbarStyles;
      document.head.appendChild(styleElement);
      
      // Clean up styles when component unmounts
      return () => {
        const element = document.getElementById('terminal-scrollbar-styles');
        if (element) {
          element.remove();
        }
      };
    }
  }, []);
  
  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Custom commands
  const commands = {
    help: () => "Available commands: help, about, skills, experience, contact, projects, clear",
    about: () =>
      "Abhijeet Kadam · Full Stack AI Engineer @ AEOS Labs · Building AI systems in production.",
    skills: () => "See skills.json under About — Azure, BullMQ, Hono, Prisma, Twilio, Gemini Live, and more.",
    experience: () => "Open About → experience.ts in the sidebar (or /about/experience) for AEOS Labs — marketplace, RFQ AI, Azure, Graph, Prisma.",
    projects: () => "voice-agent/    bugbot/    (more coming soon)",
    contact: () => "Feel free to contact me through the Contact page or at kadamabhijeet021@gmail.com",
    clear: () => "",
  }
  
  // Display welcome messages with typing animation
  useEffect(() => {
    if (welcomeMessage) {
      setMessages([welcomeMessage])
      return
    }
    
    const timeouts: NodeJS.Timeout[] = []
    
    defaultMessages.forEach((message) => {
      const timeout = setTimeout(() => {
        setMessages(prev => [...prev, message.text])
      }, message.delay)
      
      timeouts.push(timeout)
    })
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [welcomeMessage])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const command = input.trim().toLowerCase()

      if (command === "clear") {
        setMessages([])
        setCommandHistory((prev) => [input, ...prev].slice(0, 10))
        setInput("")
        setHistoryIndex(-1)
        return
      }

      // Add command to messages
      const newMessages = [...messages, `$ ${input}`]

      // Process command
      if (command in commands) {
        const response = commands[command as keyof typeof commands]()
        if (response) {
          newMessages.push(response)
        }
      } else {
        newMessages.push(`Command not found: ${command}. Type 'help' for available commands.`)
      }

      setMessages(newMessages)
      setCommandHistory(prev => [input, ...prev].slice(0, 10))
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
  
  return (
    <motion.div
      className={`bg-black/90 rounded-md p-2 sm:p-4 text-green-400 font-mono text-xs sm:text-sm flex flex-col overflow-hidden min-h-0 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Title bar — does not scroll with output */}
      <div className="flex shrink-0 items-center space-x-2 pb-2 border-b border-white/10">
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full" />
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-yellow-500 rounded-full" />
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full" />
        <div className="text-xs text-gray-400 ml-2">Terminal</div>
      </div>

      {/* Scrollable output only */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-1 py-2">
        {messages.map((message, index) => (
          <div key={index} className="flex">
            {message.startsWith("$") ? (
              <>
                <span className="text-blue-400">$</span>
                <span className="text-white">{message.substring(1)}</span>
              </>
            ) : message.startsWith("─") ? (
              <span className="text-gray-600">{message}</span>
            ) : (
              <span className="text-green-300">{message}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input row — stays pinned under the scroll region */}
      <div className="flex shrink-0 items-center pt-2 border-t border-white/10">
        <ChevronRight className="h-4 w-4 mr-1 text-green-500 shrink-0" />
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none border-none text-green-400"
          autoFocus
        />
      </div>
    </motion.div>
  )
} 