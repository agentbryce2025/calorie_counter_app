"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Check, X } from "lucide-react"
import { getMockFoodData, calculateGoalProgress } from "@/lib/analytics-utils"

interface GoalsSectionProps {
  timeframe: "daily" | "weekly" | "monthly"
}

export function GoalsSection({ timeframe }: GoalsSectionProps) {
  const [goals, setGoals] = useState({
    daily: {
      calories: 2000,
      meals: 3,
      water: 8,
      protein: 120,
    },
    weekly: {
      avgCalories: 2000,
      exerciseDays: 4,
      mealPrep: 5,
      sugarLimit: 30,
    },
    monthly: {
      weightChange: -2,
      consistentDays: 25,
      cheatMeals: 4,
      avgProtein: 100,
    },
  })

  const [progress, setProgress] = useState<any>(null)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")

  useEffect(() => {
    // Get mock data and calculate progress
    const foods = getMockFoodData()
    const goalProgress = calculateGoalProgress(foods, goals)
    setProgress(goalProgress)
  }, [goals])

  if (!progress) {
    return <div>Loading goals...</div>
  }

  const startEditing = (goalKey: string, currentValue: number) => {
    setEditingGoal(goalKey)
    setEditValue(currentValue.toString())
  }

  const saveGoal = (goalCategory: "daily" | "weekly" | "monthly", goalKey: string) => {
    const newValue = Number.parseInt(editValue)
    if (!isNaN(newValue) && newValue > 0) {
      setGoals({
        ...goals,
        [goalCategory]: {
          ...goals[goalCategory],
          [goalKey]: newValue,
        },
      })
    }
    setEditingGoal(null)
  }

  const cancelEditing = () => {
    setEditingGoal(null)
  }

  const renderGoalItem = (category: "daily" | "weekly" | "monthly", goalKey: string, label: string, unit: string) => {
    const value = goals[category][goalKey as keyof (typeof goals)[typeof category]] as number
    const progressValue = progress[category][goalKey]
    const progressPercent = Math.min(100, Math.round((progressValue / value) * 100))
    const isEditing = editingGoal === `${category}.${goalKey}`

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">{label}</Label>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Input
                  className="w-20 h-8 text-sm"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  type="number"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => saveGoal(category, goalKey)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm">
                  {value} {unit}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEditing(`${category}.${goalKey}`, value)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progressPercent} className="h-2" />
          <span className="text-xs w-10 text-right">
            {progressValue}/{value}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="daily">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="daily">Daily Goals</TabsTrigger>
        <TabsTrigger value="weekly">Weekly Goals</TabsTrigger>
        <TabsTrigger value="monthly">Monthly Goals</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="space-y-4">
        {renderGoalItem("daily", "calories", "Calorie Limit", "cal")}
        {renderGoalItem("daily", "meals", "Number of Meals", "")}
        {renderGoalItem("daily", "water", "Water Intake", "cups")}
        {renderGoalItem("daily", "protein", "Protein Intake", "g")}
      </TabsContent>

      <TabsContent value="weekly" className="space-y-4">
        {renderGoalItem("weekly", "avgCalories", "Average Daily Calories", "cal")}
        {renderGoalItem("weekly", "exerciseDays", "Exercise Days", "days")}
        {renderGoalItem("weekly", "mealPrep", "Meal Prep Portions", "meals")}
        {renderGoalItem("weekly", "sugarLimit", "Sugar Limit", "g/day")}
      </TabsContent>

      <TabsContent value="monthly" className="space-y-4">
        {renderGoalItem("monthly", "weightChange", "Weight Change", "lbs")}
        {renderGoalItem("monthly", "consistentDays", "Consistent Tracking", "days")}
        {renderGoalItem("monthly", "cheatMeals", "Cheat Meals", "meals")}
        {renderGoalItem("monthly", "avgProtein", "Average Protein", "g/day")}
      </TabsContent>
    </Tabs>
  )
}

