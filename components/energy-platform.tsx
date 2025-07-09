"use client"

import { useState } from "react"
import Navigation from "./navigation"
import MainContent from "./main-content"
import DataPanel from "./data-panel"
import ResultPanel from "./result-panel"

export type NavigationItem = "analysis" | "results" | "note" | "return"
export type ContentSection = "transformation" | "resources"

export default function EnergyPlatform() {
  const [activeNav, setActiveNav] = useState<NavigationItem>("analysis")
  const [activeSection, setActiveSection] = useState<ContentSection>("transformation")
  const [selectedScenario, setSelectedScenario] = useState("cn60")
  const [selectedProvince, setSelectedProvince] = useState("beijing")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isModelComplete, setIsModelComplete] = useState(false)

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNode(nodeId)
  }

  // 3. 确保"分析"和"结果"使用相同的三栏布局
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Column - Navigation (smaller width) */}
      <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Middle Column - Main Content */}
      {activeNav !== "note" && (
        <div className="w-[360px] border-r border-border overflow-hidden flex-shrink-0">
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
            onModelComplete={() => setIsModelComplete(true)}
          />
        </div>
      )}

      {/* Right Column - Data/Charts/Explanation */}
      <div className="flex-1">
        {activeNav === "results" ? (
          <ResultPanel
            activeNav={activeNav}
            selectedNode={selectedNode}
            selectedScenario={selectedScenario}
            selectedProvince={selectedProvince}
            isModelComplete={isModelComplete}
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
    </div>
  )
}

