"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

type Bullet =
  | string
  | {
      text: string
      sub: string[]
    }

const meta = {
  category: "AI Systems / Developer Tools / Distributed Systems",
}

const bullets: Bullet[] = [
  "Built an AI-powered GitHub code review system that automatically analyzes pull requests and posts inline review comments — mimicking a senior engineer.",
  "Designed an event-driven architecture using GitHub Webhooks → Hono server → BullMQ queue → distributed workers for scalable async processing.",
  {
    text: "Implemented a multi-stage AI pipeline:",
    sub: [
      "summarize code changes",
      "identify bugs & security issues (structured JSON)",
      "generate inline fix suggestions (GitHub-compatible)",
    ],
  },
  "Stage 3 (fix suggestion) only runs for bug and security type issues — skipping style and low-severity findings cuts LLM calls by ~60% on average PRs.",
  "Engineered a diff chunking system to handle large PRs efficiently, with token-aware splitting and global processing limits.",
  {
    text: "Solved the GitHub diff line problem with snapToNearestDiffLine —",
    sub: [
      "AI returns absolute file line numbers; GitHub only accepts lines present in the diff hunk",
      "snapper finds the nearest addedLines entry by absolute distance, preventing 422 errors",
      "deduplication filters issues whose description already exists in PR comments, preventing duplicate noise on force-push re-triggers",
    ],
  },
  "On synchronize (force-push) events, before/after SHA comparison filters out already-reviewed files — only the net-new diff gets re-processed, not the entire PR.",
  "Integrated GitHub App authentication using @octokit/app for secure, installation-based access across repositories.",
  "Designed persistent job tracking system using PostgreSQL (Prisma) to monitor processing status, failures, and token usage.",
  {
    text: "Optimized system for reliability:",
    sub: [
      "crypto.timingSafeEqual HMAC verification with typed failure reasons (missing_secret, length_mismatch, mismatch)",
      "x-github-delivery header as idempotency key — same webhook delivery never processes twice",
      "3 retries with exponential backoff via BullMQ; ReviewJob marked failed with error message after exhausting",
      "202 Accepted returned to GitHub immediately — worker decoupled so GitHub's 10s timeout is never at risk",
    ],
  },
  "Packaged as a TypeScript monorepo with shared config + DB layers for scalability and maintainability.",
]

const tech = [
  "Hono",
  "BullMQ",
  "Redis",
  "OpenAI",
  "Octokit",
  "PostgreSQL",
  "Prisma",
  "TypeScript",
  "gpt-4.1-mini",
  "Docker",
]

export default function BugBotProjectPage() {
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
            <h1 className="text-2xl sm:text-3xl font-bold">BugBot — AI GitHub Code Review</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Autonomous PR review bot: HMAC-verified webhooks → BullMQ workers → 3-stage GPT-4.1-mini pipeline that posts inline GitHub suggestions.
              Reduces LLM calls by ~60% by skipping Stage 3 for non-critical issues.
            </p>
          </div>

          <Card className="overflow-hidden border-border bg-card">
            <div className="relative h-[200px] sm:h-[300px] w-full bg-muted">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/35 px-4 text-center pointer-events-none">
                <p className="text-white text-base sm:text-xl font-medium drop-shadow-sm">
                  BugBot — AI analysis on a GitHub PR
                </p>
                <span className="font-mono text-[11px] sm:text-xs text-cyan-200/95">
                  {"// "}
                  {meta.category}
                </span>
              </div>
              <Image
                src="/icons/bugbot.png"
                alt="BugBot reviewing a pull request: GitHub diff with AI security findings and inline suggestions"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BugBot</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                3-stage AI pipeline · HMAC-verified webhooks · diff line snapping · ~60% LLM call reduction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-3 not-prose text-xs sm:text-sm text-muted-foreground">
                {bullets.map((item, i) =>
                  typeof item === "string" ? (
                    <li key={i} className="text-foreground">
                      {item}
                    </li>
                  ) : (
                    <li key={i} className="text-foreground">
                      {item.text}
                      <ul className="list-disc pl-5 mt-2 space-y-1.5 text-muted-foreground">
                        {item.sub.map((s) => (
                          <li key={s} className="text-foreground">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                )}
              </ul>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 font-mono">
                  {"// tech"}
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {tech.map((t) => (
                    <span key={t} className="tech-badge">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link href="/projects/voice-agent">Previous: Voice Agent</Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link href="/projects/voice-agent">Next: Voice Agent</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
