import type React from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={`min-h-screen bg-gray-100 ${inter.className}`}>{children}</div>
}
