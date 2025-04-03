"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
import { KeyboardEvent } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProjectPage() {
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
      
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <motion.div 
          className="flex flex-col space-y-4 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Bablue - The AI Agent</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Bablue is an AI-powered agent built with Gemini AI that efficiently manages tasks, interacts with databases, and makes intelligent decisions based on user prompts.
            </p>
          </div>
          
          <Card className="overflow-hidden border-border bg-card">
            <div className="relative h-[200px] sm:h-[300px] w-full">
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                <p className="text-white text-base sm:text-xl font-medium">Bablue AI Interface</p>
              </div>
              <Image 
                className="rounded-lg"
                src="/icons/image1.png" 
                alt="Bablue AI" 
                layout="fill" 
                objectFit="cover" 
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Bablue - AI Agent</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Task management & intelligent decision-making</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Bablue is an AI agent that can perform database operations such as adding, updating, deleting, and searching tasks. It intelligently processes user inputs and makes decisions based on prompt-based interactions, enhancing task automation and workflow efficiency.
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">Next.js</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">Node.js</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">MongoDB</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">Gemini API</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
                <Github className="h-4 w-4" />
                <a href="https://github.com/abhijeet8080/Bablue---An-AI-Agent">Source Code</a>
              </Button>
              <Button size="sm" className="w-full sm:w-auto gap-2">
                <ExternalLink className="h-4 w-4" />
                <a href="https://bablue-an-ai-agent.vercel.app/">Live Demo</a>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="flex justify-between items-center mt-3 sm:mt-6">
            <Link href='/projects/convocloud'><Button variant="outline" size="sm" className="text-xs sm:text-sm" disabled>Previous Project</Button></Link>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm gap-2">
              <Link href="/projects/bablue">Next Project</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
