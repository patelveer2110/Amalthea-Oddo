"use client"

import type React from "react"

import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth"
import { Button } from "./ui/button"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">OneFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.fullName}</span>
            <Button onClick={handleLogout} className="text-red-600 hover:text-red-700 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block">
            <nav className="space-y-3">
              <a href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Projects
              </a>
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Tasks
              </a>
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Timesheets
              </a>
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Finance
              </a>
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Reports
              </a>
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
