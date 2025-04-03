"use client"

import React from "react"
import { 
  Files, 
  Search, 
  GitBranch, 
  Bug, 
  Package, 
  Settings,
  User
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

interface ActivityBarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export function ActivityBar({ isSidebarOpen, toggleSidebar }: ActivityBarProps) {
  const icons = [
    { icon: <Files size={24} />, tooltip: "Explorer", onClick: toggleSidebar, active: isSidebarOpen },
    { icon: <Search size={24} />, tooltip: "Search", onClick: () => {} },
    { icon: <GitBranch size={24} />, tooltip: "Source Control", onClick: () => {} },
    { icon: <Bug size={24} />, tooltip: "Run and Debug", onClick: () => {} },
    { icon: <Package size={24} />, tooltip: "Extensions", onClick: () => {} },
    { icon: <User size={24} />, tooltip: "Profile", onClick: () => {} },
  ]
  
  return (
    <div className="w-12 h-full bg-muted border-r border-border flex flex-col">
      <div className="flex-1 flex flex-col items-center py-2 space-y-4">
        {icons.map((item, index) => (
          <Tooltip key={index} delayDuration={300}>
            <TooltipTrigger asChild>
              <motion.button
                className={`w-full flex justify-center p-2 ${item.active ? "bg-zinc-800" : "hover:bg-zinc-800"} text-muted-foreground hover:text-foreground`}
                onClick={item.onClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {item.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="py-2 flex flex-col items-center">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <motion.button
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-zinc-800 w-full flex justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={24} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Settings
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
} 