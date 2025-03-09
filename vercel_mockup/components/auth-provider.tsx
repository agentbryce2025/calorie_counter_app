"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth-utils"

type User = {
  id: string
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    // If loading is complete and we have no user, redirect to login
    // except when already on login or signup pages
    if (!isLoading && !user && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login")
    }
  }, [isLoading, user, router, pathname])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, logout: handleLogout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

