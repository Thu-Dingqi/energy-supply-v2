"use client"

import { useEffect, useRef } from "react"

export function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.stroke()

    // Sample data
    const data = [
      { year: 2025, value: 100 },
      { year: 2030, value: 120 },
      { year: 2035, value: 140 },
      { year: 2040, value: 160 },
      { year: 2045, value: 180 },
      { year: 2050, value: 200 },
      { year: 2055, value: 220 },
      { year: 2060, value: 240 },
    ]

    // Calculate scales
    const xScale = (width - 2 * padding) / (data.length - 1)
    const yMax = Math.max(...data.map((d) => d.value)) * 1.2
    const yScale = (height - 2 * padding) / yMax

    // Draw line
    ctx.beginPath()
    data.forEach((point, i) => {
      const x = padding + i * xScale
      const y = height - padding - point.value * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points
    data.forEach((point, i) => {
      const x = padding + i * xScale
      const y = height - padding - point.value * yScale

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#0ea5e9"
      ctx.fill()
    })

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "10px sans-serif"
    data.forEach((point, i) => {
      const x = padding + i * xScale
      ctx.fillText(point.year.toString(), x, height - padding + 15)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const value = Math.round((yMax * i) / yTicks)
      const y = height - padding - value * yScale
      ctx.fillText(value.toString(), padding - 5, y)
    }
  }, [])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}

export function BarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.stroke()

    // Sample data
    const data = [
      { year: 2025, value: 100 },
      { year: 2030, value: 120 },
      { year: 2035, value: 140 },
      { year: 2040, value: 160 },
      { year: 2045, value: 180 },
      { year: 2050, value: 200 },
      { year: 2055, value: 220 },
      { year: 2060, value: 240 },
    ]

    // Calculate scales
    const barWidth = ((width - 2 * padding) / data.length) * 0.8
    const barSpacing = ((width - 2 * padding) / data.length) * 0.2
    const yMax = Math.max(...data.map((d) => d.value)) * 1.2
    const yScale = (height - 2 * padding) / yMax

    // Draw bars
    data.forEach((item, i) => {
      const x = padding + i * (barWidth + barSpacing)
      const y = height - padding - item.value * yScale
      const barHeight = item.value * yScale

      ctx.fillStyle = "#0ea5e9"
      ctx.fillRect(x, y, barWidth, barHeight)
    })

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "10px sans-serif"
    data.forEach((item, i) => {
      const x = padding + i * (barWidth + barSpacing) + barWidth / 2
      ctx.fillText(item.year.toString(), x, height - padding + 15)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const value = Math.round((yMax * i) / yTicks)
      const y = height - padding - value * yScale
      ctx.fillText(value.toString(), padding - 5, y)
    }
  }, [])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}

export function PieChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 40

    // Sample data
    const data = [
      { label: "煤炭", value: 20, color: "#94a3b8" },
      { label: "石油", value: 15, color: "#f59e0b" },
      { label: "天然气", value: 15, color: "#0ea5e9" },
      { label: "核能", value: 10, color: "#10b981" },
      { label: "可再生能源", value: 40, color: "#8b5cf6" },
    ]

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw pie
    let startAngle = 0
    data.forEach((item) => {
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
      ctx.font = "12px sans-serif"
      ctx.fillText(`${item.label}`, labelX, labelY)

      startAngle += sliceAngle
    })

    // Draw legend
    const legendX = width - 120
    const legendY = 20
    const legendSpacing = 25

    data.forEach((item, i) => {
      const y = legendY + i * legendSpacing

      // Draw color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.font = "12px sans-serif"
      ctx.fillText(`${item.label} ${item.value}%`, legendX + 18, y + 6)
    })
  }, [])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}

