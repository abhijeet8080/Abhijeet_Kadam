"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { VSCodeLayout } from "@/components/vscode/layout"
import { Terminal } from "@/components/vscode/terminal"
import { CommandPalette } from "@/components/vscode/command-palette"
import { Button } from "@/components/ui/button"
import { VSCodeLogoIcon } from "@/components/icons/vscode-logo"
import { KeyboardEvent } from "react"
import { FileText } from "lucide-react"
import { RESUME_PDF_HREF } from "@/lib/site"

export default function Home() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 w-full">
          <h1 className="text-4xl font-bold tracking-tight">Abhijeet Kadam</h1>

          <p className="text-xl sm:text-2xl font-mono text-portfolio-highlight">
            Full Stack AI Engineer · Voice AI · Backend Systems
          </p>

          <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl leading-relaxed">
            I build AI systems that run in production — autonomous PR review agents, real-time voice
            receptionists, and distributed backends on Azure. Currently at AEOS Labs.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
            <Button asChild size="sm">
              <Link href="/projects/voice-agent">View Projects</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={RESUME_PDF_HREF} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </a>
            </Button>
            <a
              href="https://github.dev/abhijeet8080/Abhijeet_Kadam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#e6edf3] dark:shadow-none dark:hover:bg-[#30363d] dark:focus-visible:outline-[#58a6ff]"
            >
              <VSCodeLogoIcon className="size-4 shrink-0 text-[#007ACC]" />
              Open in VS Code
            </a>
          </div>

          <p className="font-mono text-xs text-portfolio-highlight/90 self-start w-full max-w-3xl">
            {"// try typing 'help' below"}
          </p>

          <div className="w-full max-w-3xl">
            <Terminal className="w-full h-80 sm:h-96" />
          </div>
        </div>
      </div>
    </VSCodeLayout>
  )
}
