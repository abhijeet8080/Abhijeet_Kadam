"use client"
import axios from "axios"
import React, { useState, useEffect } from "react"
import { VSCodeLayout } from "@/components/vscode/layout"
import { CommandPalette } from "@/components/vscode/command-palette"
import { motion } from "framer-motion"
import { KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, User, MessageSquare, Send, Github, Linkedin } from "lucide-react"

export default function ContactPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
  
    try {
      const { data } = await axios.post("/api/contact", formState)
      // const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/contact`, formState)
  
      if (data.success) {
        setSubmitSuccess(true)
        setFormState({ name: "", email: "", message: "" })
      } else {
        setErrorMessage(data.error || "Something went wrong.")
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setErrorMessage(error.response?.data?.error || "Error sending message.")
    } finally {
      setIsSubmitting(false)
  
      if (submitSuccess) {
        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    }
  }
  
  
  return (
    <VSCodeLayout>
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
      />
      
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Contact Me</h1>
              <p className="text-muted-foreground mt-2">
                Feel free to reach out if you have any questions or want to collaborate.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message here..."
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
              
              {submitSuccess && (
                <motion.div 
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 p-3 rounded text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  Message sent successfully! I&apos;ll get back to you soon.
                </motion.div>
              )}
              
              {errorMessage && (
                <motion.div 
                  className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-3 rounded text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </form>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-muted p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold">Connect With Me</h2>
              
              <div className="space-y-3">
                <a 
                  href="mailto:kadamabhijeet021@gmail.com" 
                  className="flex items-center gap-3 hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>kadamabhijeet021@gmail.com</span>
                </a>
                
                <a 
                  href="https://github.com/abhijeet8080" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>github.com/abhijeet8080</span>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/abhijeetkadam21/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>linkedin.com/in/abhijeetkadam21</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </VSCodeLayout>
  )
}
