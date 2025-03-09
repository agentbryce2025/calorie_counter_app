"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarView } from "@/components/calendar-view"
import { ThemeProvider } from "@/components/theme-provider"
import { isAuthenticated } from "@/lib/auth-utils"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <main className="min-h-screen bg-background text-foreground">
        <CalendarView />
      </main>
    </ThemeProvider>
  )
}

