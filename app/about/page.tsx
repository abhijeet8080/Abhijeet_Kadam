"use client"

import React, { useState, useEffect } from "react";
import { VSCodeLayout } from "@/components/vscode/layout";
import { CommandPalette } from "@/components/vscode/command-palette";
import { motion } from "framer-motion";
import { KeyboardEvent } from "react";

export default function AboutPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Handle keyboard shortcuts
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
            <h1 className="text-3xl md:text-4xl font-bold text-blue-400">👨‍💻 About Me</h1>
            <p>
              Hey there! I&apos;m <strong className="text-blue-300">Abhijeet Kadam</strong>, a full-stack developer who thrives on crafting elegant, high-performance web applications. With a passion for clean code and user-centric design, I build experiences that are both intuitive and visually compelling.
            </p>

            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-200">
              <p>&quot;Great software is the perfect harmony of aesthetics, functionality, and performance.&quot;</p>
            </blockquote>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-400">🚀 My Journey</h2>
            <p>
              My fascination with technology began with a simple website I created years ago. That spark turned into an obsession with building scalable, impactful digital solutions. Today, I specialize in modern JavaScript frameworks, primarily React and Next.js, while also working across the full stack to create seamless applications.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-400">💡 What I Do</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Design and build intuitive, accessible user interfaces</li>
              <li>Develop robust APIs and scalable backend services</li>
              <li>Optimize application performance for lightning-fast experiences</li>
              <li>Ensure security and data integrity in web applications</li>
              <li>Collaborate with teams to deliver cutting-edge digital products</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-400">🌟 Beyond Coding</h2>
            <p>
              When I&apos;m not immersed in code, I&apos;m out exploring nature, experimenting with new recipes, or diving into tech blogs and books. I believe that creativity stems from diverse experiences, and I love bringing that mindset into my work.
            </p>

            <p>
              I&apos;m always open to exciting projects and collaborations. Let&apos;s connect and create something extraordinary!
            </p>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  );
}
