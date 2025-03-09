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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "@/components/ui/chart"
import { getMockFoodData, calculateDailyStats } from "@/lib/analytics-utils"

export function DailyStats() {
  const [date, setDate] = useState(new Date())
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    // Get mock data and calculate stats
    const foods = getMockFoodData()
    const dailyStats = calculateDailyStats(foods, date)
    setStats(dailyStats)
  }, [date])

  if (!stats) {
    return <div>Loading stats...</div>
  }

  // Data for hourly distribution chart
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    calories: stats.hourlyCalories[i] || 0,
  })).filter((item) => item.hour >= 5 && item.hour <= 23) // Only show hours 5am to 11pm

  // Data for meal type distribution
  const mealTypeData = [
    { name: "Breakfast", value: stats.mealTypeCalories.breakfast || 0 },
    { name: "Lunch", value: stats.mealTypeCalories.lunch || 0 },
    { name: "Dinner", value: stats.mealTypeCalories.dinner || 0 },
    { name: "Snacks", value: stats.mealTypeCalories.snacks || 0 },
  ].filter((item) => item.value > 0)

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalCalories}</CardTitle>
            <CardDescription>Total Calories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${stats.totalCalories > stats.calorieGoal ? "text-red-500" : "text-green-500"}`}>
              {stats.totalCalories > stats.calorieGoal
                ? `${stats.totalCalories - stats.calorieGoal} over goal`
                : `${stats.calorieGoal - stats.totalCalories} under goal`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.mealCount}</CardTitle>
            <CardDescription>Meals & Snacks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.firstMealTime} - {stats.lastMealTime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.avgCaloriesPerMeal}</CardTitle>
            <CardDescription>Avg. Calories Per Meal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Highest: {stats.highestCalorieMeal} cal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calories by Hour</CardTitle>
            <CardDescription>When you consumed calories today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Meal Distribution</CardTitle>
            <CardDescription>Calories by meal type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mealTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mealTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} calories`, "Calories"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Insights</CardTitle>
          <CardDescription>Analysis of your eating patterns</CardDescription>
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

