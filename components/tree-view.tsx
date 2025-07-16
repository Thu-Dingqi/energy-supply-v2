"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Zap, Wind, Sun, Droplet, Activity, Flame, Box } from "lucide-react"

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

  // 根据节点ID返回适当的图标
  const getNodeIcon = (node: TreeNode) => {
    const id = node.id.toLowerCase();
    
    if (id.includes("coal") || id.includes("coa")) {
      return <Flame className="h-4 w-4 mr-1.5 text-slate-600" />;
    } else if (id.includes("wind") || id.includes("win")) {
      return <Wind className="h-4 w-4 mr-1.5 text-blue-500" />;
    } else if (id.includes("solar") || id.includes("sol")) {
      return <Sun className="h-4 w-4 mr-1.5 text-yellow-500" />;
    } else if (id.includes("hydro") || id.includes("hyd")) {
      return <Droplet className="h-4 w-4 mr-1.5 text-blue-400" />;
    } else if (id.includes("nuclear") || id.includes("nuc")) {
      return <Activity className="h-4 w-4 mr-1.5 text-purple-500" />;
    } else if (id.includes("gas") || id.includes("nga")) {
      return <Zap className="h-4 w-4 mr-1.5 text-orange-500" />;
    } else {
      // 默认图标
      return <Box className="h-4 w-4 mr-1.5 text-gray-400" />;
    }
  };

  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedNodeId === node.id;

    // 定义类名
    const nodeClasses = "flex items-center py-2 px-2 rounded-md cursor-pointer transition-colors duration-200";
    const selectedClasses = "bg-primary/10 text-primary font-medium border-l-2 border-primary";
    const hoverClasses = "hover:bg-accent/50";

    return (
      <div key={node.id} className="select-none">
        <div
          className={`${nodeClasses} ${isSelected ? selectedClasses : hoverClasses}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            onNodeSelect(node.id);
            if (hasChildren) {
              toggleNode(node.id);
            }
          }}
        >
          {hasChildren && (
            <button
              className="mr-1 p-0.5 rounded-sm hover:bg-muted-foreground/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
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
          
          {getNodeIcon(node)}
          <span className="text-sm">{node.label}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="transition-all duration-300">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-0.5">{nodes.map((node) => renderNode(node))}</div>;
}
