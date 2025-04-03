"use client"

import React from "react"
import { GitBranch, Check, Wifi, Bell } from "lucide-react"

export function StatusBar() {
  return (
    <div className="h-6 bg-muted text-xs border-t border-border flex items-center justify-between text-muted-foreground px-2 overflow-x-auto">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <GitBranch className="h-3.5 w-3.5" />
          <span>main</span>
        </div>
        <div className="flex items-center space-x-1">
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span>0 problems</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-1">
          <Wifi className="h-3.5 w-3.5" />
          <span>Connected</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1">
          <Bell className="h-3.5 w-3.5" />
          <span>Notifications</span>
        </div>
        <div className="hidden md:block">
          <span>TypeScript 5.3.3</span>
        </div>
        <div className="hidden md:block">
          <span>UTF-8</span>
        </div>
        <div className="hidden md:block">
          <span>LF</span>
        </div>
      </div>
    </div>
  )
} 