"use client"

import { AlertTriangle, Clock, BookOpen, TrendingUp, FileX } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Classroom } from "@/app/page"

interface StudentDashboardProps {
  onClassroomClick: (classroom: Classroom) => void
}

type UrgencyLevel = "high" | "medium" | "low"

const tasks: { id: number; title: string; subject: string; due: string; urgency: UrgencyLevel; progress: number }[] = [
  { id: 1, title: "Physics Lab Report", subject: "Physics", due: "Tomorrow", urgency: "high", progress: 45 },
  { id: 2, title: "Calculus Problem Set", subject: "Math", due: "In 2 days", urgency: "medium", progress: 20 },
  { id: 3, title: "History Essay Draft", subject: "History", due: "In 3 days", urgency: "medium", progress: 60 },
  { id: 4, title: "Chemistry Quiz Prep", subject: "Chemistry", due: "Friday", urgency: "high", progress: 10 },
  { id: 5, title: "English Book Report", subject: "English", due: "Next week", urgency: "low", progress: 80 },
]

const heatmapData = [
  { day: "Mon", level: 1 },
  { day: "Tue", level: 2 },
  { day: "Wed", level: 1 },
  { day: "Thu", level: 3 },
  { day: "Fri", level: 4 },
  { day: "Sat", level: 1 },
  { day: "Sun", level: 0 },
]

const classrooms: Classroom[] = [
  { id: "1", name: "AP Physics", subject: "Physics", teacher: "Dr. Newton", color: "bg-blue-500", studentCount: 28 },
  { id: "2", name: "Calculus II", subject: "Math", teacher: "Prof. Euler", color: "bg-emerald-500", studentCount: 32 },
  { id: "3", name: "World History", subject: "History", teacher: "Ms. Adams", color: "bg-amber-500", studentCount: 25 },
  { id: "4", name: "Chemistry", subject: "Chemistry", teacher: "Dr. Curie", color: "bg-rose-500", studentCount: 30 },
]

const urgencyColors = {
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-teal-500/10 text-teal-600 border-teal-500/20",
}

const heatmapColors = ["bg-teal-100", "bg-teal-200", "bg-amber-200", "bg-orange-300", "bg-orange-500"]

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <FileX className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

export default function StudentDashboard({ onClassroomClick }: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">Here's your academic overview for this week.</p>
      </div>

      {/* Conflict Alert - updated to orange */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Warning: 3 overlapping deadlines on Friday</p>
              <p className="text-sm text-muted-foreground">
                Physics Lab Report, Chemistry Quiz, and Math Problem Set are all due on the same day.
              </p>
            </div>
            <Badge className="bg-orange-500 text-white hover:bg-orange-600">Action Needed</Badge>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unified Task Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-500" />
              Unified Task Timeline
            </CardTitle>
            <Badge variant="secondary">{tasks.length} Tasks</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <EmptyState message="No tasks scheduled. Enjoy your free time!" />
            ) : (
              tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      <Badge variant="outline" className={urgencyColors[task.urgency]}>
                        {task.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.subject} • Due {task.due}
                    </p>
                  </div>
                  <div className="w-32 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2 [&>div]:bg-teal-500" />
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Workload Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Weekly Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {heatmapData.map((day) => (
                  <motion.div key={day.day} whileHover={{ scale: 1.1 }} className="text-center">
                    <div
                      className={`w-full aspect-square rounded-lg ${heatmapColors[day.level]} mb-2 transition-all hover:shadow-md`}
                    />
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-teal-200" />
                  <span>Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500" />
                  <span>Overloaded</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classroom Cards - with hover effect */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-500" />
          My Classes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classrooms.map((classroom, index) => (
            <motion.div
              key={classroom.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                onClick={() => onClassroomClick(classroom)}
              >
                <CardContent className="p-0">
                  <div
                    className={`h-24 ${classroom.color} rounded-t-lg flex items-center justify-center relative overflow-hidden`}
                  >
                    <BookOpen className="w-10 h-10 text-white/80" />
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{classroom.name}</h3>
                    <p className="text-sm text-muted-foreground">{classroom.teacher}</p>
                    <p className="text-xs text-muted-foreground mt-2">{classroom.studentCount} students</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}