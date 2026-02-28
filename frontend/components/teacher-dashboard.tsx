"use client"

import { useState, useEffect } from "react"
import { Plus, Users, CheckCircle, AlertCircle, Calendar, BookOpen, FileX, Check, X, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Classroom } from "@/app/page"

interface TeacherDashboardProps {
  onClassroomClick: (classroom: Classroom) => void
}

interface PendingRequest {
  studentName: string;
  studentEmail: string;
  reason: string;
  timestamp?: string;
}

interface Task {
  id: string;
  title: string;
  batch: string;
  dueDate: string;
}

const batchSchedule = [
  { batch: "CS-2024-A", monday: 3, tuesday: 2, wednesday: 4, thursday: 3, friday: 5 },
  { batch: "CS-2024-B", monday: 2, tuesday: 4, wednesday: 3, thursday: 4, friday: 4 },
  { batch: "IT-2024-A", monday: 4, tuesday: 3, wednesday: 2, thursday: 3, friday: 3 },
]

const classrooms: Classroom[] = [
  { id: "1", name: "AP Physics", subject: "Physics", teacher: "Dr. Mitchell", color: "bg-blue-500", studentCount: 28 },
  { id: "2", name: "Physics 101", subject: "Physics", teacher: "Dr. Mitchell", color: "bg-emerald-500", studentCount: 35 },
  { id: "3", name: "Advanced Mechanics", subject: "Physics", teacher: "Dr. Mitchell", color: "bg-cyan-500", studentCount: 22 },
]

const pendingGrading = [
  { id: 1, title: "Week 5 Assignment", submissions: 28, graded: 15, total: 28 },
  { id: 2, title: "Midterm Project", submissions: 30, graded: 8, total: 30 },
  { id: 3, title: "Lab Report #3", submissions: 25, graded: 25, total: 28 },
]

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

