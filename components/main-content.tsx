"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { NavigationItem, ContentSection } from "./energy-platform"
import TreeView from "./tree-view"

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

interface MainContentProps {
  activeNav: NavigationItem
  activeSection: ContentSection
  setActiveSection: (section: ContentSection) => void
  selectedScenario: string
  setSelectedScenario: (scenario: string) => void
  selectedProvince: string
  setSelectedProvince: (province: string) => void
  selectedNode: string | null
  onNodeSelect: (nodeId: string) => void
}

export default function MainContent({
  activeNav,
  activeSection,
  setActiveSection,
  selectedScenario,
  setSelectedScenario,
  selectedProvince,
  setSelectedProvince,
  selectedNode,
  onNodeSelect,
}: MainContentProps) {
  // Define tree structures for each section
  const keyAssumptionsTree: TreeNode[] = [
    {
      id: "macro",
      label: "社会经济参数",
      children: [
        { id: "population", label: "人口" },
        { id: "gdp", label: "GDP" },
        { id: "industry-structure", label: "三产结构" },
      ],
    },
    {
      id: "sector-parameters",
      label: "部门参数",
      children: [
        { id: "agriculture", label: "农业" },
        { id: "industry", label: "工业" },
        { id: "construction", label: "建筑业" },
        { id: "transportation", label: "交通运输" },
        { id: "service", label: "服务业" },
        { id: "residential", label: "居民生活" },
      ],
    },
  ]

  const demandTree: TreeNode[] = [
    {
      id: "agriculture-demand",
      label: "农业",
      children: [{ id: "agriculture-energy", label: "终端用能需求" }],
    },
    {
      id: "industry-demand",
      label: "工业",
      children: [{ id: "industry-energy", label: "终端用能需求" }],
    },
    {
      id: "construction-demand",
      label: "建筑业",
      children: [{ id: "construction-energy", label: "终端用能需求" }],
    },
    {
      id: "transportation-demand",
      label: "交通运输",
      children: [{ id: "transportation-energy", label: "终端用能需求" }],
    },
    {
      id: "service-demand",
      label: "服务业",
      children: [{ id: "service-energy", label: "终端用能需求" }],
    },
    {
      id: "residential-demand",
      label: "居民生活",
      children: [{ id: "residential-energy", label: "终端用能需求" }],
    },
  ]

  const transformationTree: TreeNode[] = [
    {
      id: "power-generation",
      label: "发电技术",
      children: [
        {
          id: "coal-power",
          label: "煤电",
          children: [
            {
              id: "coal-no-ccs",
              label: "无CCS",
              children: [
                { id: "ECHPCOA", label: "煤基热电联产" },
                { id: "EPLTCOAUSC", label: "超超临界燃煤发电" },
                { id: "HPLTCOA", label: "煤基高温发电" },
              ],
            },
            {
              id: "coal-with-ccs",
              label: "带CCS",
              children: [
                { id: "ECHPCOACCS", label: "煤基热电联产 (带CCS)" },
                { id: "EPLTCUSCCCS", label: "超超临界燃煤发电 (带CCS)" },
                { id: "HPLTCOACCS", label: "煤基高温发电 (带CCS)" },
              ],
            },
          ],
        },
        {
          id: "gas-power",
          label: "气电",
          children: [
            {
              id: "gas-no-ccs",
              label: "无CCS",
              children: [
                { id: "ECHPNGA", label: "燃气热电联产" },
                { id: "EPLTNGANGCC", label: "燃气联合循环 (NGCC)" },
                { id: "HPLTGAS", label: "燃气高温发电" },
              ],
            },
            {
              id: "gas-with-ccs",
              label: "带CCS",
              children: [
                { id: "ECHPNGACCS", label: "燃气热电联产 (带CCS)" },
                { id: "EPLTNGACCS", label: "燃气联合循环 (NGCC) (带CCS)" },
                { id: "HPLTGASCCS", label: "燃气高温发电 (带CCS)" },
              ],
            },
          ],
        },
        {
          id: "nuclear",
          label: "核能",
          children: [{ id: "EPLTNUC", label: "核电" }],
        },
        {
          id: "hydro",
          label: "水电",
          children: [{ id: "EPLTHYDL", label: "大型水电" }],
        },
        {
          id: "transformation-wind",
          label: "风电",
          children: [
            { id: "EPLTWINONS", label: "陆上风电" },
            { id: "EPLTWINOFS", label: "海上风电" }
          ],
        },
        {
          id: "transformation-solar",
          label: "太阳能",
          children: [{ id: "EPLTSOLPV", label: "太阳能光伏" }],
        },
        {
          id: "biomass",
          label: "生物质能",
          children: [
            {
              id: "biomass-direct",
              label: "直接燃烧",
              children: [
                { id: "ECHPBSL", label: "生物质热电联产" },
                { id: "HPLTBSL", label: "生物质高温发电" },
              ],
            },
            {
              id: "biomass-mixed",
              label: "混烧",
              children: [{ id: "EPLTBIOSLDC", label: "生物质混烧发电" }],
            },
            {
              id: "biomass-ccs",
              label: "带CCS/BECCS",
              children: [
                { id: "ECHPBIOBSLDCCS", label: "生物质热电联产 (带CCS/BECCS)" },
                { id: "EPLTBSLDCCS", label: "生物质直燃发电 (带CCS/BECCS)" },
                { id: "EPLTCBECCS", label: "生物质与煤混烧 (BECCS)" },
                { id: "HPLTBSLCCS", label: "生物质高温发电 (带CCS/BECCS)" },
              ],
            },
          ],
        },
        {
          id: "oil-power",
          label: "油电",
          children: [
            {
              id: "oil-no-ccs",
              label: "无CCS",
              children: [
                { id: "ECHPOIL", label: "燃油热电联产" },
                { id: "EPLTOILST", label: "燃油蒸汽轮机发电" },
                { id: "HPLTOIL", label: "燃油高温发电" },
              ],
            },
            {
              id: "oil-with-ccs",
              label: "带CCS",
              children: [{ id: "HPLTOILCCS", label: "燃油高温发电 (带CCS)" }],
            },
          ],
        },
        {
          id: "geothermal",
          label: "地热能",
          children: [{ id: "HPLTGEO", label: "地热发电" }],
        },
      ],
    },
    {
      id: "hydrogen-production",
      label: "制氢技术",
      children: [
        { id: "ALK", label: "碱性电解 (ALK)" },
        { id: "SOEC", label: "固体氧化物电解 (SOEC)" },
        { id: "AEM", label: "阴离子交换膜 (AEM)" },
        { id: "PEM", label: "质子交换膜电解 (PEM)" },
      ],
    },
    {
      id: "energy-chemical",
      label: "能源化工",
      children: [
        { id: "CTL", label: "煤制油" },
        { id: "CTH", label: "煤制氢" },
        { id: "oil-refining", label: "炼油技术" },
        { id: "coking", label: "炼焦技术" }
      ],
    },
  ]

  const resourcesTree: TreeNode[] = [
    {
      id: "fossil",
      label: "传统化石能源",
      children: [
        { id: "coal", label: "煤炭" },
        { id: "oil", label: "石油" }, 
        { id: "natural-gas", label: "天然气" }
      ]
    },
    {
      id: "renewable", 
      label: "可再生能源",
      children: [
        { id: "wind-resource", label: "风能" },
        { id: "solar-resource", label: "太阳能" },
        { id: "hydro-resource", label: "水能" },
        { id: "biomass-resource", label: "生物质能" }
      ]
    }
  ]

  const resultsTree: TreeNode[] = [
    {
      id: "final-energy-consumption",
      label: "终端用能需求",
      children: [
        { id: "demand-by-sector", label: "分部门" },
        { id: "demand-by-fuel", label: "分燃料" },
        {
          id: "demand-by-sector-fuel",
          label: "分部门分燃料",
          children: [
            { id: "agriculture-fuel", label: "农业" },
            { id: "industry-fuel", label: "工业" },
            { id: "construction-fuel", label: "建筑业" },
            { id: "transportation-fuel", label: "交通运输" },
            { id: "service-fuel", label: "服务业" },
            { id: "residential-fuel", label: "居民生活" },
          ]
        },
      ]
    },
    {
      id: "energy-supply",
      label: "能源供应",
      children: [
        { id: "power-generation-mix", label: "发电结构" },
        { id: "installed-power-capacity", label: "电力装机" },
        { id: "new-installed-capacity", label: "新增电力装机" },
        { id: "primary-energy-supply", label: "一次能源供应" },
        { id: "hydrogen-supply", label: "氢能供应" },
        { id: "net-electricity-export", label: "净调出电量" },
      ]
    },
    {
      id: "co2-emissions",
      label: "二氧化碳排放",
      children: [
        { id: "emissions-by-sector", label: "分部门碳排放" }
      ]
    },
  ]

  // Get the appropriate tree based on the active section
  const getActiveTree = () => {
    if (activeNav === "results") {
      return resultsTree;
    }
    
    switch (activeSection) {
      case "key-assumptions":
        return keyAssumptionsTree
      case "demand":
        return demandTree
      case "transformation":
        return transformationTree
      case "resources":
        return resourcesTree
      default:
        return []
    }
  }

  return (
    <div className="w-[25%] flex flex-col border-r border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">能源平台</h2>
            <div className="flex gap-2">
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="选择情景" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cn60">CN60碳中和</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="选择省份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beijing">北京</SelectItem>
                  <SelectItem value="tianjin">天津</SelectItem>
                  <SelectItem value="hebei">河北</SelectItem>
                  <SelectItem value="shanxi">山西</SelectItem>
                  <SelectItem value="neimenggu">内蒙古</SelectItem>
                  <SelectItem value="liaoning">辽宁</SelectItem>
                  <SelectItem value="jilin">吉林</SelectItem>
                  <SelectItem value="heilongjiang">黑龙江</SelectItem>
                  <SelectItem value="shanghai">上海</SelectItem>
                  <SelectItem value="jiangsu">江苏</SelectItem>
                  <SelectItem value="zhejiang">浙江</SelectItem>
                  <SelectItem value="anhui">安徽</SelectItem>
                  <SelectItem value="fujian">福建</SelectItem>
                  <SelectItem value="jiangxi">江西</SelectItem>
                  <SelectItem value="shandong">山东</SelectItem>
                  <SelectItem value="henan">河南</SelectItem>
                  <SelectItem value="hubei">湖北</SelectItem>
                  <SelectItem value="hunan">湖南</SelectItem>
                  <SelectItem value="guangdong">广东</SelectItem>
                  <SelectItem value="guangxi">广西</SelectItem>
                  <SelectItem value="hainan">海南</SelectItem>
                  <SelectItem value="chongqing">重庆</SelectItem>
                  <SelectItem value="sichuan">四川</SelectItem>
                  <SelectItem value="guizhou">贵州</SelectItem>
                  <SelectItem value="yunnan">云南</SelectItem>
                  <SelectItem value="shaanxi">陕西</SelectItem>
                  <SelectItem value="gansu">甘肃</SelectItem>
                  <SelectItem value="qinghai">青海</SelectItem>
                  <SelectItem value="ningxia">宁夏</SelectItem>
                  <SelectItem value="xinjiang">新疆</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeNav !== "results" ? (
            <Tabs
              value={activeSection}
              onValueChange={(value) => setActiveSection(value as ContentSection)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="key-assumptions">关键假设</TabsTrigger>
                <TabsTrigger value="demand">需求</TabsTrigger>
                <TabsTrigger value="transformation">技术</TabsTrigger>
                <TabsTrigger value="resources">资源</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : (
            <div className="p-2 text-center bg-secondary rounded-md">
              <h3 className="text-md font-medium">结果数据</h3>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <TreeView nodes={getActiveTree()} selectedNodeId={selectedNode} onNodeSelect={onNodeSelect} />
        </div>
      </ScrollArea>
    </div>
  )
}
