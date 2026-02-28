"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { UserRole, DashboardView, Classroom, Organization } from "@/app/page"
import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"
import StudentDashboard from "@/components/student-dashboard"
import StudentSchedule from "@/components/student-schedule"
import SmartStudy from "@/components/smart-study"
import AttendanceView from "@/components/attendance-view"
import TeacherDashboard from "@/components/teacher-dashboard"
import TeacherStudents from "@/components/teacher-students"
import TeacherAnalytics from "@/components/teacher-analytics"
import AdminDashboard from "@/components/admin-dashboard"
import AdminUsers from "@/components/admin-users"
import SettingsPage from "@/components/settings-page"
import ClassroomDetail from "@/components/classroom-detail"
import GeminiFab from "@/components/gemini-fab"

interface DashboardProps {
  role: UserRole
  currentView: DashboardView
  setCurrentView: (view: DashboardView) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  onLogout: () => void
  selectedClassroom: Classroom | null
  onBackToOrganizations: () => void
  selectedOrganization: Organization | null
  vivaMode: boolean
  setVivaMode: (mode: boolean) => void
  isDarkMode: boolean
  setIsDarkMode: (mode: boolean) => void
}

export default function Dashboard({
  role,
  currentView,
  setCurrentView,
  sidebarCollapsed,
  setSidebarCollapsed,
  onLogout,
  selectedClassroom,
  onBackToOrganizations,
  selectedOrganization,
  vivaMode,
  setVivaMode,
  isDarkMode,
  setIsDarkMode,
}: DashboardProps) {
  const [classroomDetailView, setClassroomDetailView] = useState<Classroom | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentView])

  const handleClassroomClick = (classroom: Classroom) => {
    setClassroomDetailView(classroom)
    setCurrentView("classroom")
  }

  const handleBackFromClassroom = () => {
    setClassroomDetailView(null)
    setCurrentView("dashboard")
  }

  const renderContent = () => {
    if (currentView === "classroom" && classroomDetailView) {
      return <ClassroomDetail classroom={classroomDetailView} onBack={handleBackFromClassroom} role={role} />
    }

    // Student views
    if (role === "student") {
      switch (currentView) {
        case "schedule":
          return <StudentSchedule />
        case "attendance":
          return <AttendanceView />
        case "smart-study":
          return <SmartStudy />
        case "settings":
          return <SettingsPage role={role} />
        default:
          return <StudentDashboard onClassroomClick={handleClassroomClick} />
      }
    }

    // Teacher views
    if (role === "teacher") {
      switch (currentView) {
        case "schedule":
          return <StudentSchedule />
        case "attendance":
          return <AttendanceView />
        case "students":
          return <TeacherStudents />
        case "analytics":
          return <TeacherAnalytics />
        case "settings":
          return <SettingsPage role={role} />
        default:
          return <TeacherDashboard onClassroomClick={handleClassroomClick} />
      }
    }

    // Admin views
    if (role === "admin") {
      switch (currentView) {
        case "analytics":
          return <TeacherAnalytics />
        case "users":
          return <AdminUsers />
        case "settings":
          return <SettingsPage role={role} />
        default:
          return <AdminDashboard />
      }
    }

    return <StudentDashboard onClassroomClick={handleClassroomClick} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex h-screen ${vivaMode ? "bg-orange-50 dark:bg-orange-950/20" : "bg-background dark:bg-gray-900"} relative overflow-hidden transition-colors duration-300`}
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 ${vivaMode ? "bg-orange-500/10" : "bg-teal-500/5"} rounded-full blur-3xl`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 ${vivaMode ? "bg-amber-500/10" : "bg-emerald-500/5"} rounded-full blur-3xl`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${vivaMode ? "bg-orange-400/5" : "bg-teal-400/3"} rounded-full blur-3xl`}
        />
      </div>

      <Sidebar
        role={role}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onBackToOrganizations={onBackToOrganizations}
        selectedClassroom={selectedClassroom}
        selectedOrganization={selectedOrganization}
        vivaMode={vivaMode}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar
          role={role}
          onLogout={onLogout}
          sidebarCollapsed={sidebarCollapsed}
          vivaMode={vivaMode}
          setVivaMode={setVivaMode}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <GeminiFab />
    </motion.div>
  )
}
