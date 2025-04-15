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
    "sector1-para": {
    "title": "1农、林、牧、渔业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.32,
          "2030": 0.34,
          "2035": 0.3,
          "2040": 0.29,
          "2045": 0.23,
          "2050": 0.19,
          "2055": 0.19,
          "2060": 0.11
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 32.5,
          "2030": 35.9,
          "2035": 40.4,
          "2040": 48.1,
          "2045": 47.5,
          "2050": 51.1,
          "2055": 55.3,
          "2060": 60.1
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.3,
          "2030": 0.9,
          "2035": 2.2,
          "2040": 2.7,
          "2045": 4.3,
          "2050": 4.9,
          "2055": 5.8,
          "2060": 6.9
        }
      }
    ]
  },
  "sector2-para": {
    "title": "2煤炭开采和洗选业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.67,
          "2030": 0.59,
          "2035": 0.52,
          "2040": 0.46,
          "2045": 0.49,
          "2050": 0.41,
          "2055": 0.37,
          "2060": 0.29
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 25.6,
          "2030": 33.1,
          "2035": 38.6,
          "2040": 35.6,
          "2045": 49.2,
          "2050": 46.9,
          "2055": 57.4,
          "2060": 56.5
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.5,
          "2030": 2.0,
          "2035": 3.2,
          "2040": 6.2,
          "2045": 7.1,
          "2050": 9.5,
          "2055": 11.6,
          "2060": 13.7
        }
      }
    ]
  },
  "sector3-para": {
    "title": "3石油和天然气开采业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.68,
          "2030": 0.57,
          "2035": 0.53,
          "2040": 0.54,
          "2045": 0.5,
          "2050": 0.35,
          "2055": 0.37,
          "2060": 0.28
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 26.6,
          "2030": 33.5,
          "2035": 37.6,
          "2040": 35.6,
          "2045": 47.3,
          "2050": 50.0,
          "2055": 54.0,
          "2060": 61.6
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.6,
          "2030": 2.6,
          "2035": 4.5,
          "2040": 5.6,
          "2045": 8.0,
          "2050": 9.3,
          "2055": 11.4,
          "2060": 14.3
        }
      }
    ]
  },
  "sector4-para": {
    "title": "4黑色金属矿采选业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.64,
          "2030": 0.58,
          "2035": 0.56,
          "2040": 0.54,
          "2045": 0.49,
          "2050": 0.38,
          "2055": 0.35,
          "2060": 0.34
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 20.9,
          "2030": 34.7,
          "2035": 34.6,
          "2040": 35.8,
          "2045": 44.8,
          "2050": 51.0,
          "2055": 59.1,
          "2060": 59.4
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 2.5,
          "2035": 3.0,
          "2040": 5.8,
          "2045": 7.3,
          "2050": 11.0,
          "2055": 11.4,
          "2060": 15.9
        }
      }
    ]
  },
  "sector5-para": {
    "title": "5有色金属矿采选业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.67,
          "2030": 0.64,
          "2035": 0.51,
          "2040": 0.46,
          "2045": 0.42,
          "2050": 0.36,
          "2055": 0.36,
          "2060": 0.33
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 24.9,
          "2030": 29.7,
          "2035": 33.6,
          "2040": 44.1,
          "2045": 43.5,
          "2050": 46.1,
          "2055": 57.0,
          "2060": 56.2
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 2.8,
          "2035": 3.8,
          "2040": 5.1,
          "2045": 7.2,
          "2050": 9.3,
          "2055": 12.2,
          "2060": 14.2
        }
      }
    ]
  },
  "sector6-para": {
    "title": "6非金属矿采选业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.66,
          "2030": 0.56,
          "2035": 0.58,
          "2040": 0.46,
          "2045": 0.47,
          "2050": 0.44,
          "2055": 0.35,
          "2060": 0.28
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 29.9,
          "2030": 30.5,
          "2035": 32.6,
          "2040": 38.0,
          "2045": 43.7,
          "2050": 54.2,
          "2055": 53.5,
          "2060": 55.6
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.7,
          "2030": 2.8,
          "2035": 3.3,
          "2040": 6.7,
          "2045": 8.1,
          "2050": 10.3,
          "2055": 12.3,
          "2060": 14.2
        }
      }
    ]
  },
  "sector7-para": {
    "title": "7其他采矿业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.68,
          "2030": 0.58,
          "2035": 0.56,
          "2040": 0.5,
          "2045": 0.46,
          "2050": 0.44,
          "2055": 0.34,
          "2060": 0.26
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 29.6,
          "2030": 31.0,
          "2035": 39.9,
          "2040": 40.6,
          "2045": 49.2,
          "2050": 49.5,
          "2055": 52.3,
          "2060": 55.1
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.9,
          "2030": 2.4,
          "2035": 4.7,
          "2040": 5.8,
          "2045": 8.3,
          "2050": 9.3,
          "2055": 12.7,
          "2060": 15.2
        }
      }
    ]
  },
  "sector8-para": {
    "title": "8农副食品加工业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.39,
          "2030": 0.28,
          "2035": 0.24,
          "2040": 0.28,
          "2045": 0.28,
          "2050": 0.19,
          "2055": 0.2,
          "2060": 0.19
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 29.7,
          "2030": 30.2,
          "2035": 35.0,
          "2040": 45.8,
          "2045": 54.1,
          "2050": 52.3,
          "2055": 58.8,
          "2060": 64.6
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.4,
          "2035": 2.0,
          "2040": 3.5,
          "2045": 4.0,
          "2050": 4.6,
          "2055": 6.4,
          "2060": 6.5
        }
      }
    ]
  },
  "sector9-para": {
    "title": "9食品制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.32,
          "2030": 0.29,
          "2035": 0.29,
          "2040": 0.35,
          "2045": 0.28,
          "2050": 0.24,
          "2055": 0.2,
          "2060": 0.16
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 28.5,
          "2030": 30.9,
          "2035": 41.8,
          "2040": 49.0,
          "2045": 51.8,
          "2050": 57.3,
          "2055": 63.8,
          "2060": 64.9
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.3,
          "2030": 1.2,
          "2035": 2.0,
          "2040": 3.4,
          "2045": 3.8,
          "2050": 4.7,
          "2055": 5.8,
          "2060": 7.1
        }
      }
    ]
  },
  "sector10-para": {
    "title": "10酒.饮料和精制茶制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.43,
          "2030": 0.33,
          "2035": 0.29,
          "2040": 0.34,
          "2045": 0.26,
          "2050": 0.21,
          "2055": 0.21,
          "2060": 0.18
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 27.7,
          "2030": 34.5,
          "2035": 39.6,
          "2040": 48.9,
          "2045": 53.2,
          "2050": 56.0,
          "2055": 55.7,
          "2060": 63.3
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.5,
          "2030": 1.1,
          "2035": 2.2,
          "2040": 3.0,
          "2045": 4.3,
          "2050": 5.4,
          "2055": 5.8,
          "2060": 6.9
        }
      }
    ]
  },
  "sector11-para": {
    "title": "11烟草制品业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.5,
          "2030": 0.45,
          "2035": 0.31,
          "2040": 0.27,
          "2045": 0.28,
          "2050": 0.27,
          "2055": 0.23,
          "2060": 0.23
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 31.9,
          "2030": 38.2,
          "2035": 39.4,
          "2040": 43.0,
          "2045": 54.9,
          "2050": 50.8,
          "2055": 60.1,
          "2060": 61.6
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.0,
          "2035": 1.8,
          "2040": 2.9,
          "2045": 3.5,
          "2050": 5.3,
          "2055": 6.2,
          "2060": 7.1
        }
      }
    ]
  },
  "sector12-para": {
    "title": "12纺织业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.49,
          "2030": 0.41,
          "2035": 0.34,
          "2040": 0.32,
          "2045": 0.27,
          "2050": 0.25,
          "2055": 0.22,
          "2060": 0.22
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 34.5,
          "2030": 33.2,
          "2035": 39.7,
          "2040": 47.8,
          "2045": 47.8,
          "2050": 50.3,
          "2055": 63.9,
          "2060": 63.3
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 0.5,
          "2035": 2.0,
          "2040": 3.2,
          "2045": 3.7,
          "2050": 4.6,
          "2055": 5.5,
          "2060": 7.2
        }
      }
    ]
  },
  "sector13-para": {
    "title": "13纺织服装.服饰业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.47,
          "2030": 0.29,
          "2035": 0.4,
          "2040": 0.27,
          "2045": 0.24,
          "2050": 0.22,
          "2055": 0.26,
          "2060": 0.2
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 26.3,
          "2030": 31.7,
          "2035": 44.2,
          "2040": 44.4,
          "2045": 54.1,
          "2050": 52.6,
          "2055": 56.0,
          "2060": 68.8
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.1,
          "2030": 1.2,
          "2035": 1.9,
          "2040": 3.3,
          "2045": 3.6,
          "2050": 4.9,
          "2055": 5.9,
          "2060": 6.6
        }
      }
    ]
  },
  "sector14-para": {
    "title": "14皮革.毛皮.羽毛及其制品和制鞋业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.43,
          "2030": 0.33,
          "2035": 0.33,
          "2040": 0.29,
          "2045": 0.26,
          "2050": 0.22,
          "2055": 0.22,
          "2060": 0.22
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 30.3,
          "2030": 32.1,
          "2035": 38.5,
          "2040": 48.6,
          "2045": 54.2,
          "2050": 53.3,
          "2055": 63.1,
          "2060": 65.4
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.1,
          "2030": 1.1,
          "2035": 2.5,
          "2040": 2.9,
          "2045": 4.5,
          "2050": 5.3,
          "2055": 5.6,
          "2060": 7.2
        }
      }
    ]
  },
  "sector15-para": {
    "title": "15木材加工和木.竹.藤.棕.草制品业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.46,
          "2030": 0.45,
          "2035": 0.39,
          "2040": 0.33,
          "2045": 0.25,
          "2050": 0.27,
          "2055": 0.25,
          "2060": 0.24
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 31.1,
          "2030": 33.8,
          "2035": 40.1,
          "2040": 42.2,
          "2045": 45.9,
          "2050": 51.3,
          "2055": 61.4,
          "2060": 61.7
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.3,
          "2030": 1.4,
          "2035": 1.6,
          "2040": 3.0,
          "2045": 3.7,
          "2050": 5.2,
          "2055": 5.9,
          "2060": 6.9
        }
      }
    ]
  },
  "sector16-para": {
    "title": "16家具制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.5,
          "2030": 0.28,
          "2035": 0.34,
          "2040": 0.31,
          "2045": 0.25,
          "2050": 0.22,
          "2055": 0.19,
          "2060": 0.23
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 33.7,
          "2030": 35.7,
          "2035": 41.6,
          "2040": 42.9,
          "2045": 47.3,
          "2050": 57.8,
          "2055": 56.6,
          "2060": 61.9
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.4,
          "2035": 1.7,
          "2040": 2.5,
          "2045": 4.4,
          "2050": 5.4,
          "2055": 5.7,
          "2060": 7.0
        }
      }
    ]
  },
  "sector17-para": {
    "title": "17造纸和纸制品业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.38,
          "2030": 0.32,
          "2035": 0.35,
          "2040": 0.34,
          "2045": 0.3,
          "2050": 0.23,
          "2055": 0.26,
          "2060": 0.18
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 26.4,
          "2030": 35.8,
          "2035": 35.0,
          "2040": 43.2,
          "2045": 50.0,
          "2050": 58.0,
          "2055": 64.5,
          "2060": 69.7
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 1.4,
          "2035": 1.7,
          "2040": 3.0,
          "2045": 4.5,
          "2050": 4.5,
          "2055": 5.9,
          "2060": 7.5
        }
      }
    ]
  },
  "sector18-para": {
    "title": "18印刷和记录媒介复制业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.37,
          "2030": 0.31,
          "2035": 0.34,
          "2040": 0.27,
          "2045": 0.29,
          "2050": 0.26,
          "2055": 0.2,
          "2060": 0.22
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 34.4,
          "2030": 31.0,
          "2035": 35.4,
          "2040": 40.4,
          "2045": 49.0,
          "2050": 53.2,
          "2055": 60.9,
          "2060": 61.5
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.0,
          "2030": 0.7,
          "2035": 2.2,
          "2040": 2.6,
          "2045": 4.3,
          "2050": 5.4,
          "2055": 6.3,
          "2060": 7.1
        }
      }
    ]
  },
  "sector19-para": {
    "title": "19文教.工美.体育和娱乐用品制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.43,
          "2030": 0.29,
          "2035": 0.33,
          "2040": 0.31,
          "2045": 0.27,
          "2050": 0.28,
          "2055": 0.26,
          "2060": 0.22
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 28.4,
          "2030": 38.7,
          "2035": 41.5,
          "2040": 47.8,
          "2045": 54.2,
          "2050": 58.7,
          "2055": 64.0,
          "2060": 61.9
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 0.6,
          "2035": 1.7,
          "2040": 3.1,
          "2045": 4.2,
          "2050": 4.9,
          "2055": 5.7,
          "2060": 7.0
        }
      }
    ]
  },
  "sector20-para": {
    "title": "20石油.煤炭及其他燃料加工业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.66,
          "2030": 0.63,
          "2035": 0.53,
          "2040": 0.54,
          "2045": 0.44,
          "2050": 0.42,
          "2055": 0.36,
          "2060": 0.32
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 29.2,
          "2030": 26.6,
          "2035": 31.1,
          "2040": 38.2,
          "2045": 42.6,
          "2050": 51.6,
          "2055": 58.6,
          "2060": 58.0
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.8,
          "2030": 1.3,
          "2035": 3.6,
          "2040": 6.5,
          "2045": 8.7,
          "2050": 9.8,
          "2055": 11.2,
          "2060": 13.5
        }
      }
    ]
  },
  "sector21-para": {
    "title": "21化学原料和化学制品制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.5,
          "2030": 0.36,
          "2035": 0.38,
          "2040": 0.34,
          "2045": 0.28,
          "2050": 0.2,
          "2055": 0.19,
          "2060": 0.19
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 32.6,
          "2030": 35.6,
          "2035": 36.8,
          "2040": 42.6,
          "2045": 47.0,
          "2050": 53.3,
          "2055": 61.0,
          "2060": 62.3
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.3,
          "2030": 1.3,
          "2035": 2.0,
          "2040": 2.8,
          "2045": 4.4,
          "2050": 5.4,
          "2055": 6.0,
          "2060": 7.0
        }
      }
    ]
  },
  "sector22-para": {
    "title": "22医药制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.47,
          "2030": 0.29,
          "2035": 0.33,
          "2040": 0.24,
          "2045": 0.28,
          "2050": 0.27,
          "2055": 0.22,
          "2060": 0.16
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 34.4,
          "2030": 36.8,
          "2035": 42.8,
          "2040": 49.3,
          "2045": 46.2,
          "2050": 54.4,
          "2055": 61.5,
          "2060": 66.1
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 1.0,
          "2035": 2.5,
          "2040": 2.7,
          "2045": 3.8,
          "2050": 4.7,
          "2055": 6.0,
          "2060": 7.2
        }
      }
    ]
  },
  "sector23-para": {
    "title": "23化学纤维制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.45,
          "2030": 0.34,
          "2035": 0.39,
          "2040": 0.27,
          "2045": 0.26,
          "2050": 0.24,
          "2055": 0.2,
          "2060": 0.23
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 28.0,
          "2030": 38.0,
          "2035": 41.0,
          "2040": 41.9,
          "2045": 50.2,
          "2050": 53.0,
          "2055": 61.5,
          "2060": 67.4
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.1,
          "2035": 1.8,
          "2040": 3.3,
          "2045": 4.1,
          "2050": 5.0,
          "2055": 5.5,
          "2060": 6.9
        }
      }
    ]
  },
  "sector24-para": {
    "title": "24橡胶和塑料制品业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.34,
          "2030": 0.39,
          "2035": 0.28,
          "2040": 0.32,
          "2045": 0.27,
          "2050": 0.25,
          "2055": 0.21,
          "2060": 0.18
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 30.7,
          "2030": 34.9,
          "2035": 39.8,
          "2040": 44.2,
          "2045": 50.4,
          "2050": 53.4,
          "2055": 56.2,
          "2060": 66.7
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 1.3,
          "2035": 1.6,
          "2040": 2.7,
          "2045": 3.7,
          "2050": 4.9,
          "2055": 5.8,
          "2060": 7.4
        }
      }
    ]
  },
  "sector25-para": {
    "title": "25非金属矿物制品业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.7,
          "2030": 0.6,
          "2035": 0.5,
          "2040": 0.54,
          "2045": 0.44,
          "2050": 0.44,
          "2055": 0.34,
          "2060": 0.25
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 21.1,
          "2030": 33.6,
          "2035": 38.5,
          "2040": 38.5,
          "2045": 41.0,
          "2050": 48.4,
          "2055": 59.2,
          "2060": 56.4
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.8,
          "2030": 2.5,
          "2035": 4.4,
          "2040": 5.9,
          "2045": 8.2,
          "2050": 10.6,
          "2055": 12.1,
          "2060": 13.1
        }
      }
    ]
  },
  "sector26-para": {
    "title": "26黑色金属冶炼和压延加工业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.62,
          "2030": 0.57,
          "2035": 0.5,
          "2040": 0.48,
          "2045": 0.45,
          "2050": 0.45,
          "2055": 0.31,
          "2060": 0.26
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 21.6,
          "2030": 31.7,
          "2035": 39.7,
          "2040": 35.5,
          "2045": 44.1,
          "2050": 45.8,
          "2055": 54.2,
          "2060": 55.0
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.1,
          "2030": 2.1,
          "2035": 4.8,
          "2040": 6.1,
          "2045": 7.2,
          "2050": 9.8,
          "2055": 12.2,
          "2060": 14.5
        }
      }
    ]
  },
  "sector27-para": {
    "title": "27有色金属冶炼和压延加工业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.6,
          "2030": 0.57,
          "2035": 0.56,
          "2040": 0.48,
          "2045": 0.43,
          "2050": 0.36,
          "2055": 0.33,
          "2060": 0.3
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 29.3,
          "2030": 32.7,
          "2035": 34.1,
          "2040": 44.0,
          "2045": 42.6,
          "2050": 53.3,
          "2055": 50.9,
          "2060": 57.4
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.9,
          "2030": 2.0,
          "2035": 4.7,
          "2040": 6.3,
          "2045": 8.3,
          "2050": 10.1,
          "2055": 11.9,
          "2060": 15.1
        }
      }
    ]
  },
  "sector28-para": {
    "title": "28金属制品业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.46,
          "2030": 0.36,
          "2035": 0.33,
          "2040": 0.24,
          "2045": 0.27,
          "2050": 0.27,
          "2055": 0.25,
          "2060": 0.19
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 31.9,
          "2030": 33.4,
          "2035": 35.2,
          "2040": 43.7,
          "2045": 52.1,
          "2050": 52.3,
          "2055": 64.8,
          "2060": 66.3
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 1.1,
          "2035": 1.8,
          "2040": 2.7,
          "2045": 3.5,
          "2050": 5.3,
          "2055": 6.5,
          "2060": 6.7
        }
      }
    ]
  },
  "sector29-para": {
    "title": "29通用设备制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.43,
          "2030": 0.36,
          "2035": 0.3,
          "2040": 0.25,
          "2045": 0.25,
          "2050": 0.26,
          "2055": 0.2,
          "2060": 0.21
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 27.0,
          "2030": 30.5,
          "2035": 41.4,
          "2040": 46.3,
          "2045": 51.9,
          "2050": 53.7,
          "2055": 63.9,
          "2060": 67.2
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.3,
          "2030": 0.7,
          "2035": 1.6,
          "2040": 3.3,
          "2045": 3.8,
          "2050": 4.8,
          "2055": 6.1,
          "2060": 7.2
        }
      }
    ]
  },
  "sector30-para": {
    "title": "30专用设备制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.49,
          "2030": 0.33,
          "2035": 0.36,
          "2040": 0.34,
          "2045": 0.3,
          "2050": 0.23,
          "2055": 0.2,
          "2060": 0.17
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 31.7,
          "2030": 35.7,
          "2035": 39.1,
          "2040": 47.1,
          "2045": 47.0,
          "2050": 58.1,
          "2055": 57.4,
          "2060": 64.9
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.0,
          "2030": 1.3,
          "2035": 1.6,
          "2040": 3.2,
          "2045": 3.9,
          "2050": 4.8,
          "2055": 5.8,
          "2060": 6.6
        }
      }
    ]
  },
  "sector31-para": {
    "title": "31汽车制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.34,
          "2030": 0.41,
          "2035": 0.27,
          "2040": 0.29,
          "2045": 0.23,
          "2050": 0.23,
          "2055": 0.23,
          "2060": 0.19
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 28.1,
          "2030": 32.4,
          "2035": 39.2,
          "2040": 41.2,
          "2045": 49.1,
          "2050": 51.1,
          "2055": 63.8,
          "2060": 63.5
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.5,
          "2030": 0.7,
          "2035": 2.4,
          "2040": 2.7,
          "2045": 3.7,
          "2050": 5.1,
          "2055": 5.6,
          "2060": 6.7
        }
      }
    ]
  },
  "sector32-para": {
    "title": "32铁路.船舶.航空航天和其他运输设备制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.58,
          "2030": 0.47,
          "2035": 0.44,
          "2040": 0.39,
          "2045": 0.35,
          "2050": 0.3,
          "2055": 0.24,
          "2060": 0.21
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 10.9,
          "2030": 27.7,
          "2035": 36.9,
          "2040": 43.8,
          "2045": 50.5,
          "2050": 67.5,
          "2055": 77.1,
          "2060": 84.0
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.9,
          "2030": 1.6,
          "2035": 3.1,
          "2040": 6.2,
          "2045": 8.8,
          "2050": 9.5,
          "2055": 12.6,
          "2060": 15.8
        }
      }
    ]
  },
  "sector33-para": {
    "title": "33电气机械和器材制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.47,
          "2030": 0.38,
          "2035": 0.29,
          "2040": 0.26,
          "2045": 0.27,
          "2050": 0.25,
          "2055": 0.19,
          "2060": 0.18
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 28.3,
          "2030": 30.7,
          "2035": 44.4,
          "2040": 46.7,
          "2045": 51.4,
          "2050": 57.2,
          "2055": 63.5,
          "2060": 63.4
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.3,
          "2030": 0.9,
          "2035": 1.6,
          "2040": 3.0,
          "2045": 3.9,
          "2050": 5.2,
          "2055": 5.5,
          "2060": 6.7
        }
      }
    ]
  },
  "sector34-para": {
    "title": "34计算机.通信和其他电子设备制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.36,
          "2030": 0.45,
          "2035": 0.27,
          "2040": 0.25,
          "2045": 0.23,
          "2050": 0.22,
          "2055": 0.25,
          "2060": 0.2
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 28.6,
          "2030": 33.1,
          "2035": 40.3,
          "2040": 41.5,
          "2045": 52.1,
          "2050": 59.9,
          "2055": 57.0,
          "2060": 60.0
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.3,
          "2035": 2.0,
          "2040": 3.5,
          "2045": 3.8,
          "2050": 5.4,
          "2055": 5.9,
          "2060": 6.5
        }
      }
    ]
  },
  "sector35-para": {
    "title": "35仪器仪表制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.5,
          "2030": 0.38,
          "2035": 0.28,
          "2040": 0.34,
          "2045": 0.3,
          "2050": 0.23,
          "2055": 0.22,
          "2060": 0.19
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 26.7,
          "2030": 39.2,
          "2035": 38.3,
          "2040": 49.9,
          "2045": 48.2,
          "2050": 55.7,
          "2055": 60.9,
          "2060": 67.8
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.4,
          "2035": 2.0,
          "2040": 2.8,
          "2045": 4.0,
          "2050": 5.3,
          "2055": 5.6,
          "2060": 7.3
        }
      }
    ]
  },
  "sector36-para": {
    "title": "36其他制造业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.5,
          "2030": 0.29,
          "2035": 0.32,
          "2040": 0.24,
          "2045": 0.23,
          "2050": 0.25,
          "2055": 0.22,
          "2060": 0.23
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 26.8,
          "2030": 36.6,
          "2035": 43.8,
          "2040": 43.8,
          "2045": 54.2,
          "2050": 58.1,
          "2055": 62.1,
          "2060": 68.0
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.0,
          "2030": 0.6,
          "2035": 2.0,
          "2040": 3.3,
          "2045": 4.2,
          "2050": 5.2,
          "2055": 5.7,
          "2060": 6.6
        }
      }
    ]
  },
  "sector37-para": {
    "title": "37废弃资利用业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.37,
          "2030": 0.31,
          "2035": 0.35,
          "2040": 0.32,
          "2045": 0.22,
          "2050": 0.28,
          "2055": 0.25,
          "2060": 0.22
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 31.1,
          "2030": 35.6,
          "2035": 37.0,
          "2040": 40.7,
          "2045": 53.1,
          "2050": 53.8,
          "2055": 58.2,
          "2060": 63.9
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.5,
          "2030": 1.1,
          "2035": 1.9,
          "2040": 3.4,
          "2045": 3.8,
          "2050": 4.5,
          "2055": 6.5,
          "2060": 6.9
        }
      }
    ]
  },
  "sector38-para": {
    "title": "38金属制品.机械和设备修理业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.39,
          "2030": 0.43,
          "2035": 0.39,
          "2040": 0.27,
          "2045": 0.28,
          "2050": 0.26,
          "2055": 0.21,
          "2060": 0.17
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 28.4,
          "2030": 32.2,
          "2035": 40.6,
          "2040": 42.1,
          "2045": 46.0,
          "2050": 57.0,
          "2055": 57.1,
          "2060": 61.7
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.0,
          "2030": 0.7,
          "2035": 1.7,
          "2040": 3.4,
          "2045": 4.3,
          "2050": 5.4,
          "2055": 6.5,
          "2060": 7.4
        }
      }
    ]
  },
  "sector39-para": {
    "title": "39电力.热力生产和供应业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.42,
          "2030": 0.31,
          "2035": 0.38,
          "2040": 0.24,
          "2045": 0.28,
          "2050": 0.24,
          "2055": 0.21,
          "2060": 0.19
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 31.6,
          "2030": 35.5,
          "2035": 42.5,
          "2040": 40.4,
          "2045": 50.8,
          "2050": 58.6,
          "2055": 63.9,
          "2060": 62.2
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.5,
          "2030": 1.2,
          "2035": 2.2,
          "2040": 3.1,
          "2045": 4.4,
          "2050": 5.4,
          "2055": 5.6,
          "2060": 6.8
        }
      }
    ]
  },
  "sector40-para": {
    "title": "40燃气生产和供应业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.33,
          "2030": 0.34,
          "2035": 0.29,
          "2040": 0.34,
          "2045": 0.27,
          "2050": 0.22,
          "2055": 0.21,
          "2060": 0.22
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 26.7,
          "2030": 33.8,
          "2035": 36.2,
          "2040": 48.3,
          "2045": 52.8,
          "2050": 59.0,
          "2055": 63.4,
          "2060": 63.3
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.5,
          "2030": 0.7,
          "2035": 2.1,
          "2040": 2.7,
          "2045": 4.1,
          "2050": 4.9,
          "2055": 6.4,
          "2060": 6.7
        }
      }
    ]
  },
  "sector41-para": {
    "title": "41水的生产和供应业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.5,
          "2030": 0.35,
          "2035": 0.31,
          "2040": 0.26,
          "2045": 0.25,
          "2050": 0.2,
          "2055": 0.26,
          "2060": 0.21
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 25.2,
          "2030": 30.4,
          "2035": 35.7,
          "2040": 43.7,
          "2045": 54.6,
          "2050": 56.8,
          "2055": 60.3,
          "2060": 69.6
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 1.0,
          "2035": 2.0,
          "2040": 3.0,
          "2045": 3.8,
          "2050": 5.2,
          "2055": 5.6,
          "2060": 7.3
        }
      }
    ]
  },
  "sector42-para": {
    "title": "42建筑业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.46,
          "2030": 0.37,
          "2035": 0.37,
          "2040": 0.33,
          "2045": 0.26,
          "2050": 0.25,
          "2055": 0.28,
          "2060": 0.25
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 23.4,
          "2030": 28.6,
          "2035": 32.4,
          "2040": 33.4,
          "2045": 37.1,
          "2050": 47.4,
          "2055": 51.6,
          "2060": 54.7
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.5,
          "2035": 2.4,
          "2040": 3.5,
          "2045": 4.1,
          "2050": 4.6,
          "2055": 6.4,
          "2060": 7.3
        }
      }
    ]
  },
  "sector43-para": {
    "title": "43交通运输、仓储和邮政业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.58,
          "2030": 0.48,
          "2035": 0.48,
          "2040": 0.36,
          "2045": 0.39,
          "2050": 0.28,
          "2055": 0.27,
          "2060": 0.3
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 14.2,
          "2030": 27.3,
          "2035": 30.0,
          "2040": 44.3,
          "2045": 50.6,
          "2050": 69.6,
          "2055": 72.0,
          "2060": 89.6
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.4,
          "2030": 1.2,
          "2035": 4.9,
          "2040": 5.8,
          "2045": 8.7,
          "2050": 10.6,
          "2055": 12.8,
          "2060": 13.3
        }
      }
    ]
  },
  "sector44-para": {
    "title": "44批发和零售业、住宿和餐饮业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.23,
          "2030": 0.25,
          "2035": 0.25,
          "2040": 0.17,
          "2045": 0.17,
          "2050": 0.11,
          "2055": 0.14,
          "2060": 0.13
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 39.1,
          "2030": 43.5,
          "2035": 49.7,
          "2040": 50.5,
          "2045": 57.0,
          "2050": 64.6,
          "2055": 67.3,
          "2060": 72.8
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.0,
          "2030": 0.7,
          "2035": 2.5,
          "2040": 2.7,
          "2045": 3.9,
          "2050": 4.7,
          "2055": 5.7,
          "2060": 6.6
        }
      }
    ]
  },
  "sector45-para": {
    "title": "45其他行业",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/万元",
        "values": {
          "2025": 0.25,
          "2030": 0.27,
          "2035": 0.22,
          "2040": 0.15,
          "2045": 0.22,
          "2050": 0.15,
          "2055": 0.15,
          "2060": 0.11
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 38.9,
          "2030": 49.6,
          "2035": 47.5,
          "2040": 57.1,
          "2045": 62.8,
          "2050": 63.3,
          "2055": 70.9,
          "2060": 75.8
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.2,
          "2030": 0.7,
          "2035": 1.6,
          "2040": 3.0,
          "2045": 4.4,
          "2050": 4.6,
          "2055": 5.7,
          "2060": 7.2
        }
      }
    ]
  },
  "sector46-para": {
    "title": "46城镇居民",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/户",
        "values": {
          "2025": 1.25,
          "2030": 0.77,
          "2035": 0.6,
          "2040": 0.64,
          "2045": 0.7,
          "2050": 0.46,
          "2055": 0.59,
          "2060": 0.43
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 32.0,
          "2030": 40.0,
          "2035": 44.1,
          "2040": 46.5,
          "2045": 54.4,
          "2050": 64.3,
          "2055": 66.5,
          "2060": 69.0
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.1,
          "2030": 0.7,
          "2035": 1.2,
          "2040": 1.9,
          "2045": 2.0,
          "2050": 2.9,
          "2055": 3.1,
          "2060": 4.0
        }
      }
    ]
  },
  "sector47-para": {
    "title": "47乡村居民",
    "data": [
      {
        "indicator": "能源强度",
        "unit": "吨标煤/户",
        "values": {
          "2025": 1.29,
          "2030": 0.95,
          "2035": 0.67,
          "2040": 0.74,
          "2045": 0.64,
          "2050": 0.39,
          "2055": 0.58,
          "2060": 0.43
        }
      },
      {
        "indicator": "电气化率",
        "unit": "%",
        "values": {
          "2025": 37.3,
          "2030": 40.4,
          "2035": 41.5,
          "2040": 48.2,
          "2045": 50.4,
          "2050": 59.3,
          "2055": 69.6,
          "2060": 70.4
        }
      },
      {
        "indicator": "氢气化率",
        "unit": "%",
        "values": {
          "2025": 0.0,
          "2030": 0.9,
          "2035": 1.1,
          "2040": 1.6,
          "2045": 2.3,
          "2050": 3.0,
          "2055": 3.0,
          "2060": 3.6
        }
      }
    ]
  },
    // Energy demand data for each sector with fuel breakdown
 "sector1-fe": {
    "title": "农业终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 27,
          "2030": 25,
          "2035": 24,
          "2040": 22,
          "2045": 21,
          "2050": 19,
          "2055": 18,
          "2060": 16
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 32,
          "2030": 30,
          "2035": 28,
          "2040": 27,
          "2045": 25,
          "2050": 23,
          "2055": 21,
          "2060": 19
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 9,
          "2030": 10,
          "2035": 10,
          "2040": 10,
          "2045": 9,
          "2050": 9,
          "2055": 8,
          "2060": 8
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 42,
          "2030": 45,
          "2035": 49,
          "2040": 52,
          "2045": 56,
          "2050": 59,
          "2055": 63,
          "2060": 66
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector2-fe": {
    "title": "工业部门2终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 900,
          "2030": 850,
          "2035": 800,
          "2040": 750,
          "2045": 700,
          "2050": 650,
          "2055": 600,
          "2060": 550
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 457,
          "2030": 431,
          "2035": 406,
          "2040": 381,
          "2045": 355,
          "2050": 330,
          "2055": 304,
          "2060": 279
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 232,
          "2030": 242,
          "2035": 253,
          "2040": 240,
          "2045": 227,
          "2050": 215,
          "2055": 202,
          "2060": 189
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 616,
          "2030": 668,
          "2035": 719,
          "2040": 771,
          "2045": 822,
          "2050": 873,
          "2055": 925,
          "2060": 976
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector3-fe": {
    "title": "工业部门3终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 796,
          "2030": 752,
          "2035": 708,
          "2040": 663,
          "2045": 619,
          "2050": 575,
          "2055": 531,
          "2060": 486
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 401,
          "2030": 379,
          "2035": 356,
          "2040": 334,
          "2045": 312,
          "2050": 289,
          "2055": 267,
          "2060": 245
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 221,
          "2030": 231,
          "2035": 241,
          "2040": 229,
          "2045": 217,
          "2050": 205,
          "2055": 192,
          "2060": 180
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 627,
          "2030": 679,
          "2035": 732,
          "2040": 784,
          "2045": 836,
          "2050": 889,
          "2055": 941,
          "2060": 993
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector4-fe": {
    "title": "工业部门4终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1190,
          "2030": 1124,
          "2035": 1058,
          "2040": 992,
          "2045": 926,
          "2050": 859,
          "2055": 793,
          "2060": 727
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 406,
          "2030": 384,
          "2035": 361,
          "2040": 339,
          "2045": 316,
          "2050": 293,
          "2055": 271,
          "2060": 248
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 231,
          "2030": 241,
          "2035": 252,
          "2040": 239,
          "2045": 226,
          "2050": 214,
          "2055": 201,
          "2060": 189
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 488,
          "2030": 529,
          "2035": 569,
          "2040": 610,
          "2045": 651,
          "2050": 691,
          "2055": 732,
          "2060": 773
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector5-fe": {
    "title": "工业部门5终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 846,
          "2030": 799,
          "2035": 752,
          "2040": 705,
          "2045": 658,
          "2050": 611,
          "2055": 564,
          "2060": 516
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 535,
          "2030": 505,
          "2035": 476,
          "2040": 446,
          "2045": 416,
          "2050": 386,
          "2055": 357,
          "2060": 327
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 370,
          "2030": 387,
          "2035": 404,
          "2040": 384,
          "2045": 363,
          "2050": 343,
          "2055": 323,
          "2060": 303
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 610,
          "2030": 661,
          "2035": 712,
          "2040": 763,
          "2045": 814,
          "2050": 865,
          "2055": 916,
          "2060": 967
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector6-fe": {
    "title": "工业部门6终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 722,
          "2030": 682,
          "2035": 642,
          "2040": 602,
          "2045": 562,
          "2050": 521,
          "2055": 481,
          "2060": 441
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 368,
          "2030": 347,
          "2035": 327,
          "2040": 306,
          "2045": 286,
          "2050": 265,
          "2055": 245,
          "2060": 224
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 297,
          "2030": 310,
          "2035": 324,
          "2040": 307,
          "2045": 291,
          "2050": 275,
          "2055": 259,
          "2060": 243
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 520,
          "2030": 564,
          "2035": 607,
          "2040": 651,
          "2045": 694,
          "2050": 737,
          "2055": 781,
          "2060": 824
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector7-fe": {
    "title": "工业部门7终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1098,
          "2030": 1037,
          "2035": 976,
          "2040": 915,
          "2045": 854,
          "2050": 793,
          "2055": 732,
          "2060": 670
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 512,
          "2030": 483,
          "2035": 455,
          "2040": 426,
          "2045": 398,
          "2050": 369,
          "2055": 341,
          "2060": 312
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 255,
          "2030": 266,
          "2035": 278,
          "2040": 264,
          "2045": 250,
          "2050": 236,
          "2055": 222,
          "2060": 208
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 498,
          "2030": 539,
          "2035": 581,
          "2040": 622,
          "2045": 664,
          "2050": 705,
          "2055": 747,
          "2060": 788
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector8-fe": {
    "title": "工业部门8终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1253,
          "2030": 1184,
          "2035": 1114,
          "2040": 1044,
          "2045": 975,
          "2050": 905,
          "2055": 835,
          "2060": 766
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 433,
          "2030": 409,
          "2035": 385,
          "2040": 361,
          "2045": 337,
          "2050": 313,
          "2055": 289,
          "2060": 265
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 376,
          "2030": 393,
          "2035": 410,
          "2040": 389,
          "2045": 369,
          "2050": 348,
          "2055": 328,
          "2060": 307
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 568,
          "2030": 616,
          "2035": 663,
          "2040": 711,
          "2045": 758,
          "2050": 805,
          "2055": 853,
          "2060": 900
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector9-fe": {
    "title": "工业部门9终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 893,
          "2030": 844,
          "2035": 794,
          "2040": 744,
          "2045": 695,
          "2050": 645,
          "2055": 595,
          "2060": 546
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 468,
          "2030": 442,
          "2035": 416,
          "2040": 390,
          "2045": 364,
          "2050": 338,
          "2055": 312,
          "2060": 285
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 246,
          "2030": 257,
          "2035": 268,
          "2040": 255,
          "2045": 241,
          "2050": 228,
          "2055": 215,
          "2060": 201
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 717,
          "2030": 777,
          "2035": 837,
          "2040": 897,
          "2045": 956,
          "2050": 1016,
          "2055": 1076,
          "2060": 1136
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector10-fe": {
    "title": "工业部门10终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1278,
          "2030": 1207,
          "2035": 1136,
          "2040": 1065,
          "2045": 993,
          "2050": 923,
          "2055": 852,
          "2060": 780
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 367,
          "2030": 346,
          "2035": 326,
          "2040": 306,
          "2045": 285,
          "2050": 265,
          "2055": 244,
          "2060": 224
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 403,
          "2030": 422,
          "2035": 440,
          "2040": 418,
          "2045": 396,
          "2050": 374,
          "2055": 352,
          "2060": 330
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 529,
          "2030": 573,
          "2035": 617,
          "2040": 661,
          "2045": 705,
          "2050": 749,
          "2055": 793,
          "2060": 837
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector11-fe": {
    "title": "工业部门11终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1174,
          "2030": 1109,
          "2035": 1044,
          "2040": 978,
          "2045": 913,
          "2050": 848,
          "2055": 783,
          "2060": 717
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 368,
          "2030": 347,
          "2035": 327,
          "2040": 306,
          "2045": 286,
          "2050": 265,
          "2055": 245,
          "2060": 224
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 366,
          "2030": 382,
          "2035": 399,
          "2040": 379,
          "2045": 359,
          "2050": 339,
          "2055": 319,
          "2060": 299
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 619,
          "2030": 670,
          "2035": 722,
          "2040": 774,
          "2045": 825,
          "2050": 877,
          "2055": 928,
          "2060": 980
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector12-fe": {
    "title": "工业部门12终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 773,
          "2030": 730,
          "2035": 687,
          "2040": 644,
          "2045": 601,
          "2050": 558,
          "2055": 515,
          "2060": 472
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 382,
          "2030": 361,
          "2035": 340,
          "2040": 318,
          "2045": 297,
          "2050": 276,
          "2055": 255,
          "2060": 233
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 268,
          "2030": 280,
          "2035": 292,
          "2040": 278,
          "2045": 263,
          "2050": 248,
          "2055": 234,
          "2060": 219
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 687,
          "2030": 744,
          "2035": 802,
          "2040": 859,
          "2045": 916,
          "2050": 974,
          "2055": 1031,
          "2060": 1088
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector13-fe": {
    "title": "工业部门13终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1051,
          "2030": 992,
          "2035": 934,
          "2040": 876,
          "2045": 817,
          "2050": 759,
          "2055": 700,
          "2060": 642
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 371,
          "2030": 351,
          "2035": 330,
          "2040": 309,
          "2045": 289,
          "2050": 268,
          "2055": 247,
          "2060": 227
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 277,
          "2030": 289,
          "2035": 302,
          "2040": 287,
          "2045": 272,
          "2050": 257,
          "2055": 241,
          "2060": 226
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 506,
          "2030": 548,
          "2035": 590,
          "2040": 633,
          "2045": 675,
          "2050": 717,
          "2055": 759,
          "2060": 801
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector14-fe": {
    "title": "工业部门14终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 913,
          "2030": 862,
          "2035": 812,
          "2040": 761,
          "2045": 710,
          "2050": 659,
          "2055": 609,
          "2060": 558
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 430,
          "2030": 406,
          "2035": 382,
          "2040": 358,
          "2045": 334,
          "2050": 310,
          "2055": 286,
          "2060": 262
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 342,
          "2030": 357,
          "2035": 373,
          "2040": 354,
          "2045": 335,
          "2050": 317,
          "2055": 298,
          "2060": 279
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 554,
          "2030": 600,
          "2035": 646,
          "2040": 693,
          "2045": 739,
          "2050": 785,
          "2055": 831,
          "2060": 877
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector15-fe": {
    "title": "工业部门15终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 758,
          "2030": 716,
          "2035": 674,
          "2040": 632,
          "2045": 590,
          "2050": 547,
          "2055": 505,
          "2060": 463
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 526,
          "2030": 497,
          "2035": 468,
          "2040": 438,
          "2045": 409,
          "2050": 380,
          "2055": 351,
          "2060": 321
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 231,
          "2030": 241,
          "2035": 252,
          "2040": 239,
          "2045": 226,
          "2050": 214,
          "2055": 201,
          "2060": 189
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 572,
          "2030": 620,
          "2035": 667,
          "2040": 715,
          "2045": 763,
          "2050": 810,
          "2055": 858,
          "2060": 906
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector16-fe": {
    "title": "工业部门16终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 763,
          "2030": 720,
          "2035": 678,
          "2040": 636,
          "2045": 593,
          "2050": 551,
          "2055": 508,
          "2060": 466
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 504,
          "2030": 476,
          "2035": 448,
          "2040": 420,
          "2045": 392,
          "2050": 364,
          "2055": 336,
          "2060": 308
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 264,
          "2030": 276,
          "2035": 288,
          "2040": 273,
          "2045": 259,
          "2050": 244,
          "2055": 230,
          "2060": 216
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 550,
          "2030": 596,
          "2035": 642,
          "2040": 688,
          "2045": 734,
          "2050": 780,
          "2055": 826,
          "2060": 872
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector17-fe": {
    "title": "工业部门17终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1105,
          "2030": 1043,
          "2035": 982,
          "2040": 921,
          "2045": 859,
          "2050": 798,
          "2055": 736,
          "2060": 675
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 518,
          "2030": 489,
          "2035": 460,
          "2040": 432,
          "2045": 403,
          "2050": 374,
          "2055": 345,
          "2060": 316
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 324,
          "2030": 339,
          "2035": 354,
          "2040": 336,
          "2045": 318,
          "2050": 300,
          "2055": 283,
          "2060": 265
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 589,
          "2030": 638,
          "2035": 687,
          "2040": 736,
          "2045": 785,
          "2050": 834,
          "2055": 883,
          "2060": 932
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector18-fe": {
    "title": "工业部门18终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1012,
          "2030": 956,
          "2035": 900,
          "2040": 843,
          "2045": 787,
          "2050": 731,
          "2055": 675,
          "2060": 618
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 479,
          "2030": 453,
          "2035": 426,
          "2040": 399,
          "2045": 373,
          "2050": 346,
          "2055": 319,
          "2060": 293
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 291,
          "2030": 304,
          "2035": 318,
          "2040": 302,
          "2045": 286,
          "2050": 270,
          "2055": 254,
          "2060": 238
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 608,
          "2030": 659,
          "2035": 709,
          "2040": 760,
          "2045": 811,
          "2050": 861,
          "2055": 912,
          "2060": 963
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector19-fe": {
    "title": "工业部门19终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1042,
          "2030": 984,
          "2035": 926,
          "2040": 868,
          "2045": 810,
          "2050": 752,
          "2055": 694,
          "2060": 636
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 472,
          "2030": 446,
          "2035": 420,
          "2040": 393,
          "2045": 367,
          "2050": 341,
          "2055": 315,
          "2060": 288
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 366,
          "2030": 382,
          "2035": 399,
          "2040": 379,
          "2045": 359,
          "2050": 339,
          "2055": 319,
          "2060": 299
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 705,
          "2030": 764,
          "2035": 823,
          "2040": 882,
          "2045": 940,
          "2050": 999,
          "2055": 1058,
          "2060": 1117
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector20-fe": {
    "title": "工业部门20终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1154,
          "2030": 1090,
          "2035": 1026,
          "2040": 962,
          "2045": 898,
          "2050": 833,
          "2055": 769,
          "2060": 705
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 532,
          "2030": 503,
          "2035": 473,
          "2040": 444,
          "2045": 414,
          "2050": 384,
          "2055": 355,
          "2060": 325
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 333,
          "2030": 348,
          "2035": 363,
          "2040": 345,
          "2045": 327,
          "2050": 309,
          "2055": 290,
          "2060": 272
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 668,
          "2030": 724,
          "2035": 779,
          "2040": 835,
          "2045": 891,
          "2050": 946,
          "2055": 1002,
          "2060": 1058
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector21-fe": {
    "title": "工业部门21终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1209,
          "2030": 1142,
          "2035": 1075,
          "2040": 1008,
          "2045": 940,
          "2050": 873,
          "2055": 806,
          "2060": 739
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 386,
          "2030": 364,
          "2035": 343,
          "2040": 321,
          "2045": 300,
          "2050": 278,
          "2055": 257,
          "2060": 235
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 253,
          "2030": 264,
          "2035": 276,
          "2040": 262,
          "2045": 248,
          "2050": 234,
          "2055": 220,
          "2060": 207
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 672,
          "2030": 728,
          "2035": 784,
          "2040": 840,
          "2045": 896,
          "2050": 952,
          "2055": 1008,
          "2060": 1064
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector22-fe": {
    "title": "工业部门22终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1278,
          "2030": 1207,
          "2035": 1136,
          "2040": 1065,
          "2045": 994,
          "2050": 923,
          "2055": 852,
          "2060": 781
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 383,
          "2030": 362,
          "2035": 340,
          "2040": 319,
          "2045": 298,
          "2050": 276,
          "2055": 255,
          "2060": 234
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 405,
          "2030": 424,
          "2035": 442,
          "2040": 420,
          "2045": 398,
          "2050": 376,
          "2055": 354,
          "2060": 332
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 699,
          "2030": 757,
          "2035": 816,
          "2040": 874,
          "2045": 932,
          "2050": 991,
          "2055": 1049,
          "2060": 1107
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector23-fe": {
    "title": "工业部门23终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1019,
          "2030": 963,
          "2035": 906,
          "2040": 849,
          "2045": 793,
          "2050": 736,
          "2055": 679,
          "2060": 623
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 369,
          "2030": 349,
          "2035": 328,
          "2040": 308,
          "2045": 287,
          "2050": 267,
          "2055": 246,
          "2060": 226
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 416,
          "2030": 435,
          "2035": 454,
          "2040": 432,
          "2045": 409,
          "2050": 386,
          "2055": 363,
          "2060": 341
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 523,
          "2030": 566,
          "2035": 610,
          "2040": 654,
          "2045": 697,
          "2050": 741,
          "2055": 784,
          "2060": 828
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector24-fe": {
    "title": "工业部门24终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1250,
          "2030": 1180,
          "2035": 1111,
          "2040": 1041,
          "2045": 972,
          "2050": 902,
          "2055": 833,
          "2060": 763
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 437,
          "2030": 413,
          "2035": 388,
          "2040": 364,
          "2045": 340,
          "2050": 315,
          "2055": 291,
          "2060": 267
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 228,
          "2030": 239,
          "2035": 249,
          "2040": 237,
          "2045": 224,
          "2050": 212,
          "2055": 199,
          "2060": 187
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 649,
          "2030": 703,
          "2035": 757,
          "2040": 811,
          "2045": 865,
          "2050": 919,
          "2055": 973,
          "2060": 1027
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector25-fe": {
    "title": "工业部门25终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 908,
          "2030": 857,
          "2035": 807,
          "2040": 756,
          "2045": 706,
          "2050": 655,
          "2055": 605,
          "2060": 554
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 443,
          "2030": 419,
          "2035": 394,
          "2040": 369,
          "2045": 345,
          "2050": 320,
          "2055": 295,
          "2060": 271
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 375,
          "2030": 392,
          "2035": 409,
          "2040": 388,
          "2045": 368,
          "2050": 347,
          "2055": 327,
          "2060": 306
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 592,
          "2030": 642,
          "2035": 691,
          "2040": 741,
          "2045": 790,
          "2050": 839,
          "2055": 889,
          "2060": 938
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector26-fe": {
    "title": "工业部门26终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1242,
          "2030": 1173,
          "2035": 1104,
          "2040": 1035,
          "2045": 965,
          "2050": 897,
          "2055": 828,
          "2060": 758
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 457,
          "2030": 431,
          "2035": 406,
          "2040": 381,
          "2045": 355,
          "2050": 330,
          "2055": 304,
          "2060": 279
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 281,
          "2030": 294,
          "2035": 307,
          "2040": 291,
          "2045": 276,
          "2050": 261,
          "2055": 245,
          "2060": 230
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 667,
          "2030": 722,
          "2035": 778,
          "2040": 834,
          "2045": 889,
          "2050": 945,
          "2055": 1000,
          "2060": 1056
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector27-fe": {
    "title": "工业部门27终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 842,
          "2030": 795,
          "2035": 748,
          "2040": 702,
          "2045": 655,
          "2050": 608,
          "2055": 561,
          "2060": 514
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 452,
          "2030": 427,
          "2035": 402,
          "2040": 377,
          "2045": 352,
          "2050": 326,
          "2055": 301,
          "2060": 276
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 251,
          "2030": 263,
          "2035": 274,
          "2040": 261,
          "2045": 247,
          "2050": 233,
          "2055": 219,
          "2060": 206
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 696,
          "2030": 754,
          "2035": 812,
          "2040": 870,
          "2045": 928,
          "2050": 986,
          "2055": 1044,
          "2060": 1102
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector28-fe": {
    "title": "工业部门28终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1218,
          "2030": 1150,
          "2035": 1083,
          "2040": 1015,
          "2045": 947,
          "2050": 880,
          "2055": 812,
          "2060": 744
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 524,
          "2030": 495,
          "2035": 466,
          "2040": 437,
          "2045": 408,
          "2050": 378,
          "2055": 349,
          "2060": 320
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 381,
          "2030": 399,
          "2035": 416,
          "2040": 395,
          "2045": 374,
          "2050": 353,
          "2055": 333,
          "2060": 312
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 558,
          "2030": 604,
          "2035": 651,
          "2040": 697,
          "2045": 744,
          "2050": 790,
          "2055": 837,
          "2060": 883
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector29-fe": {
    "title": "工业部门29终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1080,
          "2030": 1020,
          "2035": 960,
          "2040": 900,
          "2045": 840,
          "2050": 780,
          "2055": 720,
          "2060": 659
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 502,
          "2030": 474,
          "2035": 446,
          "2040": 418,
          "2045": 390,
          "2050": 362,
          "2055": 334,
          "2060": 306
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 244,
          "2030": 255,
          "2035": 266,
          "2040": 253,
          "2045": 239,
          "2050": 226,
          "2055": 213,
          "2060": 199
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 610,
          "2030": 661,
          "2035": 712,
          "2040": 763,
          "2045": 814,
          "2050": 865,
          "2055": 916,
          "2060": 967
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector30-fe": {
    "title": "工业部门30终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1135,
          "2030": 1072,
          "2035": 1009,
          "2040": 946,
          "2045": 883,
          "2050": 820,
          "2055": 757,
          "2060": 694
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 462,
          "2030": 436,
          "2035": 411,
          "2040": 385,
          "2045": 359,
          "2050": 334,
          "2055": 308,
          "2060": 282
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 435,
          "2030": 455,
          "2035": 475,
          "2040": 451,
          "2045": 427,
          "2050": 403,
          "2055": 380,
          "2060": 356
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 536,
          "2030": 581,
          "2035": 625,
          "2040": 670,
          "2045": 715,
          "2050": 759,
          "2055": 804,
          "2060": 849
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector31-fe": {
    "title": "工业部门31终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1316,
          "2030": 1243,
          "2035": 1170,
          "2040": 1097,
          "2045": 1024,
          "2050": 950,
          "2055": 877,
          "2060": 804
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 408,
          "2030": 385,
          "2035": 363,
          "2040": 340,
          "2045": 317,
          "2050": 295,
          "2055": 272,
          "2060": 249
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 414,
          "2030": 433,
          "2035": 452,
          "2040": 429,
          "2045": 407,
          "2050": 384,
          "2055": 361,
          "2060": 339
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 556,
          "2030": 603,
          "2035": 649,
          "2040": 696,
          "2045": 742,
          "2050": 788,
          "2055": 835,
          "2060": 881
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector32-fe": {
    "title": "工业部门32终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1167,
          "2030": 1102,
          "2035": 1037,
          "2040": 972,
          "2045": 907,
          "2050": 843,
          "2055": 778,
          "2060": 713
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 528,
          "2030": 498,
          "2035": 469,
          "2040": 440,
          "2045": 410,
          "2050": 381,
          "2055": 352,
          "2060": 322
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 339,
          "2030": 355,
          "2035": 370,
          "2040": 352,
          "2045": 333,
          "2050": 315,
          "2055": 296,
          "2060": 278
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 507,
          "2030": 549,
          "2035": 592,
          "2040": 634,
          "2045": 676,
          "2050": 719,
          "2055": 761,
          "2060": 803
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector33-fe": {
    "title": "工业部门33终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 815,
          "2030": 770,
          "2035": 724,
          "2040": 679,
          "2045": 634,
          "2050": 588,
          "2055": 543,
          "2060": 498
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 405,
          "2030": 383,
          "2035": 360,
          "2040": 338,
          "2045": 315,
          "2050": 293,
          "2055": 270,
          "2060": 248
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 420,
          "2030": 439,
          "2035": 458,
          "2040": 435,
          "2045": 412,
          "2050": 389,
          "2055": 366,
          "2060": 343
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 600,
          "2030": 650,
          "2035": 700,
          "2040": 750,
          "2045": 800,
          "2050": 850,
          "2055": 900,
          "2060": 950
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector34-fe": {
    "title": "工业部门34终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1033,
          "2030": 975,
          "2035": 918,
          "2040": 861,
          "2045": 803,
          "2050": 746,
          "2055": 688,
          "2060": 631
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 498,
          "2030": 470,
          "2035": 443,
          "2040": 415,
          "2045": 387,
          "2050": 360,
          "2055": 332,
          "2060": 304
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 282,
          "2030": 295,
          "2035": 308,
          "2040": 292,
          "2045": 277,
          "2050": 262,
          "2055": 246,
          "2060": 231
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 712,
          "2030": 772,
          "2035": 831,
          "2040": 891,
          "2045": 950,
          "2050": 1009,
          "2055": 1069,
          "2060": 1128
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector35-fe": {
    "title": "工业部门35终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 753,
          "2030": 711,
          "2035": 669,
          "2040": 627,
          "2045": 585,
          "2050": 544,
          "2055": 502,
          "2060": 460
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 486,
          "2030": 459,
          "2035": 432,
          "2040": 405,
          "2045": 378,
          "2050": 351,
          "2055": 324,
          "2060": 296
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 341,
          "2030": 356,
          "2035": 372,
          "2040": 353,
          "2045": 334,
          "2050": 316,
          "2055": 297,
          "2060": 279
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 711,
          "2030": 770,
          "2035": 830,
          "2040": 889,
          "2045": 948,
          "2050": 1008,
          "2055": 1067,
          "2060": 1126
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector36-fe": {
    "title": "工业部门36终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 976,
          "2030": 922,
          "2035": 868,
          "2040": 813,
          "2045": 759,
          "2050": 705,
          "2055": 651,
          "2060": 596
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 494,
          "2030": 466,
          "2035": 439,
          "2040": 411,
          "2045": 384,
          "2050": 356,
          "2055": 329,
          "2060": 301
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 258,
          "2030": 270,
          "2035": 282,
          "2040": 267,
          "2045": 253,
          "2050": 239,
          "2055": 225,
          "2060": 211
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 502,
          "2030": 544,
          "2035": 586,
          "2040": 628,
          "2045": 670,
          "2050": 712,
          "2055": 754,
          "2060": 796
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector37-fe": {
    "title": "工业部门37终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1023,
          "2030": 966,
          "2035": 909,
          "2040": 852,
          "2045": 795,
          "2050": 739,
          "2055": 682,
          "2060": 625
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 460,
          "2030": 435,
          "2035": 409,
          "2040": 384,
          "2045": 358,
          "2050": 332,
          "2055": 307,
          "2060": 281
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 290,
          "2030": 303,
          "2035": 316,
          "2040": 300,
          "2045": 285,
          "2050": 269,
          "2055": 253,
          "2060": 237
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 498,
          "2030": 539,
          "2035": 581,
          "2040": 622,
          "2045": 664,
          "2050": 705,
          "2055": 747,
          "2060": 788
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector38-fe": {
    "title": "工业部门38终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 867,
          "2030": 819,
          "2035": 771,
          "2040": 723,
          "2045": 674,
          "2050": 626,
          "2055": 578,
          "2060": 530
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 527,
          "2030": 498,
          "2035": 468,
          "2040": 439,
          "2045": 410,
          "2050": 380,
          "2055": 351,
          "2060": 322
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 386,
          "2030": 403,
          "2035": 421,
          "2040": 400,
          "2045": 379,
          "2050": 358,
          "2055": 336,
          "2060": 315
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 531,
          "2030": 575,
          "2035": 620,
          "2040": 664,
          "2045": 708,
          "2050": 753,
          "2055": 797,
          "2060": 841
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector39-fe": {
    "title": "工业部门39终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 982,
          "2030": 928,
          "2035": 873,
          "2040": 819,
          "2045": 764,
          "2050": 709,
          "2055": 655,
          "2060": 600
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 435,
          "2030": 411,
          "2035": 387,
          "2040": 363,
          "2045": 338,
          "2050": 314,
          "2055": 290,
          "2060": 266
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 372,
          "2030": 389,
          "2035": 406,
          "2040": 386,
          "2045": 366,
          "2050": 345,
          "2055": 325,
          "2060": 305
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 625,
          "2030": 677,
          "2035": 729,
          "2040": 781,
          "2045": 833,
          "2050": 885,
          "2055": 937,
          "2060": 989
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector40-fe": {
    "title": "工业部门40终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 1073,
          "2030": 1014,
          "2035": 954,
          "2040": 894,
          "2045": 835,
          "2050": 775,
          "2055": 715,
          "2060": 656
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 529,
          "2030": 499,
          "2035": 470,
          "2040": 441,
          "2045": 411,
          "2050": 382,
          "2055": 352,
          "2060": 323
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 414,
          "2030": 433,
          "2035": 452,
          "2040": 429,
          "2045": 407,
          "2050": 384,
          "2055": 361,
          "2060": 339
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 663,
          "2030": 718,
          "2035": 774,
          "2040": 829,
          "2045": 884,
          "2050": 940,
          "2055": 995,
          "2060": 1050
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector41-fe": {
    "title": "工业部门41终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 748,
          "2030": 707,
          "2035": 665,
          "2040": 624,
          "2045": 582,
          "2050": 540,
          "2055": 499,
          "2060": 457
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 469,
          "2030": 443,
          "2035": 417,
          "2040": 391,
          "2045": 365,
          "2050": 339,
          "2055": 313,
          "2060": 287
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 255,
          "2030": 266,
          "2035": 278,
          "2040": 264,
          "2045": 250,
          "2050": 236,
          "2055": 222,
          "2060": 208
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 498,
          "2030": 539,
          "2035": 581,
          "2040": 622,
          "2045": 664,
          "2050": 705,
          "2055": 747,
          "2060": 788
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector42-fe": {
    "title": "建筑业终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 141,
          "2030": 133,
          "2035": 125,
          "2040": 117,
          "2045": 109,
          "2050": 102,
          "2055": 94,
          "2060": 86
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 147,
          "2030": 139,
          "2035": 131,
          "2040": 123,
          "2045": 114,
          "2050": 106,
          "2055": 98,
          "2060": 90
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 105,
          "2030": 110,
          "2035": 115,
          "2040": 109,
          "2045": 103,
          "2050": 97,
          "2055": 92,
          "2060": 86
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 262,
          "2030": 284,
          "2035": 306,
          "2040": 328,
          "2045": 350,
          "2050": 372,
          "2055": 394,
          "2060": 416
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector43-fe": {
    "title": "交通运输终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 51,
          "2030": 48,
          "2035": 45,
          "2040": 42,
          "2045": 39,
          "2050": 37,
          "2055": 34,
          "2060": 31
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 386,
          "2030": 364,
          "2035": 343,
          "2040": 321,
          "2045": 300,
          "2050": 278,
          "2055": 257,
          "2060": 235
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 68,
          "2030": 71,
          "2035": 74,
          "2040": 70,
          "2045": 66,
          "2050": 63,
          "2055": 59,
          "2060": 55
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 190,
          "2030": 206,
          "2035": 222,
          "2040": 238,
          "2045": 254,
          "2050": 270,
          "2055": 286,
          "2060": 302
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 10,
          "2035": 15,
          "2040": 20,
          "2045": 25,
          "2050": 30,
          "2055": 35,
          "2060": 40
        }
      }
    ]
  },
  "sector44-fe": {
    "title": "服务业终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 58,
          "2030": 55,
          "2035": 52,
          "2040": 48,
          "2045": 45,
          "2050": 42,
          "2055": 39,
          "2060": 35
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 150,
          "2030": 141,
          "2035": 133,
          "2040": 125,
          "2045": 116,
          "2050": 108,
          "2055": 100,
          "2060": 91
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 146,
          "2030": 152,
          "2035": 159,
          "2040": 151,
          "2045": 143,
          "2050": 135,
          "2055": 127,
          "2060": 119
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 289,
          "2030": 313,
          "2035": 337,
          "2040": 361,
          "2045": 385,
          "2050": 409,
          "2055": 433,
          "2060": 457
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector45-fe": {
    "title": "服务业终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 59,
          "2030": 56,
          "2035": 52,
          "2040": 49,
          "2045": 46,
          "2050": 42,
          "2055": 39,
          "2060": 36
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 149,
          "2030": 141,
          "2035": 132,
          "2040": 124,
          "2045": 116,
          "2050": 107,
          "2055": 99,
          "2060": 91
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 140,
          "2030": 147,
          "2035": 153,
          "2040": 145,
          "2045": 138,
          "2050": 130,
          "2055": 122,
          "2060": 115
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 355,
          "2030": 384,
          "2035": 414,
          "2040": 444,
          "2045": 473,
          "2050": 503,
          "2055": 532,
          "2060": 562
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector46-fe": {
    "title": "居民生活终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 120,
          "2030": 113,
          "2035": 107,
          "2040": 100,
          "2045": 93,
          "2050": 87,
          "2055": 80,
          "2060": 73
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 144,
          "2030": 136,
          "2035": 128,
          "2040": 120,
          "2045": 112,
          "2050": 104,
          "2055": 96,
          "2060": 87
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 181,
          "2030": 189,
          "2035": 198,
          "2040": 188,
          "2045": 178,
          "2050": 168,
          "2055": 158,
          "2060": 148
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 327,
          "2030": 354,
          "2035": 382,
          "2040": 409,
          "2045": 436,
          "2050": 464,
          "2055": 491,
          "2060": 518
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
  },
  "sector47-fe": {
    "title": "居民生活终端用能需求",
    "defaultChartType": "stacked",
    "data": [
      {
        "indicator": "煤炭",
        "unit": "万吨标煤",
        "values": {
          "2025": 126,
          "2030": 119,
          "2035": 112,
          "2040": 105,
          "2045": 98,
          "2050": 91,
          "2055": 84,
          "2060": 77
        }
      },
      {
        "indicator": "石油",
        "unit": "万吨标煤",
        "values": {
          "2025": 127,
          "2030": 120,
          "2035": 113,
          "2040": 106,
          "2045": 99,
          "2050": 92,
          "2055": 85,
          "2060": 78
        }
      },
      {
        "indicator": "天然气",
        "unit": "万吨标煤",
        "values": {
          "2025": 165,
          "2030": 172,
          "2035": 180,
          "2040": 171,
          "2045": 162,
          "2050": 153,
          "2055": 144,
          "2060": 135
        }
      },
      {
        "indicator": "电力",
        "unit": "万吨标煤",
        "values": {
          "2025": 346,
          "2030": 375,
          "2035": 404,
          "2040": 433,
          "2045": 462,
          "2050": 491,
          "2055": 520,
          "2060": 549
        }
      },
      {
        "indicator": "氢能",
        "unit": "万吨标煤",
        "values": {
          "2025": 0,
          "2030": 5,
          "2035": 8,
          "2040": 11,
          "2045": 14,
          "2050": 17,
          "2055": 20,
          "2060": 23
        }
      }
    ]
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
                            <strong>全国尺度分析</strong>：聚焦中国整体能源系统，基于47个行业的详细划分，结合国家资源禀赋、能源需求和基础设施特点，提供宏观层面的系统性洞察。
                          </li>
                          <li>
                            <strong>直观数据交互</strong>：通过清晰的树状目录结构和可编辑的数据表格，便捷地浏览和修改覆盖社会经济指标、分行业能源需求、能源转换技术及资源潜力的详细数据集。
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
                            <strong>基础驱动：关键假设模块</strong>：设定模型运行的基础条件，涵盖宏观社会经济预测（人口、GDP、产业结构）以及关键技术参数（如行业能源强度、电气化水平、氢能渗透率等）。
                          </li>
                          <li>
                            <strong>能源消费：需求模块</strong>：精细刻画全国47个行业的能源消费活动，区分不同燃料类型（煤、油、气、电、氢等）的需求，提供高度细化的能源消费结构分析。
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
                            <strong>灵活扩展设计</strong>：模型框架具有良好的可扩展性，便于未来根据需要纳入新的能源技术或扩展到区域分析，适应不断发展的能源研究需求。
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
                            <strong>步骤 1: 定义分析范围</strong>：首先，在页面顶部下拉菜单中选择您想研究的"情景"（如 CN60 碳中和）。这将设定您后续分析的宏观背景。
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
                            <strong>步骤 6: 查看综合结果</strong>：完成数据审阅和调整后，切换到"结果"视图。这里汇总了模型计算的核心输出，如能源供应总量与结构、发电装机容量、分行业的 CO2 排放等。
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
