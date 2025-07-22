"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Hammer } from "lucide-react"
import Link from "next/link"

export default function ProjectPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <VSCodeLayout>
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <motion.div
          className="flex flex-col space-y-4 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Jarvis (FounderBot) - AI Email Assistant for Founders</h1>
            <div className="inline-flex items-center gap-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded w-fit">
              <Hammer className="w-3 h-3" />
              Work in Progress
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Jarvis is your personal AI executive assistant — it reads, summarizes, and replies to emails automatically. Designed to help founders handle investor conversations, job applications, and outreach at scale.
            </p>
          </div>

          <Card className="overflow-hidden border-border bg-card">
            <div className="relative h-[200px] sm:h-[300px] w-full bg-muted flex items-center justify-center text-muted-foreground text-sm sm:text-base">
              <span>📸 UI Preview Coming Soon</span>
            </div>

            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Jarvis - Smart Email Agent</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                AI that reasons through email using memory, tools, and function calling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Jarvis uses GPT-4 and LangChain to reason about your inbox. It fetches Gmail threads, summarizes them, and executes smart replies based on memory and context. A planning-agent architecture calls tools like <code>fetchEmails</code>, <code>suggestReply</code>, and <code>replyToEmail</code> in loops, with PostgreSQL memory storage.
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                <span className="tech-badge">Next.js</span>
                <span className="tech-badge">LangChain</span>
                <span className="tech-badge">OpenAI GPT-4</span>
                <span className="tech-badge">PostgreSQL</span>
                <span className="tech-badge">Prisma</span>
                <span className="tech-badge">Gmail API</span>
                <span className="tech-badge">TypeScript</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2" asChild>
                <a href="https://github.com/abhijeet8080/founderbot" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  Source Code
                </a>
              </Button>
              <Button size="sm" className="w-full sm:w-auto gap-2" disabled>
                <ExternalLink className="h-4 w-4" />
                Live Demo (Coming Soon)
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-between items-center mt-3 sm:mt-6">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
              <Link href="/projects/blockmind">Previous Project</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm gap-2" disabled>
              <Link href="#">Next Project</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
