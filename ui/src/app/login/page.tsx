"use client"

import { useState, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { authService } from "@/services/authService"
import { UserIcon, LockIcon } from "lucide-react"
import { showToast } from "@/utils/toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    if (username && password) {
      try {
        const user = await authService.login(username, password)
        authService.setCurrentUser(user)
        router.push("/") // 登录成功后重定向到主页
      } catch (error) {
        console.error("Login failed:", error)
        showToast.error("Login failed. Please check your username and password.")
      }
    }
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="relative flex items-center justify-center flex-grow min-h-screen bg-gradient-to-r from-pink-500 to-purple-500 overflow-hidden">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
      <div className="relative z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75"></div>
        <Card className="relative w-[350px] bg-white/90 backdrop-blur-md shadow-xl border-2 border-white/50">
          <CardHeader>
            <h2 className="text-3xl font-bold text-center font-heading text-gray-800">Retro Board</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input 
                placeholder="Username"
                className="pl-10 bg-white/50 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserIcon size={18} />
              </span>
            </div>
            <div className="relative">
              <Input 
                type="password" 
                placeholder="Password"
                className="pl-10 bg-white/50 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LockIcon size={18} />
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105" 
            onClick={handleLogin} 
            disabled={!username || !password}
          >
            Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}