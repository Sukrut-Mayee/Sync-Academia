"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, Shield, Zap, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginPageProps {
  onLogin: (email: string) => void
  isDarkMode: boolean
  setIsDarkMode: (mode: boolean) => void
}

function SyncLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
      <path
        d="M12 20C12 15.5817 15.5817 12 20 12C22.7614 12 25.2386 13.3432 26.8 15.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M28 20C28 24.4183 24.4183 28 20 28C17.2386 28 14.7614 26.6568 13.2 24.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="3" fill="white" />
      <path d="M17 10L20 12L17 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 26L20 28L23 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#14B8A6" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function LoginPage({ onLogin, isDarkMode, setIsDarkMode }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) onLogin(email)
  }

  const handleGoogleSignIn = () => {
    onLogin("student@university.edu")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex"
    >
      <div className="hidden lg:flex w-[60%] relative bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 overflow-hidden items-center justify-center">
        {/* Animated Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-orange-400/60 to-amber-500/60 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/50 to-teal-400/50 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-400/40 to-violet-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 80, 0],
            y: [0, 60, -80, 0],
          }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-32 right-32 w-48 h-48 bg-gradient-to-br from-white/30 to-teal-200/30 rounded-full blur-2xl"
        />

        {/* Floating Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 space-y-6"
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Smart Scheduling</h3>
                <p className="text-sm text-white/70">AI-powered coordination</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-white/20 rounded-full w-full" />
              <div className="h-2 bg-white/20 rounded-full w-3/4" />
              <div className="h-2 bg-white/20 rounded-full w-1/2" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-sm ml-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-sm text-white/80">Conflict Detection Active</span>
            </div>
            <p className="text-white font-medium">No deadline conflicts this week!</p>
          </motion.div>

          <motion.div
            animate={{ y: [-5, 15, -5] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl max-w-xs"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-300" />
              <span className="text-sm text-white">Viva Mode ready</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 bg-background dark:bg-gray-900 relative">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }}>
              <SyncLogo className="w-14 h-14" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                SyncAcademia
              </h1>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Intelligent Academic Coordination</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground dark:text-white">Welcome back!</h2>
            <p className="text-muted-foreground dark:text-gray-400">Sign in to access your personalized dashboard.</p>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-12 rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all text-gray-700 dark:text-gray-200 font-medium gap-3"
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background dark:bg-gray-900 px-2 text-muted-foreground dark:text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground dark:text-white">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 rounded-xl bg-muted/50 dark:bg-gray-800 border-border/50 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Hint: Use &quot;student&quot;, &quot;teacher&quot;, or &quot;admin&quot; in email for different roles
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground dark:text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 rounded-xl bg-muted/50 dark:bg-gray-800 border-border/50 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium shadow-lg shadow-teal-500/25"
              >
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </form>

          <p className="text-xs text-center text-muted-foreground dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
