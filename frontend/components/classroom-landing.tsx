"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, LogOut, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Classroom, UserRole } from "@/app/page"

interface ClassroomLandingProps {
  role: UserRole
  onClassroomSelect: (classroom: Classroom) => void
  onLogout: () => void
}

const classrooms: Classroom[] = [
  {
    id: "1",
    name: "AP Physics",
    subject: "Physics",
    teacher: "Dr. Newton",
    color: "from-blue-500 to-blue-600",
    studentCount: 28,
  },
  {
    id: "2",
    name: "Calculus II",
    subject: "Math",
    teacher: "Prof. Euler",
    color: "from-emerald-500 to-emerald-600",
    studentCount: 32,
  },
  {
    id: "3",
    name: "World History",
    subject: "History",
    teacher: "Ms. Adams",
    color: "from-amber-500 to-orange-500",
    studentCount: 25,
  },
  {
    id: "4",
    name: "Chemistry",
    subject: "Chemistry",
    teacher: "Dr. Curie",
    color: "from-rose-500 to-pink-600",
    studentCount: 30,
  },
  {
    id: "5",
    name: "English Literature",
    subject: "English",
    teacher: "Prof. Shakespeare",
    color: "from-purple-500 to-violet-600",
    studentCount: 27,
  },
  {
    id: "6",
    name: "Computer Science",
    subject: "CS",
    teacher: "Dr. Turing",
    color: "from-teal-500 to-cyan-600",
    studentCount: 35,
  },
]

const roleNames = {
  student: "Alex Johnson",
  teacher: "Dr. Sarah Mitchell",
  admin: "Admin User",
}

// Custom SyncAcademia logo
function SyncLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="url(#logoGrad2)" />
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
        <linearGradient id="logoGrad2" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#14B8A6" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function ClassroomLanding({ role, onClassroomSelect, onLogout }: ClassroomLandingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SyncLogo className="w-10 h-10" />
            <div>
              <h1 className="font-bold text-foreground">SyncAcademia</h1>
              <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={`/.jpg?height=36&width=36&query=${role} avatar`} />
                <AvatarFallback>{roleNames[role].charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{roleNames[role]}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">Your Classes</h2>
          <p className="text-muted-foreground">Select a class to view details and manage your work.</p>
        </motion.div>

        {/* Classroom Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom, index) => (
            <motion.div
              key={classroom.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onClassroomSelect(classroom)}
              className="cursor-pointer group"
            >
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Colored Header */}
                <div className={`h-28 bg-gradient-to-br ${classroom.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <BookOpen className="w-10 h-10 text-white/80 mb-2" />
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {classroom.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{classroom.teacher}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{classroom.studentCount} students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>3 pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-card/80 backdrop-blur rounded-xl border border-border/50 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-teal-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{classrooms.length}</p>
              <p className="text-sm text-muted-foreground">Active Classes</p>
            </div>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl border border-border/50 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
            </div>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl border border-border/50 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">87%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  )
}
