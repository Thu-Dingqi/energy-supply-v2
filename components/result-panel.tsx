"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { NavigationItem } from "./energy-platform"
import { ScrollArea } from "@/components/ui/scroll-area"
import EditableDataTable from "./editable-data-table"
import SimpleChart from "./simple-chart"
import emissionsData from "@/data/excel/json/emissions.json"
import elcMixData from "@/data/excel/json/elc_mix.json"
import capData from "@/data/excel/json/cap.json"
import newCapData from "@/data/excel/json/newcap.json"
import peData from "@/data/excel/json/pe.json"
import h2nData from "@/data/excel/json/h2n.json"
import elcTransData from "@/data/excel/json/elc_trans.json"

interface DataRow {
  indicator: string
  unit: string
  values: { [year: string]: string | number }
}

interface ResultPanelProps {
  activeNav: NavigationItem
  selectedNode: string | null
  selectedScenario: string
  selectedProvince: string
  isModelComplete: boolean
}

// 映射UI中的省份代码到JSON文件中的省份代码
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

const years = ["2020", "2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"];
// Special years array for emissions data (without 2020)
const emissionsYears = ["2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"];
// Special years array for hydrogen and new capacity data (without 2020)
const from2025Years = ["2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"];

// 1-2. 修正单位映射
const unitMap: Record<string, string> = {
  "亿吨 CO₂": "亿吨", // 改为"亿吨"
  "亿千瓦时": "TWh",
  "吉瓦": "GW",
  "万吨标准煤": "万吨标煤",
  "万吨": "万吨"
};

// Helper function to create a data row with formatted values (2 decimal places)
const createDataRow = (indicator: string, unit: string, values: any): DataRow => {
  // Format values to 2 decimal places if they are numbers
  const formattedValues: { [year: string]: string | number } = {};
  if (values) {
    Object.entries(values).forEach(([year, value]) => {
      if (typeof value === 'number') {
        formattedValues[year] = Number(value.toFixed(2));
      } else if (value !== undefined && value !== null) {
        // Handle non-numeric values safely
        // Make sure we don't add empty objects as values
        if (typeof value === 'object' && Object.keys(value).length === 0) {
          formattedValues[year] = "";
        } else {
          formattedValues[year] = String(value);
        }
      }
    });
  }
  
  // Map Chinese units to English units
  const englishUnit = unitMap[unit] || unit;
  
  return {
    indicator,
    unit: englishUnit,
    values: formattedValues
  };
};

// Indicator mappings
const elcMixIndicatorMap: Record<string, string> = {
  coal: "煤",
  "coal ccs": "煤CCS",
  oil: "油",
  gas: "气",
  "gas ccs": "气CCS",
  nuclear: "核电",
  hydro: "水电",
  biomass: "生物质",
  "biomass ccs": "生物质CCS",
  "co-firing beccs": "生物质与煤混烧 (BECCS)",
  wind: "风电",
  pv: "太阳能"
};

const capIndicatorMap = elcMixIndicatorMap;
const newCapIndicatorMap = elcMixIndicatorMap;

const peIndicatorMap: Record<string, string> = {
  Coal: "煤炭",
  Oil: "石油",
  Gas: "天然气",
  Nuclear: "核能",
  Hydro: "水电",
  Biomass: "生物质",
  Wind: "风电",
  PV: "太阳能"
};

const h2nIndicatorMap: Record<string, string> = {
  ELC: "电解水制氢",
  solar: "太阳能制氢",
  onshore: "陆上风电制氢",
  offshore: "海上风电制氢"
};

// Data processing functions
const getElcMixData = (provinceData: any) => {
  if (!provinceData) return [];
  return Object.entries(elcMixIndicatorMap).map(([key, indicator]) =>
    createDataRow(indicator, "亿千瓦时", provinceData[key])
  ).filter(row => Object.keys(row.values).length > 0 && Object.values(row.values).some(v => v !== 0));
};

const getCapData = (provinceData: any) => {
  if (!provinceData) return [];
  return Object.entries(capIndicatorMap).map(([key, indicator]) =>
    createDataRow(indicator, "吉瓦", provinceData[key])
  ).filter(row => Object.keys(row.values).length > 0 && Object.values(row.values).some(v => v !== 0));
};

