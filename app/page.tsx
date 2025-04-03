"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { Terminal } from "@/components/vscode/terminal"
import { CommandPalette } from "@/components/vscode/command-palette"
import { KeyboardEvent } from "react"

export default function Home() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Shift+P or Cmd+Shift+P for command palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }
    
    // @ts-expect-error - KeyboardEvent typing issue between DOM and React
    document.addEventListener("keydown", handleKeyDown)
    
    return () => {
      // @ts-expect-error - KeyboardEvent typing issue between DOM and React
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
  
  return (
    <VSCodeLayout>
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
      />
      
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to My Portfolio
          </h1>
          
          <p className="text-lg text-muted-foreground text-center max-w-3xl">
            This portfolio is designed to look and feel like Visual Studio Code.
            Use the sidebar to navigate or type commands in the terminal below.
          </p>
          
          <div className="w-full max-w-3xl">
            <Terminal className="w-full h-64" />
          </div>
        </div>
      </div>
    </VSCodeLayout>
  )
}