export function StackedBarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.stroke()

    // Sample data
    const data = [
      {
        year: 2025,
        values: [
          { label: "工业", value: 250, color: "#0ea5e9" },
          { label: "交通", value: 150, color: "#f59e0b" },
          { label: "建筑", value: 200, color: "#10b981" },
          { label: "农业", value: 50, color: "#8b5cf6" },
          { label: "服务业", value: 100, color: "#ec4899" },
          { label: "居民生活", value: 120, color: "#f43f5e" },
        ],
      },
      {
        year: 2030,
        values: [
          { label: "工业", value: 260, color: "#0ea5e9" },
          { label: "交通", value: 170, color: "#f59e0b" },
          { label: "建筑", value: 210, color: "#10b981" },
          { label: "农业", value: 45, color: "#8b5cf6" },
          { label: "服务业", value: 120, color: "#ec4899" },
          { label: "居民生活", value: 130, color: "#f43f5e" },
        ],
      },
      {
        year: 2040,
        values: [
          { label: "工业", value: 240, color: "#0ea5e9" },
          { label: "交通", value: 190, color: "#f59e0b" },
          { label: "建筑", value: 230, color: "#10b981" },
          { label: "农业", value: 40, color: "#8b5cf6" },
          { label: "服务业", value: 150, color: "#ec4899" },
          { label: "居民生活", value: 150, color: "#f43f5e" },
        ],
      },
      {
        year: 2050,
        values: [
          { label: "工业", value: 220, color: "#0ea5e9" },
          { label: "交通", value: 210, color: "#f59e0b" },
          { label: "建筑", value: 250, color: "#10b981" },
          { label: "农业", value: 35, color: "#8b5cf6" },
          { label: "服务业", value: 180, color: "#ec4899" },
          { label: "居民生活", value: 170, color: "#f43f5e" },
        ],
      },
      {
        year: 2060,
        values: [
          { label: "工业", value: 200, color: "#0ea5e9" },
          { label: "交通", value: 230, color: "#f59e0b" },
          { label: "建筑", value: 270, color: "#10b981" },
          { label: "农业", value: 30, color: "#8b5cf6" },
          { label: "服务业", value: 200, color: "#ec4899" },
          { label: "居民生活", value: 190, color: "#f43f5e" },
        ],
      },
    ]

    // Calculate scales
    const barWidth = ((width - 2 * padding) / data.length) * 0.8
    const barSpacing = ((width - 2 * padding) / data.length) * 0.2

    // Calculate max total height
    const maxTotal = Math.max(...data.map((d) => d.values.reduce((sum, item) => sum + item.value, 0)))
    const yScale = (height - 2 * padding) / (maxTotal * 1.2)

    // Draw stacked bars
    data.forEach((yearData, i) => {
      const x = padding + i * (barWidth + barSpacing)
      let yOffset = 0

      yearData.values.forEach((item) => {
        const barHeight = item.value * yScale
        const y = height - padding - barHeight - yOffset

        ctx.fillStyle = item.color
        ctx.fillRect(x, y, barWidth, barHeight)

        yOffset += barHeight
      })
    })

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "10px sans-serif"
    data.forEach((item, i) => {
      const x = padding + i * (barWidth + barSpacing) + barWidth / 2
      ctx.fillText(item.year.toString(), x, height - padding + 15)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const value = Math.round((maxTotal * 1.2 * i) / yTicks)
      const y = height - padding - value * yScale
      ctx.fillText(value.toString(), padding - 5, y)
    }
    )

    // Draw legend
    const legendX = width - 120
    const legendY = 20
    const legendSpacing = 25

    data[0].values.forEach((item, i) => {
      \
      const y = legendY + i * legendSpacing

      // Draw color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.font = "12px sans-serif"
      ctx.fillText(item.label, legendX + 18, y + 6)
    })
  }, [])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}

export function AreaChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.stroke()

    // Sample data
    const data = [
      { year: 2025, value: 100 },
      { year: 2030, value: 120 },
      { year: 2035, value: 140 },
      { year: 2040, value: 160 },
      { year: 2045, value: 180 },
      { year: 2050, value: 200 },
      { year: 2055, value: 220 },
      { year: 2060, value: 240 },
    ]

    // Calculate scales
    const xScale = (width - 2 * padding) / (data.length - 1)
    const yMax = Math.max(...data.map((d) => d.value)) * 1.2
    const yScale = (height - 2 * padding) / yMax

    // Draw area
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)

    data.forEach((point, i) => {
      const x = padding + i * xScale
      const y = height - padding - point.value * yScale
      ctx.lineTo(x, y)
    })

    ctx.lineTo(padding + (data.length - 1) * xScale, height - padding)
    ctx.closePath()

    ctx.fillStyle = "rgba(14, 165, 233, 0.2)"
    ctx.fill()

    // Draw line
    ctx.beginPath()
    data.forEach((point, i) => {
      const x = padding + i * xScale
      const y = height - padding - point.value * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points
    data.forEach((point, i) => {
      const x = padding + i * xScale
      const y = height - padding - point.value * yScale

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#0ea5e9"
      ctx.fill()
    })

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "10px sans-serif"
    data.forEach((point, i) => {
      const x = padding + i * xScale
      ctx.fillText(point.year.toString(), x, height - padding + 15)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const value = Math.round((yMax * i) / yTicks)
      const y = height - padding - value * yScale
      ctx.fillText(value.toString(), padding - 5, y)
    }
  }, [])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}
