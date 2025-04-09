# 能源系统分析平台设计文档

## 1. 项目概述

### 1.1 项目背景
本项目旨在开发一个综合性的能源系统分析平台，用于展示和分析中国在不同情景下的能源技术发展、需求预测和转型路径。平台将为能源政策制定者、研究人员和相关从业者提供决策支持工具。

### 1.2 项目目标
- 构建直观的数据可视化界面
- 提供多维度的能源系统分析功能
- 支持多情景对比分析
- 实现灵活的数据管理和更新机制

## 2. 技术架构

### 2.1 技术栈选择
- 前端框架：React 18 + Next.js
- 状态管理：Zustand
- 类型系统：TypeScript
- UI 组件库：shadcn/ui
- 数据可视化：Canvas API + Recharts
- CSS框架：Tailwind CSS
- 包管理器：pnpm

### 2.2 项目结构
```
energy-platform/
├── components/           # 通用组件
│   ├── ui/              # 基础UI组件
│   ├── charts/          # 图表组件
│   └── data/            # 数据相关组件
├── store/               # 状态管理
├── types/              # TypeScript 类型定义
├── data/               # 数据文件
├── styles/             # 样式文件
└── public/             # 静态资源
```

## 3. 功能模块设计

### 3.1 核心功能模块
1. 导航模块（Navigation）
   - 分析视图
   - 结果展示
   - 总览页面
   - 说明文档

2. 主内容模块（MainContent）
   - 情景选择
   - 地区选择
   - 参数配置
   - 数据展示

3. 数据面板模块（DataPanel）
   - 数据编辑
   - 图表展示
   - 参数分析
   - 结果对比

4. 可视化模块（Charts）
   - 折线图
   - 柱状图
   - 饼图
   - 堆叠图
   - 面积图

### 3.2 功能分级
1. P0级（核心功能）
   - 数据可视化展示
   - 参数配置与编辑
   - 多维度分析
   - 情景对比

2. P1级（重要功能）
   - 数据导入导出
   - 图表交互
   - 数据验证
   - 实时更新

3. P2级（扩展功能）
   - 高级分析工具
   - 自定义图表
   - 数据协同
   - 版本控制

## 4. 页面设计

### 4.1 总体布局
```
+----------------+-------------------+------------------+
|                |                  |                  |
|    导航栏       |    主内容区域     |    数据面板      |
|   (1/5宽度)    |   (1/4宽度)      |   (剩余宽度)     |
|                |                  |                  |
|  Navigation    |   MainContent    |    DataPanel    |
|                |                  |                  |
|                |                  |                  |
+----------------+-------------------+------------------+
```

### 4.2 主要模块

1. 导航栏（Navigation）
   - 分析（BarChart3图标）
   - 结果（PieChart图标）
   - 总览（Home图标）
   - 说明（FileText图标）

2. 主内容区域（MainContent）
   - 顶部控制栏
     * 情景选择器（CN60碳中和等）
     * 地区选择器（北京等）
   - 标签页导航
     * 关键假设
     * 需求
     * 转换
     * 资源
   - 树形结构导航
     * 社会经济参数
     * 部门参数
     * 技术参数

3. 数据面板（DataPanel）
   - 数据表格
     * 可编辑单元格
     * 年份列
     * 指标行
   - 图表展示
     * 动态图表
     * 多种图表类型
     * 交互控制

## 5. 数据模型

### 5.1 核心数据结构

1. 基础数据行（DataRow）
   ```typescript
   interface DataRow {
     indicator: string;      // 指标名称
     unit: string;          // 单位
     values: {              // 年份对应的值
       [year: string]: string | number
     }
   }
   ```

2. 技术数据（TechnologyData）
   ```typescript
   interface TechnologyData {
     title: string;         // 技术名称
     data: DataRow[];       // 技术参数数据
     isEnergyTech: boolean; // 是否为能源技术
   }
   ```

3. 技术参数集合（TechnologiesData）
   ```typescript
   interface TechnologiesData {
     [key: string]: TechnologyData;
   }
   ```

### 5.2 具体技术参数

