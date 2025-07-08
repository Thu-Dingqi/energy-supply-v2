"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { NavigationItem, ContentSection } from "./energy-platform"
import { ScrollArea } from "@/components/ui/scroll-area"
import EditableDataTable from "./editable-data-table"
import SimpleChart from "./simple-chart"

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
}

export default function ResultPanel({
  activeNav,
  selectedNode,
  selectedScenario,
  selectedProvince,
}: ResultPanelProps) {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie" | "stacked">("line")
  const [tableData, setTableData] = useState<DataRow[]>([])
  const [nodeTitle, setNodeTitle] = useState<string>("")
  const [currentNode, setCurrentNode] = useState<string | null>(null)

  // 结果数据年份
  const years = ["2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"]

  // 结果数据集
  const resultDataSets: Record<
    string,
    {
      title: string
      data: DataRow[]
      defaultChartType?: "line" | "bar" | "pie" | "stacked"
    }
  > = {
    // 能源供应相关结果
    "power-generation-mix": {
      title: "发电结构",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤",
          unit: "亿千瓦时",
          values: {
            "2025": 2400,
            "2030": 2000,
            "2035": 1700,
            "2040": 1400,
            "2045": 1100,
            "2050": 800,
            "2055": 500,
            "2060": 200,
          },
        },
        {
          indicator: "煤CCS",
          unit: "亿千瓦时",
          values: {
            "2025": 0,
            "2030": 100,
            "2035": 200,
            "2040": 300,
            "2045": 200,
            "2050": 100,
            "2055": 50,
            "2060": 0,
          },
        },
        {
          indicator: "油",
          unit: "亿千瓦时",
          values: {
            "2025": 1910,
            "2030": 1705,
            "2035": 1500,
            "2040": 1295,
            "2045": 1090,
            "2050": 885,
            "2055": 680,
            "2060": 475,
          },
        },
        {
          indicator: "气",
          unit: "亿千瓦时",
          values: {
            "2025": 800,
            "2030": 950,
            "2035": 1100,
            "2040": 1250,
            "2045": 1100,
            "2050": 950,
            "2055": 800,
            "2060": 650,
          },
        },
        {
          indicator: "核电",
          unit: "亿千瓦时",
          values: {
            "2025": 400,
            "2030": 600,
            "2035": 800,
            "2040": 1000,
            "2045": 1200,
            "2050": 1400,
            "2055": 1600,
            "2060": 1800,
          },
        },
        {
          indicator: "水电",
          unit: "亿千瓦时",
          values: {
            "2025": 800,
            "2030": 850,
            "2035": 900,
            "2040": 950,
            "2045": 1000,
            "2050": 1050,
            "2055": 1100,
            "2060": 1150,
          },
        },
        {
          indicator: "风电",
          unit: "亿千瓦时",
          values: {
            "2025": 600,
            "2030": 900,
            "2035": 1200,
            "2040": 1500,
            "2045": 1800,
            "2050": 2100,
            "2055": 2400,
            "2060": 2700,
          },
        },
        {
          indicator: "太阳能",
          unit: "亿千瓦时",
          values: {
            "2025": 400,
            "2030": 700,
            "2035": 1000,
            "2040": 1300,
            "2045": 1600,
            "2050": 1900,
            "2055": 2200,
            "2060": 2500,
          },
        },
      ],
    },
    "installed-power-capacity": {
      title: "电力装机",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤",
          unit: "GW",
          values: {
            "2025": 1000,
            "2030": 900,
            "2035": 800,
            "2040": 700,
            "2045": 600,
            "2050": 500,
            "2055": 400,
            "2060": 300,
          },
        },
        {
          indicator: "煤CCS",
          unit: "GW",
          values: {
            "2025": 0,
            "2030": 20,
            "2035": 40,
            "2040": 60,
            "2045": 80,
            "2050": 100,
            "2055": 100,
            "2060": 100,
          },
        },
        {
          indicator: "油",
          unit: "GW",
          values: {
            "2025": 30,
            "2030": 25,
            "2035": 20,
            "2040": 15,
            "2045": 10,
            "2050": 5,
            "2055": 0,
            "2060": 0,
          },
        },
        {
          indicator: "油CCS",
          unit: "GW",
          values: {
            "2025": 0,
            "2030": 5,
            "2035": 10,
            "2040": 15,
            "2045": 10,
            "2050": 5,
            "2055": 0,
            "2060": 0,
          },
        },
        {
          indicator: "气",
          unit: "GW",
          values: {
            "2025": 130,
            "2030": 140,
            "2035": 150,
            "2040": 160,
            "2045": 150,
            "2050": 140,
            "2055": 130,
            "2060": 110,
          },
        },
        {
          indicator: "气CCS",
          unit: "GW",
          values: {
            "2025": 0,
            "2030": 20,
            "2035": 40,
            "2040": 60,
            "2045": 50,
            "2050": 40,
            "2055": 30,
            "2060": 10,
          },
        },
        {
          indicator: "核电",
          unit: "GW",
          values: {
            "2025": 70,
            "2030": 100,
            "2035": 130,
            "2040": 160,
            "2045": 190,
            "2050": 220,
            "2055": 250,
            "2060": 280,
          },
        },
        {
          indicator: "地热",
          unit: "GW",
          values: {
            "2025": 2,
            "2030": 5,
            "2035": 8,
            "2040": 12,
            "2045": 15,
            "2050": 18,
            "2055": 22,
            "2060": 25,
          },
        },
        {
          indicator: "生物质-煤",
          unit: "GW",
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
          indicator: "生物质-煤CCS",
          unit: "GW",
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
        {
          indicator: "生物质",
          unit: "GW",
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
          indicator: "生物质CCS",
          unit: "GW",
          values: {
            "2025": 0,
            "2030": 5,
            "2035": 10,
            "2040": 15,
            "2045": 25,
            "2050": 35,
            "2055": 45,
            "2060": 55,
          },
        },
        {
          indicator: "水电",
          unit: "GW",
          values: {
            "2025": 380,
            "2030": 400,
            "2035": 420,
            "2040": 440,
            "2045": 460,
            "2050": 480,
            "2055": 490,
            "2060": 500,
          },
        },
        {
          indicator: "海洋能",
          unit: "GW",
          values: {
            "2025": 0,
            "2030": 2,
            "2035": 5,
            "2040": 8,
            "2045": 12,
            "2050": 15,
            "2055": 18,
            "2060": 22,
          },
        },
        {
          indicator: "风能",
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
        },
        {
          indicator: "太阳能",
          unit: "GW",
          values: {
            "2025": 400,
            "2030": 650,
            "2035": 900,
            "2040": 1150,
            "2045": 1400,
            "2050": 1650,
            "2055": 1900,
            "2060": 2150,
          },
        },
      ],
    },
    "new-installed-capacity": {
      title: "新增电力装机",
      defaultChartType: "bar",
      data: [
        {
          indicator: "煤电",
          unit: "GW",
          values: {
            "2025": 20,
            "2030": 10,
            "2035": 5,
            "2040": 0,
            "2045": 0,
            "2050": 0,
            "2055": 0,
            "2060": 0,
          },
        },
        {
          indicator: "气电",
          unit: "GW",
          values: {
            "2025": 20,
            "2030": 30,
            "2035": 30,
            "2040": 30,
            "2045": 0,
            "2050": 0,
            "2055": 0,
            "2060": 0,
          },
        },
        {
          indicator: "核电",
          unit: "GW",
          values: {
            "2025": 10,
            "2030": 30,
            "2035": 30,
            "2040": 30,
            "2045": 30,
            "2050": 30,
            "2055": 30,
            "2060": 30,
          },
        },
        {
          indicator: "水电",
          unit: "GW",
          values: {
            "2025": 10,
            "2030": 20,
            "2035": 20,
            "2040": 20,
            "2045": 20,
            "2050": 20,
            "2055": 10,
            "2060": 10,
          },
        },
        {
          indicator: "风电",
          unit: "GW",
          values: {
            "2025": 50,
            "2030": 150,
            "2035": 150,
            "2040": 150,
            "2045": 150,
            "2050": 150,
            "2055": 150,
            "2060": 150,
          },
        },
        {
          indicator: "太阳能",
          unit: "GW",
          values: {
            "2025": 100,
            "2030": 250,
            "2035": 250,
            "2040": 250,
            "2045": 250,
            "2050": 250,
            "2055": 250,
            "2060": 250,
          },
        },
        {
          indicator: "生物质能",
          unit: "GW",
          values: {
            "2025": 10,
            "2030": 20,
            "2035": 20,
            "2040": 20,
            "2045": 20,
            "2050": 20,
            "2055": 20,
            "2060": 20,
          },
        },
      ],
    },
    "hydrogen-supply": {
      title: "氢能供应",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤制气",
          unit: "万吨",
          values: {
            "2025": 100,
            "2030": 150,
            "2035": 200,
            "2040": 250,
            "2045": 200,
            "2050": 150,
            "2055": 100,
            "2060": 50,
          },
        },
        {
          indicator: "气制氢",
          unit: "万吨",
          values: {
            "2025": 50,
            "2030": 70,
            "2035": 90,
            "2040": 110,
            "2045": 90,
            "2050": 70,
            "2055": 50,
            "2060": 30,
          },
        },
        {
          indicator: "电解水制氢",
          unit: "万吨",
          values: {
            "2025": 10,
            "2030": 50,
            "2035": 90,
            "2040": 130,
            "2045": 180,
            "2050": 230,
            "2055": 280,
            "2060": 330,
          },
        },
        {
          indicator: "生物质制氢",
          unit: "万吨",
          values: {
            "2025": 5,
            "2030": 15,
            "2035": 25,
            "2040": 35,
            "2045": 45,
            "2050": 55,
            "2055": 65,
            "2060": 75,
          },
        },
      ],
    },
    "primary-energy-supply": {
      title: "一次能源供应", 
      defaultChartType: "stacked",
      data: [
        {
          indicator: "煤",
          unit: "万吨标煤",
          values: {
            "2025": 3900,
            "2030": 3400,
            "2035": 2900,
            "2040": 2400,
            "2045": 1900,
            "2050": 1400,
            "2055": 900,
            "2060": 400,
          },
        },
        {
          indicator: "煤CCS",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 100,
            "2035": 200,
            "2040": 300,
            "2045": 200,
            "2050": 100,
            "2055": 50,
            "2060": 0,
          },
        },
        {
          indicator: "油",
          unit: "万吨标煤",
          values: {
            "2025": 2500,
            "2030": 2300,
            "2035": 2100,
            "2040": 1900,
            "2045": 1700,
            "2050": 1500,
            "2055": 1300,
            "2060": 1100,
          },
        },
        {
          indicator: "油CCS",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 50,
            "2035": 100,
            "2040": 150,
            "2045": 100,
            "2050": 50,
            "2055": 25,
            "2060": 0,
          },
        },
        {
          indicator: "气",
          unit: "万吨标煤",
          values: {
            "2025": 1200,
            "2030": 1300,
            "2035": 1400,
            "2040": 1500,
            "2045": 1400,
            "2050": 1300,
            "2055": 1200,
            "2060": 1100,
          },
        },
        {
          indicator: "气CCS",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 50,
            "2035": 100,
            "2040": 150,
            "2045": 100,
            "2050": 50,
            "2055": 25,
            "2060": 0,
          },
        },
        {
          indicator: "核能",
          unit: "万吨标煤",
          values: {
            "2025": 400,
            "2030": 600,
            "2035": 800,
            "2040": 1000,
            "2045": 1200,
            "2050": 1400,
            "2055": 1600,
            "2060": 1800,
          },
        },
        {
          indicator: "地热能",
          unit: "万吨标煤",
          values: {
            "2025": 20,
            "2030": 30,
            "2035": 40,
            "2040": 50,
            "2045": 60,
            "2050": 70,
            "2055": 80,
            "2060": 90,
          },
        },
        {
          indicator: "生物质",
          unit: "万吨标煤",
          values: {
            "2025": 120,
            "2030": 160,
            "2035": 200,
            "2040": 240,
            "2045": 280,
            "2050": 320,
            "2055": 360,
            "2060": 400,
          },
        },
        {
          indicator: "生物质CCS",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 40,
            "2035": 80,
            "2040": 120,
            "2045": 160,
            "2050": 200,
            "2055": 240,
            "2060": 280,
          },
        },
        {
          indicator: "水能",
          unit: "万吨标煤",
          values: {
            "2025": 800,
            "2030": 850,
            "2035": 900,
            "2040": 950,
            "2045": 1000,
            "2050": 1050,
            "2055": 1100,
            "2060": 1150,
          },
        },
        {
          indicator: "海洋能",
          unit: "万吨标煤",
          values: {
            "2025": 0,
            "2030": 10,
            "2035": 20,
            "2040": 30,
            "2045": 40,
            "2050": 50,
            "2055": 60,
            "2060": 70,
          },
        },
        {
          indicator: "风能",
          unit: "万吨标煤",
          values: {
            "2025": 600,
            "2030": 900,
            "2035": 1200,
            "2040": 1500,
            "2045": 1800,
            "2050": 2100,
            "2055": 2400,
            "2060": 2700,
          },
        },
        {
          indicator: "太阳能",
          unit: "万吨标煤",
          values: {
            "2025": 400,
            "2030": 700,
            "2035": 1000,
            "2040": 1300,
            "2045": 1600,
            "2050": 1900,
            "2055": 2200,
            "2060": 2500,
          },
        },
      ],
    },
    "net-electricity-export": {
      title: "净调出电量",
      defaultChartType: "line",
      data: [
        {
          indicator: "净调出电量",
          unit: "亿千瓦时",
          values: {
            "2025": 100,
            "2030": 150,
            "2035": 200,
            "2040": 250,
            "2045": 300,
            "2050": 350,
            "2055": 400,
            "2060": 450,
          },
        },
      ],
    },

    // 二氧化碳排放相关结果
    "emissions-supply": {
      title: "供应排放",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "发电部门",
          unit: "Mt CO₂",
          values: {
            "2025": 450,
            "2030": 350,
            "2035": 250,
            "2040": 150,
            "2045": 100,
            "2050": 50,
            "2055": 0,
            "2060": -50, // 负值表示BECCS等负排放技术
          }
        },
        {
          indicator: "炼油部门",
          unit: "Mt CO₂",
          values: {
            "2025": 150,
            "2030": 130,
            "2035": 110,
            "2040": 90,
            "2045": 70,
            "2050": 50,
            "2055": 30,
            "2060": 10,
          }
        },
        {
          indicator: "炼焦部门",
          unit: "Mt CO₂",
          values: {
            "2025": 200,
            "2030": 180,
            "2035": 160,
            "2040": 140,
            "2045": 120,
            "2050": 100,
            "2055": 80,
            "2060": 60,
          }
        }
      ]
    },
    "emissions-end-use": {
      title: "终端排放",
      defaultChartType: "stacked",
      data: [
        {
          indicator: "工业部门",
          unit: "Mt CO₂",
          values: {
            "2025": 500,
            "2030": 400,
            "2035": 300,
            "2040": 200,
            "2045": 150,
            "2050": 100,
            "2055": 50,
            "2060": 0,
          }
        },
        {
          indicator: "建筑部门",
          unit: "Mt CO₂",
          values: {
            "2025": 100,
            "2030": 90,
            "2035": 80,
            "2040": 70,
            "2045": 50,
            "2050": 30,
            "2055": 10,
            "2060": 0,
          }
        },
        {
          indicator: "交通部门",
          unit: "Mt CO₂",
          values: {
            "2025": 250,
            "2030": 230,
            "2035": 200,
            "2040": 170,
            "2045": 130,
            "2050": 90,
            "2055": 50,
            "2060": 10,
          }
        }
      ]
    },
    "emissions-total": {
      title: "总排放",
      defaultChartType: "line",
      data: [
        {
          indicator: "总排放量",
          unit: "Mt CO₂",
          values: {
            "2025": 1650,
            "2030": 1380,
            "2035": 1100,
            "2040": 820,
            "2045": 620,
            "2050": 420,
            "2055": 220,
            "2060": 30,
          }
        }
      ]
    }
  }

  // 更新数据当选择节点变化时
  useEffect(() => {
    if (selectedNode && selectedNode !== currentNode) {
      if (resultDataSets[selectedNode]) {
        setTableData(resultDataSets[selectedNode].data)
        setNodeTitle(resultDataSets[selectedNode].title)
        
        if (resultDataSets[selectedNode].defaultChartType) {
          setChartType(resultDataSets[selectedNode].defaultChartType)
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

  // 数据更新处理函数
  const handleDataChange = (newData: DataRow[]) => {
    setTableData(newData)
    
    // 可以在这里添加保存到本地或后端的逻辑
    if (currentNode && resultDataSets[currentNode]) {
      // 保存更新后的数据
      resultDataSets[currentNode].data = newData
      
      // 这里可以添加数据持久化的逻辑，例如:
      // saveResultData(selectedScenario, selectedProvince, currentNode, newData)
    }
  }

  // 在组件内部添加省份映射函数
  const getProvinceLabel = (provinceCode: string): string => {
    const provinceMap: Record<string, string> = {
      beijing: "北京",
      tianjin: "天津", 
      hebei: "河北",
      shanxi: "山西",
      neimenggu: "内蒙古",
      liaoning: "辽宁",
      jilin: "吉林",
      heilongjiang: "黑龙江",
      shanghai: "上海",
      jiangsu: "江苏",
      zhejiang: "浙江",
      anhui: "安徽",
      fujian: "福建",
      jiangxi: "江西",
      shandong: "山东",
      henan: "河南",
      hubei: "湖北",
      hunan: "湖南",
      guangdong: "广东",
      guangxi: "广西",
      hainan: "海南",
      chongqing: "重庆",
      sichuan: "四川",
      guizhou: "贵州",
      yunnan: "云南",
      shaanxi: "陕西",
      gansu: "甘肃",
      qinghai: "青海",
      ningxia: "宁夏",
      xinjiang: "新疆"
    };
    
    return provinceMap[provinceCode] || provinceCode;
  };

  return (
    <div className="w-[65%] border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">结果展示</h3>
          {nodeTitle && <div className="text-sm text-muted-foreground">当前选择: {nodeTitle}</div>}
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          展示 {getProvinceLabel(selectedProvince)} 在 {selectedScenario === "cn60" ? "CN60碳中和" : selectedScenario} 情景下的结果。
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {selectedNode === "demand-by-sector-fuel" ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            请在左侧选择具体的部门以查看分燃料用能需求数据
          </div>
        ) : selectedNode && tableData.length > 0 ? (
          <>
            {/* 数据表格部分 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">{nodeTitle}数据</h4>
                <div className="text-sm text-muted-foreground">点击单元格可编辑数值</div>
              </div>
              <EditableDataTable data={tableData} years={years} onDataChange={handleDataChange} />
            </div>

            {/* 图表部分 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">图表展示</h4>
                <div className="flex gap-2">
                  <Button
                    variant={chartType === "line" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("line")}
                  >折线图</Button>
                  <Button
                    variant={chartType === "bar" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >柱状图</Button>
                  <Button
                    variant={chartType === "pie" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("pie")}
                  >饼图</Button>
                  <Button
                    variant={chartType === "stacked" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setChartType("stacked")}
                  >堆叠图</Button>
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
            请在左侧选择一个结果节点以查看数据
          </div>
        )}
      </div>
    </div>
  )
}

