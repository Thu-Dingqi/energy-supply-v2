"use client"

import { useState, useEffect } from "react"
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
  // 添加重设标识符，用于通知子组件重置状态
  const [resetKey, setResetKey] = useState<number>(0)

  // Add this effect to handle when the user is viewing "净调入电量" and selects "全国"
  useEffect(() => {
    if (selectedNode === "net-power-export" && selectedProvince === "nation") {
      // Switch to a default node when this happens
      setSelectedNode("power-generation-mix");
    }
  }, [selectedProvince, selectedNode]);

  const handleNodeSelect = (nodeId: string) => {
    // 判断是否切换到不同类别的节点
    const currentCategory = getNodeCategory(selectedNode);
    const newCategory = getNodeCategory(nodeId);
    
    if (currentCategory !== newCategory) {
      // 如果切换到不同类别，增加重设标识符
      setResetKey(prev => prev + 1);
    }
    
    setSelectedNode(nodeId);
  }

  // 辅助函数：获取节点所属的类别
  const getNodeCategory = (nodeId: string | null): string => {
    if (!nodeId) return "";
    
    if (nodeId.startsWith("emissions-")) {
      return "emissions";
    }
    
    // 能源供应类别
    const energySupplyNodes = [
      "power-generation-mix", "installed-power-capacity", 
      "new-power-capacity", "power-investment", 
      "primary-energy-supply", "hydrogen-supply", "net-power-export"
    ];
    if (energySupplyNodes.includes(nodeId)) {
      return "energy-supply";
    }
    
    // 技术类别
    if (nodeId.includes("PLT") || nodeId.includes("CHP")) {
      return "technology";
    }
    
    // 资源类别
    const resourceNodes = ["coal", "oil", "natural-gas", "nuclear", "biomass", "solar", "wind"];
    if (resourceNodes.includes(nodeId)) {
      return "resource";
    }
    
    return "other";
  }

  const handleModelComplete = () => {
    setIsModelComplete(true)
    setActiveNav("results")
    setSelectedNode("power-generation-mix") // Set a default selection for results
    // 切换到结果视图时重置状态
    setResetKey(prev => prev + 1);
  }

  const renderActivePanel = () => {
    switch (activeNav) {
      case "analysis":
        return (
          <DataPanel
            key={`data-${resetKey}`}
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
            key={`result-${resetKey}`}
            activeNav={activeNav}
            selectedNode={selectedNode}
            selectedScenario={selectedScenario}
            selectedProvince={selectedProvince}
            isModelComplete={isModelComplete}
          />
        )
      case "note":
        return (
          <DataPanel
            key={`note-${resetKey}`}
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
          setActiveNav={(nav) => {
            if (nav !== activeNav) {
              // 切换导航时重置状态
              setResetKey(prev => prev + 1);
            }
            setActiveNav(nav);
          }}
          isModelComplete={isModelComplete}
          setIsModelComplete={setIsModelComplete}
          onRunModel={handleModelComplete}
        />
        {activeNav !== "note" && (
          <div className="w-[400px] border-r border-border">
            <MainContent
              activeNav={activeNav}
              activeSection={activeSection}
              setActiveSection={(section) => {
                if (section !== activeSection) {
                  // 切换区域时重置状态
                  setResetKey(prev => prev + 1);
                }
                setActiveSection(section);
              }}
              selectedScenario={selectedScenario}
              setSelectedScenario={setSelectedScenario}
              selectedProvince={selectedProvince}
              setSelectedProvince={(province) => {
                if (province !== selectedProvince) {
                  // 切换省份时重置状态
                  setResetKey(prev => prev + 1);
                }
                setSelectedProvince(province);
              }}
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

