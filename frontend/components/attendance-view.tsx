"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// STABLE DATA GENERATION (Fixed Seed Logic)
const generateCleanAttendance = () => {
  const weeks = []
  // Simulate 5 weeks
  for (let w = 0; w < 5; w++) {
    const week: any = {}
    for (let d = 0; d < 7; d++) {
      if (d === 0 || d === 6) {
        week[d] = "weekend"
      } else {
        // Create a pattern: mostly present, a few absences in week 2 & 4
        if ((w === 1 && d === 2) || (w === 3 && d === 4)) {
          week[d] = "absent"
        } else {
          week[d] = "present"
        }
      }
    }
    weeks.push(week)
  }
  return weeks
}

const attendanceData = generateCleanAttendance()
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
]

export default function AttendanceView() {
  const [currentMonth, setCurrentMonth] = useState(0) // January

  // Precise Calculation
  const flatData = attendanceData.flat()
  // Count only weekdays (Mon-Fri) for valid calculation
  let totalWorkingDays = 0
  let presentCount = 0
  
  attendanceData.forEach(week => {
    Object.values(week).forEach(status => {
      if (status !== 'weekend') {
        totalWorkingDays++
        if (status === 'present') presentCount++
      }
    })
  })

  // Avoid NaN by checking if total > 0
  const percentage = totalWorkingDays > 0 
    ? Math.round((presentCount / totalWorkingDays) * 100) 
    : 0

  // Circle Math
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground dark:text-white">Attendance Record</h1>
        <p className="text-muted-foreground dark:text-gray-400">Track your daily presence and stats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Calendar Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg dark:text-white">Monthly View</CardTitle>
              <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(m => Math.max(0, m - 1))}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold min-w-[100px] text-center dark:text-white">
                  {months[currentMonth]} 2026
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(m => Math.min(11, m + 1))}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {days.map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="space-y-2">
                {attendanceData.map((week, wIndex) => (
                  <div key={wIndex} className="grid grid-cols-7 gap-2">
                    {Object.entries(week).map(([dIndex, status]) => {
                      // Fake date calculation for visuals
                      const dayNum = wIndex * 7 + parseInt(dIndex) - (wIndex * 2) + 1
                      const showDay = dayNum > 0 && dayNum <= 31

                      return (
                        <motion.div
                          key={dIndex}
                          whileHover={{ scale: showDay ? 1.05 : 1 }}
                          className={`
                            aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                            ${!showDay ? "opacity-0" : ""}
                            ${status === "present" ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                            ${status === "absent" ? "bg-red-100 text-red-700 border-2 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" : ""}
                            ${status === "weekend" ? "bg-gray-50 text-gray-400 dark:bg-gray-800/50 dark:text-gray-600" : ""}
                          `}
                        >
                          {showDay ? dayNum : ""}
                        </motion.div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-xs text-muted-foreground">Weekend</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT: Stats Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          
          {/* Main Percentage Card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-center dark:text-white">Attendance Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80" cy="80" r={radius}
                    stroke="currentColor" strokeWidth="12" fill="none"
                    className="text-gray-100 dark:text-gray-700"
                  />
                  <motion.circle
                    cx="80" cy="80" r={radius}
                    stroke="url(#gradient)" strokeWidth="12" fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ strokeDasharray: circumference }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground dark:text-white">{percentage}%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Overall</span>
                </div>
              </div>
              <p className={`text-sm font-medium mt-4 px-3 py-1 rounded-full ${
                percentage > 85 ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
              }`}>
                {percentage >= 85 ? "🎉 Excellent Record" : "⚠️ Needs Improvement"}
              </p>
            </CardContent>
          </Card>

          {/* Breakdown Card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base dark:text-white">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm text-muted-foreground">Present Days</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm text-muted-foreground">Absent Days</span>
                <span className="font-bold text-red-600 dark:text-red-400">{totalWorkingDays - presentCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm text-muted-foreground">Total Working Days</span>
                <span className="font-bold text-foreground dark:text-white">{totalWorkingDays}</span>
              </div>
              
              <div className="pt-4 mt-2 border-t dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Required Target</span>
                  <span className="text-xs font-bold">75%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 w-[75%] rounded-full opacity-30" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}