"use client"

import { useState } from "react"
import MainContent from "./main-content"
import DataPanel from "./data-panel"
import ResultPanel from "./result-panel"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"

export type NavigationItem = "analysis" | "results" | "note" | "return"
export type ContentSection = "transformation" | "resources"

export default function EnergyPlatform() {
  const [activeNav, setActiveNav] = useState<NavigationItem>("analysis")
  const [activeSection, setActiveSection] = useState<ContentSection>("transformation")
  const [selectedNode, setSelectedNode] = useState<string | null>("ECHPCOA")
  const [selectedScenario, setSelectedScenario] = useState<string>("cn60")
  const [selectedProvince, setSelectedProvince] = useState<string>("nation")
  const [isModelComplete, setIsModelComplete] = useState(false)

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNode(nodeId)
  }

  const handleModelComplete = () => {
    setIsModelComplete(true)
    setActiveNav("results")
    setSelectedNode("power-generation-mix") // Set a default selection for results
  }

  const renderActivePanel = () => {
    switch (activeNav) {
      case "analysis":
        return (
          <DataPanel
            activeNav={activeNav}
            activeSection={activeSection}
            selectedNode={selectedNode}
            selectedScenario={selectedScenario}
            selectedProvince={selectedProvince}
          />
        )
      case "results":
        return (
          <ResultPanel
            activeNav={activeNav}
            activeSection={activeSection}
            selectedNode={selectedNode}
            selectedScenario={selectedScenario}
            selectedProvince={selectedProvince}
            isModelComplete={isModelComplete}
          />
        )
      case "note":
        return (
          <DataPanel
            activeNav="note"
            activeSection={activeSection}
            selectedNode={selectedNode}
            selectedScenario={selectedScenario}
            selectedProvince={selectedProvince}
          />
        )
      default:
        return null
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen w-full">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isModelComplete={isModelComplete}
          setIsModelComplete={setIsModelComplete}
          onRunModel={handleModelComplete}
        />
        {activeNav !== "note" && (
          <div className="w-[400px] border-r border-border">
            <MainContent
              activeNav={activeNav}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              selectedScenario={selectedScenario}
              setSelectedScenario={setSelectedScenario}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedNode={selectedNode}
              onNodeSelect={handleNodeSelect}
              isModelComplete={isModelComplete}
              onModelComplete={handleModelComplete}
            />
          </div>
        )}
        <main className="flex-1 overflow-auto">
          <div className="p-4 h-full">
            {renderActivePanel()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

