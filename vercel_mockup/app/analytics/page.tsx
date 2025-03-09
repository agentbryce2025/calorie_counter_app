"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target } from "lucide-react"
import Link from "next/link"
import { DailyStats } from "@/components/analytics/daily-stats"
import { WeeklyStats } from "@/components/analytics/weekly-stats"
import { MonthlyStats } from "@/components/analytics/monthly-stats"
import { GoalsSection } from "@/components/analytics/goals-section"
import { ThemeProvider } from "@/components/theme-provider"
import { isAuthenticated } from "@/lib/auth-utils"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("daily")
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
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tracker
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <div className="w-[100px]"></div> {/* Spacer for centering */}
          </div>

          <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <DailyStats />
            </TabsContent>

            <TabsContent value="weekly">
              <WeeklyStats />
            </TabsContent>

            <TabsContent value="monthly">
              <MonthlyStats />
            </TabsContent>
          </Tabs>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Goals & Progress
                </CardTitle>
                <CardDescription>Track your nutrition goals and progress</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <GoalsSection timeframe={activeTab as "daily" | "weekly" | "monthly"} />
            </CardContent>
          </Card>
        </div>
      </main>
    </ThemeProvider>
  )
}

