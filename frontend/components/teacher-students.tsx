"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Search, Mail, BookOpen, ArrowLeft, MoreVertical, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// --- TYPES & MOCK DATA ---
type StudentStatus = "available" | "busy" | "absent" | "pending";

interface Student {
  id: number;
  rollNo: number;
  name: string;
  email: string;
  status: StudentStatus;
  grade: number;
  trend: "up" | "down";
  submissions: number;
  totalAssignments: number;
  lastActive: string;
}

const classrooms = [
  { id: "c1", name: "CS-2024-A", subject: "Computer Science", count: 42, color: "bg-blue-500" },
  { id: "c2", name: "CS-2024-B", subject: "Computer Science", count: 38, color: "bg-indigo-500" },
  { id: "c3", name: "IT-2024-A", subject: "Information Tech", count: 45, color: "bg-teal-500" },
]

// Generating dummy students for the selected class
const generateStudents = (classId: string): Student[] => {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    rollNo: i + 1,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@university.edu`,
    status: i % 10 === 0 ? "absent" : i % 7 === 0 ? "busy" : "available",
    grade: 70 + Math.floor(Math.random() * 30),
    trend: Math.random() > 0.5 ? "up" : "down",
    submissions: 12 + Math.floor(Math.random() * 4),
    totalAssignments: 16,
    lastActive: `${Math.floor(Math.random() * 5)} hours ago`
  }));
};

export default function TeacherStudents() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const currentStudents = selectedClass ? generateStudents(selectedClass) : []

  // Filter for the grid
  const filteredStudents = currentStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.toString().includes(searchQuery)
  )

  const getStatusColor = (status: StudentStatus) => {
    switch (status) {
      case "available": return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
      case "busy": return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200";
      case "absent": return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedClass && (
            <Button variant="ghost" size="icon" onClick={() => {
                setSelectedClass(null);
                setSelectedStudent(null);
            }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-violet-500" />
              {selectedClass ? classrooms.find(c => c.id === selectedClass)?.name : "Student Management"}
            </h1>
            <p className="text-muted-foreground">
              {selectedClass ? "View real-time status and performance" : "Select a classroom to view students"}
            </p>
          </div>
        </div>
        
        {selectedClass && (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mr-4">
                    <span className="w-3 h-3 bg-emerald-400 rounded-sm"></span> Available
                    <span className="w-3 h-3 bg-orange-400 rounded-sm ml-2"></span> Viva/Busy
                    <span className="w-3 h-3 bg-red-400 rounded-sm ml-2"></span> Absent
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search Name or Roll No..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>
            </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: CLASSROOM SELECTION */}
        {!selectedClass ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {classrooms.map((cls) => (
              <Card 
                key={cls.id} 
                className="cursor-pointer hover:shadow-lg transition-all hover:border-violet-300 group"
                onClick={() => setSelectedClass(cls.id)}
              >
                <CardContent className="p-0">
                  <div className={`h-24 ${cls.color} rounded-t-xl flex items-center justify-center relative overflow-hidden`}>
                    <BookOpen className="w-10 h-10 text-white/90 group-hover:scale-110 transition-transform" />
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{cls.name}</h3>
                        <Badge variant="secondary">{cls.count} Students</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{cls.subject}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        38 Students Active
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          /* VIEW 2: STUDENT GRID + DETAILS */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* LEFT: STUDENT GRID */}
            <Card className="lg:col-span-2 border-none shadow-none bg-transparent">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {filteredStudents.map((student) => (
                        <motion.button
                            key={student.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedStudent(student)}
                            className={cn(
                                "aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all shadow-sm",
                                getStatusColor(student.status),
                                selectedStudent?.id === student.id ? "ring-2 ring-violet-500 ring-offset-2" : ""
                            )}
                        >
                            <span className="text-lg font-bold">{student.rollNo}</span>
                            <span className="text-[10px] uppercase font-bold opacity-70">{student.status}</span>
                        </motion.button>
                    ))}
                </div>
            </Card>

            {/* RIGHT: STUDENT DETAIL CARD */}
            <div className="lg:col-span-1">
                <AnimatePresence mode="wait">
                    {selectedStudent ? (
                        <motion.div
                            key={selectedStudent.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Card className="sticky top-6 border-violet-200 shadow-lg">
                                <CardHeader className="bg-muted/30 pb-8">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <Avatar className="w-16 h-16 border-4 border-white shadow-md">
                                                <AvatarFallback className="bg-violet-600 text-white text-xl">
                                                    {selectedStudent.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle>{selectedStudent.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">Roll No: {selectedStudent.rollNo}</p>
                                                <Badge className={cn("mt-2 capitalize", getStatusColor(selectedStudent.status))}>
                                                    {selectedStudent.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4"/></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem><Mail className="w-4 h-4 mr-2"/> Email</DropdownMenuItem>
                                                <DropdownMenuItem><FileText className="w-4 h-4 mr-2"/> Report</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="-mt-4">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-3 bg-white rounded-lg border shadow-sm text-center">
                                            <p className="text-xs text-muted-foreground">Average Grade</p>
                                            <p className="text-2xl font-bold text-violet-600">{selectedStudent.grade}%</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border shadow-sm text-center">
                                            <p className="text-xs text-muted-foreground">Submissions</p>
                                            <p className="text-2xl font-bold text-emerald-600">{selectedStudent.submissions}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Assignment Completion</span>
                                                <span className="font-bold">{Math.round((selectedStudent.submissions/selectedStudent.totalAssignments)*100)}%</span>
                                            </div>
                                            <Progress value={(selectedStudent.submissions/selectedStudent.totalAssignments)*100} className="h-2" />
                                        </div>
                                        
                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-semibold mb-2">Recent Activity</h4>
                                            <div className="text-sm text-muted-foreground space-y-2">
                                                <p>• Submitted Physics Lab Report</p>
                                                <p>• Viewed Calculus II Materials</p>
                                                <p className="text-xs italic text-right mt-2">Last active: {selectedStudent.lastActive}</p>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-violet-600 hover:bg-violet-700">View Full Profile</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed rounded-xl">
                            <Users className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a student from the grid to view details</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}