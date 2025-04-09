"use client"

import { BarChart3, FileText, Home, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { NavigationItem } from "./energy-platform"

interface SidebarProps {
  activeNav: NavigationItem
  setActiveNav: (nav: NavigationItem) => void
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const navItems = [
    { id: "analysis" as const, icon: BarChart3, label: "分析" },
    { id: "results" as const, icon: PieChart, label: "结果" },
    { id: "overview" as const, icon: Home, label: "总览" },
    { id: "note" as const, icon: FileText, label: "说明" },
  ]

  return (
    <div className="w-1/5 bg-muted/30 border-r border-border flex flex-col items-center py-6">
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Tooltip key={item.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeNav === item.id ? "secondary" : "ghost"}
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setActiveNav(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
