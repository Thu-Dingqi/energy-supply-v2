"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface YearSelectorProps {
  selectedYear: string
  onYearChange: (year: string) => void
}

export default function YearSelector({ selectedYear, onYearChange }: YearSelectorProps) {
  const [customYear, setCustomYear] = useState(selectedYear)
  const predefinedYears = ["2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060"]

  const handleCustomYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setCustomYear(value)
    }
  }

  const handleApplyCustomYear = () => {
    if (customYear && Number.parseInt(customYear) >= 2025 && Number.parseInt(customYear) <= 2060) {
      onYearChange(customYear)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[120px] justify-between">
          {selectedYear}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="grid gap-1">
          {predefinedYears.map((year) => (
            <Button
              key={year}
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => {
                onYearChange(year)
                setCustomYear(year)
              }}
            >
              {year}
            </Button>
          ))}
          <div className="border-t px-2 py-2">
            <div className="space-y-2">
              <Label htmlFor="custom-year">自定义年份</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-year"
                  value={customYear}
                  onChange={handleCustomYearChange}
                  className="h-8"
                  placeholder="2025-2060"
                />
                <Button size="sm" onClick={handleApplyCustomYear}>
                  应用
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
