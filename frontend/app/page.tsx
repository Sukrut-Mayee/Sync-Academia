"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import LoginPage from "@/components/login-page"
import OrganizationSelect from "@/components/organization-select"
import Dashboard from "@/components/dashboard"

export type UserRole = "student" | "teacher" | "admin"
export type DashboardView =
  | "dashboard"
  | "schedule"
  | "smart-study"
  | "attendance"
  | "settings"
  | "students"
  | "analytics"
  | "users"
  | "overview"
  | "classroom"

export interface Classroom {
  id: string
  name: string
  subject: string
  teacher: string
  color: string
  studentCount: number
}

export interface Organization {
  id: string
  name: string
  type: "school" | "tuition"
  logo?: string
}

export type AppView = "LOGIN" | "ORGANIZATION_SELECT" | "DASHBOARD"

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("LOGIN")
  const [userRole, setUserRole] = useState<UserRole>("student")
  const [dashboardView, setDashboardView] = useState<DashboardView>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [vivaMode, setVivaMode] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentView])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleLogin = (email: string) => {
    if (email.toLowerCase().includes("teacher")) {
      setUserRole("teacher")
    } else if (email.toLowerCase().includes("admin")) {
      setUserRole("admin")
    } else {
      setUserRole("student")
    }
    setCurrentView("ORGANIZATION_SELECT")
  }

  const handleOrganizationSelect = (org: Organization) => {
    setSelectedOrganization(org)
    setCurrentView("DASHBOARD")
    setDashboardView("dashboard")
  }

  const handleBackToOrganizations = () => {
    setCurrentView("ORGANIZATION_SELECT")
    setSelectedOrganization(null)
  }

  const handleLogout = () => {
    setCurrentView("LOGIN")
    setUserRole("student")
    setDashboardView("dashboard")
    setSelectedClassroom(null)
    setSelectedOrganization(null)
    setVivaMode(false)
  }

  return (
    <main className="min-h-screen bg-background dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {currentView === "LOGIN" && (
          <LoginPage key="login" onLogin={handleLogin} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        )}
        {currentView === "ORGANIZATION_SELECT" && (
          <OrganizationSelect
            key="org-select"
            role={userRole}
            onOrganizationSelect={handleOrganizationSelect}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
        {currentView === "DASHBOARD" && (
          <Dashboard
            key="dashboard"
            role={userRole}
            currentView={dashboardView}
            setCurrentView={setDashboardView}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            onLogout={handleLogout}
            selectedClassroom={selectedClassroom}
            onBackToOrganizations={handleBackToOrganizations}
            selectedOrganization={selectedOrganization}
            vivaMode={vivaMode}
            setVivaMode={setVivaMode}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
