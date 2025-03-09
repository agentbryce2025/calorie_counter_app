"use client"

import { useState, useEffect } from "react"
import { ProgressBar } from "@/components/progress-bar"
import { AddFoodButton } from "@/components/add-food-button"
import { DayView } from "@/components/day-view"
import { ChevronLeft, ChevronRight, BarChart2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Type definitions
type Food = {
  id: string
  name: string
  calories: number
  time: Date
  description: string
}

export function CalendarView() {
  const { user, logout } = useAuth()
  const [date, setDate] = useState<Date>(new Date())
  const [foods, setFoods] = useState<Food[]>([])
  const [dailyGoal, setDailyGoal] = useState(2000)

  // Load foods from localStorage on component mount
  useEffect(() => {
    const savedFoods = localStorage.getItem("calorieTrackerFoods")
    if (savedFoods) {
      const parsedFoods = JSON.parse(savedFoods).map((food: any) => ({
        ...food,
        time: new Date(food.time),
      }))
      setFoods(parsedFoods)
    } else {
      // Add mock data if no saved foods
      setFoods(generateMockData())
    }
  }, [])

  // Save foods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calorieTrackerFoods", JSON.stringify(foods))
  }, [foods])

  // Generate mock data for demonstration
  const generateMockData = (): Food[] => {
    const today = new Date()
    const mockFoods: Food[] = [
      {
        id: "1",
        name: "Breakfast - Oatmeal with Berries",
        calories: 320,
        time: new Date(today.setHours(7, 30)),
        description: "Oatmeal with mixed berries and honey",
      },
      {
        id: "2",
        name: "Morning Snack - Protein Bar",
        calories: 180,
        time: new Date(today.setHours(10, 15)),
        description: "Protein bar with nuts and chocolate",
      },
      {
        id: "3",
        name: "Lunch - Chicken Salad",
        calories: 450,
        time: new Date(today.setHours(12, 45)),
        description: "Grilled chicken salad with avocado and vinaigrette",
      },
      {
        id: "4",
        name: "Afternoon Snack - Apple",
        calories: 95,
        time: new Date(today.setHours(15, 30)),
        description: "Medium-sized apple",
      },
      {
        id: "5",
        name: "Dinner - Salmon with Vegetables",
        calories: 520,
        time: new Date(today.setHours(19, 0)),
        description: "Baked salmon with roasted vegetables",
      },
    ]
    return mockFoods
  }

  // Filter foods for the selected date
  const foodsForSelectedDate = foods.filter(
    (food) =>
      food.time.getDate() === date.getDate() &&
      food.time.getMonth() === date.getMonth() &&
      food.time.getFullYear() === date.getFullYear(),
  )

  // Calculate total calories for the selected date
  const totalCalories = foodsForSelectedDate.reduce((sum, food) => sum + food.calories, 0)

  // Add a new food entry
  const addFood = (food: Omit<Food, "id">) => {
    const newFood = {
      ...food,
      id: Date.now().toString(),
    }
    setFoods([...foods, newFood])
  }

  // Delete a food entry
  const deleteFood = (id: string) => {
    setFoods(foods.filter((food) => food.id !== id))
  }

  // Navigate to previous day
  const goToPreviousDay = () => {
    const previousDay = new Date(date)
    previousDay.setDate(previousDay.getDate() - 1)
    setDate(previousDay)
  }

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    setDate(nextDay)
  }

  // Go to today
  const goToToday = () => {
    setDate(new Date())
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return "U"
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calorie Tracker</h1>
        <div className="flex items-center gap-4">
          <Link href="/analytics">
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart2 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} alt={user?.name || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Profile</DropdownMenuItem>
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={goToPreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <Button variant="link" onClick={goToToday} className="text-sm">
            Today
          </Button>
        </div>

        <Button variant="outline" size="icon" onClick={goToNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Today's progress */}
      <div className="mb-6 bg-card rounded-lg p-4 shadow-md">
        <ProgressBar current={totalCalories} max={dailyGoal} />
        <p className="text-sm mt-2 text-muted-foreground">
          {totalCalories} / {dailyGoal} calories • {Math.max(0, dailyGoal - totalCalories)} remaining
        </p>
      </div>

      {/* Day view calendar */}
      <div className="mb-6 bg-card rounded-lg shadow-md overflow-hidden">
        <DayView date={date} foods={foodsForSelectedDate} onDeleteFood={deleteFood} />
      </div>

      {/* Add food button */}
      <AddFoodButton onAddFood={addFood} selectedDate={date} />
    </div>
  )
}

