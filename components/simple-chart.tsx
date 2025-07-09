"use client"

import { useEffect, useRef } from "react"

interface DataRow {
  indicator: string
  unit: string
  values: { [year: string]: string | number }
}

interface SimpleChartProps {
  data: DataRow[]
  type: "line" | "bar" | "pie" | "stacked"
  title?: string
  unit?: string
}

export default function SimpleChart({ type, data, title }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 60

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.stroke()

    // Get years from the first data row
    const years = Object.keys(data[0].values).sort()

    if (type === "line") {
      // Draw line chart for each indicator
      const colors = ["#e11d48", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"]

      // Calculate scales
      const xScale = (width - 2 * padding) / (years.length - 1)
      const allValues = data.flatMap((row) => Object.values(row.values).map((v) => Number(v)))
      const yMax = Math.max(...allValues, 0) * 1.1
      const yMin = Math.min(...allValues, 0) * 1.1
      
      // Calculate the full range and scale
      const yRange = yMax - yMin
      const yScale = (height - 2 * padding) / yRange
      
      // Calculate the position of y=0 on the chart
      const zeroY = height - padding - (-yMin * yScale)

      // Draw grid lines
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5

      // Draw zero line if we have negative values
      if (yMin < 0) {
        ctx.beginPath()
        ctx.moveTo(padding, zeroY)
        ctx.lineTo(width - padding, zeroY)
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 0.5
      }

      // Horizontal grid lines
      const yTicks = 5
      for (let i = 0; i <= yTicks; i++) {
        const yValue = yMin + (yRange * i) / yTicks
        const y = height - padding - (yValue - yMin) * yScale
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      // Vertical grid lines
      years.forEach((year, i) => {
        const x = padding + i * xScale
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
        ctx.stroke()
      })

      // Draw lines for each indicator
      data.forEach((row, rowIndex) => {
        const color = colors[rowIndex % colors.length]

        ctx.beginPath()
        years.forEach((year, i) => {
          const x = padding + i * xScale
          const value = Number(row.values[year])
          const y = height - padding - (value - yMin) * yScale

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw points
        years.forEach((year, i) => {
          const x = padding + i * xScale
          const value = Number(row.values[year])
          const y = height - padding - (value - yMin) * yScale

          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        })
      })

      // Draw x-axis labels
      ctx.textAlign = "center"
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      years.forEach((year, i) => {
        const x = padding + i * xScale
        ctx.fillText(year, x, height - padding + 20)
      })

      // Draw y-axis labels
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      for (let i = 0; i <= yTicks; i++) {
        const value = yMin + (yRange * i) / yTicks
        const y = height - padding - (value - yMin) * yScale
        ctx.fillText(value.toFixed(1), padding - 10, y)
      }

      // Draw title
      ctx.textAlign = "center"
      ctx.fillStyle = "#334155"
      ctx.font = "14px sans-serif"
      ctx.fillText(`${title} (${data[0].unit})`, width / 2, 20)

      // Draw legend if multiple indicators
      if (data.length > 1) {
        const legendX = width - 150
        const legendY = 30
        const legendSpacing = 25

        data.forEach((row, i) => {
          const y = legendY + i * legendSpacing
          const color = colors[i % colors.length]

          // Draw color line
          ctx.beginPath()
          ctx.moveTo(legendX, y + 8)
          ctx.lineTo(legendX + 20, y + 8)
          ctx.strokeStyle = color
          ctx.lineWidth = 3
          ctx.stroke()

          // Draw point
          ctx.beginPath()
          ctx.arc(legendX + 10, y + 8, 4, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()

          // Draw label
          ctx.fillStyle = "#334155"
          ctx.textAlign = "left"
          ctx.textBaseline = "middle"
          ctx.font = "12px sans-serif"
          ctx.fillText(row.indicator, legendX + 25, y + 8)
        })
      }
    } else if (type === "bar") {
      // For bar chart
      // If we have multiple indicators, we'll group them
      const barCount = data.length
      const groupWidth = (width - 2 * padding) / years.length
      const barWidth = (groupWidth * 0.8) / barCount
      const barSpacing = (groupWidth * 0.2) / (barCount + 1)

      // Calculate max and min values for y-axis
      const allValues = data.flatMap((row) => Object.values(row.values).map((v) => Number(v)))
      const yMax = Math.max(...allValues, 0) * 1.1
      const yMin = Math.min(...allValues, 0) * 1.1
      
      // Calculate the full range and scale
      const yRange = yMax - yMin
      const yScale = (height - 2 * padding) / yRange
      
      // Calculate the position of y=0 on the chart
      const zeroY = height - padding - (-yMin * yScale)

      // Draw grid lines
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5
      
      // Draw zero line if we have negative values
      if (yMin < 0) {
        ctx.beginPath()
        ctx.moveTo(padding, zeroY)
        ctx.lineTo(width - padding, zeroY)
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 0.5
      }

      // Horizontal grid lines
      const yTicks = 5
      for (let i = 0; i <= yTicks; i++) {
        const yValue = yMin + (yRange * i) / yTicks
        const y = height - padding - (yValue - yMin) * yScale
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      // Colors for different indicators
      const colors = ["#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#e11d48"]

      // Draw bars for each year and indicator
      years.forEach((year, yearIndex) => {
        data.forEach((row, rowIndex) => {
          const x = padding + yearIndex * groupWidth + barSpacing * (rowIndex + 1) + rowIndex * barWidth
          const value = Number(row.values[year])
          
          // Calculate bar position and height based on value (positive or negative)
          let y, barHeight;
          
          if (value >= 0) {
            barHeight = value * yScale;
            y = zeroY - barHeight;
          } else {
            barHeight = -value * yScale;
            y = zeroY;
          }

          ctx.fillStyle = colors[rowIndex % colors.length]
          ctx.fillRect(x, y, barWidth, barHeight)
        })
      })

      // Draw x-axis labels
      ctx.textAlign = "center"
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      years.forEach((year, i) => {
        const x = padding + i * groupWidth + groupWidth / 2
        ctx.fillText(year, x, height - padding + 20)
      })

      // Draw y-axis labels
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      for (let i = 0; i <= yTicks; i++) {
        const value = yMin + (yRange * i) / yTicks
        const y = height - padding - (value - yMin) * yScale
        ctx.fillText(value.toFixed(1), padding - 10, y)
      }

      // Draw title
      ctx.textAlign = "center"
      ctx.fillStyle = "#334155"
      ctx.font = "14px sans-serif"
      ctx.fillText(`${title} (${data[0].unit})`, width / 2, 20)

      // Draw legend if multiple indicators
      if (data.length > 1) {
        const legendX = width - 150
        const legendY = 30
        const legendSpacing = 25

        data.forEach((row, i) => {
          const y = legendY + i * legendSpacing
          const color = colors[i % colors.length]

          // Draw color box
          ctx.fillStyle = color
          ctx.fillRect(legendX, y, 16, 16)

          // Draw label
          ctx.fillStyle = "#334155"
          ctx.textAlign = "left"
          ctx.textBaseline = "middle"
          ctx.font = "12px sans-serif"
          ctx.fillText(row.indicator, legendX + 24, y + 8)
        })
      }
    } else if (type === "stacked") {
      // For stacked bar chart
      const groupWidth = (width - 2 * padding) / years.length
      const barWidth = groupWidth * 0.8
      const barSpacing = groupWidth * 0.1

      // Separate positive and negative values for stacking
      const positiveByYearAndRow: Record<string, Record<number, number>> = {}
      const negativeByYearAndRow: Record<string, Record<number, number>> = {}
      
      years.forEach(year => {
        positiveByYearAndRow[year] = {}
        negativeByYearAndRow[year] = {}
        
        data.forEach((row, rowIndex) => {
          const value = Number(row.values[year])
          if (value >= 0) {
            positiveByYearAndRow[year][rowIndex] = value
          } else {
            negativeByYearAndRow[year][rowIndex] = value
          }
        })
      })
      
      // Calculate max total for positive and min total for negative values
      const totalPositiveByYear: Record<string, number> = {}
      const totalNegativeByYear: Record<string, number> = {}
      
      years.forEach((year) => {
        totalPositiveByYear[year] = Object.values(positiveByYearAndRow[year]).reduce((sum, val) => sum + val, 0)
        totalNegativeByYear[year] = Object.values(negativeByYearAndRow[year]).reduce((sum, val) => sum + val, 0)
      })
      
      const yMaxPositive = Math.max(...Object.values(totalPositiveByYear), 0) * 1.1
      const yMinNegative = Math.min(...Object.values(totalNegativeByYear), 0) * 1.1
      
      // Calculate the full range and scale
      const yRange = yMaxPositive - yMinNegative
      const yScale = (height - 2 * padding) / yRange
      
      // Calculate the position of y=0 on the chart
      const zeroY = height - padding - (-yMinNegative * yScale)

      // Draw grid lines
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5

      // Draw zero line
      ctx.beginPath()
      ctx.moveTo(padding, zeroY)
      ctx.lineTo(width - padding, zeroY)
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5

      // Horizontal grid lines
      const yTicks = 5
      for (let i = 0; i <= yTicks; i++) {
        const yValue = yMinNegative + (yRange * i) / yTicks
        const y = height - padding - (yValue - yMinNegative) * yScale
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      // Colors for different indicators
      const colors = ["#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#e11d48"]

      // Draw stacked bars for each year
      years.forEach((year, yearIndex) => {
        // Positive values stack up from zero
        let positiveYOffset = 0
        // Negative values stack down from zero
        let negativeYOffset = 0

        data.forEach((row, rowIndex) => {
          const x = padding + yearIndex * groupWidth + barSpacing
          const value = Number(row.values[year])
          
          if (value >= 0) {
            const barHeight = value * yScale
            const y = zeroY - barHeight - positiveYOffset
            
            ctx.fillStyle = colors[rowIndex % colors.length]
            ctx.fillRect(x, y, barWidth, barHeight)
            
            positiveYOffset += barHeight
          } else {
            const barHeight = -value * yScale
            const y = zeroY + negativeYOffset
            
            ctx.fillStyle = colors[rowIndex % colors.length]
            ctx.fillRect(x, y, barWidth, barHeight)
            
            negativeYOffset += barHeight
          }
        })
      })

      // Draw x-axis labels
      ctx.textAlign = "center"
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      years.forEach((year, i) => {
        const x = padding + i * groupWidth + groupWidth / 2
        ctx.fillText(year, x, height - padding + 20)
      })

      // Draw y-axis labels
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      for (let i = 0; i <= yTicks; i++) {
        const value = yMinNegative + (yRange * i) / yTicks
        const y = height - padding - (value - yMinNegative) * yScale
        ctx.fillText(value.toFixed(1), padding - 10, y)
      }

      // Draw title
      ctx.textAlign = "center"
      ctx.fillStyle = "#334155"
      ctx.font = "14px sans-serif"
      ctx.fillText(`${title} (${data[0].unit})`, width / 2, 20)

      // Draw legend if multiple indicators
      if (data.length > 1) {
        const legendX = width - 150
        const legendY = 30
        const legendSpacing = 25

        data.forEach((row, i) => {
          const y = legendY + i * legendSpacing
          const color = colors[i % colors.length]

          // Draw color box
          ctx.fillStyle = color
          ctx.fillRect(legendX, y, 16, 16)

          // Draw label
          ctx.fillStyle = "#334155"
          ctx.textAlign = "left"
          ctx.textBaseline = "middle"
          ctx.font = "12px sans-serif"
          ctx.fillText(row.indicator, legendX + 24, y + 8)
        })
      }
    } else if (type === "pie") {
      // For pie chart - we'll use the last year's data
      const lastYear = years[years.length - 1]

      // Set dimensions
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2 - 80

      // Prepare data for the selected year
      const pieData = data.map((row, index) => {
        return {
          label: row.indicator,
          value: Number(row.values[lastYear] || 0),
          color: ["#94a3b8", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"][index % 6],
        }
      })

      // Calculate total
      const total = pieData.reduce((sum, item) => sum + item.value, 0)

      // Draw pie
      let startAngle = 0
      pieData.forEach((item) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()

        ctx.fillStyle = item.color
        ctx.fill()

        // Draw label
        const labelAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "14px sans-serif"
        ctx.fillText(`${item.label}`, labelX, labelY)

        startAngle += sliceAngle
      })

      // Draw legend
      const legendX = width - 150
      const legendY = height / 2 - 60
      const legendSpacing = 30

      pieData.forEach((item, i) => {
        const y = legendY + i * legendSpacing

        // Draw color box
        ctx.fillStyle = item.color
        ctx.fillRect(legendX, y, 16, 16)

        // Draw label
        ctx.fillStyle = "#334155"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.font = "14px sans-serif"
        const percentage = Math.round((item.value / total) * 100)
        ctx.fillText(`${item.label} ${percentage}%`, legendX + 24, y + 8)
      })

      // Draw title
      ctx.textAlign = "center"
      ctx.fillStyle = "#334155"
      ctx.font = "16px sans-serif"
      ctx.fillText(`${title} (${lastYear}年)`, width / 2, 30)
    }
  }, [type, data, title])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}
