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

  // 格式化数字，处理大数值
  const formatDisplayValue = (value: string | number): string => {
    if (typeof value === 'number') {
      // 大数值使用科学计数法或千分位分隔
      if (Math.abs(value) >= 1000000) {
        return value.toExponential(2);
      } else if (Math.abs(value) >= 1000) {
        return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
      } else {
        return value.toFixed(2);
      }
    }
    return String(value);
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="w-[120px] px-2 py-1 text-left text-sm font-medium border-r sticky left-0 bg-slate-100 z-10">指标</th>
              <th className="w-[80px] px-2 py-1 text-left text-sm font-medium border-r sticky left-[120px] bg-slate-100 z-10">单位</th>
              {years.map((year) => (
                <th key={year} className="min-w-[80px] px-2 py-1 text-center text-sm font-medium border-r">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-slate-50">
                <td className="w-[120px] px-2 py-1 text-sm border-r font-medium truncate sticky left-0 bg-white z-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate block">{row.indicator}</span>
                      </TooltipTrigger>
                      <TooltipContent>{row.indicator}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="w-[80px] px-2 py-1 text-sm border-r text-muted-foreground truncate sticky left-[120px] bg-white z-10">
                  {row.unit}
                </td>
                {years.map((year) => (
                  <td
                    key={year}
                    className="min-w-[80px] px-2 py-1 text-sm text-center border-r"
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
    </div>
  )
}