1. 发电技术参数
   - 煤电技术
     * 常规煤电
       - ECHPCOA（煤基热电联产）
       - EPLTCOAUSC（超超临界燃煤发电）
       - HPLTCOA（煤基超高温发电）
     * 碳捕集煤电
       - ECHPCOACCS（碳捕集煤基热电联产）
       - EPLTCUSCCCS（碳捕集超超临界燃煤发电）
       - HPLTCOACCS（碳捕集煤基超高温发电）
   
   - 天然气发电
     * 常规燃气发电
       - ECHPNGA（燃气热电联产）
       - EPLTNGANGCC（燃气联合循环发电）
       - HPLTGAS（燃气超高温发电）
     * 带CCS
       - ECHPNGACCS（带CCS的天然气联合供热发电）
       - EPLTNGACCS（带CCS的天然气联合循环发电）
       - HPLTGASCCS（带CCS的燃气高温发电）

   - 核能发电
     * EPLTNUC（核电 - 一次性冷却）

   - 水电技术
     * EPLTHYDL（大型水电）

   - 风电技术
     * EPLTWINONS（陆上风电）
     * EPLTWINOFS（海上风电）

   - 太阳能
     * EPLTSOLPV（太阳能光伏）

   - 生物质能
     * 直接燃烧
       - ECHPBSL（固体生物质燃烧联合供热发电）
       - HPLTBSL（固体生物质高温发电）
     * 混烧
       - EPLTBIOSLDC（固体生物质混烧发电）
     * 带CCS/BECCS
       - ECHPBIOBSLDCCS（带CCS的固体生物质燃烧联合供热发电）
       - EPLTBSLDCCS（固体生物质直接燃烧带CCS发电）
       - EPLTCBECCS（固体生物质与煤混烧BECCS）
       - HPLTBSLCCS（带CCS的固体生物质高温发电）

   - 油电技术
     * 无CCS
       - ECHPOIL（油基联合供热发电）
       - EPLTOILST（油蒸汽轮机发电）
       - HPLTOIL（油基高温发电）
     * 带CCS
       - HPLTOILCCS（带CCS的油基高温发电）

   - 地热发电
     * HPLTGEO（地热发电）

2. 制氢技术参数
   - 碱性电解槽
   - PEM电解槽
   - 固体氧化物电解槽

3. 炼油技术参数

4. 炼焦技术参数

### 5.3 关键假设参数

1. 社会经济参数
   - 人口
   - GDP
   - 三产结构

2. 部门参数
   - 农业
     * 终端用能需求
   - 工业
     * 终端用能需求
   - 建筑业
     * 终端用能需求
   - 交通运输
     * 终端用能需求
   - 服务业
     * 终端用能需求
   - 居民生活
     * 终端用能需求

### 5.4 技术参数指标

1. 基本指标
   ```typescript
   interface TechIndicators {
     efficiency: number;     // 效率
     lifetime: number;       // 使用寿命
     ncapCost: number;      // 投资成本
     ncapFOM: number;       // 固定运维成本
     actCost: number;       // 可变运维成本
     capacityFactor?: number; // 利用率（部分技术适用）
   }
   ```

2. 年份数据
   ```typescript
   interface YearData {
     [year: string]: {
       value: number;
       unit: string;
     }
   }
   ```

### 5.5 资源参数

1. 一次能源
   - 煤炭
   - 石油
   - 天然气
   - 核燃料
   - 可再生能源

2. 二次能源
   - 电力
   - 热力
   - 氢能
   - 成品油

### 5.6 数据管理设计

1. 情景管理
   ```typescript
   interface Scenario {
     id: string;                // 情景唯一标识
     name: string;             // 情景名称
     description: string;      // 情景描述
     baseYear: number;        // 基准年
     targetYears: number[];   // 目标年份
     createdAt: Date;         // 创建时间
     updatedAt: Date;         // 更新时间
     isTemplate: boolean;     // 是否为模板情景
   }
   ```

2. 地区数据结构
   ```typescript
   interface RegionData {
     code: string;           // 地区编码
     name: string;          // 地区名称
     type: "province" | "municipality" | "autonomous_region"; // 地区类型
     technologies: {        // 该地区的技术参数
       [techId: string]: TechnologyData;
     };
     assumptions: {        // 该地区的关键假设
       [paramId: string]: DataRow[];
     };
     resources: {         // 该地区的资源数据
       [resourceId: string]: DataRow[];
     };
   }
   ```

3. 情景数据组织
   ```typescript
   interface ScenarioData {
     scenarioId: string;
     regions: {
       [regionCode: string]: RegionData;
     };
     globalParams: {      // 全局参数
       [paramId: string]: DataRow[];
     };
     metadata: {         // 元数据
       lastModified: Date;
       version: string;
       tags: string[];
     };
   }
   ```

