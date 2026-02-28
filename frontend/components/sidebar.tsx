"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, Calendar, Sparkles, Settings, BarChart3, Users, ArrowLeft, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserRole, DashboardView, Classroom, Organization } from "@/app/page"

interface SidebarProps {
  role: UserRole
  currentView: DashboardView
  setCurrentView: (view: DashboardView) => void
  onBackToOrganizations: () => void
  selectedClassroom: Classroom | null
  selectedOrganization: Organization | null
  vivaMode: boolean
}

function SyncLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="url(#sidebarLogoGrad)" />
      <path
        d="M12 20C12 15.5817 15.5817 12 20 12C22.7614 12 25.2386 13.3432 26.8 15.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M28 20C28 24.4183 24.4183 28 20 28C17.2386 28 14.7614 26.6568 13.2 24.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="3" fill="white" />
      <path d="M17 10L20 12L17 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 26L20 28L23 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="sidebarLogoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#14B8A6" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const studentNav = [
  { icon: Home, label: "Dashboard", view: "dashboard" as DashboardView },
  { icon: Calendar, label: "My Schedule", view: "schedule" as DashboardView },
  { icon: ClipboardCheck, label: "Attendance", view: "attendance" as DashboardView },
  { icon: Sparkles, label: "Smart Study", view: "smart-study" as DashboardView },
  { icon: Settings, label: "Settings", view: "settings" as DashboardView },
]

const teacherNav = [
  { icon: Home, label: "Dashboard", view: "dashboard" as DashboardView },
  { icon: Calendar, label: "Schedule", view: "schedule" as DashboardView },
  { icon: ClipboardCheck, label: "Attendance", view: "attendance" as DashboardView },
  { icon: Users, label: "Students", view: "students" as DashboardView },
  { icon: BarChart3, label: "Analytics", view: "analytics" as DashboardView },
  { icon: Settings, label: "Settings", view: "settings" as DashboardView },
]

const adminNav = [
  { icon: Home, label: "Overview", view: "dashboard" as DashboardView },
  { icon: BarChart3, label: "Analytics", view: "analytics" as DashboardView },
  { icon: Users, label: "Users", view: "users" as DashboardView },
  { icon: Settings, label: "Settings", view: "settings" as DashboardView },
]

const myClasses = [
  { id: "1", name: "AP Physics", color: "bg-blue-500" },
  { id: "2", name: "Calculus II", color: "bg-emerald-500" },
  { id: "3", name: "World History", color: "bg-amber-500" },
]

export default function Sidebar({
  role,
  currentView,
  setCurrentView,
  onBackToOrganizations,
  selectedOrganization,
  vivaMode,
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const collapsed = !isHovered

  const navItems = role === "student" ? studentNav : role === "teacher" ? teacherNav : adminNav

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ width: 80 }}
      animate={{ width: isHovered ? 260 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "backdrop-blur-xl border-r flex flex-col relative z-20",
        vivaMode
          ? "bg-orange-100/80 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800"
          : "bg-card/50 dark:bg-gray-800/50 border-border/50 dark:border-gray-700",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "p-6 border-b",
          vivaMode ? "border-orange-200 dark:border-orange-800" : "border-border/50 dark:border-gray-700",
          collapsed && "px-4",
        )}
      >
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05, rotate: 5 }}>
            <SyncLogo className="w-10 h-10 flex-shrink-0" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, width: isHovered ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <h1 className="font-bold text-foreground dark:text-white">SyncAcademia</h1>
            <p className="text-xs text-muted-foreground dark:text-gray-400">{selectedOrganization?.name || "Portal"}</p>
          </motion.div>
        </div>
      </div>

      {/* Back to Organizations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="px-3 pt-3 overflow-hidden"
      >
        {isHovered && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToOrganizations}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              vivaMode
                ? "text-orange-700 dark:text-orange-300 hover:bg-orange-200/50 dark:hover:bg-orange-800/50"
                : "text-muted-foreground hover:bg-muted/50 dark:hover:bg-gray-700/50 hover:text-foreground dark:hover:text-white",
            )}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span>Switch Organization</span>
          </motion.button>
        )}
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view
            return (
              <li key={item.label}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView(item.view)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    collapsed && "justify-center px-3",
                    isActive
                      ? vivaMode
                        ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30"
                        : "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                      : vivaMode
                        ? "text-orange-600 dark:text-orange-400 hover:bg-orange-200/50 dark:hover:bg-orange-800/50"
                        : "text-muted-foreground hover:bg-muted/50 dark:hover:bg-gray-700/50 hover:text-foreground dark:hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive && (vivaMode ? "text-orange-500" : "text-teal-500"),
                    )}
                  />
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0, width: isHovered ? "auto" : 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </motion.button>
              </li>
            )
          })}
        </ul>

        {/* My Classes Section */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
          className="overflow-hidden"
        >
          {isHovered && (
            <div className="mt-6 pt-6 border-t border-border/50 dark:border-gray-700">
              <p className="px-4 text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider mb-3">
                My Classes
              </p>
              <ul className="space-y-1">
                {myClasses.map((cls) => (
                  <li key={cls.id}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentView("classroom")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-muted-foreground hover:bg-muted/50 dark:hover:bg-gray-700/50 hover:text-foreground dark:hover:text-white"
                    >
                      <div className={`w-3 h-3 rounded-full ${cls.color} flex-shrink-0`} />
                      <span className="truncate">{cls.name}</span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </nav>

      {/* Help Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} className="p-4 overflow-hidden">
        {isHovered && (
          <div
            className={cn(
              "rounded-2xl p-4 border",
              vivaMode
                ? "bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20"
                : "bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/20",
            )}
          >
            <p className="text-sm font-medium text-foreground dark:text-white">Need Help?</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">Check our docs or contact support.</p>
          </div>
        )}
      </motion.div>
    </motion.aside>
  )
}
