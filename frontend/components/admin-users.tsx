"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Search, Filter, MoreVertical, UserPlus, Mail, Shield, GraduationCap, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const users = [
  {
    id: 1,
    name: "Dr. Sarah Miller",
    email: "sarah.miller@university.edu",
    role: "teacher",
    department: "Computer Science",
    status: "active",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@university.edu",
    role: "student",
    department: "Engineering",
    status: "active",
    lastLogin: "30 minutes ago",
  },
  {
    id: 3,
    name: "Prof. James Wilson",
    email: "james.wilson@university.edu",
    role: "teacher",
    department: "Mathematics",
    status: "active",
    lastLogin: "1 day ago",
  },
  {
    id: 4,
    name: "Emily Chen",
    email: "emily.chen@university.edu",
    role: "student",
    department: "Computer Science",
    status: "inactive",
    lastLogin: "1 week ago",
  },
  {
    id: 5,
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    department: "Administration",
    status: "active",
    lastLogin: "Just now",
  },
]

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />
      case "teacher":
        return <Briefcase className="w-4 h-4" />
      default:
        return <GraduationCap className="w-4 h-4" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20">Admin</Badge>
      case "teacher":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Teacher</Badge>
      default:
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Student</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-500" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage users across the platform</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "2,450", icon: Users, color: "text-violet-500" },
          { label: "Students", value: "2,180", icon: GraduationCap, color: "text-emerald-500" },
          { label: "Teachers", value: "245", icon: Briefcase, color: "text-blue-500" },
          { label: "Admins", value: "25", icon: Shield, color: "text-amber-500" },
        ].map((stat, index) => (
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

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-violet-500/30 transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback
                    className={cn(
                      "text-white",
                      user.role === "admin"
                        ? "bg-gradient-to-br from-violet-500 to-purple-600"
                        : user.role === "teacher"
                          ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                          : "bg-gradient-to-br from-emerald-500 to-teal-600",
                    )}
                  >
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{user.name}</p>
                    {getRoleBadge(user.role)}
                    {user.status === "inactive" && (
                      <Badge variant="secondary" className="text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <div className="hidden md:block text-right">
                  <p className="text-sm text-foreground">{user.department}</p>
                  <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      {getRoleIcon(user.role)}
                      <span className="ml-2">View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4" />
                      <span className="ml-2">Send Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-rose-500">
                      <Shield className="w-4 h-4" />
                      <span className="ml-2">Change Role</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
