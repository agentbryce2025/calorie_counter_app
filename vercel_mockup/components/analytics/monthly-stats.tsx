"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
} from "@/components/ui/chart"
import { getMockFoodData, calculateMonthlyStats } from "@/lib/analytics-utils"

export function MonthlyStats() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    // Get mock data and calculate stats
    const foods = getMockFoodData()
    const monthlyStats = calculateMonthlyStats(foods)
    setStats(monthlyStats)
  }, [])

  if (!stats) {
    return <div>Loading stats...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.avgDailyCalories}</CardTitle>
            <CardDescription>Avg. Daily Calories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{stats.totalMonthlyCalories} total calories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.daysTracked}</CardTitle>
            <CardDescription>Days Tracked</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{stats.daysOnTarget} days on target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.calorieVariance}</CardTitle>
            <CardDescription>Calorie Variance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Min: {stats.minCalories} / Max: {stats.maxCalories}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Calorie Trend</CardTitle>
          <CardDescription>Daily calorie intake for the month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyCalories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} calories`, "Calories"]} />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorCalories)"
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Averages</CardTitle>
            <CardDescription>Average calories by week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} calories`, "Calories"]} />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="goal" fill="hsl(var(--muted-foreground) / 0.3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Day of Week Patterns</CardTitle>
            <CardDescription>Average calories by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dayOfWeekPatterns} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} calories`, "Calories"]} />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Insights</CardTitle>
          <CardDescription>Long-term patterns and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {stats.insights.map((insight: string, index: number) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

