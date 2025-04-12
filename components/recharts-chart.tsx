"use client"

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"

interface DataRow {
  indicator: string;
  unit: string;
  values: { [year: string]: string | number };
}

interface RechartsChartProps {
  type: "line" | "bar" | "pie" | "stacked";
  data: DataRow[];
  title: string;
}

export default function RechartsChart({ type, data, title }: RechartsChartProps) {
  // 添加数据验证和转换
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    
    // 获取所有年份
    const years = Object.keys(data[0].values).sort();
    
    // 转换数据格式
    return years.map(year => {
      const entry: any = { name: year };
      data.forEach(row => {
        const value = parseFloat(row.values[year].toString());
        entry[row.indicator] = isNaN(value) ? 0 : value;
      });
      return entry;
    });
  }, [data]);

  // 添加调试日志
  console.log("Transformed chart data:", chartData);

  // 基础图表配置
  const chartProps = {
    width: "100%",
    height: "100%",
    data: chartData,
    margin: { top: 20, right: 30, left: 20, bottom: 10 }
  };

  // 确保有数据才渲染
  if (!chartData.length) {
    return <div>No data available</div>;
  }

  // 折线图示例
  if (type === "line") {
    return (
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.map((row, index) => (
              <Line
                key={row.indicator}
                type="monotone"
                dataKey={row.indicator}
                stroke={`hsl(${index * 60}, 70%, 50%)`}
                dot={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 柱状图
  if (type === "bar") {
    return (
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.map((row, index) => (
              <Bar
                key={row.indicator}
                dataKey={row.indicator}
                fill={`hsl(${index * 60}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 其他图表类型的处理...
  return null;
}
