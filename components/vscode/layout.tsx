"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/components/vscode/sidebar"
import { Tabs } from "@/components/vscode/tabs"
import { StatusBar } from "@/components/vscode/status-bar"
import { ActivityBar } from "@/components/vscode/activity-bar"
import { motion } from "framer-motion"

interface VSCodeLayoutProps {
  children: React.ReactNode
}

export function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check viewport size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }
    
    // Check on initial load
    checkScreenSize()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Main content area with sidebar and editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity bar (left side icons) */}
        <ActivityBar 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        {/* Sidebar with file explorer */}
        <motion.div 
          initial={{ width: isSidebarOpen ? (isMobile ? '100%' : 250) : 0 }}
          animate={{ width: isSidebarOpen ? (isMobile ? '100%' : 250) : 0 }}
          transition={{ duration: 0.2 }}
          className={`h-full overflow-hidden ${isMobile && isSidebarOpen ? 'absolute z-10 left-12 top-0 bottom-0 bg-background' : ''}`}
        >
          {isSidebarOpen && <Sidebar />}
        </motion.div>
        
        {/* Main editor area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs area */}
          <Tabs />
          
          {/* Content area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
      
      {/* Status bar */}
      <StatusBar />
    </div>
  )
} 