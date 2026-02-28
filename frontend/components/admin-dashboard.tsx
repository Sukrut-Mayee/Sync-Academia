"use client"

import { AlertTriangle, Users, TrendingUp, Activity, BarChart3, FileX } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const overloadedBatches = [
  { batch: "CS-2024-A", violations: 5, severity: "high", avgWorkload: 8.2 },
  { batch: "IT-2024-B", violations: 3, severity: "medium", avgWorkload: 6.5 },
  { batch: "CS-2024-B", violations: 2, severity: "low", avgWorkload: 5.1 },
]

const engagementData = [
  { metric: "Assignment Completion", value: 87, trend: "+5%" },
  { metric: "Class Attendance", value: 92, trend: "+2%" },
  { metric: "Forum Participation", value: 64, trend: "-3%" },
  { metric: "Resource Access", value: 78, trend: "+8%" },
]

const burnoutRisk = [
  { batch: "CS-2024-A", risk: 75, students: 12 },
  { batch: "IT-2024-A", risk: 45, students: 8 },
  { batch: "CS-2024-B", risk: 30, students: 5 },
  { batch: "IT-2024-B", risk: 55, students: 10 },
]

const weeklyTrend = [
  { week: "W1", submissions: 85, onTime: 78 },
  { week: "W2", submissions: 92, onTime: 85 },
  { week: "W3", submissions: 78, onTime: 65 },
  { week: "W4", submissions: 88, onTime: 80 },
]

const heatmapGrid = [
  { batch: "CS-2024-A", mon: 3, tue: 5, wed: 4, thu: 7, fri: 8 },
  { batch: "CS-2024-B", mon: 2, tue: 3, wed: 5, thu: 4, fri: 6 },
  { batch: "IT-2024-A", mon: 4, tue: 2, wed: 3, thu: 5, fri: 4 },
  { batch: "IT-2024-B", mon: 1, tue: 4, wed: 6, thu: 3, fri: 5 },
  { batch: "EC-2024-A", mon: 3, tue: 3, wed: 2, thu: 6, fri: 7 },
]

const getHeatmapColor = (value: number) => {
  if (value <= 2) return "bg-teal-200"
  if (value <= 4) return "bg-teal-400"
  if (value <= 5) return "bg-amber-300"
  if (value <= 6) return "bg-orange-400"
  return "bg-orange-600"
}

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

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
        <p className="text-muted-foreground">Monitor and resolve academic coordination issues.</p>
      </div>

      {/* Stats Overview - updated colors */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2, scale: 1.02 }}>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,247</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -2, scale: 1.02 }}>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">87%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -2, scale: 1.02 }}>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">10</p>
                <p className="text-sm text-muted-foreground">Policy Violations</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -2, scale: 1.02 }}>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">35</p>
                <p className="text-sm text-muted-foreground">At-Risk Students</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deadlock Analytics Heatmap - NEW */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Deadlock Analytics - Workload Heatmap
          </CardTitle>
          <p className="text-sm text-muted-foreground">Task distribution across batches and days</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header Row */}
            <div className="flex items-center">
              <div className="w-24 shrink-0" />
              <div className="flex-1 grid grid-cols-5 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Rows */}
            {heatmapGrid.map((row, index) => (
              <motion.div
                key={row.batch}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center"
              >
                <div className="w-24 shrink-0 text-sm font-medium">{row.batch}</div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {[row.mon, row.tue, row.wed, row.thu, row.fri].map((value, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className={`h-10 rounded-lg ${getHeatmapColor(value)} flex items-center justify-center text-sm font-medium cursor-pointer transition-all hover:shadow-md ${value > 5 ? "text-white" : "text-gray-700"}`}
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Legend:</span>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-teal-200" />
              <span className="text-xs">1-2</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-teal-400" />
              <span className="text-xs">3-4</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-amber-300" />
              <span className="text-xs">5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-orange-400" />
              <span className="text-xs">6</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-orange-600" />
              <span className="text-xs">7+</span>
            </div>
            <span className="text-xs text-muted-foreground ml-2">(tasks per day)</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadlock Resolution - updated colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Overloaded Batches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overloadedBatches.length === 0 ? (
              <EmptyState message="No overloaded batches detected." />
            ) : (
              overloadedBatches.map((batch, index) => (
                <motion.div
                  key={batch.batch}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 space-y-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{batch.batch}</span>
                      <Badge
                        className={
                          batch.severity === "high"
                            ? "bg-orange-500 text-white"
                            : batch.severity === "medium"
                              ? "bg-amber-500 text-white"
                              : "bg-teal-500 text-white"
                        }
                      >
                        {batch.violations} violations
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">Avg: {batch.avgWorkload} tasks/day</span>
                  </div>
                  <Progress
                    value={(batch.avgWorkload / 10) * 100}
                    className={`h-2 ${
                      batch.severity === "high"
                        ? "[&>div]:bg-orange-500"
                        : batch.severity === "medium"
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-teal-500"
                    }`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Policy limit: 5 tasks/day • Current average exceeds by{" "}
                    {Math.max(0, batch.avgWorkload - 5).toFixed(1)} tasks
                  </p>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Student Engagement - updated colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-500" />
              Student Engagement Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {engagementData.map((item, index) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.value}%</span>
                    <Badge
                      className={
                        item.trend.startsWith("+")
                          ? "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20"
                          : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                      }
                    >
                      {item.trend}
                    </Badge>
                  </div>
                </div>
                <Progress value={item.value} className="h-2 [&>div]:bg-teal-500" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Burnout Risk Assessment - updated colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Burnout Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {burnoutRisk.map((batch, index) => (
                <motion.div
                  key={batch.batch}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-24 text-sm font-medium">{batch.batch}</div>
                  <div className="flex-1">
                    <Progress
                      value={batch.risk}
                      className={`h-3 ${
                        batch.risk > 60
                          ? "[&>div]:bg-orange-500"
                          : batch.risk > 40
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-teal-500"
                      }`}
                    />
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium">{batch.risk}%</span>
                    <p className="text-xs text-muted-foreground">{batch.students} students</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
              Risk is calculated based on workload density, deadline clustering, and assignment complexity.
            </p>
          </CardContent>
        </Card>

        {/* Weekly Submission Trends - updated colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Weekly Submission Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyTrend.map((week, index) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 text-sm font-medium text-muted-foreground">{week.week}</div>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-teal-500/20 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${week.submissions}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-teal-500 rounded-full flex items-center justify-end pr-2"
                      >
                        <span className="text-xs text-white font-medium">{week.submissions}%</span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-sm text-teal-600 font-medium">{week.onTime}% on time</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
