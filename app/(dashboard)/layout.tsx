import type React from "react"
import { Inter } from "next/font/google"
import { Sidebar, MobileSidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background">
          <Sidebar />
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
            <MobileSidebar />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
