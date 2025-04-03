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

export function Terminal({ welcomeMessage, className = "" }: TerminalProps) {
  const defaultMessages = [
    { text: "Welcome to my Portfolio", delay: 300 },
    { text: "I'm Abhijeet Kadam, I'm a full-stack developer passionate about creating amazing web experiences", delay: 1500 },
    { text: "Feel free to explore using the sidebar or the command palette (Ctrl+Shift+P)", delay: 3000 },
    { text: "Type 'help' for available commands", delay: 4500 },
  ]

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
    help: () => "Available commands: help, about, skills, contact, projects, clear",
    about: () => "I'm a passionate developer with experience in React, Next.js, and more. Check out the About section!",
    skills: () => "My skills include: JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, and more.",
    projects: () => "Check out my projects in the sidebar under Projects folder.",
    // blog: () => "Read my latest thoughts on the Blog section.",
    contact: () => "Feel free to contact me through the Contact page or at kadamabhijeet021@gmail.com",
    clear: () => {
      setMessages([])
      return ""
    }
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
      className={`bg-black/90 rounded-md p-2 sm:p-4 text-green-400 font-mono text-xs sm:text-sm overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full" />
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-yellow-500 rounded-full" />
        <div className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full" />
        <div className="text-xs text-gray-400 ml-2">Terminal</div>
      </div>
      
      <div className="space-y-1 pb-2 max-h-36 sm:max-h-60 overflow-y-auto custom-scrollbar">
        {messages.map((message, index) => (
          <div key={index} className="flex">
            {message.startsWith("$") ? (
              <>
                <span className="text-blue-400 mr-1">$</span>
                <span>{message.substring(1)}</span>
              </>
            ) : (
              <span>{message}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex items-center">
        <ChevronRight className="h-4 w-4 mr-1 text-green-500" />
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-green-400"
          autoFocus
        />
      </div>
    </motion.div>
  )
} 