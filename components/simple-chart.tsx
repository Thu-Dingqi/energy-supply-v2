"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from 'echarts';

interface DataRow {
  indicator: string
  unit: string
  values: { [year: string]: string | number }
}

interface SimpleChartProps {
  type: "line" | "bar" | "pie" | "stacked"
  data: DataRow[]
  title: string
  unit: string
}

export default function SimpleChart({ type, data, title, unit }: SimpleChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<echarts.ECharts | null>(null)
  const [hasError, setHasError] = useState<string | null>(null)
  // 添加dataId状态，用于跟踪数据是否发生实质变化
  const [dataId, setDataId] = useState<string>("")

  // 添加自定义颜色方案
  const colorPalette = [
    '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f',
    '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
  ];
  
  // 生成数据的唯一标识，用于检测变化
  useEffect(() => {
    if (data && data.length > 0) {
      // 生成基于数据内容的唯一标识
      const newDataId = title + "_" + type + "_" + data.map(row => row.indicator).join("_");
      if (newDataId !== dataId) {
        setDataId(newDataId);
        
        // 如果数据实质变化，清除当前图表
        if (chart) {
          console.log("数据变化，清理图表", newDataId);
          chart.dispose();
          setChart(null);
        }
      }
    }
  }, [data, title, type]);
  
  // 初始化图表 - 分离初始化逻辑以便更清晰地处理
  useEffect(() => {
    if (!chartRef.current) return;
    
    // 清除任何现有图表
    if (chart) {
      chart.dispose();
    }
    
    try {
      // 延迟初始化以确保DOM已完全加载
      const timer = setTimeout(() => {
        if (chartRef.current) {
          console.log("初始化图表", chartRef.current.clientWidth, chartRef.current.clientHeight);
          const newChart = echarts.init(chartRef.current);
          setChart(newChart);
          
          // 添加图表响应式调整
          const handleResize = () => {
            console.log("调整图表大小");
            newChart.resize();
          };
          
          window.addEventListener('resize', handleResize);
          
          // 在组件卸载时清理
          return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            newChart.dispose();
          };
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("图表初始化错误:", error);
      setHasError(error instanceof Error ? error.message : "未知错误");
    }
  }, [chartRef.current, dataId]); // 添加dataId作为依赖项，确保数据变化时重新初始化
  
  // 更新图表数据和配置
  useEffect(() => {
    if (!chart || !data || data.length === 0) return;
    
    try {
      // 获取年份
      const years = Object.keys(data[0]?.values || {}).sort();
      if (years.length === 0) return;
      
      console.log("更新图表数据", {
        type,
        dataLength: data.length,
        years,
        title,
        dataId // 打印dataId以便调试
      });
      
      // 准备数据系列
      let series: any[] = [];
      
      if (type === 'pie') {
        // 饼图特殊处理
        const pieYear = years[years.length - 1]; // 默认使用最后一年数据
        const pieData = data.map(row => {
          const value = row.values[pieYear];
          return {
            name: row.indicator,
            value: typeof value === 'number' 
              ? Number(value.toFixed(2)) 
              : typeof value === 'string'
                ? Number(parseFloat(value).toFixed(2))
                : 0
          };
        });
        
        series = [{
          name: title,
          type: 'pie' as const,
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData
        }];
      } else {
        // 线图、柱状图和堆叠图处理
        series = data.map(row => {
          // 提取每个指标对应的数据点
          const seriesData = years.map(year => {
            const value = row.values[year];
            return typeof value === 'number' ? Number(value.toFixed(2)) : 
                   typeof value === 'string' ? Number(parseFloat(value).toFixed(2)) : 0;
          });
          
          if (type === 'line') {
            return {
              name: row.indicator,
              type: 'line' as const,
              data: seriesData,
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                width: 3
              },
              emphasis: {
                itemStyle: {
                  borderWidth: 2
                }
              }
            };
          } else if (type === 'bar') {
            return {
              name: row.indicator,
              type: 'bar' as const,
              data: seriesData,
              barMaxWidth: 50,
              itemStyle: {
                borderRadius: [3, 3, 0, 0]
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
              }
            };
          } else {
            return {
              name: row.indicator,
              type: 'bar' as const,
              stack: 'total',
              data: seriesData,
              barMaxWidth: 50,
              label: {
                show: false
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
              }
            };
          }
        });
      }
      
      // 配置图表选项
      const option = {
        title: {
          text: type === 'pie' ? `${title} (${years[years.length - 1]}年)` : title,
          subtext: `单位: ${unit}`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#666'
          },
          top: 10,
          padding: [0, 0, 20, 0]
        },
        tooltip: {
          trigger: type === 'pie' ? 'item' : 'axis',
          formatter: type === 'pie' ? '{a} <br/>{b}: {c} ({d}%)' : undefined,
          axisPointer: type === 'pie' ? undefined : {
            type: 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          itemGap: 15,
          textStyle: {
            fontSize: 12
          },
          type: 'scroll'
        },
        grid: type === 'pie' ? undefined : {
          top: 80,
          left: '3%',
          right: '4%',
          bottom: 80,
          containLabel: true
        },
        xAxis: type === 'pie' ? undefined : {
          type: 'category',
          data: years,
          axisLabel: {
            fontSize: 13
          }
        },
        yAxis: type === 'pie' ? undefined : {
          type: 'value',
          name: unit,
          nameTextStyle: {
            fontSize: 13,
            padding: [0, 0, 0, 30]
          },
          axisLabel: {
            fontSize: 12
          }
        },
        color: colorPalette,
        series: series
      };
      
      console.log("设置图表选项");
      chart.setOption(option);
      
      // 强制更新一次大小以确保正确渲染
      setTimeout(() => {
        chart.resize();
      }, 200);
      
    } catch (error) {
      console.error("图表数据更新错误:", error);
      setHasError(error instanceof Error ? error.message : "未知错误");
    }
  }, [chart, data, title, type, unit, dataId]); // 添加dataId作为依赖项
  
  // 显示错误信息
  if (hasError) {
    return (
      <div className="flex items-center justify-center h-[350px] bg-red-50 rounded-lg border border-red-200 p-4">
        <div className="text-center text-red-500">
          <p className="font-semibold">图表加载失败</p>
          <p className="text-sm">{hasError}</p>
        </div>
      </div>
    );
  }
  
  // 增加一个吸引人的容器样式，确保有明确的高度
  return (
    <div className="chart-container p-4 bg-white rounded-lg border border-gray-100 shadow-sm h-full">
      <div ref={chartRef} style={{ width: '100%', height: '350px', minHeight: '350px' }} />
    </div>
  );
}
