"use client"

import { useState } from "react"
import Navigation from "./navigation"
import MainContent from "./main-content"
import DataPanel from "./data-panel"
import ResultPanel from "./result-panel"

export type NavigationItem = "analysis" | "results" | "note" | "return"
export type ContentSection = "key-assumptions" | "demand" | "transformation" | "resources"

export default function EnergyPlatform() {
  const [activeNav, setActiveNav] = useState<NavigationItem>("overview")
  const [activeSection, setActiveSection] = useState<ContentSection>("key-assumptions")
  const [selectedScenario, setSelectedScenario] = useState("cn60")
  const [selectedProvince, setSelectedProvince] = useState("beijing")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNode(nodeId)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Column - Navigation (smaller width) */}
      <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Middle Column - Main Content (reduced by 30%) */}
      {activeNav !== "note" && (
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
        />
      )}

      {/* Right Column - Data/Charts/Explanation (increased proportionally) */}
      {activeNav === "results" ? (
        <ResultPanel
          activeNav={activeNav}
          selectedNode={selectedNode}
          selectedScenario={selectedScenario}
          selectedProvince={selectedProvince}
        />
      ) : (
        <DataPanel
          activeNav={activeNav}
          activeSection={activeSection}
          selectedNode={selectedNode}
          selectedScenario={selectedScenario}
          selectedProvince={selectedProvince}
        />
      )}
    </div>
  )
}

