"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export function TypingAnimation({
  text,
  duration = 20,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [text,duration, i]);

  return (
    <div
    className={cn(
      "text-sm font-medium leading-relaxed tracking-tight",
      className
    )}
  >
    <ReactMarkdown>{displayedText ? displayedText : text}</ReactMarkdown>
  </div>
  
  );
}