const getNewCapData = (provinceData: any) => {
  if (!provinceData) return [];
  // 过滤数据，只保留2025年及以后的数据
  const filteredData: Record<string, any> = {};
  Object.entries(provinceData).forEach(([key, values]) => {
    if (values && typeof values === 'object') {
      filteredData[key] = Object.fromEntries(
        Object.entries(values as Record<string, any>).filter(([year]) => parseInt(year) >= 2025)
      );
    }
  });
  
  return Object.entries(newCapIndicatorMap).map(([key, indicator]) =>
    createDataRow(indicator, "吉瓦", filteredData[key])
  ).filter(row => Object.keys(row.values).length > 0 && Object.values(row.values).some(v => v !== 0));
};

const getPeData = (provinceData: any) => {
  if (!provinceData) return [];
  const combinedData: Record<string, any> = {};

  for (const type of ["Coal", "Oil", "Gas", "Biomass"]) {
    combinedData[type] = {};
    for (const year of years) {
      combinedData[type][year] = (provinceData[type]?.[year] || 0) + (provinceData[`${type} CCS`]?.[year] || 0);
    }
  }

  const dataRows = Object.entries(peIndicatorMap).map(([key, indicator]) => {
      let values = {};
      if (combinedData[key]) {
          values = combinedData[key];
      } else if (provinceData[key]) {
          values = provinceData[key];
      }
      return createDataRow(indicator, "万吨标准煤", values);
  });

  return dataRows.filter(row => Object.keys(row.values).length > 0 && Object.values(row.values).some(v => v !== 0));
};

const getH2nData = (provinceData: any) => {
  if (!provinceData) return [];
  // 过滤数据，只保留2025年及以后的数据
  const filteredData: Record<string, any> = {};
  Object.entries(provinceData).forEach(([key, values]) => {
    if (values && typeof values === 'object') {
      filteredData[key] = Object.fromEntries(
        Object.entries(values as Record<string, any>).filter(([year]) => parseInt(year) >= 2025)
      );
    }
  });
  
  return Object.entries(h2nIndicatorMap).map(([key, indicator]) =>
    createDataRow(indicator, "万吨", filteredData[key])
  ).filter(row => Object.keys(row.values).length > 0 && Object.values(row.values).some(v => v !== 0));
};

const getElcTransData = (provinceData: any) => {
  if (!provinceData) return [];
  return [createDataRow("净调入电量", "亿千瓦时", provinceData["ELC_TRA"])];
};

