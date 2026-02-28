"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, FileText, CheckCircle, Award, CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const classPerformance = [
  { name: "CS 101 - Section A", avgGrade: 85, students: 32, submissions: 94 },
  { name: "CS 101 - Section B", avgGrade: 78, students: 28, submissions: 87 },
  { name: "Data Structures", avgGrade: 82, students: 35, submissions: 91 },
  { name: "Algorithms", avgGrade: 76, students: 30, submissions: 83 },
]

const weeklySubmissions = [
  { day: "Mon", count: 45 },
  { day: "Tue", count: 32 },
  { day: "Wed", count: 28 },
  { day: "Thu", count: 56 },
  { day: "Fri", count: 78 },
  { day: "Sat", count: 23 },
  { day: "Sun", count: 15 },
]

const gradeDistribution = [
  { grade: "A", count: 28, percentage: 22 },
  { grade: "B", count: 45, percentage: 36 },
  { grade: "C", count: 32, percentage: 25 },
  { grade: "D", count: 15, percentage: 12 },
  { grade: "F", count: 6, percentage: 5 },
]

export default function TeacherAnalytics() {
  const maxSubmissions = Math.max(...weeklySubmissions.map((d) => d.count))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-violet-500" />
          Analytics
        </h1>
        <p className="text-muted-foreground">Track class performance and student engagement.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "125", change: "+5%", icon: Users, color: "text-violet-500" },
          { label: "Avg Class Grade", value: "80%", change: "+3%", icon: Award, color: "text-emerald-500" },
          { label: "Pending Reviews", value: "23", change: "-12%", icon: FileText, color: "text-amber-500" },
          { label: "Avg Attendance", value: "92%", change: "+1.2%", icon: CheckCircle, color: "text-blue-500" },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2 rounded-lg bg-opacity-10", metric.color.replace("text-", "bg-"))}>
                    <metric.icon className={cn("w-5 h-5", metric.color)} />
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", metric.change.startsWith("+") ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50")}
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className="mt-3">
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              Class Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classPerformance.map((cls, index) => (
              <motion.div
                key={cls.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">{cls.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{cls.avgGrade}%</p>
                    <p className="text-xs text-muted-foreground">{cls.submissions}% submitted</p>
                  </div>
                </div>
                <Progress 
                    value={cls.avgGrade} 
                    className={cn("h-2", cls.avgGrade > 80 ? "bg-emerald-500" : cls.avgGrade > 70 ? "bg-blue-500" : "bg-amber-500")}
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="w-5 h-5 text-emerald-500" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gradeDistribution.map((item, index) => (
                <motion.div
                  key={item.grade}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {item.grade}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">{item.count} students</span>
                      <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Submissions Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            Weekly Activity & Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-4 pt-4">
            {weeklySubmissions.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / maxSubmissions) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-full flex flex-col items-center justify-end h-full relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {day.count} Submissions
                  </div>
                  
                  <div
                    className={cn("w-full rounded-t-sm transition-all duration-300", 
                        day.day === "Fri" ? "bg-violet-500 shadow-lg shadow-violet-200" : "bg-violet-200 group-hover:bg-violet-400"
                    )}
                    style={{ height: `${(day.count / maxSubmissions) * 100}%`, minHeight: "8px" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}