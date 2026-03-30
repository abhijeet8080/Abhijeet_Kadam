"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
import { KeyboardEvent } from "react"

const skills = {
  languages: ["TypeScript", "JavaScript (ES6+)", "Java", "Python"],
  backend: [
    "Node.js",
    "Express",
    "RESTful APIs",
    "MongoDB",
    "WebSockets",
    "Hono",
    "BullMQ",
    "Redis",
    "Prisma",
    "PostgreSQL",
  ],
  ai_and_voice: [
    "OpenAI (GPT-4.1-mini)",
    "Google Gemini (Live API + 2.5 Flash)",
    "Deepgram (STT / Aura TTS)",
    "ElevenLabs",
    "Microsoft Graph API",
    "pgvector",
    "Prompt Engineering",
    "Structured Outputs",
  ],
  cloud: [
    "Azure Container Apps",
    "Azure Container Registry",
    "Azure Communication Services",
    "GitHub Actions",
    "Docker",
    "KEDA",
    "Supabase",
    "Upstash Redis",
  ],
  telephony: ["Twilio Voice", "Twilio Media Streams", "Twilio SMS", "Silero VAD", "alawmulaw"],
  frontend: [
    "HTML5",
    "CSS3",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Framer Motion",
    "Redux",
  ],
  tools: [
    "Git & GitHub",
    "VS Code",
    "Vite",
    "PostMan",
    "IntelliJ",
    "Docker",
    "ngrok",
  ],
} as const

const SKILL_ORDER = [
  "languages",
  "backend",
  "ai_and_voice",
  "cloud",
  "telephony",
  "frontend",
  "tools",
] as const satisfies readonly (keyof typeof skills)[]

export default function SkillsPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown as unknown as EventListener)
    return () => {
      document.removeEventListener("keydown", handleKeyDown as unknown as EventListener)
    }
  }, [])

  return (
    <VSCodeLayout>
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />

      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-muted/30 rounded-md p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-green-400">
              <span className="text-blue-400">{"{"}</span>
              {"\n"}
              <span className="text-yellow-400 pl-4">&quot;name&quot;</span>
              <span className="text-white">: </span>
              <span className="text-green-400">&quot;Abhijeet Kadam&quot;</span>
              <span className="text-white">,</span>
              {"\n"}
              <span className="text-yellow-400 pl-4">&quot;title&quot;</span>
              <span className="text-white">: </span>
              <span className="text-green-400">&quot;Full Stack AI Engineer&quot;</span>
              <span className="text-white">,</span>
              {"\n"}
              <span className="text-yellow-400 pl-4">&quot;skills&quot;</span>
              <span className="text-white">: </span>
              <span className="text-blue-400">{"{"}</span>
              {"\n"}
              {SKILL_ORDER.map((key, catIndex) => {
                const list = skills[key]
                const isLastCategory = catIndex === SKILL_ORDER.length - 1
                return (
                  <React.Fragment key={key}>
                    <span className="text-yellow-400 pl-8">&quot;{key}&quot;</span>
                    <span className="text-white">: </span>
                    <span className="text-blue-400">[</span>
                    {"\n"}
                    {list.map((skill, index) => (
                      <React.Fragment key={skill}>
                        <span className="pl-12 text-green-400">&quot;{skill}&quot;</span>
                        {index < list.length - 1 && <span className="text-white">,</span>}
                        {"\n"}
                      </React.Fragment>
                    ))}
                    <span className="text-blue-400 pl-8">]</span>
                    {!isLastCategory && <span className="text-white">,</span>}
                    {"\n"}
                  </React.Fragment>
                )
              })}
              <span className="text-blue-400 pl-4">{"}"}</span>
              {"\n"}
              <span className="text-blue-400">{"}"}</span>
            </pre>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
