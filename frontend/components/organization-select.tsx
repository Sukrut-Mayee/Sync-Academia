"use client"

import { motion } from "framer-motion"
import { Building2, GraduationCap, LogOut, Moon, Sun, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { UserRole, Organization } from "@/app/page"

interface OrganizationSelectProps {
  role: UserRole
  onOrganizationSelect: (org: Organization) => void
  onLogout: () => void
  isDarkMode: boolean
  setIsDarkMode: (mode: boolean) => void
}

const organizations: Organization[] = [
  {
    id: "1",
    name: "Hawkins High School",
    type: "school",
  },
  {
    id: "2",
    name: "Ace Physics Tuition",
    type: "tuition",
  },
]

function SyncLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="url(#orgLogoGrad)" />
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
        <linearGradient id="orgLogoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#14B8A6" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const roleNames = {
  student: "Alex Johnson",
  teacher: "Dr. Sarah Mitchell",
  admin: "Admin User",
}

export default function OrganizationSelect({
  role,
  onOrganizationSelect,
  onLogout,
  isDarkMode,
  setIsDarkMode,
}: OrganizationSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <SyncLogo className="w-10 h-10" />
          <div>
            <h1 className="font-bold text-foreground dark:text-white">SyncAcademia</h1>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Select Organization</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 dark:bg-gray-800">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{roleNames[role].charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground dark:text-white">{roleNames[role]}</p>
              <p className="text-xs text-muted-foreground dark:text-gray-400 capitalize">{role}</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-100px)]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground dark:text-white mb-2">Choose Your Organization</h2>
          <p className="text-muted-foreground dark:text-gray-400">Select an institution to access your dashboard</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          {organizations.map((org, index) => (
            <motion.button
              key={org.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOrganizationSelect(org)}
              className="group relative bg-card dark:bg-gray-800 rounded-2xl p-6 border border-border/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-left overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    org.type === "school"
                      ? "bg-gradient-to-br from-teal-500 to-emerald-500"
                      : "bg-gradient-to-br from-orange-500 to-amber-500"
                  }`}
                >
                  {org.type === "school" ? (
                    <Building2 className="w-8 h-8 text-white" />
                  ) : (
                    <GraduationCap className="w-8 h-8 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-1">{org.name}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 capitalize">
                    {org.type === "school" ? "Official Institution" : "Private Tuition"}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-teal-500 transition-colors" />
              </div>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${
                  org.type === "school"
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                    : "bg-gradient-to-r from-orange-500 to-amber-500"
                } transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
              />
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-muted-foreground dark:text-gray-400"
        >
          You can switch organizations anytime from your dashboard
        </motion.p>
      </main>
    </motion.div>
  )
}
