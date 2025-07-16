"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DataRow {
  indicator: string
  unit: string
  values: { [year: string]: string | number }
}

interface EditableDataTableProps {
  data: DataRow[]
  years: string[]
  onDataChange: (newData: DataRow[]) => void
}

export default function EditableDataTable({ data, years, onDataChange }: EditableDataTableProps) {
  const [editableData, setEditableData] = useState<DataRow[]>(data)
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; year: string } | null>(null)

  useEffect(() => {
    setEditableData(data)
  }, [data])

  const handleCellValueChange = (rowIndex: number, year: string, value: string) => {
    // Only allow numbers and decimals
    if (!/^-?\d*\.?\d*$/.test(value) && value !== "") return

    const newData = [...editableData]
    newData[rowIndex].values[year] = value
    setEditableData(newData)
    onDataChange(newData)
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  // 优化数字格式化，确保所有数字都能在有限空间内显示
  const formatDisplayValue = (value: string | number): string => {
    if (value === undefined || value === null || value === "") return "-";
    
    if (typeof value === 'number') {
      // 非常大的数字：使用K, M, G等缩写单位
      if (Math.abs(value) >= 1000000000) {
        return (value / 1000000000).toFixed(1) + 'G';
      } else if (Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      } else if (Math.abs(value) < 0.01 && value !== 0) {
        // 非常小的数字使用科学计数法
        return value.toExponential(1);
      } else {
        // 普通数字保留1位小数
        return value.toFixed(1);
      }
    }
    
    // 字符串类型值如果过长则截断
    const strValue = String(value);
    if (strValue.length > 8) {
      return strValue.substring(0, 7) + '…';
    }
    return strValue;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-slate-100">
            <th className="w-[110px] px-2 py-1 text-left text-sm font-medium border-r">指标</th>
            <th className="w-[70px] px-2 py-1 text-left text-sm font-medium border-r">单位</th>
            {years.map((year) => (
              <th key={year} className="w-[62px] px-1 py-1 text-center text-sm font-medium border-r">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t hover:bg-slate-50">
              <td className="w-[110px] px-2 py-1 text-sm border-r font-medium truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate block">{row.indicator}</span>
                    </TooltipTrigger>
                    <TooltipContent>{row.indicator}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
              <td className="w-[70px] px-2 py-1 text-sm border-r text-muted-foreground truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate block">{row.unit}</span>
                    </TooltipTrigger>
                    <TooltipContent>{row.unit}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
              {years.map((year) => (
                <td
                  key={year}
                  className="w-[62px] px-1 py-1 text-sm text-center border-r"
                  onClick={() => setEditingCell({ rowIndex, year })}
                >
                  {editingCell?.rowIndex === rowIndex && editingCell?.year === year ? (
                    <Input
                      autoFocus
                      value={row.values[year]}
                      onChange={(e) => handleCellValueChange(rowIndex, year, e.target.value)}
                      onBlur={handleCellBlur}
                      className="h-7 w-full p-1 text-center"
                    />
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-pointer hover:bg-slate-100 p-1 rounded truncate">
                            {formatDisplayValue(row.values[year])}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{row.values[year]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
