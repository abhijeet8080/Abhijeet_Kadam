"use client";

import React, { useState, useEffect, useRef } from "react";
import { VSCodeLayout } from "@/components/vscode/layout";
import { CommandPalette } from "@/components/vscode/command-palette";
import { motion, AnimatePresence } from "framer-motion";
import { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot } from "lucide-react";
import { sendMessageToAI } from "@/lib/chatBot";
import { TypingAnimation } from "@/components/ui/typing-animation";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hey there! 👋 Crypto here, Abhijeet Kadam's AI assistant. Nice to meet you! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Shift+P or Cmd+Shift+P for command palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    // @ts-expect-error - KeyboardEvent typing issue between DOM and React
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // @ts-expect-error - KeyboardEvent typing issue between DOM and React
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      // Send message to our AI service
      const aiResponseText = await sendMessageToAI(input.trim());

      // Create AI message with the response
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setIsThinking(false);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Create error message
      const errorResponse: Message = {
        id: `ai-error-${Date.now()}`,
        content:
          "Sorry, I encountered an error processing your request. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setIsThinking(false);
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  return (
    <VSCodeLayout>
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
      />

      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">Crypto: AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Ask me anything about coding, web development, or Abhijeet.
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.isUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar
                    className={message.isUser ? "bg-blue-600" : "bg-zinc-700"}
                  >
                    {message.isUser ? (
                      <AvatarFallback>U</AvatarFallback>
                    ) : (
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={`rounded-lg p-3 text-sm ${
                      message.isUser ? "bg-blue-600 text-white" : "bg-muted"
                    }`}
                  >
                    {message.isUser ? (
                      <p>{message.content}</p>
                    ) : (
                      <div className="prose prose-base dark:prose-invert max-w-none leading-relaxed">
                        <TypingAnimation text={message.content} />
                      </div>
                    )}
                    <div
                      className={`text-xs mt-1 opacity-70 ${
                        message.isUser ? "text-right" : ""
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                key="typing-indicator"
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-start gap-3 max-w-[80%]">
                  <Avatar className="bg-zinc-700">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="rounded-lg p-3 text-sm bg-muted">
                    <div className="flex space-x-1">
                      <div
                        key="dot-1"
                        className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        key="dot-2"
                        className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        key="dot-3"
                        className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-border bg-background shadow-sm">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              className="flex-1 rounded-lg"
              disabled={isThinking}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isThinking || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </VSCodeLayout>
  );
}
