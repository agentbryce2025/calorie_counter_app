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
  LineChart,
  Line,
  Legend,
} from "@/components/ui/chart"
import { getMockFoodData, calculateWeeklyStats } from "@/lib/analytics-utils"

export function WeeklyStats() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    // Get mock data and calculate stats
    const foods = getMockFoodData()
    const weeklyStats = calculateWeeklyStats(foods)
    setStats(weeklyStats)
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
            <p className={`text-sm ${stats.avgDailyCalories > stats.calorieGoal ? "text-red-500" : "text-green-500"}`}>
              {stats.avgDailyCalories > stats.calorieGoal
                ? `${stats.avgDailyCalories - stats.calorieGoal} over goal`
                : `${stats.calorieGoal - stats.avgDailyCalories} under goal`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalWeeklyCalories}</CardTitle>
            <CardDescription>Total Weekly Calories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{stats.daysTracked} days tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.avgMealsPerDay}</CardTitle>
            <CardDescription>Avg. Meals Per Day</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Most consistent: {stats.mostConsistentMealTime}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Calories This Week</CardTitle>
            <CardDescription>Calorie intake for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyCalories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
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
            <CardTitle>Meal Timing Patterns</CardTitle>
            <CardDescription>When you typically eat throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.mealTimingPatterns} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => {
                      if (hour === 0) return "12am"
                      if (hour === 12) return "12pm"
                      return hour < 12 ? `${hour}am` : `${hour - 12}pm`
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value} calories`, "Calories"]}
                    labelFormatter={(hour) => {
                      if (hour === 0) return "12:00 AM"
                      if (hour === 12) return "12:00 PM"
                      return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="breakfast" stroke="#0088FE" strokeWidth={2} />
                  <Line type="monotone" dataKey="lunch" stroke="#00C49F" strokeWidth={2} />
                  <Line type="monotone" dataKey="dinner" stroke="#FFBB28" strokeWidth={2} />
                  <Line type="monotone" dataKey="snacks" stroke="#FF8042" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Insights</CardTitle>
          <CardDescription>Patterns and recommendations based on your week</CardDescription>
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

