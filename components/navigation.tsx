"use client"

import { ArrowLeft, BarChart3, FileText, Home, PieChart } from "lucide-react"
import type { NavigationItem } from "./energy-platform"

interface NavigationProps {
  activeNav: NavigationItem
  setActiveNav: (nav: NavigationItem) => void
}

export default function Navigation({ activeNav, setActiveNav }: NavigationProps) {
  const navItems = [
    { id: "analysis" as const, icon: BarChart3, label: "分析" },
    { id: "results" as const, icon: PieChart, label: "结果" },
    { id: "note" as const, icon: FileText, label: "说明" },
    { 
      id: "return" as const, 
      icon: ArrowLeft, 
      label: "返回",
      onClick: () => window.location.href = 'https://national-grid-website.vercel.app/'
    }
  ]

  return (
    <div className="w-[10%] bg-muted/30 border-r border-border flex flex-col items-center py-8">
      <div className="flex flex-col gap-10 items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-2 w-20 py-3 px-4 rounded-lg transition-colors ${
              activeNav === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            onClick={item.onClick || (() => setActiveNav(item.id as NavigationItem))}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

