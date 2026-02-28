"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, User, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <path
        d="M14 2L16.5 9.5L24 14L16.5 18.5L14 26L11.5 18.5L4 14L11.5 9.5L14 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="7" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

interface Message {
  id: number
  text: string
  isUser: boolean
}

export default function GeminiFab() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your AI study assistant. Ask me to explain a topic or plan your schedule!", isUser: false },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // 1. Add User Message
    const userMessage: Message = { id: Date.now(), text: input, isUser: true }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // 2. CONNECT TO BACKEND (Real AI)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      })
      
      const data = await response.json()
      
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: data.reply || "Sorry, I couldn't process that.",
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])

    } catch (error) {
      console.error("AI Error:", error)
      setMessages((prev) => [...prev, { 
        id: Date.now(), 
        text: "⚠️ Connection Error: Is the backend running?", 
        isUser: false 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center z-50 hover:shadow-xl hover:shadow-teal-500/40 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="gemini"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <GeminiIcon className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Study Assistant</h3>
                  <p className="text-xs text-white/70">Powered by Gemini</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black" ref={scrollRef}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  {!message.isUser && (
                     <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-teal-600" />
                     </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      message.isUser
                        ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-br-md"
                        : "bg-white dark:bg-gray-800 border shadow-sm text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-teal-600" />
                   </div>
                   <div className="bg-white p-3 rounded-2xl border shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                      <span className="text-xs text-gray-400">Thinking...</span>
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-muted/50 border-0"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}