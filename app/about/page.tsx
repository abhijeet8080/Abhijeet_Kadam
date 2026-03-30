"use client"

import React, { useState, useEffect } from "react";
import { VSCodeLayout } from "@/components/vscode/layout";
import { CommandPalette } from "@/components/vscode/command-palette";
import { motion } from "framer-motion";
import { KeyboardEvent } from "react";

export default function AboutPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown as unknown as EventListener);
    return () => {
      document.removeEventListener("keydown", handleKeyDown as unknown as EventListener);
    };
  }, []);

  return (
    <VSCodeLayout>
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />

      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto text-gray-200">
        <motion.div
          className="flex flex-col space-y-6 md:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose dark:prose-invert text-base sm:text-lg max-w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-400">About Me</h1>
            <p>
              I build AI systems that work in production — not demos. I&apos;m Abhijeet Kadam, Full
              Stack AI Engineer at AEOS Labs (Sept 2025 – Present), where I ship distributed
              backends, AI automation pipelines, and cloud infrastructure on Azure. Most recently: an
              autonomous PR review agent that posts inline GitHub suggestions, and a real-time voice
              receptionist that handles inbound phone calls end-to-end — both running in production.
            </p>

            <div className="not-prose font-mono text-xs sm:text-sm text-cyan-600/90 dark:text-cyan-400/90 my-4 space-y-0.5 border-l-2 border-cyan-500/40 pl-3">
              <p className="m-0">{"// currently: Full Stack AI Engineer @ AEOS Labs"}</p>
              <p className="m-0">{"// prev: BugBot · Voice Agent · Industrial Motion"}</p>
              <p className="m-0">{"// stack: TypeScript · Azure · Gemini · BullMQ · Hono"}</p>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-400">Background</h2>
            <p>
              I hold a <strong>BTech in Electronics &amp; Telecommunications from VIIT</strong> with{" "}
              <strong>8.93 CGPA</strong>, graduated <strong>May 2025</strong>. That path went from
              circuits to full-stack web to AI-augmented systems — automating RFQs that used to take
              48 hours, building voice agents that handle real phone calls, and shipping a PR review
              bot that operates across repositories without human intervention.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-400">What I focus on</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Distributed backends and job queues — BullMQ + Redis + KEDA powering RFQ automation at
                AEOS
              </li>
              <li>
                AI pipelines — 3-stage GPT review in BugBot, dual-architecture voice AI with Gemini
                Live
              </li>
              <li>
                Developer experience: TypeScript monorepos, CI/CD to Azure Container Apps, code
                review tooling
              </li>
              <li>
                Interfaces that stay fast whether web or telephony — sub-800ms voice response latency
                in production
              </li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-400">Beyond the keyboard</h2>
            <p>
              I recharge by exploring nature, cooking, and keeping up with engineering blogs. Diverse
              interests feed how I design systems — practical, calm under load, and easy for others to
              extend.
            </p>

            <p>
              I&apos;m open to meaningful collaborations. Reach out via the contact page or say hi in
              the AI chat — let&apos;s build something solid.
            </p>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  );
}
