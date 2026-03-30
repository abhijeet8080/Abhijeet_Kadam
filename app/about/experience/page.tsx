"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
import { KeyboardEvent } from "react"
import Image from "next/image"

type Bullet =
  | string
  | {
      text: string
      sub: string[]
    }

const meta = {
  role: "Full Stack AI Engineer",
  domain: "Industrial B2B Marketplace + AI Automation",
}

const bullets: Bullet[] = [
  "Built a production-grade B2B industrial parts marketplace (Industrial Motion) using a TypeScript monorepo with independently deployable microservices (Auth + Sync) on Azure Container Apps.",
  "Designed an AI-powered RFQ automation pipeline using OpenAI + Google Gemini — reducing quote turnaround time from 48+ hours to minutes for industrial parts procurement.",
  {
    text: "Architected an async job processing system using BullMQ + Redis with KEDA auto-scaling, handling:",
    sub: [
      "RFQ processing and vendor sourcing jobs",
      "email ingestion via Microsoft Graph webhooks",
      "Microsoft Graph subscription lifecycle management",
      "KEDA auto-scaling based on Redis queue depth",
    ],
  },
  "Integrated Microsoft Business Central (OData APIs) for real-time bidirectional sync of vendors, items, purchase quotes, and conversations.",
  "Built an email-driven ingestion pipeline using Microsoft Graph webhooks to parse and process RFQs directly from incoming emails.",
  "Containerized services using multi-stage Docker builds and implemented CI/CD pipelines via GitHub Actions → Azure Container Registry → Azure Container Apps.",
  "Structured the platform as a TypeScript monorepo with independently deployable Auth and Sync microservices sharing a common @industrial/db Prisma package — enabling isolated deployments without duplicated database logic.",
  "Designed shared database architecture using Prisma + PostgreSQL with a reusable `@industrial/db` package across services.",
  "Developed document processing pipelines for PDF, Word, and Excel (pdf-parse, mammoth, xlsx) to extract structured RFQ data.",
  "Implemented transactional communication flows using Azure Communication Services (Email).",
  "Contributed to Business Central customization and integration workflows to align ERP processes with platform automation.",
]

export default function ExperiencePage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown as unknown as EventListener)
    return () => document.removeEventListener("keydown", handleKeyDown as unknown as EventListener)
  }, [])

  return (
    <VSCodeLayout>
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto text-gray-200">
        <motion.div
          className="flex flex-col space-y-6 md:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose dark:prose-invert text-base sm:text-lg max-w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-400">Experience</h1>

            <div className="not-prose my-6 w-64">
              <div className="relative w-full overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
                <Image
                  src="/icons/aeos.png"
                  alt="AEOS LABS minimalist white logo on a black background"
                  width={1600}
                  height={640}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 768px) 100vw, min(1152px, 100vw)"
                  priority
                />
              </div>
            </div>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-blue-300 mt-0">
                AEOS Labs — Full Stack AI Engineer
              </h2>
              <p className="text-muted-foreground not-prose text-sm sm:text-base mb-2">
                Sept 2025 – Present
              </p>
              <div className="not-prose font-mono text-xs sm:text-sm text-cyan-600/90 dark:text-cyan-400/90 mb-6 space-y-0.5 border-l-2 border-cyan-500/40 pl-3">
                <p className="m-0">
                  {"// role: "}
                  {meta.role}
                </p>
                <p className="m-0">
                  {"// domain: "}
                  {meta.domain}
                </p>
                <p className="m-0">{"// stack: TypeScript · Azure · BullMQ · Prisma · OpenAI · Gemini"}</p>
              </div>
              <ul className="list-disc pl-6 space-y-3 not-prose text-sm sm:text-base text-gray-200">
                {bullets.map((item, i) =>
                  typeof item === "string" ? (
                    <li key={i}>{item}</li>
                  ) : (
                    <li key={i}>
                      {item.text}
                      <ul className="list-disc pl-5 mt-2 space-y-1.5">
                        {item.sub.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
