"use client"

import { useState, useEffect } from "react"
import { Bell, Search, LogOut, Moon, Sun, ChevronDown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { UserRole } from "@/app/page"
import { cn } from "@/lib/utils"

interface TopbarProps {
  role: UserRole
  onLogout: () => void
  sidebarCollapsed?: boolean
  vivaMode: boolean
  setVivaMode: (mode: boolean) => void
  isDarkMode: boolean
  setIsDarkMode: (mode: boolean) => void
}

interface Notification {
  studentName: string;
  studentEmail: string;
  reason: string;
}

const roleNames = {
  student: "Alex Johnson",
  teacher: "Dr. Sarah Mitchell",
  admin: "Admin User",
}

type StatusType = "available" | "absent" | "busy" | "pending"

const supervisors = [
  { id: "1", name: "Dr. Newton", subject: "Physics" },
  { id: "2", name: "Prof. Euler", subject: "Math" },
  { id: "3", name: "Ms. Curie", subject: "Chemistry" },
]

export default function Topbar({ role, onLogout, vivaMode, setVivaMode, isDarkMode, setIsDarkMode }: TopbarProps) {
  const [status, setStatus] = useState<StatusType>("available")
  const [showBusyModal, setShowBusyModal] = useState(false)
  const [selectedSupervisor, setSelectedSupervisor] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])

  // --- 1. FETCH NOTIFICATIONS (Teacher Only) ---
  useEffect(() => {
    if (role === 'teacher') {
      const fetchNotifs = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status/notifications?teacherEmail=teacher@test.com`);
          const data = await res.json();
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        } catch (e) {
          console.error("Failed to fetch notifications");
        }
      };
      
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 5000);
      return () => clearInterval(interval);
    }
  }, [role]);

  // --- 2. POLL STATUS (Student Only) ---
  useEffect(() => {
    if (role === 'student') {
      const checkMyStatus = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/status/student@test.com`);
          const data = await res.json();
          
          if (data.status === 'BUSY - VIVA') {
             if (status !== 'busy') {
                 setStatus('busy');
                 setVivaMode(true);
                 setToastMessage("✅ Your Busy Status was Approved!");
                 setShowToast(true);
                 setTimeout(() => setShowToast(false), 4000);
             }
          } else if (data.status === 'Pending Approval') {
             if (status !== 'pending') setStatus('pending');
          } else {
             if (data.status === 'Available' && status !== 'available') {
                 setStatus('available');
                 setVivaMode(false);
             } else if (data.status === 'Absent' && status !== 'absent') {
                 setStatus('absent');
                 setVivaMode(false);
             }
          }
        } catch (e) {
          // ignore
        }
      };
      
      checkMyStatus();
      const interval = setInterval(checkMyStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [role, status, setVivaMode]);

  // --- 3. TEACHER APPROVE ACTION ---
  const handleApprove = async (studentEmail: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherEmail: "teacher@test.com",
          studentEmail: studentEmail
        })
      });
      
      setToastMessage(`✅ Approved busy status for ${studentEmail}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setNotifications(prev => prev.filter(n => n.studentEmail !== studentEmail));
    } catch (e) {
      alert("Error approving request");
    }
  };

  // --- 4. HANDLE STATUS CHANGE ---
  const handleStatusChange = async (newStatus: StatusType) => {
    if (newStatus === "busy") {
      setShowBusyModal(true)
    } else {
      setStatus(newStatus)
      if (newStatus === "available" || newStatus === "absent") {
        setVivaMode(false)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/update-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: "student@test.com", 
                    status: newStatus === 'available' ? 'Available' : 'Absent' 
                })
            });
        } catch (error) {
            console.error("Failed to update status in DB");
        }
      }
    }
  }

  // --- 5. STUDENT REQUEST LOGIC ---
  const handleBusyRequest = async () => {
    if (selectedSupervisor) {
      const supervisor = supervisors.find((s) => s.id === selectedSupervisor)
      
      setStatus("pending") 
      setShowBusyModal(false)
      setToastMessage(`Request sent to ${supervisor?.name}. Waiting for approval...`)
      setShowToast(true)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentEmail: "student@test.com", 
            teacherEmail: "teacher@test.com",
            reason: `Viva Supervision: ${supervisor?.name}`,
            supervisorId: selectedSupervisor
          })
        });

        const data = await response.json();

        if (!response.ok) {
           setToastMessage(`⚠️ Error: ${data.error || "Failed to send"}`);
           setStatus("available");
        }

      } catch (error) {
        console.error("Backend Error:", error);
        setToastMessage("❌ Error: Is Backend running?");
        setStatus("available");
      }

      setTimeout(() => setShowToast(false), 4000)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "available": return "bg-emerald-500"
      case "absent": return "bg-red-500"
      case "busy": return "bg-orange-500"
      case "pending": return "bg-yellow-400"
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case "available": return "Available"
      case "absent": return "Absent Today"
      case "busy": return "Busy / Viva Mode"
      case "pending": return "Pending Approval..."
    }
  }

  return (
    <>
      <header
        className={cn(
          "h-16 border-b flex items-center justify-between px-6 relative z-10",
          vivaMode
            ? "bg-orange-100/80 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800"
            : "bg-card/80 dark:bg-gray-800/80 backdrop-blur-xl border-border/50 dark:border-gray-700",
        )}
      >
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, assignments..."
              className={cn(
                "pl-10 border-0",
                vivaMode ? "bg-orange-200/50 dark:bg-orange-800/50" : "bg-muted/50 dark:bg-gray-700/50",
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {role === "student" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                    vivaMode
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-lg shadow-orange-500/25"
                      : "bg-muted/50 dark:bg-gray-700/50 border-border/50 dark:border-gray-600",
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", getStatusColor())} />
                  <span
                    className={cn("text-sm font-medium", vivaMode ? "text-white" : "text-foreground dark:text-white")}
                  >
                    {getStatusLabel()}
                  </span>
                  <ChevronDown className={cn("w-4 h-4", vivaMode ? "text-white" : "")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleStatusChange("available")} className="gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Available
                  {status === "available" && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("absent")} className="gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Absent Today
                  {status === "absent" && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("busy")} className="gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Busy / Viva Mode
                  {status === "busy" && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? (
              <Sun className={cn("w-5 h-5", vivaMode && "text-orange-700 dark:text-orange-300")} />
            ) : (
              <Moon className={cn("w-5 h-5", vivaMode && "text-orange-700")} />
            )}
          </Button>

          {/* --- SMART NOTIFICATION BELL --- */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className={cn("w-5 h-5", vivaMode && "text-orange-700 dark:text-orange-300")} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b font-medium">Notifications</div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 p-4 text-center">No pending requests.</p>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="p-3 border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mb-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold">{notif.studentName || "Student"}</p>
                          <p className="text-xs text-gray-500">{notif.reason}</p>
                        </div>
                        <span className="text-[10px] text-gray-400">Just now</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-8"
                        onClick={() => handleApprove(notif.studentEmail)}
                      >
                        Approve Busy Mode
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={`/.jpg?height=36&width=36&query=${role} avatar`} />
              <AvatarFallback>{roleNames[role].charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className={cn("text-sm font-medium", vivaMode ? "text-orange-900 dark:text-orange-100" : "text-foreground dark:text-white")}>
                {roleNames[role]}
              </p>
              <p className={cn("text-xs capitalize", vivaMode ? "text-orange-600 dark:text-orange-300" : "text-muted-foreground dark:text-gray-400")}>
                {role}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className={cn("w-5 h-5", vivaMode && "text-orange-700 dark:text-orange-300")} />
          </Button>
        </div>
      </header>

      <Dialog open={showBusyModal} onOpenChange={setShowBusyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Busy Status</DialogTitle>
            <DialogDescription>Who is supervising you during this busy period?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisors.map((supervisor) => (
                  <SelectItem key={supervisor.id} value={supervisor.id}>
                    {supervisor.name} ({supervisor.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBusyModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBusyRequest}
              disabled={!selectedSupervisor}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            >
              Request Busy Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}