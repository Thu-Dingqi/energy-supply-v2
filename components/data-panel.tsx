"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import type { NavigationItem, ContentSection } from "./energy-platform"
import { ScrollArea } from "@/components/ui/scroll-area"
import EditableDataTable from "./editable-data-table"
import SimpleChart from "./simple-chart"
import resourceData from "@/data/excel/json/resource.json"

// Define types for resource data
type YearlyValues = {
  [year: string]: number;
}

type ResourceType = {
  coal: YearlyValues;
  oil: YearlyValues;
  gas: YearlyValues;
  nuclear: YearlyValues;
  biomass: YearlyValues;
  wind: YearlyValues;
  solar: YearlyValues;
  [key: string]: YearlyValues;
}

type ResourceDataType = {
  [provinceCode: string]: ResourceType;
}

// Type assertion for resourceData
const typedResourceData = resourceData as ResourceDataType;

// Helper function to create empty data array
const getEmptyData = (): DataRow[] => {
  return [];
}

// 映射UI中的省份代码到resource.json中的省份代码
const provinceCodeMap: Record<string, string> = {
  beijing: "BEIJ",
  tianjin: "TIAN",
  hebei: "HEBE",
  shanxi: "SHNX", 
  neimenggu: "NEMO",
  liaoning: "LIAO",
  jilin: "JILI",
  heilongjiang: "HEIL",
  shanghai: "SHAN",
  jiangsu: "JINU",
  zhejiang: "ZHEJ",
  anhui: "ANHU",
  fujian: "FUJI",
  jiangxi: "JINX",
  shandong: "SHAD",
  henan: "HENA",
  hubei: "HUBE",
  hunan: "HUNA",
  guangdong: "GUAD",
  guangxi: "GUAX",
  hainan: "HAIN",
  chongqing: "CHON",
  sichuan: "SICH",
  guizhou: "GUIZ",
  yunnan: "YUNN",
  shaanxi: "SHAA",
  gansu: "GANS",
  qinghai: "QING",
  ningxia: "NINX",
  xinjiang: "XING"
};

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

  // 结果数据年份
  const years = ["2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"]

  // Function to get data from resourceData based on the selected province
  const getResourceData = (resourceType: string) => {
    // Map the resource type to the correct key in resourceData
    const resourceKey = resourceType === "natural-gas" ? "gas" : 
                        resourceType === "wind-resource" ? "wind" : 
                        resourceType === "solar-resource" ? "solar" : 
                        resourceType === "biomass-resource" ? "biomass" :
                        resourceType === "hydro-resource" ? "hydro" : // 添加 hydro 映射
                        resourceType; 
    
    const provinceCode = provinceCodeMap[selectedProvince] || "BEIJ";
    const provinceData = (typedResourceData as ResourceDataType)[provinceCode];
    
    // Check if data exists for this province and resource
    if (provinceData && provinceData[resourceKey]) {
      const resourceValues = provinceData[resourceKey];
      
      // Create a data row with the values from resourceData
      return [
        {
          indicator: "资源开发潜力上限",
          unit: resourceKey === "coal" ? "EJ" : 
                resourceKey === "oil" ? "PJ" : 
                resourceKey === "gas" ? "PJ" : 
                resourceKey === "wind" || resourceKey === "solar" ? "GW" : 
                "GW",
          values: resourceValues
        }
      ];
    }
    
    // Default fallback if data doesn't exist
    return [
      {
        indicator: "资源开发潜力上限",
        unit: "未知",
        values: {
          "2025": 0,
          "2030": 0,
          "2035": 0,
          "2040": 0,
          "2045": 0,
          "2050": 0,
          "2055": 0,
          "2060": 0,
        }
      }
    ];
  };

  // Update data when province changes
  useEffect(() => {
    if (currentNode) {
      const resourceTypes = ["coal", "oil", "natural-gas", "wind-resource", "solar-resource", "biomass-resource"];
      if (resourceTypes.includes(currentNode)) {
        setTableData(getResourceData(currentNode));
      }
    }
  }, [selectedProvince, currentNode]);

  // Power generation technology parameters
  const powerTechParameters = [
    { id: "EFF", label: "效率", unit: "%" },
    { id: "AF", label: "可用系数", unit: "%" },
    { id: "LIFETIME", label: "寿期", unit: "年" },
    { id: "NCAP_COST", label: "投资成本", unit: "美元/kW" },
    { id: "NCAP_FOM", label: "固定运维成本", unit: "美元/kW/年" },
    { id: "ACT_COST", label: "可变运维成本", unit: "美元/kWh" },
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
          unit: "美元/kW",
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
          unit: "美元/kW/年",
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
          unit: "美元/kWh",
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
            "2030": Number.parseFloat((baseEfficiency * 1.03).toFixed(1)),
            "2035": Number.parseFloat((baseEfficiency * 1.04).toFixed(1)),
            "2040": Number.parseFloat((baseEfficiency * 1.03).toFixed(1)),
            "2045": Number.parseFloat((baseEfficiency * 1.04).toFixed(1)),
            "2050": Number.parseFloat((baseEfficiency * 1.02).toFixed(1)),
            "2055": Number.parseFloat((baseEfficiency * 1.02).toFixed(1)),
            "2060": Number.parseFloat((baseEfficiency * 1.02).toFixed(1)),
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
          unit: "美元/kW",
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
          unit: "美元/kW/年",
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
          unit: "美元/kWh",
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

 
    // Resource potential data
    coal: {
      title: "煤炭",
      defaultChartType: "bar",
      data: getResourceData("coal")
    },
    oil: {
      title: "石油",
      defaultChartType: "bar",
      data: getResourceData("oil")
    },
    "natural-gas": {
      title: "天然气",
      defaultChartType: "bar",
      data: getResourceData("natural-gas")
    },
    "wind-resource": {
      title: "风能",
      data: getResourceData("wind-resource")
    },
    "solar-resource": {
      title: "太阳能",
      data: getResourceData("solar-resource")
    },
    "hydro-resource": {
      title: "水能",
      data: getResourceData("hydro-resource")
    },
    "biomass-resource": {
      title: "生物质能",
      data: getResourceData("biomass-resource")
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
      data: getEmptyData(),
      techData: generatePowerTechData("ECHPCOA", 65, 56, 40, 871, 34.9, 1.02),
    },
    EPLTCOAUSC: {
      title: "EPLTCOAUSC (超超临界煤电 - 空气冷却)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTCOAUSC", 40, 41, 40, 500, 25.2, 0.85),
    },
    HPLTCOA: {
      title: "HPLTCOA (煤基高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTCOA", 60, 52, 40, 499, 25, 0.9),
    },
    ECHPCOACCS: {
      title: "ECHPCOACCS (带CCS的煤基联合供热发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ECHPCOACCS", 45.5, 50, 40, 1364, 81.8, 3.0),
    },
    EPLTCUSCCCS: {
      title: "EPLTCUSCCCS (带CCS的超超临界煤电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTCUSCCCS", 33.26, 60, 30, 1062, 63.7, 3.0),
    },
    HPLTCOACCS: {
      title: "HPLTCOACCS (带CCS的煤基高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTCOACCS", 55, 50, 30, 799, 48, 2.5),
    },
    ECHPNGA: {
      title: "ECHPNGA (天然气联合供热发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ECHPNGA", 69, 58, 30, 883, 31.3, 1.0),
    },
    EPLTNGANGCC: {
      title: "EPLTNGANGCC (天然气联合循环发电 - 空气冷却)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTNGANGCC", 33, 55, 25, 559, 22.4, 1.0),
    },
    HPLTGAS: {
      title: "HPLTGAS (燃气高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTGAS", 79, 31, 20, 461, 23, 1.1),
    },
    ECHPNGACCS: {
      title: "ECHPNGACCS (带CCS的天然气联合供热发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ECHPNGACCS", 52, 58, 25, 1108, 66.5, 2.5),
    },
    EPLTNGACCS: {
      title: "EPLTNGACCS (带CCS的天然气联合循环发电 - 空气冷却)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTNGACCS", 44.27, 58, 30, 921, 55.2, 2.5),
    },
    HPLTGASCCS: {
      title: "HPLTGASCCS (带CCS的燃气高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTGASCCS", 75, 50, 20, 692, 41.5, 2.0),
    },
    EPLTNUC: {
      title: "EPLTNUC (核电 - 一次性冷却)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTNUC", 33, 85, 40, 1995, 199.5, 4.0),
    },
    EPLTHYDL: {
      title: "EPLTHYDL (大型水电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTHYDL", 50, 45, 60, 1066, 42.6, 2.0),
    },
    EPLTWINONS: {
      title: "EPLTWINONS (陆上风电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTWINONS", 70, 20, 20, 1095, 32.8, 1.0),
    },
    EPLTWINOFS: {
      title: "EPLTWINOFS (海上风电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTWINOFS", 70, 20, 25, 1980, 79.2, 1.0),
    },
    EPLTSOLPV: {
      title: "EPLTSOLPV (太阳能光伏)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTSOLPV", 40, 20, 25, 754, 22.6, 1.0),
    },
    ECHPBSL: {
      title: "ECHPBSL (固体生物质燃烧联合供热发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ECHPBSL", 35, 40, 20, 1748, 69.9, 6.0),
    },
    HPLTBSL: {
      title: "HPLTBSL (固体生物质高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTBSL", 60, 57, 20, 571, 28.6, 3.0),
    },
    EPLTBIOSLDC: {
      title: "EPLTBIOSLDC (固体生物质混烧发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTBIOSLDC", 38, 51.78, 30, 1350, 55.0, 6.0),
    },
    ECHPBIOBSLDCCS: {
      title: "ECHPBIOBSLDCCS (带CCS的固体生物质燃烧联合供热发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ECHPBIOBSLDCCS", 30, 50, 20, 2128, 85.1, 8.0),
    },
    EPLTBSLDCCS: {
      title: "EPLTBSLDCCS (固体生物质直接燃烧带CCS发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTBSLDCCS", 30, 56.47, 25, 2128, 145.0, 16.0),
    },
    EPLTCBECCS: {
      title: "EPLTCBECCS20-100 (固体生物质与煤混烧BECCS，比例20%-100%)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTCBECCS", 33.4, 56.47, 25, 1182, 118.2, 10.0),
    },
    HPLTBSLCCS: {
      title: "HPLTBSLCCS (带CCS的固体生物质高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTBSLCCS", 35, 57, 20, 913, 45.7, 7.5),
    },
    ECHPOIL: {
      title: "ECHPOIL (油基联合供热发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ECHPOIL", 69, 56.47, 30, 803, 32.1, 1.2),
    },
    EPLTOILST: {
      title: "EPLTOILST (油蒸汽轮机发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("EPLTOILST", 33, 50, 30, 673, 25.9, 0.85),
    },
    HPLTOIL: {
      title: "HPLTOIL (油基高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTOIL", 75, 52, 20, 499, 25.0, 1.0),
    },
    HPLTOILCCS: {
      title: "HPLTOILCCS (带CCS的油基高温发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTOILCCS", 70, 52, 20, 799, 40.0, 2.0),
    },
    HPLTGEO: {
      title: "HPLTGEO (地热发电)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HPLTGEO", 10, 92, 20, 1427, 71.4, 2.0),
    },

    // Hydrogen production technologies
    ALK: {
      title: "ALK (碱性电解水制氢)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ALK", 65, 85, 20, 800, 40.0, 1.5),
    },
    SOEC: {
      title: "SOEC (固体氧化物电解水制氢)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("SOEC", 75, 80, 15, 1200, 60.0, 2.0),
    },
    AEM: {
      title: "AEM (阴离子交换膜制氢)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("AEM", 70, 82, 18, 900, 45.0, 1.8),
    },
    PEM: {
      title: "PEM (质子交换膜电解水制氢)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("PEM", 68, 88, 20, 1000, 50.0, 1.9),
    },

    // Oil refining technologies
    ATM: {
      title: "ATM (常压蒸馏)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("ATM", 60, 92, 30, 600, 30.0, 1.0),
    },
    FCC: {
      title: "FCC (流化催化裂化)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("FCC", 45, 90, 25, 800, 40.0, 1.2),
    },
    HYD: {
      title: "HYD (加氢裂化)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HYD", 56, 88, 28, 900, 45.0, 1.5),
    },

    // Coking technologies
    CONV: {
      title: "CONV (常规焦炉炼焦)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("CONV", 60, 85, 30, 700, 35.0, 1.4),
    },
    HR: {
      title: "HR (热回收焦炉炼焦)",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData("HR", 55, 88, 25, 850, 42.5, 1.6),
    },

    // 添加能源化工技术的数据
    CTL: {
      title: "煤制油",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generateChemicalTechData(
        "CTL",
        45,    // 转化效率
        85,    // 可用系数
        30,    // 寿期
        1200,  // 投资成本
        60.0,  // 固定运维成本
        2.0    // 可变运维成本
      ),
    },
    CTH: {
      title: "煤制气",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generateChemicalTechData(
        "CTH",
        50,    // 转化效率
        88,    // 可用系数
        30,    // 寿期
        1000,  // 投资成本
        50.0,  // 固定运维成本
        1.8    // 可变运维成本
      ),
    },
    "oil-refining": {
      title: "炼油",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generateChemicalTechData(
        "oil-refining",
        42,    // 转化效率
        90,    // 可用系数
        35,    // 寿期
        800,   // 投资成本
        40.0,  // 固定运维成本
        1.5    // 可变运维成本
      ),
    },
    coking: {
      title: "炼焦",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generateChemicalTechData(
        "coking",
        48,    // 转化效率
        85,    // 可用系数
        30,    // 寿期
        700,   // 投资成本
        35.0,  // 固定运维成本
        1.4    // 可变运维成本
      ),
    },

    // ... existing code ...

    // 电力技术
    "coal-power": {
      title: "煤电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "coal-power",
        42,    // 发电效率
        85,    // 可用系数
        30,    // 寿期
        500,   // 投资成本
        25.0,  // 固定运维成本
        0.85   // 可变运维成本
      ),
    },
    "gas-power": {
      title: "气电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "gas-power",
        55,    // 发电效率
        85,    // 可用系数
        25,    // 寿期
        559,   // 投资成本
        22.4,  // 固定运维成本
        1.0    // 可变运维成本
      ),
    },
    "nuclear-power": {
      title: "核电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "nuclear-power",
        33,    // 发电效率
        90,    // 可用系数
        60,    // 寿期
        1995,  // 投资成本
        199.5, // 固定运维成本
        4.0    // 可变运维成本
      ),
    },
    "wind-power": {
      title: "风电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "wind-power",
        100,   // 发电效率
        28,    // 可用系数
        25,    // 寿期
        1095,  // 投资成本
        32.8,  // 固定运维成本
        1.0    // 可变运维成本
      ),
    },
    "solar-power": {
      title: "光伏",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "solar-power",
        100,   // 发电效率
        18,    // 可用系数
        25,    // 寿期
        754,   // 投资成本
        22.6,  // 固定运维成本
        1.0    // 可变运维成本
      ),
    },
    "biomass-power": {
      title: "生物质发电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "biomass-power",
        35,    // 发电效率
        80,    // 可用系数
        25,    // 寿期
        1748,  // 投资成本
        69.9,  // 固定运维成本
        6.0    // 可变运维成本
      ),
    },
    "hydro-power": {
      title: "水电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "hydro-power",
        100,   // 发电效率
        45,    // 可用系数
        60,    // 寿期
        1066,  // 投资成本
        42.6,  // 固定运维成本
        2.0    // 可变运维成本
      ),
    },
    "geothermal-power": {
      title: "地热发电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "geothermal-power",
        100,   // 发电效率
        80,    // 可用系数
        30,    // 寿期
        1427,  // 投资成本
        71.4,  // 固定运维成本
        2.0    // 可变运维成本
      ),
    },
    "ocean-power": {
      title: "海洋能发电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "ocean-power",
        100,   // 发电效率
        40,    // 可用系数
        25,    // 寿期
        1500,  // 投资成本
        75.0,  // 固定运维成本
        2.5    // 可变运维成本
      ),
    },
    "hydrogen-power": {
      title: "氢能发电",
      isEnergyTech: true,
      data: getEmptyData(),
      techData: generatePowerTechData(
        "hydrogen-power",
        60,    // 发电效率
        85,    // 可用系数
        20,    // 寿期
        900,   // 投资成本
        45.0,  // 固定运维成本
        1.8    // 可变运维成本
      ),
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
    <Card className="h-full w-full flex flex-col">
      {selectedNode ? (
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{nodeTitle}</h3>
            <div className="text-sm text-muted-foreground">当前选择: {nodeTitle}</div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">展示 {selectedProvince === "beijing" ? "北京" : selectedProvince === "tianjin" ? "天津" : selectedProvince === "hebei" ? "河北" : selectedProvince === "shanxi" ? "山西" : selectedProvince === "neimenggu" ? "内蒙古" : selectedProvince === "liaoning" ? "辽宁" : selectedProvince === "jilin" ? "吉林" : selectedProvince === "heilongjiang" ? "黑龙江" : selectedProvince === "shanghai" ? "上海" : selectedProvince === "jiangsu" ? "江苏" : selectedProvince === "zhejiang" ? "浙江" : selectedProvince === "anhui" ? "安徽" : selectedProvince === "fujian" ? "福建" : selectedProvince === "jiangxi" ? "江西" : selectedProvince === "shandong" ? "山东" : selectedProvince === "henan" ? "河南" : selectedProvince === "hubei" ? "湖北" : selectedProvince === "hunan" ? "湖南" : selectedProvince === "guangdong" ? "广东" : selectedProvince === "guangxi" ? "广西" : selectedProvince === "hainan" ? "海南" : selectedProvince === "chongqing" ? "重庆" : selectedProvince === "sichuan" ? "四川" : selectedProvince === "guizhou" ? "贵州" : selectedProvince === "yunnan" ? "云南" : selectedProvince === "shaanxi" ? "陕西" : selectedProvince === "gansu" ? "甘肃" : selectedProvince === "qinghai" ? "青海" : selectedProvince === "ningxia" ? "宁夏" : selectedProvince === "xinjiang" ? "新疆" : ""} 在 {selectedScenario === "cn60" ? "CN60碳中和" : ""} 情景下的数据。</div>
          <div className="flex-1">
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
          </div>
        </CardContent>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          请在左侧选择一个节点以查看数据
        </div>
      )}
    </Card>
  )
}
