"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

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

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-2 text-left text-sm font-medium border-r">指标</th>
              <th className="px-4 py-2 text-left text-sm font-medium border-r">单位</th>
              {years.map((year) => (
                <th key={year} className="px-4 py-2 text-center text-sm font-medium border-r">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-slate-50">
                <td className="px-4 py-2 text-sm border-r font-medium">{row.indicator}</td>
                <td className="px-4 py-2 text-sm border-r text-muted-foreground">{row.unit}</td>
                {years.map((year) => (
                  <td
                    key={year}
                    className="px-4 py-2 text-sm text-center border-r"
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
                      <div className="cursor-pointer hover:bg-slate-100 p-1 rounded">{row.values[year]}</div>
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
