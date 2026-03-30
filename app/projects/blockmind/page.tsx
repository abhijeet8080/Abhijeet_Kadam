"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
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
            <h1 className="text-2xl sm:text-3xl font-bold">BlockMind - AI-Powered Web3 Task Manager</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              BlockMind combines AI and blockchain to manage on-chain tasks through natural language. It leverages GPT-4 and smart contracts to help users create, update, and track tasks on the blockchain using simple chat-based instructions.
            </p>
          </div>

          <Card className="overflow-hidden border-border bg-card">
            <div className="relative h-[200px] sm:h-[300px] w-full">
              <Image
                className="rounded-lg object-cover"
                src="/icons/blockmind.png"
                alt="BlockMind UI"
                fill
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BlockMind - AI + Web3</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Chat-based task management powered by AI and smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Users interact with an AI assistant that generates smart contract transactions on the fly. BlockMind uses Next.js, Wagmi, RainbowKit, OpenAI API, and Solidity-based contracts to bring natural language automation to Web3 task management.
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                <span className="tech-badge">Next.js</span>
                <span className="tech-badge">Solidity</span>
                <span className="tech-badge">Wagmi</span>
                <span className="tech-badge">RainbowKit</span>
                <span className="tech-badge">OpenAI</span>
                <span className="tech-badge">Framer Motion</span>
                <span className="tech-badge">TypeScript</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2" asChild>
                <a href="https://github.com/abhijeet8080/BlockMind" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  Source Code
                </a>
              </Button>
              <Button size="sm" className="w-full sm:w-auto gap-2" asChild>
                <a href="https://block-mind.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-between items-center mt-3 sm:mt-6">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
              <Link href="/projects/convocloud">Previous Project</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm gap-2" asChild>
              <Link href="/projects/bablue">Next Project</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
