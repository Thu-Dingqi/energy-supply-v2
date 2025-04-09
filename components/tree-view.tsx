"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

interface TreeViewProps {
  nodes: TreeNode[]
  selectedNodeId: string | null
  onNodeSelect: (nodeId: string) => void
}

export default function TreeView({ nodes, selectedNodeId, onNodeSelect }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }

  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes[node.id]
    const isSelected = selectedNodeId === node.id

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer ${
            isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            onNodeSelect(node.id)
            if (hasChildren) {
              toggleNode(node.id)
            }
          }}
        >
          {hasChildren && (
            <button
              className="mr-1 p-0.5 rounded-sm hover:bg-muted-foreground/10"
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node.id)
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <span className="text-sm">{node.label}</span>
        </div>

        {hasChildren && isExpanded && <div>{node.children!.map((child) => renderNode(child, level + 1))}</div>}
      </div>
    )
  }

  return <div className="space-y-1">{nodes.map((node) => renderNode(node))}</div>
}