### 5.7 数据存储策略

1. 本地存储结构
   ```
   energy-platform/
   ├── data/
   │   ├── scenarios/                 # 情景数据
   │   │   ├── templates/            # 情景模板
   │   │   └── user/                # 用户创建的情景
   │   ├── regions/                  # 地区基础数据
   │   ├── technologies/             # 技术参数模板
   │   └── resources/               # 资源数据模板
   ```

2. 数据缓存策略
   - 活跃情景数据缓存在内存中
   - 使用 IndexedDB 存储本地数据
   - 定期同步到服务器

3. 数据版本控制
   ```typescript
   interface DataVersion {
     id: string;
     timestamp: Date;
     type: "scenario" | "template" | "region";
     changes: {
       path: string;
       oldValue: any;
       newValue: any;
     }[];
     author: string;
   }
   ```

### 5.8 数据操作接口

1. 情景管理接口
   ```typescript
   interface ScenarioManager {
     createScenario(template?: string): Promise<Scenario>;
     duplicateScenario(id: string): Promise<Scenario>;
     deleteScenario(id: string): Promise<void>;
     listScenarios(): Promise<Scenario[]>;
     getScenario(id: string): Promise<ScenarioData>;
   }
   ```

2. 数据编辑接口
   ```typescript
   interface DataEditor {
     updateTechnologyData(
       scenarioId: string,
       regionCode: string,
       techId: string,
       data: Partial<TechnologyData>
     ): Promise<void>;
     
     updateAssumption(
       scenarioId: string,
       regionCode: string,
       paramId: string,
       data: DataRow[]
     ): Promise<void>;
     
     updateResource(
       scenarioId: string,
       regionCode: string,
       resourceId: string,
       data: DataRow[]
     ): Promise<void>;
   }
   ```

3. 数据导入导出接口
   ```typescript
   interface DataPortability {
     exportScenario(id: string, format: "json" | "csv"): Promise<Blob>;
     importScenario(file: File, format: "json" | "csv"): Promise<Scenario>;
     exportRegionData(regionCode: string, format: "json" | "csv"): Promise<Blob>;
     importRegionData(regionCode: string, file: File, format: "json" | "csv"): Promise<void>;
   }
   ```

### 5.9 数据同步与冲突处理

1. 变更跟踪
   ```typescript
   interface ChangeTracker {
     type: "update" | "delete" | "create";
     path: string[];
     timestamp: Date;
     userId: string;
     value: any;
   }
   ```

2. 冲突解决策略
   - 最后写入胜出
   - 保留冲突版本
   - 手动合并选项

3. 批量操作处理
   ```typescript
   interface BatchOperation {
     operations: {
       type: "update" | "delete" | "create";
       path: string[];
       value: any;
     }[];
     validate(): Promise<boolean>;
     execute(): Promise<void>;
     rollback(): Promise<void>;
   }
   ```

## 6. 交互设计

### 6.1 数据编辑
- 单元格点击编辑
- 实时数据验证
- 即时保存更新

### 6.2 导航交互
- 树形结构展开/折叠
- 节点选择高亮
- 标签页切换

### 6.3 图表交互
- 图表类型切换
- 数据筛选
- 图例交互
- 缩放平移

### 6.4 选择器交互
- 情景选择
- 地区选择
- 年份选择
- 参数选择

## 7. 性能优化

### 7.1 渲染优化
- Canvas绘图优化
- 组件按需渲染
- 虚拟滚动

### 7.2 数据优化
- 状态管理优化
- 数据缓存
- 计算优化

## 8. 部署方案

### 8.1 开发环境
- 本地开发环境
- 测试环境
- 生产环境

### 8.2 部署流程
1. 代码构建
2. 测试验证
3. 部署发布
4. 监控维护

## 9. 项目进度规划

### 9.1 第一阶段（1-2周）
- 基础框架搭建
- 核心组件开发
- 数据模型实现

### 9.2 第二阶段（2-3周）
- 图表组件开发
- 数据编辑功能
- 交互实现

### 9.3 第三阶段（3-4周）
- 功能完善
- 性能优化
- 测试修复

### 9.4 第四阶段（4-5周）
- 部署上线
- 文档完善
- 问题修复