export default function TeacherDashboard({ onClassroomClick }: TeacherDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dashboardRequests, setDashboardRequests] = useState<PendingRequest[]>([])
  
  // --- Task List State ---
  const [createdTasks, setCreatedTasks] = useState<Task[]>([])

  // --- Conflict Detection State ---
  const [taskTitle, setTaskTitle] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [conflictScore, setConflictScore] = useState(0) // 0-100
  const [conflictMsg, setConflictMsg] = useState("Select a date to check conflicts.")
  const [isChecking, setIsChecking] = useState(false)

  // 1. Fetch Notifications & Tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Notifications
        const notifRes = await fetch('http://localhost:5000/api/status/notifications?teacherEmail=teacher@test.com');
        const notifData = await notifRes.json();
        if (Array.isArray(notifData)) setDashboardRequests(notifData.reverse());

        // Fetch Tasks
        const taskRes = await fetch('http://localhost:5000/api/tasks');
        const taskData = await taskRes.json();
        if (Array.isArray(taskData)) setCreatedTasks(taskData);

      } catch (e) {
        console.error("Dashboard fetch error", e);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (studentEmail: string, action: 'approve' | 'reject') => {
    try {
        const endpoint = action === 'approve' ? '/approve' : '/reject';
        await fetch(`http://localhost:5000/api/status${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teacherEmail: "teacher@test.com", studentEmail })
        });
        setDashboardRequests(prev => prev.filter(r => r.studentEmail !== studentEmail));
    } catch (e) {
        alert(`Error: ${e}`);
    }
  };

  // --- 2. LIVE CONFLICT CHECK LOGIC ---
  useEffect(() => {
    if (selectedBatch && selectedDate) {
        const checkConflict = async () => {
            setIsChecking(true);
            try {
                const res = await fetch('http://localhost:5000/api/tasks/check-conflict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ batch: selectedBatch, date: selectedDate })
                });
                const data = await res.json();
                setConflictScore(data.score);
                setConflictMsg(data.message);
            } catch (error) {
                console.error("Conflict check failed");
            } finally {
                setIsChecking(false);
            }
        };
        const timer = setTimeout(checkConflict, 300);
        return () => clearTimeout(timer);
    }
  }, [selectedBatch, selectedDate]); 

  // --- 3. CREATE TASK LOGIC ---
  const handleCreateTask = async () => {
    if (!taskTitle || !selectedBatch || !selectedDate) {
        alert("Please fill all fields");
        return;
    }
    try {
        const res = await fetch('http://localhost:5000/api/tasks/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: taskTitle,
                batch: selectedBatch,
                dueDate: selectedDate
            })
        });
        if (res.ok) {
            alert("✅ Task Created Successfully!");
            setIsModalOpen(false);
            
            // Refresh list immediately
            const newTask = { id: Date.now().toString(), title: taskTitle, batch: selectedBatch, dueDate: selectedDate };
            setCreatedTasks(prev => [newTask, ...prev]);

            setTaskTitle("");
            setSelectedDate("");
            setConflictScore(0);
        }
    } catch (error) {
        alert("Failed to create task");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teaching Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes and coordinate assignments.</p>
        </div>
        
        {/* CREATE TASK MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25">
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                    id="title" 
                    placeholder="e.g. Physics Lab Report" 
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Target Batch</Label>
                <Select onValueChange={setSelectedBatch} value={selectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CS-2024-A">CS-2024-A</SelectItem>
                    <SelectItem value="CS-2024-B">CS-2024-B</SelectItem>
                    <SelectItem value="IT-2024-A">IT-2024-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Due Date</Label>
                <Input 
                    id="date" 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                />
              </div>

              {/* REAL Conflict Score Meter */}
              <div className={`p-4 rounded-xl space-y-3 transition-colors ${
                  conflictScore > 80 ? "bg-red-50 border border-red-200" : 
                  conflictScore > 40 ? "bg-orange-50 border border-orange-200" : 
                  "bg-emerald-50 border border-emerald-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${
                      conflictScore > 80 ? "text-red-700" : 
                      conflictScore > 40 ? "text-orange-700" : "text-emerald-700"
                  }`}>
                      Conflict Probability
                  </span>
                  <Badge
                    className={
                      conflictScore > 80
                        ? "bg-red-500 text-white"
                        : conflictScore > 40
                          ? "bg-orange-500 text-white"
                          : "bg-emerald-500 text-white"
                    }
                  >
                    {isChecking ? "Checking..." : `${conflictScore}%`}
                  </Badge>
                </div>
                
                {/* Visual conflict meter bar */}
                <div className="relative h-4 rounded-full overflow-hidden bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${conflictScore}%` }}
                    className={`absolute top-0 left-0 h-full ${
                        conflictScore > 80 ? "bg-red-500" : 
                        conflictScore > 40 ? "bg-orange-500" : "bg-emerald-500"
                    }`}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground font-medium">
                  {isChecking ? "Analyzing schedule..." : conflictMsg}
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                onClick={handleCreateTask}
                disabled={isChecking || !selectedBatch || !selectedDate}
              >
                Confirm & Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ y: -2, scale: 1.02 }}>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">85</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* COMPACT PENDING REQUESTS CARD */}
        <motion.div whileHover={{ y: -2, scale: 1.02 }} className="sm:col-span-2">
          <Card className="hover:shadow-lg transition-all border-orange-200 bg-orange-50/30 h-full">
            <CardHeader className="py-3 px-4 pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2 text-orange-700">
                        <AlertCircle className="w-4 h-4" />
                        Pending Approvals
                    </div>
                    <Badge variant="secondary" className="text-xs bg-white">{dashboardRequests.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2">
                {dashboardRequests.length === 0 ? (
                    <div className="flex items-center text-sm text-muted-foreground h-12">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        All caught up! No requests.
                    </div>
                ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {dashboardRequests.map((req, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-orange-100 shadow-sm text-sm">
                                <div>
                                    <p className="font-semibold text-foreground">{req.studentName || "Student"}</p>
                                    <p className="text-xs text-muted-foreground">{req.reason}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleAction(req.studentEmail, 'reject')}
                                        title="Reject"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        className="h-7 w-7 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleAction(req.studentEmail, 'approve')}
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENTLY CREATED TASKS (New) */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" />
              Recent Class Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {createdTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    No tasks created yet.
                </div>
            ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {createdTasks.map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                            <div>
                                <p className="font-medium text-foreground">{task.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Badge variant="outline" className="bg-white">{task.batch}</Badge>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Due: {task.dueDate}
                                    </span>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>

        {/* Coordination Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" />
              Batch Schedule Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Batch</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Mon</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Tue</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Wed</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Thu</th>
                    <th className="text-center py-3 px-2 font-medium text-muted-foreground">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  {batchSchedule.map((batch) => (
                    <tr key={batch.batch} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{batch.batch}</td>
                      <td className="text-center py-3 px-2">
                        <Badge
                          className={batch.monday > 3 ? "bg-orange-500 text-white" : "bg-teal-500/10 text-teal-600"}
                        >
                          {batch.monday}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge
                          className={batch.tuesday > 3 ? "bg-orange-500 text-white" : "bg-teal-500/10 text-teal-600"}
                        >
                          {batch.tuesday}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge
                          className={batch.wednesday > 3 ? "bg-orange-500 text-white" : "bg-teal-500/10 text-teal-600"}
                        >
                          {batch.wednesday}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge
                          className={batch.thursday > 3 ? "bg-orange-500 text-white" : "bg-teal-500/10 text-teal-600"}
                        >
                          {batch.thursday}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge
                          className={batch.friday > 3 ? "bg-orange-500 text-white" : "bg-teal-500/10 text-teal-600"}
                        >
                          {batch.friday}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Numbers indicate pending assignments per day. Orange indicates overload ({">"} 3 tasks).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evaluation Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-500" />
            Evaluation Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingGrading.length === 0 ? (
            <EmptyState message="All caught up! No pending evaluations." />
          ) : (
            pendingGrading.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="space-y-2 p-3 rounded-lg hover:bg-muted/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.graded}/{item.submissions} graded
                  </span>
                </div>
                <Progress value={(item.graded / item.submissions) * 100} className="h-2 [&>div]:bg-teal-500" />
                {item.submissions < item.total && (
                  <p className="text-xs text-orange-600">
                    {item.total - item.submissions} students haven't submitted yet
                  </p>
                )}
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      {/* My Classes */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-500" />
          My Classes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <p className="text-sm text-muted-foreground">{classroom.studentCount} students enrolled</p>
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