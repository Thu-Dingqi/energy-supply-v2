import type { Metadata } from "next"
// import { Inter } from 'next/font/google' // This line will be removed
import "./globals.css"

// const inter = Inter({ subsets: ['latin'] }) // This line will be removed

export const metadata: Metadata = {
  title: "国网能源研究院-能源优化平台",
  description: "能源系统优化",
  generator: "dq2001",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">{children}</body>
    </html>
  )
}
