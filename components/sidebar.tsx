"use client"

import { ArrowLeft, BarChart3, FileText, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { NavigationItem } from "./energy-platform"

interface SidebarProps {
  activeNav: NavigationItem
  setActiveNav: (nav: NavigationItem) => void
  isModelComplete: boolean
  setIsModelComplete: (isComplete: boolean) => void
  onRunModel: () => void
  className?: string
}

export default function Sidebar({
  activeNav,
  setActiveNav,
  isModelComplete,
  setIsModelComplete,
  onRunModel,
  className = "",
}: SidebarProps) {
  const navItems = [
    { id: "analysis" as const, icon: BarChart3, label: "分析" },
    { id: "results" as const, icon: PieChart, label: "结果" },
    { id: "note" as const, icon: FileText, label: "说明" },
    { 
      id: "return" as const, 
      icon: ArrowLeft, 
      label: "返回",
      onClick: () => window.location.href = 'https://demand.energy-model.site/'
    }
  ]

  return (
    <div className={`w-[130px] bg-muted/30 border-r border-border flex flex-col items-center py-6 ${className}`}>
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Tooltip key={item.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeNav === item.id ? "secondary" : "ghost"}
                  size="icon"
                  className={`h-16 w-16 transition-all flex flex-col items-center justify-center ${
                    activeNav === item.id 
                      ? "bg-primary/10 border-l-4 border-primary shadow-sm" 
                      : "hover:bg-primary/5"
                  }`}
                  onClick={item.onClick || (() => setActiveNav(item.id))}
                >
                  <item.icon className={`h-8 w-8 ${activeNav === item.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
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