// 移除 getEmissionsData 函数，将逻辑直接内联到 useEffect 中
export default function ResultPanel({
  activeNav,
  selectedNode,
  selectedScenario,
  selectedProvince,
  isModelComplete,
}: ResultPanelProps) {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie" | "stacked">("line")
  const [tableData, setTableData] = useState<DataRow[]>([])
  const [nodeTitle, setNodeTitle] = useState<string>("")
  const [currentNode, setCurrentNode] = useState<string | null>(null)
  const [resultDataSets, setResultDataSets] = useState<Record<string, any>>({});
  // Track which years array to use based on the selected node
  const [currentYears, setCurrentYears] = useState<string[]>(years);

  useEffect(() => {
    const provinceCode = provinceCodeMap[selectedProvince] || "BEIJ";

    // 格式化排放数据并移除2020年
    const emissionsResult = (emissionsData as any)[provinceCode] || {};
    const filteredSupply = Object.fromEntries(Object.entries(emissionsResult.SUPPLY || {}).filter(([year]) => parseInt(year) >= 2025));
    const filteredFE = Object.fromEntries(Object.entries(emissionsResult.FE || {}).filter(([year]) => parseInt(year) >= 2025));
    const filteredTotal = Object.fromEntries(Object.entries(emissionsResult.TOTAL || {}).filter(([year]) => parseInt(year) >= 2025));

    const newResultDataSets = {
        "emissions-supply": {
          title: "供应排放",
          defaultChartType: "line",
          data: [createDataRow("供应排放量", "亿吨 CO₂", filteredSupply)]
        },
        "emissions-end-use": {
          title: "终端排放",
          defaultChartType: "line",
          data: [createDataRow("终端排放量", "亿吨 CO₂", filteredFE)]
        },
        "emissions-total": {
          title: "总排放",
          defaultChartType: "line",
          data: [createDataRow("总排放量", "亿吨 CO₂", filteredTotal)]
        },
        "power-generation-mix": {
          title: "发电结构",
          defaultChartType: "line",
          data: getElcMixData((elcMixData as any)[provinceCode])
    },
    "installed-power-capacity": {
      title: "电力装机",
          defaultChartType: "line",
          data: getCapData((capData as any)[provinceCode])
        },
        "new-power-capacity": {
      title: "新增电力装机",
          defaultChartType: "line",
          data: getNewCapData((newCapData as any)[provinceCode])
        },
        "primary-energy-supply": {
          title: "一次能源供应",
          defaultChartType: "line",
          data: getPeData((peData as any)[provinceCode])
    },
    "hydrogen-supply": {
      title: "氢能供应",
          defaultChartType: "line",
          data: getH2nData((h2nData as any)[provinceCode])
        },
        "net-power-export": {
      title: "净调入电量",
      defaultChartType: "line",
          data: getElcTransData((elcTransData as any)[provinceCode])
        }
    };
    setResultDataSets(newResultDataSets);
  }, [selectedProvince]);


  useEffect(() => {
    if (selectedNode && resultDataSets[selectedNode]) {
      const { title, data, defaultChartType } = resultDataSets[selectedNode]
      setNodeTitle(title)
      setTableData(data)
      setChartType(defaultChartType || "line")
      setCurrentNode(selectedNode)
      
      // Set appropriate years array based on the selected node
      if (selectedNode.startsWith('emissions-')) {
        setCurrentYears(emissionsYears);
      } else if (selectedNode === 'hydrogen-supply' || selectedNode === 'new-power-capacity') {
        setCurrentYears(from2025Years);
      } else {
        setCurrentYears(years);
      }
    } else if (activeNav === 'results') {
      // Since NavigationItem doesn't have children, we need a different approach
      // for selecting the first node based on activeNav
      const resultsNodes = Object.keys(resultDataSets);
      const firstNode = resultsNodes.length > 0 ? resultsNodes[0] : null;
      
      if (firstNode && resultDataSets[firstNode]) {
        const { title, data, defaultChartType } = resultDataSets[firstNode]
        setNodeTitle(title)
        setTableData(data)
        setChartType(defaultChartType || "line")
        setCurrentNode(firstNode)
        
        // Set appropriate years array based on the first node
        if (firstNode.startsWith('emissions-')) {
          setCurrentYears(emissionsYears);
        } else if (firstNode === 'hydrogen-supply' || firstNode === 'new-power-capacity') {
          setCurrentYears(from2025Years);
        } else {
          setCurrentYears(years);
        }
      } else {
        setNodeTitle("")
        setTableData([])
        setCurrentYears(years);
      }
    }
  }, [selectedNode, activeNav, resultDataSets])

  const handleDataChange = (newData: DataRow[]) => {
    setTableData(newData)
    // Update the main dataset
    if (currentNode) {
      const newResultDataSets = { ...resultDataSets }
      newResultDataSets[currentNode].data = newData
      setResultDataSets(newResultDataSets)
    }
  }

  const getProvinceLabel = (provinceCode: string): string => {
    const provinceName = Object.keys(provinceCodeMap).find(key => provinceCodeMap[key] === provinceCodeMap[provinceCode]);
    return provinceName ? provinceName.charAt(0).toUpperCase() + provinceName.slice(1) : provinceCode;
  }

  const provinceName = Object.entries(provinceCodeMap).find(([name, code]) => code === provinceCodeMap[selectedProvince])?.[0] || selectedProvince

  if (!isModelComplete) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">请运行模型以展示结果</h3>
          <p className="text-sm text-muted-foreground/80">点击左侧"结果数据"按钮来运行模型。</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="h-full w-full flex flex-col">
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{nodeTitle}</h2>
          <div className="flex space-x-2">
                  <Button
              variant={chartType === "line" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("line")}
            >
              折线图
            </Button>
                  <Button
              variant={chartType === "bar" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("bar")}
            >
              柱状图
            </Button>
            <Button
              variant={chartType === "stacked" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setChartType("stacked")}
            >
              堆叠图
            </Button>
                  <Button
              variant={chartType === "pie" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("pie")}
            >
              饼图
            </Button>
                </div>
              </div>
        <div className="mb-4 h-[400px] w-full">
          <SimpleChart 
            type={chartType} 
            data={tableData} 
            title={nodeTitle} 
            unit={tableData.length > 0 ? tableData[0].unit : ""} 
          />
        </div>
        <div className="h-[300px]">
          <ScrollArea className="h-full">
            <EditableDataTable data={tableData} onDataChange={handleDataChange} years={currentYears} />
          </ScrollArea>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
           展示 {provinceName.charAt(0).toUpperCase() + provinceName.slice(1)} 在 {selectedScenario === "cn60" ? "CN60碳中和" : ""} 情景下的数据。
        </div>
                </CardContent>
              </Card>
  )
}
