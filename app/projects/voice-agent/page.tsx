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
  category: "AI Systems / Real-Time / Telephony",
}

const bullets: Bullet[] = [
  "Built a real-time AI voice receptionist capable of handling inbound phone calls, booking appointments, and sending confirmations without human intervention.",
  "Achieves sub-800ms end-to-end latency in Live mode — from caller speech to agent audio response.",
  {
    text: "Two switchable call handler architectures:",
    sub: [
      "LiveCallHandler: Gemini Live API — native audio-in/audio-out, no STT/TTS chaining, sub-800ms latency",
      "SequentialCallHandler: Deepgram STT → Gemini 2.5 Flash → Deepgram Aura TTS — reliable fallback with 4s silence reprompting",
      "Toggle between them via a single import swap in server.ts",
    ],
  },
  "Implemented a fallback STT → LLM → TTS pipeline (Deepgram + Gemini) to support reliability and flexible deployment modes.",
  {
    text: "Local Silero VAD via @ericedouard/vad-node-realtime for zero-latency barge-in:",
    sub: [
      "Runs inference locally — no cloud round-trip means detection fires in sub-millisecond",
      "On interrupt: fires clear command to Twilio dropping queued audio, simultaneously sends turnComplete: true to Gemini WebSocket to stop the model mid-speech",
    ],
  },
  "Worked around Gemini Live's persistent context limitation using injected [SYSTEM STATE UPDATE] user messages after each tool execution — allowing dynamic system prompt behavior inside a stateful session.",
  "Developed a state-driven conversation engine (GREETING → COLLECTING_INFO → CONFIRMING → BOOKED) with dynamic system prompts for context-aware responses.",
  {
    text: "Built end-to-end booking flow:",
    sub: [
      "captures user details via voice",
      "checks availability",
      "persists appointments (Supabase/PostgreSQL)",
      "sends SMS confirmations via Twilio",
    ],
  },
  {
    text: "Full audio resampling chain across both architectures:",
    sub: [
      "Ingress: Twilio 8kHz µ-law → alawmulaw decode → PCM → upsample to 16kHz for Gemini Live ingestion",
      "Egress: Gemini Live outputs 24kHz PCM → downsample → 8kHz µ-law → chunked into 160-byte buffers for Twilio's 20ms frames",
      "Sequential path: Deepgram nova-2 STT → Gemini 2.5 Flash text → Deepgram Aura TTS → same µ-law chunking",
    ],
  },
  "Managed session state and real-time interactions using Upstash Redis with automatic cleanup on call termination.",
  "Designed the system for production readiness with scalable WebSocket handling and extensible tool-based architecture.",
]

const tech = [
  "Twilio",
  "Gemini Live",
  "Deepgram",
  "Hono",
  "WebSockets",
  "Supabase",
  "Redis",
  "Node.js",
  "Silero VAD",
  "alawmulaw",
  "TypeScript",
]

export default function VoiceAgentProjectPage() {
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
            <h1 className="text-2xl sm:text-3xl font-bold">Voice Agent — AI Voice Receptionist</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Phone AI receptionist built on two switchable architectures: Gemini Live (native audio-to/audio-out) and a Sequential STT→LLM→TTS pipeline. Sub-800ms end-to-end latency with local VAD barge-in.
            </p>
          </div>

          <Card className="overflow-hidden border-border bg-card">
            <div className="relative h-[200px] sm:h-[300px] w-full bg-muted">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/35 px-4 text-center pointer-events-none">
                <p className="text-white text-base sm:text-xl font-medium drop-shadow-sm">
                  Voice Agent — live call, transcription & tools
                </p>
                <span className="font-mono text-[11px] sm:text-xs text-cyan-200/95">
                  {"// "}
                  {meta.category}
                </span>
              </div>
              <Image
                src="/icons/voice-agent.png"
                alt="Voice Agent UI: active call, real-time transcription, booking and SMS tool flows"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Voice Agent</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Dual architecture · local VAD barge-in · full audio resampling chain · sub-800ms latency
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
                <Link href="/projects/bugbot">Previous: BugBot</Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link href="/projects/bugbot">Next: BugBot</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
