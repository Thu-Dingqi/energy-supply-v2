"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { NavigationItem, ContentSection } from "./energy-platform"
import { ScrollArea } from "@/components/ui/scroll-area"
import EditableDataTable from "./editable-data-table"
import SimpleChart from "./simple-chart"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface DataRow {
  indicator: string
  unit: string
  values: { [year: string]: string | number }
}

interface DataPanelProps {
  activeNav: NavigationItem
  activeSection: ContentSection
  selectedNode: string | null
  selectedScenario: string
  selectedProvince: string
}

export default function DataPanel({
  activeNav,
  activeSection,
  selectedNode,
  selectedScenario,
  selectedProvince,
}: DataPanelProps) {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie" | "stacked">("line")
  const [tableData, setTableData] = useState<DataRow[]>([])
  const [nodeTitle, setNodeTitle] = useState<string>("")
  const [currentNode, setCurrentNode] = useState<string | null>(null)
  const [selectedParameter, setSelectedParameter] = useState<string>("EFF")

  // Sample data for the editable table
  const years = ["2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"]

  // Power generation technology parameters
  const powerTechParameters = [
    { id: "EFF", label: "效率", unit: "%" },
    { id: "AF", label: "可用系数", unit: "%" },
    { id: "LIFETIME", label: "寿期", unit: "年" },
    { id: "NCAP_COST", label: "投资成本", unit: "元/kW" },
    { id: "NCAP_FOM", label: "固定运维成本", unit: "元/kW/年" },
    { id: "ACT_COST", label: "可变运维成本", unit: "元/kWh" },
  ]

  // 获取参数对应的单位
  const getUnitForParameter = (paramId: string): string => {
    const param = powerTechParameters.find((p) => p.id === paramId)
    return param ? param.unit : "%"
  }

  // 获取参数对应的中文名称
  const getLabelForParameter = (paramId: string): string => {
    const param = powerTechParameters.find((p) => p.id === paramId)
    return param ? param.label : "效率"
  }

  // Generate sample data for power generation technologies
  const generatePowerTechData = (
    techId: string,
    baseEfficiency: number,
    baseAF: number,
    baseLifetime: number,
    baseNCAPCost: number,
    baseNCAPFOM: number,
    baseACTCost: number,
  ) => {
    const efficiencyData = {
      title: `${techId} - 效率`,
      data: [
        {
          indicator: "效率",
          unit: "%",
          values: {
            "2025": Number.parseFloat(baseEfficiency.toFixed(1)),
            "2030": Number.parseFloat((baseEfficiency * 1.05).toFixed(1)),
            "2035": Number.parseFloat((baseEfficiency * 1.1).toFixed(1)),
            "2040": Number.parseFloat((baseEfficiency * 1.15).toFixed(1)),
            "2045": Number.parseFloat((baseEfficiency * 1.18).toFixed(1)),
            "2050": Number.parseFloat((baseEfficiency * 1.2).toFixed(1)),
            "2055": Number.parseFloat((baseEfficiency * 1.22).toFixed(1)),
            "2060": Number.parseFloat((baseEfficiency * 1.25).toFixed(1)),
          },
        },
      ],
    }

    const afData = {
      title: `${techId} - 可用系数`,
      data: [
        {
          indicator: "可用系数",
          unit: "%",
          values: {
            "2025": Number.parseFloat(baseAF.toFixed(1)),
            "2030": Number.parseFloat((baseAF * 1.02).toFixed(1)),
            "2035": Number.parseFloat((baseAF * 1.04).toFixed(1)),
            "2040": Number.parseFloat((baseAF * 1.06).toFixed(1)),
            "2045": Number.parseFloat((baseAF * 1.08).toFixed(1)),
            "2050": Number.parseFloat((baseAF * 1.1).toFixed(1)),
            "2055": Number.parseFloat((baseAF * 1.11).toFixed(1)),
            "2060": Number.parseFloat((baseAF * 1.12).toFixed(1)),
          },
        },
      ],
    }

    const lifetimeData = {
      title: `${techId} - 寿期`,
      data: [
        {
          indicator: "寿期",
          unit: "年",
          values: {
            "2025": Number.parseFloat(baseLifetime.toFixed(1)),
            "2030": Number.parseFloat(baseLifetime.toFixed(1)),
            "2035": Number.parseFloat(baseLifetime.toFixed(1)),
            "2040": Number.parseFloat(baseLifetime.toFixed(1)),
            "2045": Number.parseFloat(baseLifetime.toFixed(1)),
            "2050": Number.parseFloat(baseLifetime.toFixed(1)),
            "2055": Number.parseFloat(baseLifetime.toFixed(1)),
            "2060": Number.parseFloat(baseLifetime.toFixed(1)),
          },
        },
      ],
    }

    const ncapCostData = {
      title: `${techId} - 投资成本`,
      data: [
        {
          indicator: "投资成本",
          unit: "元/kW",
          values: {
            "2025": Number.parseFloat(baseNCAPCost.toFixed(1)),
            "2030": Number.parseFloat((baseNCAPCost * 0.95).toFixed(1)),
            "2035": Number.parseFloat((baseNCAPCost * 0.9).toFixed(1)),
            "2040": Number.parseFloat((baseNCAPCost * 0.85).toFixed(1)),
            "2045": Number.parseFloat((baseNCAPCost * 0.8).toFixed(1)),
            "2050": Number.parseFloat((baseNCAPCost * 0.75).toFixed(1)),
            "2055": Number.parseFloat((baseNCAPCost * 0.72).toFixed(1)),
            "2060": Number.parseFloat((baseNCAPCost * 0.7).toFixed(1)),
          },
        },
      ],
    }

    const ncapFOMData = {
      title: `${techId} - 固定运维成本`,
      data: [
        {
          indicator: "固定运维成本",
          unit: "元/kW/年",
          values: {
            "2025": Number.parseFloat(baseNCAPFOM.toFixed(1)),
            "2030": Number.parseFloat((baseNCAPFOM * 0.98).toFixed(1)),
            "2035": Number.parseFloat((baseNCAPFOM * 0.96).toFixed(1)),
            "2040": Number.parseFloat((baseNCAPFOM * 0.94).toFixed(1)),
            "2045": Number.parseFloat((baseNCAPFOM * 0.92).toFixed(1)),
            "2050": Number.parseFloat((baseNCAPFOM * 0.9).toFixed(1)),
            "2055": Number.parseFloat((baseNCAPFOM * 0.88).toFixed(1)),
            "2060": Number.parseFloat((baseNCAPFOM * 0.85).toFixed(1)),
          },
        },
      ],
    }

    const actCostData = {
      title: `${techId} - 可变运维成本`,
      data: [
        {
          indicator: "可变运维成本",
          unit: "元/kWh",
          values: {
            "2025": Number.parseFloat(baseACTCost.toFixed(3)),
            "2030": Number.parseFloat((baseACTCost * 0.98).toFixed(3)),
            "2035": Number.parseFloat((baseACTCost * 0.96).toFixed(3)),
            "2040": Number.parseFloat((baseACTCost * 0.94).toFixed(3)),
            "2045": Number.parseFloat((baseACTCost * 0.92).toFixed(3)),
            "2050": Number.parseFloat((baseACTCost * 0.9).toFixed(3)),
            "2055": Number.parseFloat((baseACTCost * 0.88).toFixed(3)),
            "2060": Number.parseFloat((baseACTCost * 0.85).toFixed(3)),
          },
        },
      ],
    }

    return {
      EFF: efficiencyData,
      AF: afData,
      LIFETIME: lifetimeData,
      NCAP_COST: ncapCostData,
      NCAP_FOM: ncapFOMData,
      ACT_COST: actCostData,
    }
  }

  // 在 generatePowerTechData 函数后添加新的函数
  const generateChemicalTechData = (
    techId: string,
    baseEfficiency: number,      // 转化效率 (%)
    baseAF: number,              // 可用系数 (%)
    baseLifetime: number,        // 寿期 (年)
    baseNCAPCost: number,        // 投资成本 (元/kW)
    baseNCAPFOM: number,         // 固定运维成本 (元/kW/年)
    baseACTCost: number,         // 可变运维成本 (元/kWh)
  ) => {
    const efficiencyData = {
      title: `${techId} - 效率`,
      data: [
        {
          indicator: "效率",
          unit: "%",
          values: {
            "2025": Number.parseFloat(baseEfficiency.toFixed(1)),
            "2030": Number.parseFloat((baseEfficiency * 1.05).toFixed(1)),
            "2035": Number.parseFloat((baseEfficiency * 1.1).toFixed(1)),
            "2040": Number.parseFloat((baseEfficiency * 1.15).toFixed(1)),
            "2045": Number.parseFloat((baseEfficiency * 1.18).toFixed(1)),
            "2050": Number.parseFloat((baseEfficiency * 1.2).toFixed(1)),
            "2055": Number.parseFloat((baseEfficiency * 1.22).toFixed(1)),
            "2060": Number.parseFloat((baseEfficiency * 1.25).toFixed(1)),
          },
        },
      ],
    }

    const afData = {
      title: `${techId} - 可用系数`,
      data: [
        {
          indicator: "可用系数",
          unit: "%",
          values: {
            "2025": Number.parseFloat(baseAF.toFixed(1)),
            "2030": Number.parseFloat((baseAF * 1.02).toFixed(1)),
            "2035": Number.parseFloat((baseAF * 1.04).toFixed(1)),
            "2040": Number.parseFloat((baseAF * 1.06).toFixed(1)),
            "2045": Number.parseFloat((baseAF * 1.08).toFixed(1)),
            "2050": Number.parseFloat((baseAF * 1.1).toFixed(1)),
            "2055": Number.parseFloat((baseAF * 1.11).toFixed(1)),
            "2060": Number.parseFloat((baseAF * 1.12).toFixed(1)),
          },
        },
      ],
    }

    const lifetimeData = {
      title: `${techId} - 寿期`,
      data: [
        {
          indicator: "寿期",
          unit: "年",
          values: {
            "2025": Number.parseFloat(baseLifetime.toFixed(1)),
            "2030": Number.parseFloat(baseLifetime.toFixed(1)),
            "2035": Number.parseFloat(baseLifetime.toFixed(1)),
            "2040": Number.parseFloat(baseLifetime.toFixed(1)),
            "2045": Number.parseFloat(baseLifetime.toFixed(1)),
            "2050": Number.parseFloat(baseLifetime.toFixed(1)),
            "2055": Number.parseFloat(baseLifetime.toFixed(1)),
            "2060": Number.parseFloat(baseLifetime.toFixed(1)),
          },
        },
      ],
    }

    const ncapCostData = {
      title: `${techId} - 投资成本`,
      data: [
        {
          indicator: "投资成本",
          unit: "元/kW",
          values: {
            "2025": Number.parseFloat(baseNCAPCost.toFixed(1)),
            "2030": Number.parseFloat((baseNCAPCost * 0.95).toFixed(1)),
            "2035": Number.parseFloat((baseNCAPCost * 0.9).toFixed(1)),
            "2040": Number.parseFloat((baseNCAPCost * 0.85).toFixed(1)),
            "2045": Number.parseFloat((baseNCAPCost * 0.8).toFixed(1)),
            "2050": Number.parseFloat((baseNCAPCost * 0.75).toFixed(1)),
            "2055": Number.parseFloat((baseNCAPCost * 0.72).toFixed(1)),
            "2060": Number.parseFloat((baseNCAPCost * 0.7).toFixed(1)),
          },
        },
      ],
    }

    const ncapFOMData = {
      title: `${techId} - 固定运维成本`,
      data: [
        {
          indicator: "固定运维成本",
          unit: "元/kW/年",
          values: {
            "2025": Number.parseFloat(baseNCAPFOM.toFixed(1)),
            "2030": Number.parseFloat((baseNCAPFOM * 0.98).toFixed(1)),
            "2035": Number.parseFloat((baseNCAPFOM * 0.96).toFixed(1)),
            "2040": Number.parseFloat((baseNCAPFOM * 0.94).toFixed(1)),
            "2045": Number.parseFloat((baseNCAPFOM * 0.92).toFixed(1)),
            "2050": Number.parseFloat((baseNCAPFOM * 0.9).toFixed(1)),
            "2055": Number.parseFloat((baseNCAPFOM * 0.88).toFixed(1)),
            "2060": Number.parseFloat((baseNCAPFOM * 0.85).toFixed(1)),
          },
        },
      ],
    }

    const actCostData = {
      title: `${techId} - 可变运维成本`,
      data: [
        {
          indicator: "可变运维成本",
          unit: "元/kWh",
          values: {
            "2025": Number.parseFloat(baseACTCost.toFixed(3)),
            "2030": Number.parseFloat((baseACTCost * 0.98).toFixed(3)),
            "2035": Number.parseFloat((baseACTCost * 0.96).toFixed(3)),
            "2040": Number.parseFloat((baseACTCost * 0.94).toFixed(3)),
            "2045": Number.parseFloat((baseACTCost * 0.92).toFixed(3)),
            "2050": Number.parseFloat((baseACTCost * 0.9).toFixed(3)),
            "2055": Number.parseFloat((baseACTCost * 0.88).toFixed(3)),
            "2060": Number.parseFloat((baseACTCost * 0.85).toFixed(3)),
          },
        },
      ],
    }

    return {
      EFF: efficiencyData,
      AF: afData,
      LIFETIME: lifetimeData,
      NCAP_COST: ncapCostData,
      NCAP_FOM: ncapFOMData,
      ACT_COST: actCostData,
    }
  }

  // Define data sets for different nodes
  const dataSets: Record<
    string,
    {
      title: string
      data: DataRow[]
      defaultChartType?: "line" | "bar" | "pie" | "stacked"
      isEnergyTech?: boolean
      techData?: any
    }
  > = {
    population: {
      title: "人口",
      data: [
        {
          indicator: "人口",
          unit: "百万",
          values: {
            "2025": 22,
            "2030": 23,
            "2035": 24,
            "2040": 24.5,
            "2045": 25,
            "2050": 25.5,
            "2055": 26,
            "2060": 26.5,
          },
        },
      ],
    },
    gdp: {
      title: "GDP",
      data: [
        {
          indicator: "GDP",
          unit: "十亿元",
          values: {
            "2025": 4500,
            "2030": 5800,
            "2035": 7200,
            "2040": 8600,
            "2045": 10000,
            "2050": 11500,
            "2055": 13000,
            "2060": 14500,
          },
        },
      ],
    },
    "industry-structure": {
      title: "三产结构",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "第一产业",
          unit: "%",
          values: {
            "2025": 2.5,
            "2030": 2.3,
            "2035": 2.1,
            "2040": 1.9,
            "2045": 1.7,
            "2050": 1.5,
            "2055": 1.3,
            "2060": 1.1,
          },
        },
        {
          indicator: "第二产业",
          unit: "%",
          values: {
            "2025": 25,
            "2030": 23,
            "2035": 21,
            "2040": 19,
            "2045": 17,
            "2050": 15,
            "2055": 14,
            "2060": 13,
          },
        },
        {
          indicator: "第三产业",
          unit: "%",
          values: {
            "2025": 72.5,
            "2030": 74.7,
            "2035": 76.9,
            "2040": 79.1,
            "2045": 81.3,
            "2050": 83.5,
            "2055": 84.7,
            "2060": 85.9,
          },
        },
      ],
    },
    agriculture: {
      title: "农业",
      data: [
        {
          indicator: "能源强度",
          unit: "吨标煤/万元",
          values: {
            "2025": 0.35,
            "2030": 0.32,
            "2035": 0.29,
            "2040": 0.26,
            "2045": 0.23,
            "2050": 0.2,
            "2055": 0.18,
            "2060": 0.16,
          },
        },
        {
          indicator: "电气化率",
          unit: "%",
          values: {
            "2025": 30,
            "2030": 35,
            "2035": 40,
            "2040": 45,
            "2045": 50,
            "2050": 55,
            "2055": 60,
            "2060": 65,
          },
        },
        {
          indicator: "氢气化率",
          unit: "%",
          values: {
            "2025": 0,
            "2030": 1,
            "2035": 2,
            "2040": 3,
            "2045": 4,
            "2050": 5,
            "2055": 6,
            "2060": 7,
          },
        },
      ],
    },
    industry: {
      title: "工业",
      data: [
        {
          indicator: "能源强度",
          unit: "吨标煤/万元",
          values: {
            "2025": 0.65,
            "2030": 0.58,
            "2035": 0.52,
            "2040": 0.46,
            "2045": 0.41,
            "2050": 0.36,
            "2055": 0.32,
            "2060": 0.28,
          },
        },
        {
          indicator: "电气化率",
          unit: "%",
          values: {
            "2025": 25,
            "2030": 30,
            "2035": 35,
            "2040": 40,
            "2045": 45,
            "2050": 50,
            "2055": 55,
            "2060": 60,
          },
        },
        {
          indicator: "氢气化率",
          unit: "%",
          values: {
            "2025": 0,
            "2030": 2,
            "2035": 4,
            "2040": 6,
            "2045": 8,
            "2050": 10,
            "2055": 12,
            "2060": 15,
          },
        },
      ],
    },
    construction: {
      title: "建筑业",
      data: [
        {
          indicator: "能源强度",
          unit: "吨标煤/万元",
          values: {
            "2025": 0.45,
            "2030": 0.41,
            "2035": 0.37,
            "2040": 0.33,
            "2045": 0.3,
            "2050": 0.27,
            "2055": 0.24,
            "2060": 0.22,
          },
        },
        {
          indicator: "电气化率",
          unit: "%",
          values: {
            "2025": 20,
            "2030": 25,
            "2035": 30,
            "2040": 35,
            "2045": 40,
            "2050": 45,
            "2055": 50,
            "2060": 55,
          },
        },
        {
          indicator: "氢气化率",
          unit: "%",
          values: {
            "2025": 0,
            "2030": 1,
            "2035": 2,
            "2040": 3,
            "2045": 4,
            "2050": 5,
            "2055": 6,
            "2060": 7,
          },
        },
      ],
    },
    transportation: {
      title: "交通运输",
      data: [
        {
          indicator: "能源强度",
          unit: "吨标煤/万元",
          values: {
            "2025": 0.55,
            "2030": 0.49,
            "2035": 0.44,
            "2040": 0.39,
            "2045": 0.35,
            "2050": 0.31,
            "2055": 0.28,
            "2060": 0.25,
          },
        },
        {
          indicator: "电气化率",
          unit: "%",
          values: {
            "2025": 15,
            "2030": 25,
            "2035": 35,
            "2040": 45,
            "2045": 55,
            "2050": 65,
            "2055": 75,
            "2060": 85,
          },
        },
        {
          indicator: "氢气化率",
          unit: "%",
          values: {
            "2025": 0,
            "2030": 2,
            "2035": 4,
            "2040": 6,
            "2045": 8,
            "2050": 10,
            "2055": 12,
            "2060": 15,
          },
        },
      ],
    },
    service: {
      title: "服务业",
      data: [
        {
          indicator: "能源强度",
          unit: "吨标煤/万元",
          values: {
            "2025": 0.25,
            "2030": 0.22,
            "2035": 0.2,
            "2040": 0.18,
            "2045": 0.16,
            "2050": 0.14,
            "2055": 0.13,
            "2060": 0.12,
          },
        },
        {
          indicator: "电气化率",
          unit: "%",
          values: {
            "2025": 40,
            "2030": 45,
            "2035": 50,
            "2040": 55,
            "2045": 60,
            "2050": 65,
            "2055": 70,
            "2060": 75,
          },
        },
        {
          indicator: "氢气化率",
          unit: "%",
          values: {
            "2025": 0,
            "2030": 1,
            "2035": 2,
            "2040": 3,
            "2045": 4,
            "2050": 5,
            "2055": 6,
            "2060": 7,
          },
        },
      ],
    },
    residential: {
      title: "居民生活",
      data: [
        {
          indicator: "能源强度",
          unit: "吨标煤/户",
          values: {
            "2025": 1.2,
            "2030": 1.1,
            "2035": 1.0,
            "2040": 0.9,
            "2045": 0.8,
            "2050": 0.7,
            "2055": 0.65,
            "2060": 0.6,
          },
        },
        {
          indicator: "电气化率",
          unit: "%",
          values: {
            "2025": 35,
            "2030": 40,
            "2035": 45,
            "2040": 50,
            "2045": 55,
            "2050": 60,
            "2055": 65,
            "2060": 70,
          },
        },
        {
          indicator: "氢气化率",
          unit: "%",
          values: {
            "2025": 0,
            "2030": 0.5,
            "2035": 1,
            "2040": 1.5,
            "2045": 2,
            "2050": 2.5,
            "2055": 3,
            "2060": 3.5,
          },
        },
      ],
    },
    // Energy demand data for each sector with fuel breakdown
    "agriculture-energy": {
      title: "农业终端用能需求",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤炭",
          unit: "万吨标煤",
          values: {
            "2025": 30,
            "2030": 25,
            "2035": 20,
            "2040": 15,
            "2045": 10,
            "2050": 5,
            "2055": 3,
            "2060": 1,
          },
        },
        {
          indicator: "石油",
          unit: "万吨标煤",
          values: {
            "2025": 40,
            "2030": 35,
            "2035": 30,
            "2040": 25,
            "2045": 20,
            "2050": 15,
            "2055": 10,
            "2060": 5,
          },
        },
        {
          indicator: "天然气",
          unit: "万吨标煤",
          values: {
            "2025": 10,
            "2030": 15,
            "2035": 20,
            "2040": 25,
            "2045": 20,
            "2050": 15,
            "2055": 10,
            "2060": 5,
          },
        },
        {
          indicator: "电力",
          unit: "万吨标煤",
          values: {
            "2025": 40,
            "2030": 48,
            "2035": 56,
            "2040": 64,
            "2045": 80,
            "2050": 95,
            "2055": 110,
            "2060": 125,
          },
        },
        {
          indicator: "氢能",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 2,
            "2035": 4,
            "2040": 6,
            "2045": 10,
            "2050": 15,
            "2055": 17,
            "2060": 19,
          },
        },
      ],
    },
    "industry-energy": {
      title: "工业终端用能需求",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤炭",
          unit: "万吨标煤",
          values: {
            "2025": 1200,
            "2030": 1000,
            "2035": 800,
            "2040": 600,
            "2045": 400,
            "2050": 300,
            "2055": 200,
            "2060": 100,
          },
        },
        {
          indicator: "石油",
          unit: "万吨标煤",
          values: {
            "2025": 500,
            "2030": 450,
            "2035": 400,
            "2040": 350,
            "2045": 300,
            "2050": 250,
            "2055": 200,
            "2060": 150,
          },
        },
        {
          indicator: "天然气",
          unit: "万吨标煤",
          values: {
            "2025": 300,
            "2030": 350,
            "2035": 400,
            "2040": 450,
            "2045": 400,
            "2050": 350,
            "2055": 300,
            "2060": 250,
          },
        },
        {
          indicator: "电力",
          unit: "万吨标煤",
          values: {
            "2025": 500,
            "2030": 550,
            "2035": 600,
            "2040": 650,
            "2045": 800,
            "2050": 900,
            "2055": 1000,
            "2060": 1100,
          },
        },
        {
          indicator: "氢能",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 50,
            "2035": 100,
            "2040": 150,
            "2045": 200,
            "2050": 200,
            "2055": 200,
            "2060": 200,
          },
        },
      ],
    },
    "construction-energy": {
      title: "建筑业终端用能需求",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤炭",
          unit: "万吨标煤",
          values: {
            "2025": 100,
            "2030": 90,
            "2035": 80,
            "2040": 70,
            "2045": 60,
            "2050": 50,
            "2055": 40,
            "2060": 30,
          },
        },
        {
          indicator: "石油",
          unit: "万吨标煤",
          values: {
            "2025": 120,
            "2030": 110,
            "2035": 100,
            "2040": 90,
            "2045": 80,
            "2050": 70,
            "2055": 60,
            "2060": 50,
          },
        },
        {
          indicator: "天然气",
          unit: "万吨标煤",
          values: {
            "2025": 50,
            "2030": 60,
            "2035": 70,
            "2040": 80,
            "2045": 70,
            "2050": 60,
            "2055": 50,
            "2060": 40,
          },
        },
        {
          indicator: "电力",
          unit: "万吨标煤",
          values: {
            "2025": 80,
            "2030": 95,
            "2035": 110,
            "2040": 125,
            "2045": 160,
            "2050": 195,
            "2055": 230,
            "2060": 265,
          },
        },
        {
          indicator: "氢能",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 5,
            "2035": 10,
            "2040": 15,
            "2045": 20,
            "2050": 25,
            "2055": 30,
            "2060": 35,
          },
        },
      ],
    },
    "transportation-energy": {
      title: "交通运输终端用能需求",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤炭",
          unit: "万吨标煤",
          values: {
            "2025": 50,
            "2030": 40,
            "2035": 30,
            "2040": 20,
            "2045": 10,
            "2050": 5,
            "2055": 0,
            "2060": 0,
          },
        },
        {
          indicator: "石油",
          unit: "万吨标煤",
          values: {
            "2025": 900,
            "2030": 800,
            "2035": 700,
            "2040": 600,
            "2045": 500,
            "2050": 400,
            "2055": 300,
            "2060": 200,
          },
        },
        {
          indicator: "天然气",
          unit: "万吨标煤",
          values: {
            "2025": 50,
            "2030": 100,
            "2035": 150,
            "2040": 200,
            "2045": 150,
            "2050": 100,
            "2055": 50,
            "2060": 0,
          },
        },
        {
          indicator: "电力",
          unit: "万吨标煤",
          values: {
            "2025": 200,
            "2030": 300,
            "2035": 400,
            "2040": 500,
            "2045": 700,
            "2050": 900,
            "2055": 1100,
            "2060": 1300,
          },
        },
        {
          indicator: "氢能",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 60,
            "2035": 120,
            "2040": 180,
            "2045": 240,
            "2050": 295,
            "2055": 350,
            "2060": 400,
          },
        },
      ],
    },
    "service-energy": {
      title: "服务业终端用能需求",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤炭",
          unit: "万吨标煤",
          values: {
            "2025": 150,
            "2030": 120,
            "2035": 90,
            "2040": 60,
            "2045": 30,
            "2050": 15,
            "2055": 5,
            "2060": 0,
          },
        },
        {
          indicator: "石油",
          unit: "万吨标煤",
          values: {
            "2025": 200,
            "2030": 180,
            "2035": 160,
            "2040": 140,
            "2045": 120,
            "2050": 100,
            "2055": 80,
            "2060": 60,
          },
        },
        {
          indicator: "天然气",
          unit: "万吨标煤",
          values: {
            "2025": 150,
            "2030": 170,
            "2035": 190,
            "2040": 210,
            "2045": 190,
            "2050": 170,
            "2055": 150,
            "2060": 130,
          },
        },
        {
          indicator: "电力",
          unit: "万吨标煤",
          values: {
            "2025": 300,
            "2030": 350,
            "2035": 400,
            "2040": 450,
            "2045": 550,
            "2050": 650,
            "2055": 750,
            "2060": 850,
          },
        },
        {
          indicator: "氢能",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 30,
            "2035": 60,
            "2040": 90,
            "2045": 110,
            "2050": 115,
            "2055": 115,
            "2060": 110,
          },
        },
      ],
    },
    "residential-energy": {
      title: "居民生活终端用能需求",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤炭",
          unit: "万吨标煤",
          values: {
            "2025": 200,
            "2030": 150,
            "2035": 100,
            "2040": 50,
            "2045": 25,
            "2050": 10,
            "2055": 5,
            "2060": 0,
          },
        },
        {
          indicator: "石油",
          unit: "万吨标煤",
          values: {
            "2025": 150,
            "2030": 130,
            "2035": 110,
            "2040": 90,
            "2045": 70,
            "2050": 50,
            "2055": 30,
            "2060": 10,
          },
        },
        {
          indicator: "天然气",
          unit: "万吨标煤",
          values: {
            "2025": 250,
            "2030": 270,
            "2035": 290,
            "2040": 310,
            "2045": 290,
            "2050": 270,
            "2055": 250,
            "2060": 230,
          },
        },
        {
          indicator: "电力",
          unit: "万吨标煤",
          values: {
            "2025": 300,
            "2030": 350,
            "2035": 400,
            "2040": 450,
            "2045": 550,
            "2050": 650,
            "2055": 750,
            "2060": 850,
          },
        },
        {
          indicator: "氢能",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 50,
            "2035": 100,
            "2040": 150,
            "2045": 165,
            "2050": 170,
            "2055": 165,
            "2060": 160,
          },
        },
      ],
    },
    // Resource import/export data
    coal: {
      title: "煤炭",
      defaultChartType: "bar",
      data: [
        {
          indicator: selectedProvince === "national" ? "进口量" : "调入量",
          unit: "万吨",
          values: {
            "2025": 3000,
            "2030": 2800,
            "2035": 2600,
            "2040": 2400,
            "2045": 2200,
            "2050": 2000,
            "2055": 1800,
            "2060": 1600,
          },
        },
        {
          indicator: selectedProvince === "national" ? "出口量" : "调出量",
          unit: "万吨",
          values: {
            "2025": 500,
            "2030": 450,
            "2035": 400,
            "2040": 350,
            "2045": 300,
            "2050": 250,
            "2055": 200,
            "2060": 150,
          },
        },
      ],
    },
    oil: {
      title: "石油",
      defaultChartType: "bar",
      data: [
        {
          indicator: selectedProvince === "national" ? "进口量" : "调入量",
          unit: "万吨",
          values: {
            "2025": 5000,
            "2030": 4800,
            "2035": 4600,
            "2040": 4400,
            "2045": 4200,
            "2050": 4000,
            "2055": 3800,
            "2060": 3600,
          },
        },
        {
          indicator: selectedProvince === "national" ? "出口量" : "调出量",
          unit: "万吨",
          values: {
            "2025": 200,
            "2030": 180,
            "2035": 160,
            "2040": 140,
            "2045": 120,
            "2050": 100,
            "2055": 80,
            "2060": 60,
          },
        },
      ],
    },
    "natural-gas": {
      title: "天然气",
      defaultChartType: "bar",
      data: [
        {
          indicator: selectedProvince === "national" ? "进口量" : "调入量",
          unit: "亿立方米",
          values: {
            "2025": 1500,
            "2030": 1600,
            "2035": 1700,
            "2040": 1800,
            "2045": 1700,
            "2050": 1600,
            "2055": 1500,
            "2060": 1400,
          },
        },
        {
          indicator: selectedProvince === "national" ? "出口量" : "调出量",
          unit: "亿立方米",
          values: {
            "2025": 50,
            "2030": 60,
            "2035": 70,
            "2040": 80,
            "2045": 90,
            "2050": 100,
            "2055": 110,
            "2060": 120,
          },
        },
      ],
    },
    "nuclear-fuel": {
      title: "核燃料",
      defaultChartType: "bar",
      data: [
        {
          indicator: "进口量",
          unit: "吨",
          values: {
            "2025": 500,
            "2030": 600,
            "2035": 700,
            "2040": 800,
            "2045": 900,
            "2050": 1000,
            "2055": 1100,
            "2060": 1200,
          },
        },
        {
          indicator: "出口量",
          unit: "吨",
          values: {
            "2025": 0,
            "2030": 0,
            "2035": 0,
            "2040": 0,
            "2045": 0,
            "2050": 0,
            "2055": 0,
            "2060": 0,
          },
        },
      ],
    },
    
    electricity: {
      title: "电力",
      defaultChartType: "bar",
      data: [
        {
          indicator: "进口量",
          unit: "亿千瓦时",
          values: {
            "2025": 200,
            "2030": 180,
            "2035": 160,
            "2040": 140,
            "2045": 120,
            "2050": 100,
            "2055": 80,
            "2060": 60,
          },
        },
        {
          indicator: "出口量",
          unit: "亿千瓦时",
          values: {
            "2025": 300,
            "2030": 350,
            "2035": 400,
            "2040": 450,
            "2045": 500,
            "2050": 550,
            "2055": 600,
            "2060": 650,
          },
        },
      ],
    },
    heat: {
      title: "热力",
      defaultChartType: "bar",
      data: [
        {
          indicator: "进口量",
          unit: "万吉焦",
          values: {
            "2025": 100,
            "2030": 90,
            "2035": 80,
            "2040": 70,
            "2045": 60,
            "2050": 50,
            "2055": 40,
            "2060": 30,
          },
        },
        {
          indicator: "出口量",
          unit: "万吉焦",
          values: {
            "2025": 50,
            "2030": 60,
            "2035": 70,
            "2040": 80,
            "2045": 90,
            "2050": 100,
            "2055": 110,
            "2060": 120,
          },
        },
      ],
    },
    hydrogen: {
      title: "氢能",
      defaultChartType: "bar",
      data: [
        {
          indicator: "进口量",
          unit: "万吨",
          values: {
            "2025": 5,
            "2030": 10,
            "2035": 15,
            "2040": 20,
            "2045": 25,
            "2050": 30,
            "2055": 35,
            "2060": 40,
          },
        },
        {
          indicator: "出口量",
          unit: "万吨",
          values: {
            "2025": 0,
            "2030": 5,
            "2035": 10,
            "2040": 15,
            "2045": 20,
            "2050": 25,
            "2055": 30,
            "2060": 35,
          },
        },
      ],
    },
    "refined-oil": {
      title: "成品油",
      defaultChartType: "bar",
      data: [
        {
          indicator: "进口量",
          unit: "万吨",
          values: {
            "2025": 800,
            "2030": 750,
            "2035": 700,
            "2040": 650,
            "2045": 600,
            "2050": 550,
            "2055": 500,
            "2060": 450,
          },
        },
        {
          indicator: "出口量",
          unit: "万吨",
          values: {
            "2025": 400,
            "2030": 450,
            "2035": 500,
            "2040": 550,
            "2045": 500,
            "2050": 450,
            "2055": 400,
            "2060": 350,
          },
        },
      ],
    },

    // Power generation technologies
    ECHPCOA: {
      title: "ECHPCOA (煤基联合供热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("ECHPCOA", 42, 85, 30, 8000, 240, 0.05),
    },
    EPLTCOAUSC: {
      title: "EPLTCOAUSC (超超临界煤电 - 空气冷却)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTCOAUSC", 45, 88, 35, 7500, 225, 0.045),
    },
    HPLTCOA: {
      title: "HPLTCOA (煤基高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTCOA", 48, 90, 40, 9000, 270, 0.055),
    },
    ECHPCOACCS: {
      title: "ECHPCOACCS (带CCS的煤基联合供热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("ECHPCOACCS", 38, 82, 30, 12000, 360, 0.07),
    },
    EPLTCUSCCCS: {
      title: "EPLTCUSCCCS (带CCS的超超临界煤电)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTCUSCCCS", 40, 85, 35, 11500, 345, 0.065),
    },
    HPLTCOACCS: {
      title: "HPLTCOACCS (带CCS的煤基高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTCOACCS", 43, 87, 40, 13000, 390, 0.075),
    },
    ECHPNGA: {
      title: "ECHPNGA (天然气联合供热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("ECHPNGA", 50, 87, 25, 6000, 180, 0.04),
    },
    EPLTNGANGCC: {
      title: "EPLTNGANGCC (天然气联合循环发电 - 空气冷却)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTNGANGCC", 55, 90, 30, 5500, 165, 0.035),
    },
    HPLTGAS: {
      title: "HPLTGAS (燃气高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTGAS", 58, 92, 35, 7000, 210, 0.045),
    },
    ECHPNGACCS: {
      title: "ECHPNGACCS (带CCS的天然气联合供热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("ECHPNGACCS", 45, 85, 25, 9000, 270, 0.06),
    },
    EPLTNGACCS: {
      title: "EPLTNGACCS (带CCS的天然气联合循环发电 - 空气冷却)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTNGACCS", 50, 88, 30, 8500, 255, 0.055),
    },
    HPLTGASCCS: {
      title: "HPLTGASCCS (带CCS的燃气高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTGASCCS", 53, 90, 35, 10000, 300, 0.065),
    },
    EPLTNUC: {
      title: "EPLTNUC (核电 - 一次性冷却)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTNUC", 33, 90, 60, 15000, 450, 0.03),
    },
    EPLTHYDL: {
      title: "EPLTHYDL (大型水电)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTHYDL", 90, 45, 80, 12000, 120, 0.01),
    },
    EPLTWINONS: {
      title: "EPLTWINONS (陆上风电)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTWINONS", 100, 25, 25, 7000, 210, 0.02),
    },
    EPLTWINOFS: {
      title: "EPLTWINOFS (海上风电)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTWINOFS", 100, 35, 25, 12000, 360, 0.03),
    },
    EPLTSOLPV: {
      title: "EPLTSOLPV (太阳能光伏)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTSOLPV", 100, 18, 25, 5000, 150, 0.01),
    },
    ECHPBSL: {
      title: "ECHPBSL (固体生物质燃烧联合供热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("ECHPBSL", 35, 80, 25, 9000, 270, 0.06),
    },
    HPLTBSL: {
      title: "HPLTBSL (固体生物质高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTBSL", 40, 82, 30, 10000, 300, 0.065),
    },
    EPLTBIOSLDC: {
      title: "EPLTBIOSLDC (固体生物质混烧发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTBIOSLDC", 38, 85, 30, 8500, 255, 0.055),
    },
    ECHPBIOBSLDCCS: {
      title: "ECHPBIOBSLDCCS (带CCS的固体生物质燃烧联合供热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("ECHPBIOBSLDCCS", 32, 78, 25, 12000, 360, 0.08),
    },
    EPLTBSLDCCS: {
      title: "EPLTBSLDCCS (固体生物质直接燃烧带CCS发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTBSLDCCS", 35, 80, 30, 11500, 345, 0.075),
    },
    EPLTCBECCS: {
      title: "EPLTCBECCS20-100 (固体生物质与煤混烧BECCS，比例20%-100%)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTCBECCS", 37, 82, 30, 12000, 360, 0.07),
    },
    HPLTBSLCCS: {
      title: "HPLTBSLCCS (带CCS的固体生物质高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTBSLCCS", 38, 83, 30, 12500, 375, 0.075),
    },
    ECHPOIL: {
      title: "ECHPOIL (油基联合供热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("ECHPOIL", 40, 85, 25, 7000, 210, 0.05),
    },
    EPLTOILST: {
      title: "EPLTOILST (油蒸汽轮机发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("EPLTOILST", 42, 87, 30, 6500, 195, 0.045),
    },
    HPLTOIL: {
      title: "HPLTOIL (油基高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTOIL", 45, 88, 35, 8000, 240, 0.055),
    },
    HPLTOILCCS: {
      title: "HPLTOILCCS (带CCS的油基高温发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTOILCCS", 40, 85, 35, 11000, 330, 0.07),
    },
    HPLTGEO: {
      title: "HPLTGEO (地热发电)",
      isEnergyTech: true,
      techData: generatePowerTechData("HPLTGEO", 100, 80, 30, 14000, 420, 0.02),
    },

    // Hydrogen production technologies
    ALK: {
      title: "ALK (碱性电解水制氢)",
      isEnergyTech: true,
      techData: generatePowerTechData("ALK", 65, 85, 20, 5000, 150, 0.03),
    },
    SOEC: {
      title: "SOEC (固体氧化物电解水制氢)",
      isEnergyTech: true,
      techData: generatePowerTechData("SOEC", 75, 80, 15, 8000, 240, 0.04),
    },
    AEM: {
      title: "AEM (阴离子交换膜制氢)",
      isEnergyTech: true,
      techData: generatePowerTechData("AEM", 70, 82, 18, 6000, 180, 0.035),
    },
    PEM: {
      title: "PEM (质子交换膜电解水制氢)",
      isEnergyTech: true,
      techData: generatePowerTechData("PEM", 68, 88, 20, 7000, 210, 0.038),
    },

    // Oil refining technologies
    ATM: {
      title: "ATM (常压蒸馏)",
      isEnergyTech: true,
      techData: generatePowerTechData("ATM", 90, 92, 30, 10000, 300, 0.02),
    },
    FCC: {
      title: "FCC (流化催化裂化)",
      isEnergyTech: true,
      techData: generatePowerTechData("FCC", 85, 90, 25, 12000, 360, 0.025),
    },
    HYD: {
      title: "HYD (加氢裂化)",
      isEnergyTech: true,
      techData: generatePowerTechData("HYD", 88, 88, 28, 15000, 450, 0.03),
    },

    // Coking technologies
    CONV: {
      title: "CONV (常规焦炉炼焦)",
      isEnergyTech: true,
      techData: generatePowerTechData("CONV", 80, 85, 30, 9000, 270, 0.04),
    },
    HR: {
      title: "HR (热回收焦炉炼焦)",
      isEnergyTech: true,
      techData: generatePowerTechData("HR", 85, 88, 25, 11000, 330, 0.035),
    },

    // 添加能源化工技术的数据
    CTL: {
      title: "煤制油",
      isEnergyTech: true,
      techData: generateChemicalTechData(
        "CTL",
        45,    // 转化效率
        85,    // 可用系数
        30,    // 寿期
        12000, // 投资成本
        360,   // 固定运维成本
        0.05   // 可变运维成本
      ),
    },
    CTH: {
      title: "煤制气",
      isEnergyTech: true,
      techData: generateChemicalTechData(
        "CTH",
        50,    // 转化效率
        88,    // 可用系数
        30,    // 寿期
        10000, // 投资成本
        300,   // 固定运维成本
        0.04   // 可变运维成本
      ),
    },
    "oil-refining": {
      title: "炼油",
      isEnergyTech: true,
      techData: generateChemicalTechData(
        "oil-refining",
        92,    // 转化效率
        90,    // 可用系数
        35,    // 寿期
        8000,  // 投资成本
        240,   // 固定运维成本
        0.03   // 可变运维成本
      ),
    },
    coking: {
      title: "炼焦",
      isEnergyTech: true,
      techData: generateChemicalTechData(
        "coking",
        88,    // 转化效率
        85,    // 可用系数
        30,    // 寿期
        7000,  // 投资成本
        210,   // 固定运维成本
        0.03   // 可变运维成本
      ),
    },
    "wind-resource": {
      title: "风能资源",
      data: [
        {
          indicator: "资源开发潜力上限",
          unit: "GW",
          values: {
            "2025": 300,
            "2030": 450,
            "2035": 600,
            "2040": 750,
            "2045": 900,
            "2050": 1050,
            "2055": 1200,
            "2060": 1350,
          },
        }
      ]
    },
    "solar-resource": {
      title: "太阳能",
      data: [
        {
          indicator: "资源开发潜力上限",
          unit: "GW",
          values: {
            "2025": 500,
            "2030": 800,
            "2035": 1100,
            "2040": 1400,
            "2045": 1700,
            "2050": 2000,
            "2055": 2300,
            "2060": 2600,
          },
        },
      ],
    },
    "hydro-resource": {
      title: "水能",
      data: [
        {
          indicator: "资源开发潜力上限",
          unit: "GW",
          values: {
            "2025": 380,
            "2030": 400,
            "2035": 420,
            "2040": 430,
            "2045": 440,
            "2050": 450,
            "2055": 455,
            "2060": 460,
          },
        },
      ],
    },
    "biomass-resource": {
      title: "生物质能",
      data: [
        {
          indicator: "资源开发潜力上限",
          unit: "GW",
          values: {
            "2025": 50,
            "2030": 75,
            "2035": 100,
            "2040": 125,
            "2045": 150,
            "2050": 175,
            "2055": 185,
            "2060": 195,
          },
        },
      ],
    },
  }

  // Update data when selected node changes
  useEffect(() => {
    if (selectedNode && selectedNode !== currentNode) {
      if (dataSets[selectedNode]) {
        if (dataSets[selectedNode].isEnergyTech) {
          // For power generation technologies, set the data based on the selected parameter
          setTableData(dataSets[selectedNode].techData[selectedParameter].data)
          setNodeTitle(dataSets[selectedNode].title)
          setSelectedParameter("EFF") // Reset to default parameter
        } else {
          // For regular data
          setTableData(dataSets[selectedNode].data)
          setNodeTitle(dataSets[selectedNode].title)
        }

        // Set default chart type if specified
        if (dataSets[selectedNode].defaultChartType) {
          setChartType(dataSets[selectedNode].defaultChartType)
        } else {
          setChartType("line")
        }

        setCurrentNode(selectedNode)
      } else {
        setTableData([])
        setNodeTitle("")
        setCurrentNode(null)
      }
    }
  }, [selectedNode, currentNode])

  // Update data when parameter changes for power generation technologies
  useEffect(() => {
    if (currentNode && dataSets[currentNode]?.isEnergyTech) {
      // 修复这里：确保当参数变化时，表格数据也会更新
      const paramData = dataSets[currentNode].techData[selectedParameter].data

      // 创建新的数据对象，确保指标名称与所选参数匹配
      const updatedData = paramData.map((row) => ({
        ...row,
        indicator: getLabelForParameter(selectedParameter),
        unit: getUnitForParameter(selectedParameter),
      }))

      setTableData(updatedData)
    }
  }, [selectedParameter, currentNode])

  const handleDataChange = (newData: DataRow[]) => {
    setTableData(newData)
  }

  const handleParameterChange = (param: string) => {
    setSelectedParameter(param)
  }

  if (activeNav === "note") {
    return (
      <div className="w-[65%] border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-medium">说明</h3>
        </div>
        
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-6">
              {/* 功能介绍 */}
              <Card className="border shadow-sm hover:shadow transition-all duration-200">
                <AccordionItem value="introduction" className="border-none">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="px-6 py-4">
                      <h3 className="text-xl font-semibold">功能介绍</h3>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="px-6 pb-6 pt-2">
                      <div className="space-y-4">
                        <p>
                          本能源平台为您提供一套强大的分析工具，旨在深入探索和可视化不同能源发展路径。通过模拟各种情景，平台帮助用户评估实现可持续能源目标和碳中和策略的可行性与影响。
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <strong>情景对比与影响评估</strong>：轻松比较不同政策与技术假设下的能源系统表现（例如 CN60 碳中和情景），量化分析其对能源消费、生产结构及碳排放的具体影响。
                          </li>
                          <li>
                            <strong>精细化区域分析</strong>：支持超过 30 个中国省份的选择，允许用户聚焦特定区域，结合当地资源禀赋、能源需求和基础设施特点，获得定制化的深度洞察。
                          </li>
                          <li>
                            <strong>直观数据交互</strong>：通过清晰的树状目录结构和可编辑的数据表格，便捷地浏览和修改覆盖社会经济指标、分部门能源需求、能源转换技术及资源潜力的详细数据集。
                          </li>
                          <li>
                            <strong>动态趋势可视化</strong>：利用多样化的图表工具（折线图、柱状图、饼图、堆叠面积图），生动展示 2025 年至 2060 年间能源需求、供应、排放及关键技术指标的演变趋势。
                          </li>
                          <li>
                            <strong>深度技术参数剖析</strong>：详细审视各类发电、制氢及能源化工技术的关键参数，包括但不限于效率、容量因子、设备寿命及成本数据，支持精密的模型配置。
                          </li>
                          <li>
                            <strong>综合结果呈现与决策支持</strong>：在结果面板集中查看关键输出，如能源供应结构、各类电源装机容量以及二氧化碳排放总量与构成，为政策制定者和研究人员提供坚实的数据支撑。
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              {/* 模型结构 */}
              <Card className="border shadow-sm hover:shadow transition-all duration-200">
                <AccordionItem value="model-structure" className="border-none">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="px-6 py-4">
                      <h3 className="text-xl font-semibold">模型结构</h3>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="px-6 pb-6 pt-2">
                      <div className="space-y-4">
                        <p>
                          平台的核心模型基于长期能源替代规划系统框架构建。通过模块化的设计，系统地模拟了能源系统的复杂互动关系，确保分析的全面性和一致性。
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <strong>基础驱动：关键假设模块</strong>：设定模型运行的基础条件，涵盖宏观社会经济预测（人口、GDP、产业结构）以及关键技术参数（如部门能源强度、电气化水平、氢能渗透率等）。
                          </li>
                          <li>
                            <strong>能源消费：需求模块</strong>：精细刻画六大终端用能部门（农业、工业、建筑、交通、服务业、居民生活）的能源消费活动，区分不同燃料类型（煤、油、气、电、氢等）的需求。
                          </li>
                          <li>
                            <strong>能源转换：转换模块</strong>：模拟能源从一次能源向二次能源及终端能源转换的全过程，覆盖电力生产（火电、气电、核电、可再生能源发电）、氢气制取（ALK, PEM, SOEC, AEM 等技术）以及能源化工（如煤制油、炼油、焦化）等关键环节。
                          </li>
                          <li>
                            <strong>供应与贸易：资源模块</strong>：追踪各类能源资源的供应潜力、开采、进口与出口情况，包括化石燃料（煤、油、气）、可再生能源（风、光、水、生物质）及其他重要商品（核燃料、氢、成品油等）。
                          </li>
                          <li>
                            <strong>集成系统模拟</strong>：各模块紧密耦合，综合模拟能源在系统中的流动、技术的部署与迭代、以及伴随产生的环境排放，确保各项假设、需求、转换效率和资源约束得到统一考量。
                          </li>
                          <li>
                            <strong>灵活扩展设计</strong>：模型框架具有良好的可扩展性，便于未来根据需要纳入新的能源技术或扩展到更细化的区域分析，适应不断发展的能源研究需求。
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              {/* 使用说明 */}
              <Card className="border shadow-sm hover:shadow transition-all duration-200">
                <AccordionItem value="usage-guide" className="border-none">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="px-6 py-4">
                      <h3 className="text-xl font-semibold">使用说明</h3>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="px-6 pb-6 pt-2">
                      <div className="space-y-4">
                        <p>平台界面设计力求简洁直观，您可以按照以下步骤轻松完成能源系统分析并解读关键结果：</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <strong>步骤 1: 定义分析范围</strong>：首先，在页面顶部下拉菜单中选择您想研究的"情景"（如 CN60 碳中和）和"区域"（如北京）。这将设定您后续分析的宏观背景和地理边界。
                          </li>
                          <li>
                            <strong>步骤 2: 访问数据模块</strong>：利用界面左侧的导航菜单，在"分析"、"结果"和"说明"视图间切换。在"分析"视图下，您可以访问"关键假设"、"需求"、"转换"和"资源"四大核心数据模块。
                          </li>
                          <li>
                            <strong>步骤 3: 定位具体数据</strong>：在中间栏的树状目录中，点击展开并选择您感兴趣的具体条目（例如，"人口"、"煤电技术"、"风能资源"等），右侧将加载对应的数据。
                          </li>
                          <li>
                            <strong>步骤 4: 互动分析与编辑</strong>：在右侧面板，您可以查看所选条目的数据表格和自动生成的图表。对于技术类条目，还可切换查看不同参数（如效率、成本）。您可以直接在表格中修改数值，以快速测试不同假设的影响。
                          </li>
                          <li>
                            <strong>步骤 5: 可视化数据洞察</strong>：根据需要，在图表区域选择不同的图表类型（折线、柱状、饼图、堆叠图）来更直观地理解数据随时间的变化趋势或结构占比。
                          </li>
                          <li>
                            <strong>步骤 6: 查看综合结果</strong>：完成数据审阅和调整后，切换到"结果"视图。这里汇总了模型计算的核心输出，如能源供应总量与结构、发电装机容量、分部门/分燃料的 CO2 排放等。
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            </Accordion>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[65%] border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {activeNav === "analysis" ? "数据分析" : activeNav === "results" ? "结果展示" : "说明"}
          </h3>
          {nodeTitle && <div className="text-sm text-muted-foreground">当前选择: {nodeTitle}</div>}
        </div>
        <div className="text-sm text-muted-foreground mb-2">展示 {selectedProvince === "national" ? "全国" : selectedProvince === "beijing" ? "北京" : selectedProvince === "tianjin" ? "天津" : selectedProvince === "hebei" ? "河北" : selectedProvince === "shanxi" ? "山西" : selectedProvince === "neimenggu" ? "内蒙古" : selectedProvince === "liaoning" ? "辽宁" : selectedProvince === "jilin" ? "吉林" : selectedProvince === "heilongjiang" ? "黑龙江" : selectedProvince === "shanghai" ? "上海" : selectedProvince === "jiangsu" ? "江苏" : selectedProvince === "zhejiang" ? "浙江" : selectedProvince === "anhui" ? "安徽" : selectedProvince === "fujian" ? "福建" : selectedProvince === "jiangxi" ? "江西" : selectedProvince === "shandong" ? "山东" : selectedProvince === "henan" ? "河南" : selectedProvince === "hubei" ? "湖北" : selectedProvince === "hunan" ? "湖南" : selectedProvince === "guangdong" ? "广东" : selectedProvince === "guangxi" ? "广西" : selectedProvince === "hainan" ? "海南" : selectedProvince === "chongqing" ? "重庆" : selectedProvince === "sichuan" ? "四川" : selectedProvince === "guizhou" ? "贵州" : selectedProvince === "yunnan" ? "云南" : selectedProvince === "shaanxi" ? "陕西" : selectedProvince === "gansu" ? "甘肃" : selectedProvince === "qinghai" ? "青海" : selectedProvince === "ningxia" ? "宁夏" : selectedProvince === "xinjiang" ? "新疆" : ""} 在 {selectedScenario === "cn60" ? "CN60碳中和" : ""} 情景下的数据。</div>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {selectedNode && tableData.length > 0 ? (
          <>
            {/* Parameter Tabs for Power Generation Technologies */}
            {dataSets[selectedNode]?.isEnergyTech && (
              <div className="mb-4">
                <Tabs value={selectedParameter} onValueChange={handleParameterChange}>
                  <TabsList className="grid grid-cols-6">
                    {powerTechParameters.map((param) => (
                      <TabsTrigger key={param.id} value={param.id}>
                        {param.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Data Table Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">{nodeTitle}数据</h4>
                <div className="text-sm text-muted-foreground">点击单元格可编辑数值</div>
              </div>
              <EditableDataTable data={tableData} years={years} onDataChange={handleDataChange} />
            </div>

            {/* Chart Section */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">图表展示</h4>
                <div className="flex gap-2">
                  <Button
                    variant={chartType === "line" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    折线图
                  </Button>
                  <Button
                    variant={chartType === "bar" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    柱状图
                  </Button>
                  <Button
                    variant={chartType === "pie" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("pie")}
                  >
                    饼图
                  </Button>
                  <Button
                    variant={chartType === "stacked" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("stacked")}
                  >
                    堆叠图
                  </Button>
                </div>
              </div>

              <Card className="h-[400px]">
                <CardContent className="p-6">
                  <SimpleChart type={chartType} data={tableData} title={nodeTitle} />
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            请在左侧选择一个节点以查看数据
          </div>
        )}
      </div>
    </div>
  )
}
