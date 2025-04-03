"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { X, File } from "lucide-react"
import { motion } from "framer-motion"

type Tab = {
  id: string
  path: string
  name: string
  icon?: React.ReactNode
}

type TabWithUniqueId = Tab & { uniqueId: string }

// Map routes to tabs - ensure IDs are completely unique
const routeToTab: Record<string, Tab> = {
  "/": { id: "tab-welcome", path: "/", name: "welcome.jsx", icon: <File className="h-4 w-4 text-yellow-400" /> },
  "/about": { id: "tab-about", path: "/about", name: "about.md", icon: <File className="h-4 w-4 text-blue-400" /> },
  "/about/skills": { id: "tab-about-skills", path: "/about/skills", name: "skills.json", icon: <File className="h-4 w-4 text-yellow-400" /> },
//   "/about/experience": { id: "tab-about-experience", path: "/about/experience", name: "experience.md", icon: <File className="h-4 w-4 text-blue-400" /> },
  "/projects/bablue": { id: "tab-project1", path: "/projects/bablue", name: "bablue.jsx", icon: <File className="h-4 w-4 text-yellow-400" /> },
  "/projects/convocloud": { id: "tab-project2", path: "/projects/convocloud", name: "convocloud.jsx", icon: <File className="h-4 w-4 text-yellow-400" /> },
  "/projects/chatwave": { id: "tab-project3", path: "/projects/chatwave", name: "chatwave.jsx", icon: <File className="h-4 w-4 text-yellow-400" /> },
//   "/blog/1": { id: "tab-blog1", path: "/blog/1", name: "post1.mdx", icon: <File className="h-4 w-4 text-purple-400" /> },
//   "/blog/2": { id: "tab-blog2", path: "/blog/2", name: "post2.mdx", icon: <File className="h-4 w-4 text-purple-400" /> },
  "/contact": { id: "tab-contact", path: "/contact", name: "contact.tsx", icon: <File className="h-4 w-4 text-blue-400" /> },
  "/chat": { id: "tab-chat", path: "/chat", name: "chat.tsx", icon: <File className="h-4 w-4 text-green-400" /> },
}

export function Tabs() {
  const pathname = usePathname()
  const router = useRouter()
  const [openTabs, setOpenTabs] = useState<TabWithUniqueId[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  
  // Handle path changes to update tabs
  useEffect(() => {
    // Get the tab for the current path
    const currentTab = routeToTab[pathname]
    
    if (currentTab) {
      // Set this tab as active
      setActiveTab(currentTab.id)
      
      // Update tabs - check if current tab is already open
      setOpenTabs(prevTabs => {
        // Check if we already have this tab open
        const existingTabIndex = prevTabs.findIndex(tab => tab.id === currentTab.id)
        
        // If tab is not already open, add it
        if (existingTabIndex === -1) {
          const uniqueTab = {
            ...currentTab,
            uniqueId: `${currentTab.id}-${Date.now()}`
          }
          return [...prevTabs, uniqueTab]
        }
        
        // Tab is already open, return tabs unchanged
        return prevTabs
      })
    }
  }, [pathname])
  
  // Separate useEffect for navigation to avoid router updates during render
  const handleTabClick = (tabPath: string, tabId: string) => {
    setActiveTab(tabId)
    
    // Use setTimeout to delay navigation until after render
    setTimeout(() => {
      router.push(tabPath)
    }, 0)
  }
  
  const handleCloseTab = (event: React.MouseEvent, uniqueId: string, tabId: string) => {
    event.stopPropagation()
    
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab.uniqueId !== uniqueId)
      
      // If we're closing the active tab, set a new active tab
      if (activeTab === tabId && newTabs.length > 0) {
        const newActiveTab = newTabs[newTabs.length - 1]
        setActiveTab(newActiveTab.id)
        
        // Use setTimeout to delay navigation until after render
        setTimeout(() => {
          router.push(newActiveTab.path)
        }, 0)
      } else if (newTabs.length === 0) {
        // If no tabs left, go to home
        setActiveTab(null)
        
        // Use setTimeout to delay navigation until after render
        setTimeout(() => {
          router.push('/')
        }, 0)
      }
      
      return newTabs
    })
  }
  
  return (
    <div className="h-9 bg-background border-b border-border flex items-center overflow-x-auto scrollbar-hide">
      {openTabs.map((tab) => (
        <motion.div
          key={tab.uniqueId}
          className={`h-full min-w-[120px] max-w-[180px] flex items-center justify-between px-3 
                     border-r border-border relative select-none
                     ${activeTab === tab.id ? "bg-background" : "bg-muted hover:bg-background/50"}`}
          onClick={() => handleTabClick(tab.path, tab.id)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            {tab.icon || <File className="h-4 w-4 text-muted-foreground" />}
            <span className="truncate text-sm">{tab.name}</span>
          </div>
          <button
            onClick={(e) => handleCloseTab(e, tab.uniqueId, tab.id)}
            className="ml-2 text-muted-foreground hover:text-foreground rounded-sm"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Active tab indicator */}
          {activeTab === tab.id && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              layoutId="activeTabIndicator"
            />
          )}
        </motion.div>
      ))}
    </div>
  )
} 