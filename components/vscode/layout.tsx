"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/components/vscode/sidebar"
import { Tabs } from "@/components/vscode/tabs"
import { StatusBar } from "@/components/vscode/status-bar"
import { ActivityBar } from "@/components/vscode/activity-bar"
import { AnimatePresence, motion } from "framer-motion"

interface VSCodeLayoutProps {
  children: React.ReactNode
}

/**
 * Lucide icons render <svg> in the activity bar; extensions (e.g. Dark Reader) inject
 * attributes into SVGs before React hydrates, causing server/client HTML mismatches.
 * We render a chrome skeleton on SSR + first client paint, then mount full UI after hydration.
 */
export function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const [shellReady, setShellReady] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setShellReady(true)
  }, [])

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

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isMobile || window.innerWidth < 768) {
      setShowHint(false)
      return
    }
    const seen = localStorage.getItem("sidebar-hint-seen")
    if (seen) return
    setShowHint(true)
    const t = setTimeout(() => {
      setShowHint(false)
      localStorage.setItem("sidebar-hint-seen", "1")
    }, 4000)
    return () => clearTimeout(t)
  }, [isMobile])

  if (!shellReady) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
        <div className="relative flex flex-1 overflow-hidden">
          <div
            className="w-12 h-full shrink-0 bg-muted border-r border-border"
            aria-hidden
          />
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <div className="h-9 shrink-0 bg-background border-b border-border" aria-hidden />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </div>
        <div className="h-6 shrink-0 bg-muted border-t border-border" aria-hidden />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Main content area with sidebar and editor */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Activity bar (left side icons) */}
        <ActivityBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-14 top-16 z-50 text-xs font-mono px-3 py-2 rounded-md shadow-lg pointer-events-none border bg-[color:var(--hint-bg)] border-[color:var(--hint-border)] text-[color:var(--hint-fg)]"
            >
              ← explore from here
            </motion.div>
          )}
        </AnimatePresence>

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