"use client"

import { useState } from "react"
import { ArrowLeft, MessageSquare, FileText, Calendar, Clock, Paperclip, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Classroom, UserRole } from "@/app/page"

interface ClassroomDetailProps {
  classroom: Classroom
  role: UserRole
  onBack: () => void
}

const streamPosts = [
  {
    id: 1,
    author: "Dr. Newton",
    avatar: "DN",
    content:
      "Welcome to Week 6! This week we'll be covering electromagnetic waves. Please review Chapter 12 before our Tuesday lecture.",
    time: "2 hours ago",
    attachments: ["lecture_slides.pdf"],
  },
  {
    id: 2,
    author: "Dr. Newton",
    avatar: "DN",
    content: "Lab Report #3 has been graded. Great work everyone! Check your feedback in the Classwork tab.",
    time: "1 day ago",
    attachments: [],
  },
  {
    id: 3,
    author: "System",
    avatar: "SA",
    content: "New assignment posted: Final Project Proposal - Due in 2 weeks",
    time: "2 days ago",
    attachments: ["project_guidelines.pdf", "rubric.pdf"],
  },
]

const classwork = [
  { id: 1, title: "Lab Report #4", type: "Assignment", due: "Jan 20", status: "pending", points: 100 },
  { id: 2, title: "Chapter 12 Quiz", type: "Quiz", due: "Jan 18", status: "pending", points: 50 },
  { id: 3, title: "Lab Report #3", type: "Assignment", due: "Jan 13", status: "graded", points: 100, score: 92 },
  { id: 4, title: "Midterm Exam", type: "Exam", due: "Jan 10", status: "graded", points: 200, score: 178 },
]

const ganttData = [
  {
    subject: "Physics",
    tasks: [
      { name: "Lab Report", start: 0, duration: 5 },
      { name: "Quiz", start: 3, duration: 2 },
    ],
  },
  {
    subject: "Math",
    tasks: [
      { name: "Problem Set", start: 1, duration: 3 },
      { name: "Test", start: 6, duration: 1 },
    ],
  },
  { subject: "Chemistry", tasks: [{ name: "Lab", start: 2, duration: 4 }] },
  { subject: "History", tasks: [{ name: "Essay", start: 4, duration: 5 }] },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const subjectColors: Record<string, string> = {
  Physics: "bg-blue-500",
  Math: "bg-emerald-500",
  Chemistry: "bg-rose-500",
  History: "bg-amber-500",
}

const classroomColorMap: Record<string, string> = {
  "bg-blue-500": "from-blue-500 to-blue-600",
  "bg-emerald-500": "from-emerald-500 to-emerald-600",
  "bg-amber-500": "from-amber-500 to-orange-500",
  "bg-rose-500": "from-rose-500 to-pink-600",
  "bg-indigo-500": "from-indigo-500 to-violet-600",
  "bg-cyan-500": "from-cyan-500 to-teal-600",
}

export default function ClassroomDetail({ classroom, role, onBack }: ClassroomDetailProps) {
  const [activeTab, setActiveTab] = useState("stream")
  const gradientClass = classroomColorMap[classroom.color] || "from-teal-500 to-teal-600"

  return (
    <div className="space-y-6">
      {/* Header - updated with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${gradientClass} text-white rounded-2xl overflow-hidden`}
      >
        <div className="p-6 relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4 relative z-10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold relative z-10">{classroom.name}</h1>
          <p className="text-white/80 mt-1 relative z-10">{classroom.teacher}</p>
          <p className="text-white/60 text-sm mt-2 relative z-10">{classroom.studentCount} students enrolled</p>
        </div>
      </motion.div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="stream" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Stream
          </TabsTrigger>
          <TabsTrigger value="classwork" className="gap-2">
            <FileText className="w-4 h-4" />
            Classwork
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="w-4 h-4" />
            Smart Schedule
          </TabsTrigger>
        </TabsList>

        {/* Stream Tab */}
        <TabsContent value="stream" className="space-y-4">
          {role === "teacher" && (
            <motion.div whileHover={{ scale: 1.01 }}>
              <Card className="border-dashed border-2 cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all">
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">Click to create a new announcement...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {streamPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="py-4">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={`/.jpg?height=40&width=40&query=${post.author}`} />
                      <AvatarFallback>{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{post.author}</span>
                        <span className="text-sm text-muted-foreground">{post.time}</span>
                      </div>
                      <p className="text-foreground">{post.content}</p>
                      {post.attachments.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {post.attachments.map((file) => (
                            <Badge key={file} variant="secondary" className="gap-1 hover:bg-teal-500/10 cursor-pointer">
                              <Paperclip className="w-3 h-3" />
                              {file}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Classwork Tab */}
        <TabsContent value="classwork" className="space-y-4">
          {classwork.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.type === "Assignment"
                          ? "bg-teal-500/10 text-teal-500"
                          : item.type === "Quiz"
                            ? "bg-orange-500/10 text-orange-500"
                            : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.type}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>Due {item.due}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.status === "graded" ? (
                        <div>
                          <span className="text-lg font-bold text-teal-600">
                            {item.score}/{item.points}
                          </span>
                          <Badge variant="outline" className="ml-2 border-teal-500 text-teal-600">
                            Graded
                          </Badge>
                        </div>
                      ) : (
                        <div>
                          <span className="text-muted-foreground">{item.points} pts</span>
                          <Badge variant="secondary" className="ml-2">
                            Pending
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Smart Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" />
                Cross-Subject Schedule View
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare {classroom.subject} tasks against your other subjects
              </p>
            </CardHeader>
            <CardContent>
              {/* Gantt Chart */}
              <div className="space-y-4">
                {/* Days Header */}
                <div className="flex">
                  <div className="w-24 shrink-0" />
                  <div className="flex-1 grid grid-cols-7 gap-1">
                    {days.map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gantt Rows */}
                {ganttData.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-24 shrink-0 text-sm font-medium pr-4">
                      <Badge
                        variant="outline"
                        className={`${subject.subject === classroom.subject ? "border-teal-500 bg-teal-500/10 text-teal-600" : ""}`}
                      >
                        {subject.subject}
                      </Badge>
                    </div>
                    <div className="flex-1 grid grid-cols-7 gap-1 h-10 relative">
                      {/* Background grid */}
                      {days.map((_, i) => (
                        <div key={i} className="bg-muted/30 rounded" />
                      ))}
                      {/* Tasks */}
                      {subject.tasks.map((task, taskIndex) => (
                        <motion.div
                          key={taskIndex}
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                          className={`absolute top-1 h-8 ${subjectColors[subject.subject]} rounded-md flex items-center px-2 text-white text-xs font-medium overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                          style={{
                            left: `calc(${(task.start / 7) * 100}% + 2px)`,
                            width: `calc(${(task.duration / 7) * 100}% - 4px)`,
                          }}
                        >
                          {task.name}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Legend:</span>
                {Object.entries(subjectColors).map(([subject, color]) => (
                  <div key={subject} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${color}`} />
                    <span className="text-sm">{subject}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation Card - updated to teal/orange */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="mt-4 border-teal-500/50 bg-gradient-to-r from-teal-500/5 to-emerald-500/5">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      AI Schedule Intelligence
                      <Badge className="bg-teal-500 text-white text-xs">Smart</Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Thursday-Friday has high task density. Consider starting Physics Lab Report early to avoid overlap
                      with Math Test.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
