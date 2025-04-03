"use client"

import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
import { KeyboardEvent } from "react"

const skills = {
  frontend: [
    "HTML5",
    "CSS3",
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Framer Motion",
    "Redux",
    "CSS-in-JS"
  ],
  backend: [
    "Node.js",
    "Express",
    "RESTful APIs",
    
    "MongoDB",
    "WebSockets"
    
    
    
  ],
  tools: [
    "Git & GitHub",
    "VS Code",
    "Vite",
    "PostMan"
  ],
  softSkills: [
    "Problem Solving",
    "Communication",
    "Team Collaboration",
    "Time Management",
    "Adaptability",
    "Attention to Detail"
  ]
}

export default function SkillsPage() {
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
  
  // Visual representation of a JSON file
  return (
    <VSCodeLayout>
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
      />
      
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
              <span className="text-green-400">&quot;Full Stack Developer&quot;</span>
              <span className="text-white">,</span>
              {"\n"}
              <span className="text-yellow-400 pl-4">&quot;skills&quot;</span>
              <span className="text-white">: </span>
              <span className="text-blue-400">{"{"}</span>
              {"\n"}
              <span className="text-yellow-400 pl-8">&quot;frontend&quot;</span>
              <span className="text-white">: </span>
              <span className="text-blue-400">[</span>
              {"\n"}
              {skills.frontend.map((skill, index) => (
                <React.Fragment key={skill}>
                  <span className="pl-12 text-green-400">&quot;{skill}&quot;</span>
                  {index < skills.frontend.length - 1 && <span className="text-white">,</span>}
                  {"\n"}
                </React.Fragment>
              ))}
              <span className="text-blue-400 pl-8">]</span>
              <span className="text-white">,</span>
              {"\n"}
              <span className="text-yellow-400 pl-8">&quot;backend&quot;</span>
              <span className="text-white">: </span>
              <span className="text-blue-400">[</span>
              {"\n"}
              {skills.backend.map((skill, index) => (
                <React.Fragment key={skill}>
                  <span className="pl-12 text-green-400">&quot;{skill}&quot;</span>
                  {index < skills.backend.length - 1 && <span className="text-white">,</span>}
                  {"\n"}
                </React.Fragment>
              ))}
              <span className="text-blue-400 pl-8">]</span>
              <span className="text-white">,</span>
              {"\n"}
              <span className="text-yellow-400 pl-8">&quot;tools&quot;</span>
              <span className="text-white">: </span>
              <span className="text-blue-400">[</span>
              {"\n"}
              {skills.tools.map((skill, index) => (
                <React.Fragment key={skill}>
                  <span className="pl-12 text-green-400">&quot;{skill}&quot;</span>
                  {index < skills.tools.length - 1 && <span className="text-white">,</span>}
                  {"\n"}
                </React.Fragment>
              ))}
              <span className="text-blue-400 pl-8">]</span>
              <span className="text-white">,</span>
              {"\n"}
              <span className="text-yellow-400 pl-8">&quot;softSkills&quot;</span>
              <span className="text-white">: </span>
              <span className="text-blue-400">[</span>
              {"\n"}
              {skills.softSkills.map((skill, index) => (
                <React.Fragment key={skill}>
                  <span className="pl-12 text-green-400">&quot;{skill}&quot;</span>
                  {index < skills.softSkills.length - 1 && <span className="text-white">,</span>}
                  {"\n"}
                </React.Fragment>
              ))}
              <span className="text-blue-400 pl-8">]</span>
              {"\n"}
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