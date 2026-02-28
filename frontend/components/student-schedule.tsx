"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, FileText, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const scheduleData = [
  {
    day: "Mon",
    date: 13,
    events: [
      { time: "09:00", title: "Mathematics", type: "class", color: "bg-blue-500", duration: 90 },
      { time: "11:00", title: "Physics Lab", type: "lab", color: "bg-emerald-500", duration: 120 },
      { time: "14:00", title: "Assignment Due", type: "deadline", color: "bg-rose-500", duration: 30 },
    ],
  },
  {
    day: "Tue",
    date: 14,
    events: [
      { time: "10:00", title: "Chemistry", type: "class", color: "bg-purple-500", duration: 60 },
      { time: "13:00", title: "Study Group", type: "meeting", color: "bg-amber-500", duration: 60 },
    ],
  },
  {
    day: "Wed",
    date: 15,
    events: [
      { time: "09:00", title: "English Literature", type: "class", color: "bg-pink-500", duration: 90 },
      { time: "11:30", title: "Quiz: Physics", type: "exam", color: "bg-red-500", duration: 45 },
      { time: "15:00", title: "Project Meeting", type: "meeting", color: "bg-cyan-500", duration: 60 },
    ],
  },
  {
    day: "Thu",
    date: 16,
    events: [
      { time: "08:30", title: "Mathematics", type: "class", color: "bg-blue-500", duration: 90 },
      { time: "14:00", title: "Computer Science", type: "class", color: "bg-indigo-500", duration: 120 },
    ],
  },
  {
    day: "Fri",
    date: 17,
    events: [
      { time: "10:00", title: "Essay Submission", type: "deadline", color: "bg-rose-500", duration: 30 },
      { time: "13:00", title: "Chemistry Lab", type: "lab", color: "bg-emerald-500", duration: 150 },
    ],
  },
]

const upcomingDeadlines = [
  { title: "Math Assignment", subject: "Mathematics", due: "Today, 2:00 PM", urgent: true },
  { title: "Physics Lab Report", subject: "Physics", due: "Tomorrow, 11:59 PM", urgent: true },
  { title: "Essay Draft", subject: "English", due: "Jan 17, 10:00 AM", urgent: false },
  { title: "Group Project", subject: "Computer Science", due: "Jan 20, 5:00 PM", urgent: false },
]

export default function StudentSchedule() {
  const [selectedDay, setSelectedDay] = useState(0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground">Week of January 13 - 17, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline">Today</Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-500" />
              Weekly View
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Day Selector */}
            <div className="flex gap-2 mb-6">
              {scheduleData.map((day, index) => (
                <motion.button
                  key={day.day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(index)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-center transition-all",
                    selectedDay === index
                      ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg"
                      : "bg-muted/50 hover:bg-muted text-foreground",
                  )}
                >
                  <p className="text-xs font-medium opacity-80">{day.day}</p>
                  <p className="text-lg font-bold">{day.date}</p>
                </motion.button>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {scheduleData[selectedDay].events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-violet-500/30 transition-colors"
                >
                  <div className={cn("w-1 h-12 rounded-full", event.color)} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                      <span>•</span>
                      <span>{event.duration} min</span>
                    </div>
                  </div>
                  <Badge variant={event.type === "deadline" ? "destructive" : "secondary"}>{event.type}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-3 rounded-xl border transition-colors",
                  deadline.urgent ? "bg-rose-500/5 border-rose-500/20" : "bg-muted/30 border-border/50",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.subject}</p>
                  </div>
                  {deadline.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className={cn("text-xs mt-2", deadline.urgent ? "text-rose-500" : "text-muted-foreground")}>
                  Due: {deadline.due}
                </p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Classes This Week", value: "12", color: "text-blue-500" },
          { icon: FileText, label: "Assignments Due", value: "4", color: "text-rose-500" },
          { icon: Users, label: "Study Sessions", value: "3", color: "text-emerald-500" },
          { icon: Clock, label: "Study Hours", value: "18h", color: "text-amber-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
