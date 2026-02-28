"use client"

import { motion } from "framer-motion"
import { Sparkles, Brain, Target, TrendingUp, Clock, Zap, BookOpen, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const studyRecommendations = [
  {
    subject: "Mathematics",
    topic: "Calculus - Integration",
    priority: "high",
    reason: "Quiz in 2 days",
    estimatedTime: "45 min",
    progress: 35,
  },
  {
    subject: "Physics",
    topic: "Electromagnetic Waves",
    priority: "medium",
    reason: "Low quiz score",
    estimatedTime: "30 min",
    progress: 60,
  },
  {
    subject: "Chemistry",
    topic: "Organic Reactions",
    priority: "medium",
    reason: "Assignment due soon",
    estimatedTime: "40 min",
    progress: 45,
  },
  {
    subject: "English",
    topic: "Essay Writing",
    priority: "low",
    reason: "Regular review",
    estimatedTime: "20 min",
    progress: 80,
  },
]

const studyStats = [
  { label: "Study Streak", value: "7 days", icon: Zap, color: "text-amber-500" },
  { label: "Focus Score", value: "85%", icon: Target, color: "text-emerald-500" },
  { label: "Topics Mastered", value: "12", icon: Award, color: "text-violet-500" },
  { label: "Hours This Week", value: "18h", icon: Clock, color: "text-blue-500" },
]

const focusTips = [
  "Take a 5-minute break every 25 minutes (Pomodoro Technique)",
  "Review your notes from yesterday's classes",
  "Try explaining concepts to yourself out loud",
  "Use practice problems to test your understanding",
]

export default function SmartStudy() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            Smart Study
          </h1>
          <p className="text-muted-foreground">AI-powered study recommendations based on your performance</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <Brain className="w-4 h-4 mr-2" />
          Start Focus Session
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {studyStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Study Recommendations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-500" />
              Recommended Study Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studyRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border transition-all hover:shadow-md",
                  rec.priority === "high"
                    ? "bg-rose-500/5 border-rose-500/20"
                    : rec.priority === "medium"
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-muted/30 border-border/50",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{rec.subject}</h3>
                      <Badge variant={rec.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.topic}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Study
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{rec.reason}</span>
                  <span className="text-muted-foreground">{rec.estimatedTime}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Mastery Progress</span>
                    <span className="text-foreground font-medium">{rec.progress}%</span>
                  </div>
                  <Progress value={rec.progress} className="h-2" />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Focus Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-500" />
              Focus Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {focusTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-500">{index + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Weekly Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
              const height = [65, 80, 45, 90, 75, 30, 85][index]
              return (
                <motion.div
                  key={day}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className={cn("w-full rounded-t-lg", index === 6 ? "bg-violet-500" : "bg-violet-500/30")}
                    style={{ height: "100%" }}
                  />
                  <span className="text-xs text-muted-foreground">{day}</span>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
