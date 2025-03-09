// Type definitions
type Food = {
  id: string
  name: string
  calories: number
  time: Date
  description: string
}

// Generate mock food data for analytics
export function getMockFoodData(): Food[] {
  const foods: Food[] = []
  const today = new Date()

  // Generate data for the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // Generate 3-5 meals per day
    const mealsCount = Math.floor(Math.random() * 3) + 3

    for (let j = 0; j < mealsCount; j++) {
      let mealName = ""
      const mealTime = new Date(date)
      let calories = 0

      // Breakfast (7-9 AM)
      if (j === 0) {
        mealTime.setHours(7 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))
        const breakfastOptions = [
          { name: "Breakfast - Oatmeal with Berries", calories: 320 },
          { name: "Breakfast - Eggs and Toast", calories: 350 },
          { name: "Breakfast - Yogurt with Granola", calories: 280 },
          { name: "Breakfast - Smoothie Bowl", calories: 310 },
          { name: "Breakfast - Avocado Toast", calories: 290 },
        ]
        const breakfast = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)]
        mealName = breakfast.name
        calories = breakfast.calories + Math.floor(Math.random() * 50) - 25 // Add some variance
      }
      // Lunch (12-2 PM)
      else if (j === 1) {
        mealTime.setHours(12 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))
        const lunchOptions = [
          { name: "Lunch - Chicken Salad", calories: 450 },
          { name: "Lunch - Turkey Sandwich", calories: 420 },
          { name: "Lunch - Quinoa Bowl", calories: 480 },
          { name: "Lunch - Vegetable Soup with Bread", calories: 380 },
          { name: "Lunch - Tuna Wrap", calories: 410 },
        ]
        const lunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)]
        mealName = lunch.name
        calories = lunch.calories + Math.floor(Math.random() * 60) - 30 // Add some variance
      }
      // Dinner (6-8 PM)
      else if (j === 2) {
        mealTime.setHours(18 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))
        const dinnerOptions = [
          { name: "Dinner - Salmon with Vegetables", calories: 520 },
          { name: "Dinner - Pasta with Tomato Sauce", calories: 580 },
          { name: "Dinner - Stir Fry with Rice", calories: 550 },
          { name: "Dinner - Grilled Chicken with Potatoes", calories: 600 },
          { name: "Dinner - Vegetable Curry", calories: 490 },
        ]
        const dinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]
        mealName = dinner.name
        calories = dinner.calories + Math.floor(Math.random() * 70) - 35 // Add some variance
      }
      // Snacks (random times)
      else {
        const snackTimes = [10, 15, 20] // 10 AM, 3 PM, 8 PM
        const snackTime = snackTimes[Math.floor(Math.random() * snackTimes.length)]
        mealTime.setHours(snackTime, Math.floor(Math.random() * 60))
        const snackOptions = [
          { name: "Snack - Apple", calories: 95 },
          { name: "Snack - Protein Bar", calories: 180 },
          { name: "Snack - Handful of Nuts", calories: 170 },
          { name: "Snack - Greek Yogurt", calories: 120 },
          { name: "Snack - Dark Chocolate", calories: 150 },
        ]
        const snack = snackOptions[Math.floor(Math.random() * snackOptions.length)]
        mealName = snack.name
        calories = snack.calories + Math.floor(Math.random() * 30) - 15 // Add some variance
      }

      foods.push({
        id: `mock-${i}-${j}`,
        name: mealName,
        calories,
        time: mealTime,
        description: `Mock data for ${mealName.toLowerCase()}`,
      })
    }
  }

  return foods
}

// Calculate daily statistics
export function calculateDailyStats(foods: Food[], date: Date) {
  // Filter foods for the selected date
  const foodsForDate = foods.filter(
    (food) =>
      food.time.getDate() === date.getDate() &&
      food.time.getMonth() === date.getMonth() &&
      food.time.getFullYear() === date.getFullYear(),
  )

  // Initialize hourly calories
  const hourlyCalories: Record<number, number> = {}
  for (let i = 0; i < 24; i++) {
    hourlyCalories[i] = 0
  }

  // Initialize meal type calories
  const mealTypeCalories = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  }

  // Calculate statistics
  let totalCalories = 0
  let highestCalorieMeal = 0
  let firstMealTime = "N/A"
  let lastMealTime = "N/A"

  if (foodsForDate.length > 0) {
    // Sort foods by time
    const sortedFoods = [...foodsForDate].sort((a, b) => a.time.getTime() - b.time.getTime())

    // Calculate first and last meal times
    firstMealTime = sortedFoods[0].time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    lastMealTime = sortedFoods[sortedFoods.length - 1].time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Process each food
    foodsForDate.forEach((food) => {
      totalCalories += food.calories

      // Update hourly calories
      const hour = food.time.getHours()
      hourlyCalories[hour] = (hourlyCalories[hour] || 0) + food.calories

      // Update highest calorie meal
      if (food.calories > highestCalorieMeal) {
        highestCalorieMeal = food.calories
      }

      // Update meal type calories
      if (food.name.toLowerCase().includes("breakfast")) {
        mealTypeCalories.breakfast += food.calories
      } else if (food.name.toLowerCase().includes("lunch")) {
        mealTypeCalories.lunch += food.calories
      } else if (food.name.toLowerCase().includes("dinner")) {
        mealTypeCalories.dinner += food.calories
      } else {
        mealTypeCalories.snacks += food.calories
      }
    })
  }

  // Generate insights
  const insights = generateDailyInsights(foodsForDate, totalCalories, hourlyCalories)

  return {
    totalCalories,
    calorieGoal: 2000, // Default goal
    mealCount: foodsForDate.length,
    avgCaloriesPerMeal: foodsForDate.length > 0 ? Math.round(totalCalories / foodsForDate.length) : 0,
    highestCalorieMeal,
    firstMealTime,
    lastMealTime,
    hourlyCalories,
    mealTypeCalories,
    insights,
  }
}

// Generate insights for daily stats
function generateDailyInsights(foods: Food[], totalCalories: number, hourlyCalories: Record<number, number>) {
  const insights: string[] = []

  // Calorie distribution
  if (totalCalories > 2000) {
    insights.push(`You consumed ${totalCalories - 2000} calories above your daily goal.`)
  } else if (totalCalories < 2000 && totalCalories > 0) {
    insights.push(`You stayed ${2000 - totalCalories} calories under your daily goal.`)
  }

  // Meal timing
  const lateNightCalories = Object.entries(hourlyCalories)
    .filter(([hour]) => Number.parseInt(hour) >= 20)
    .reduce((sum, [_, calories]) => sum + calories, 0)

  if (lateNightCalories > 300) {
    insights.push(`You consumed ${lateNightCalories} calories after 8 PM, which may affect sleep quality.`)
  }

  // Meal frequency
  if (foods.length > 5) {
    insights.push(`You had ${foods.length} eating occasions today, which is more frequent than recommended.`)
  } else if (foods.length < 3 && foods.length > 0) {
    insights.push(`You only had ${foods.length} meals today, consider adding more balanced meals.`)
  }

  // Meal spacing
  if (foods.length >= 2) {
    const sortedFoods = [...foods].sort((a, b) => a.time.getTime() - b.time.getTime())
    const firstMeal = sortedFoods[0].time.getHours()
    const lastMeal = sortedFoods[sortedFoods.length - 1].time.getHours()

    if (lastMeal - firstMeal > 12) {
      insights.push(
        `Your eating window is ${lastMeal - firstMeal} hours, which is longer than the recommended 10-12 hours.`,
      )
    }
  }

  // If no insights, add a default one
  if (insights.length === 0) {
    insights.push("Your eating pattern today looks balanced and well-distributed.")
  }

  return insights
}

// Calculate weekly statistics
export function calculateWeeklyStats(foods: Food[]) {
  const today = new Date()
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(today.getDate() - 7)

  // Filter foods for the past week
  const foodsForWeek = foods.filter((food) => food.time >= oneWeekAgo && food.time <= today)

  // Group foods by day
  const foodsByDay: Record<string, Food[]> = {}
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dayKey = daysOfWeek[date.getDay()]
    foodsByDay[dayKey] = []
  }

  foodsForWeek.forEach((food) => {
    const dayKey = daysOfWeek[food.time.getDay()]
    if (!foodsByDay[dayKey]) {
      foodsByDay[dayKey] = []
    }
    foodsByDay[dayKey].push(food)
  })

  // Calculate daily calories
  const dailyCalories = Object.entries(foodsByDay)
    .map(([day, dayFoods]) => {
      const calories = dayFoods.reduce((sum, food) => sum + food.calories, 0)
      return {
        day,
        calories,
        goal: 2000, // Default goal
      }
    })
    .sort((a, b) => {
      const dayOrder = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
      return dayOrder[a.day as keyof typeof dayOrder] - dayOrder[b.day as keyof typeof dayOrder]
    })

  // Calculate meal timing patterns
  const mealTimingPatterns = calculateMealTimingPatterns(foodsForWeek)

  // Calculate total and average calories
  const totalWeeklyCalories = dailyCalories.reduce((sum, day) => sum + day.calories, 0)
  const daysTracked = dailyCalories.filter((day) => day.calories > 0).length
  const avgDailyCalories = daysTracked > 0 ? Math.round(totalWeeklyCalories / daysTracked) : 0

  // Calculate average meals per day
  const totalMeals = Object.values(foodsByDay).reduce((sum, dayFoods) => sum + dayFoods.length, 0)
  const avgMealsPerDay = daysTracked > 0 ? Math.round((totalMeals / daysTracked) * 10) / 10 : 0

  // Determine most consistent meal time
  const mealTimes = {
    breakfast: [] as number[],
    lunch: [] as number[],
    dinner: [] as number[],
  }

  foodsForWeek.forEach((food) => {
    const hour = food.time.getHours()
    if (hour >= 5 && hour <= 10) {
      mealTimes.breakfast.push(hour)
    } else if (hour >= 11 && hour <= 14) {
      mealTimes.lunch.push(hour)
    } else if (hour >= 17 && hour <= 21) {
      mealTimes.dinner.push(hour)
    }
  })

  let mostConsistentMealTime = "None"
  let lowestVariance = Number.POSITIVE_INFINITY

  for (const [meal, times] of Object.entries(mealTimes)) {
    if (times.length > 0) {
      const avg = times.reduce((sum, time) => sum + time, 0) / times.length
      const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length

      if (variance < lowestVariance) {
        lowestVariance = variance
        mostConsistentMealTime = meal.charAt(0).toUpperCase() + meal.slice(1)
      }
    }
  }

  // Generate insights
  const insights = generateWeeklyInsights(dailyCalories, avgDailyCalories, mealTimingPatterns)

  return {
    totalWeeklyCalories,
    avgDailyCalories,
    calorieGoal: 2000, // Default goal
    daysTracked,
    avgMealsPerDay,
    mostConsistentMealTime,
    dailyCalories,
    mealTimingPatterns,
    insights,
  }
}

// Calculate meal timing patterns
function calculateMealTimingPatterns(foods: Food[]) {
  const patterns: Record<number, { breakfast: number; lunch: number; dinner: number; snacks: number }> = {}

  // Initialize hours
  for (let i = 5; i <= 23; i++) {
    patterns[i] = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 }
  }

  foods.forEach((food) => {
    const hour = food.time.getHours()
    if (hour >= 5 && hour <= 23) {
      if (food.name.toLowerCase().includes("breakfast")) {
        patterns[hour].breakfast += food.calories
      } else if (food.name.toLowerCase().includes("lunch")) {
        patterns[hour].lunch += food.calories
      } else if (food.name.toLowerCase().includes("dinner")) {
        patterns[hour].dinner += food.calories
      } else {
        patterns[hour].snacks += food.calories
      }
    }
  })

  return Object.entries(patterns).map(([hour, data]) => ({
    hour: Number.parseInt(hour),
    ...data,
  }))
}

// Generate insights for weekly stats
function generateWeeklyInsights(
  dailyCalories: { day: string; calories: number; goal: number }[],
  avgDailyCalories: number,
  mealTimingPatterns: any[],
) {
  const insights: string[] = []

  // Calorie consistency
  const calorieVariance = Math.sqrt(
    dailyCalories
      .filter((day) => day.calories > 0)
      .reduce((sum, day) => sum + Math.pow(day.calories - avgDailyCalories, 2), 0) /
      dailyCalories.filter((day) => day.calories > 0).length,
  )

  if (calorieVariance > 500) {
    insights.push(
      `Your daily calorie intake varies significantly (±${Math.round(calorieVariance)} calories). More consistency may help with energy levels.`,
    )
  } else if (calorieVariance < 200 && calorieVariance > 0) {
    insights.push(
      `Your daily calorie intake is very consistent (±${Math.round(calorieVariance)} calories), which is excellent for metabolic health.`,
    )
  }

  // Weekend vs weekday patterns
  const weekdayCalories = dailyCalories
    .filter((day) => ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day.day))
    .reduce((sum, day) => sum + day.calories, 0)

  const weekendCalories = dailyCalories
    .filter((day) => ["Sat", "Sun"].includes(day.day))
    .reduce((sum, day) => sum + day.calories, 0)

  const weekdayAvg =
    weekdayCalories /
    dailyCalories.filter((day) => ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day.day) && day.calories > 0).length
  const weekendAvg =
    weekendCalories / dailyCalories.filter((day) => ["Sat", "Sun"].includes(day.day) && day.calories > 0).length

  if (!isNaN(weekdayAvg) && !isNaN(weekendAvg) && Math.abs(weekendAvg - weekdayAvg) > 300) {
    if (weekendAvg > weekdayAvg) {
      insights.push(
        `You consume about ${Math.round(weekendAvg - weekdayAvg)} more calories on weekend days compared to weekdays.`,
      )
    } else {
      insights.push(
        `You consume about ${Math.round(weekdayAvg - weekendAvg)} fewer calories on weekend days compared to weekdays.`,
      )
    }
  }

  // Meal timing consistency
  const breakfastHours = mealTimingPatterns.filter((pattern) => pattern.breakfast > 0).map((pattern) => pattern.hour)

  const lunchHours = mealTimingPatterns.filter((pattern) => pattern.lunch > 0).map((pattern) => pattern.hour)

  const dinnerHours = mealTimingPatterns.filter((pattern) => pattern.dinner > 0).map((pattern) => pattern.hour)

  if (breakfastHours.length > 0 && Math.max(...breakfastHours) - Math.min(...breakfastHours) > 2) {
    insights.push(
      `Your breakfast timing varies by ${Math.max(...breakfastHours) - Math.min(...breakfastHours)} hours throughout the week.`,
    )
  }

  if (dinnerHours.length > 0 && Math.max(...dinnerHours) - Math.min(...dinnerHours) > 2) {
    insights.push(
      `Your dinner timing varies by ${Math.max(...dinnerHours) - Math.min(...dinnerHours)} hours throughout the week.`,
    )
  }

  // If no insights, add a default one
  if (insights.length === 0) {
    insights.push("Your weekly eating patterns are consistent and well-balanced.")
  }

  return insights
}

// Calculate monthly statistics
export function calculateMonthlyStats(foods: Food[]) {
  const today = new Date()
  const oneMonthAgo = new Date(today)
  oneMonthAgo.setDate(today.getDate() - 30)

  // Filter foods for the past month
  const foodsForMonth = foods.filter((food) => food.time >= oneMonthAgo && food.time <= today)

  // Group foods by day
  const foodsByDay: Record<string, Food[]> = {}

  foodsForMonth.forEach((food) => {
    const dayKey = food.time.toISOString().split("T")[0]
    if (!foodsByDay[dayKey]) {
      foodsByDay[dayKey] = []
    }
    foodsByDay[dayKey].push(food)
  })

  // Calculate daily calories
  const dailyCalories = Object.entries(foodsByDay)
    .map(([day, dayFoods]) => {
      const calories = dayFoods.reduce((sum, food) => sum + food.calories, 0)
      return {
        day: day.slice(5), // Format as MM-DD
        calories,
        goal: 2000, // Default goal
      }
    })
    .sort((a, b) => a.day.localeCompare(b.day))

  // Calculate weekly averages
  const weeklyAverages = calculateWeeklyAverages(foodsByDay)

  // Calculate day of week patterns
  const dayOfWeekPatterns = calculateDayOfWeekPatterns(foodsByDay)

  // Calculate total and average calories
  const totalMonthlyCalories = dailyCalories.reduce((sum, day) => sum + day.calories, 0)
  const daysTracked = dailyCalories.length
  const avgDailyCalories = daysTracked > 0 ? Math.round(totalMonthlyCalories / daysTracked) : 0

  // Calculate min and max calories
  const calorieValues = dailyCalories.map((day) => day.calories).filter((cal) => cal > 0)
  const minCalories = calorieValues.length > 0 ? Math.min(...calorieValues) : 0
  const maxCalories = calorieValues.length > 0 ? Math.max(...calorieValues) : 0
  const calorieVariance = Math.round(maxCalories - minCalories)

  // Calculate days on target
  const daysOnTarget = dailyCalories.filter((day) => Math.abs(day.calories - day.goal) <= 200).length

  // Generate insights
  const insights = generateMonthlyInsights(dailyCalories, avgDailyCalories, dayOfWeekPatterns)

  return {
    totalMonthlyCalories,
    avgDailyCalories,
    daysTracked,
    daysOnTarget,
    minCalories,
    maxCalories,
    calorieVariance,
    dailyCalories,
    weeklyAverages,
    dayOfWeekPatterns,
    insights,
  }
}

// Calculate weekly averages
function calculateWeeklyAverages(foodsByDay: Record<string, Food[]>) {
  const weeklyData: Record<number, { calories: number; days: number }> = {}

  Object.entries(foodsByDay).forEach(([day, foods]) => {
    const date = new Date(day)
    const weekNumber = Math.ceil((date.getDate() - date.getDay()) / 7)

    if (!weeklyData[weekNumber]) {
      weeklyData[weekNumber] = { calories: 0, days: 0 }
    }

    weeklyData[weekNumber].calories += foods.reduce((sum, food) => sum + food.calories, 0)
    weeklyData[weekNumber].days += 1
  })

  return Object.entries(weeklyData).map(([week, data]) => ({
    week: `Week ${week}`,
    calories: Math.round(data.calories / data.days),
    goal: 2000, // Default goal
  }))
}

// Calculate day of week patterns
function calculateDayOfWeekPatterns(foodsByDay: Record<string, Food[]>) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayData: Record<string, { calories: number; count: number }> = {}

  daysOfWeek.forEach((day) => {
    dayData[day] = { calories: 0, count: 0 }
  })

  Object.entries(foodsByDay).forEach(([day, foods]) => {
    const date = new Date(day)
    const dayOfWeek = daysOfWeek[date.getDay()]

    dayData[dayOfWeek].calories += foods.reduce((sum, food) => sum + food.calories, 0)
    dayData[dayOfWeek].count += 1
  })

  return Object.entries(dayData)
    .map(([day, data]) => ({
      day,
      calories: data.count > 0 ? Math.round(data.calories / data.count) : 0,
    }))
    .sort((a, b) => {
      const dayOrder = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
      return dayOrder[a.day as keyof typeof dayOrder] - dayOrder[b.day as keyof typeof dayOrder]
    })
}

// Generate insights for monthly stats
function generateMonthlyInsights(
  dailyCalories: { day: string; calories: number; goal: number }[],
  avgDailyCalories: number,
  dayOfWeekPatterns: { day: string; calories: number }[],
) {
  const insights: string[] = []

  // Trend analysis
  if (dailyCalories.length >= 14) {
    const firstHalf = dailyCalories.slice(0, Math.floor(dailyCalories.length / 2))
    const secondHalf = dailyCalories.slice(Math.floor(dailyCalories.length / 2))

    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.calories, 0) / firstHalf.length
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.calories, 0) / secondHalf.length

    const difference = secondHalfAvg - firstHalfAvg

    if (Math.abs(difference) > 150) {
      if (difference > 0) {
        insights.push(
          `Your calorie intake has increased by about ${Math.round(difference)} calories per day in the latter half of the month.`,
        )
      } else {
        insights.push(
          `Your calorie intake has decreased by about ${Math.round(-difference)} calories per day in the latter half of the month.`,
        )
      }
    }
  }

  // Day of week patterns
  const highestDay = [...dayOfWeekPatterns].sort((a, b) => b.calories - a.calories)[0]
  const lowestDay = [...dayOfWeekPatterns].filter((day) => day.calories > 0).sort((a, b) => a.calories - b.calories)[0]

  if (highestDay && lowestDay && highestDay.calories - lowestDay.calories > 300) {
    insights.push(
      `${highestDay.day}s have your highest average calorie intake (${highestDay.calories} cal), while ${lowestDay.day}s have your lowest (${lowestDay.calories} cal).`,
    )
  }

  // Consistency analysis
  const daysOnTarget = dailyCalories.filter((day) => Math.abs(day.calories - day.goal) <= 200).length
  const consistency = Math.round((daysOnTarget / dailyCalories.length) * 100)

  if (consistency >= 70) {
    insights.push(
      `You stayed within 200 calories of your goal on ${consistency}% of days this month, showing excellent consistency.`,
    )
  } else if (consistency <= 30) {
    insights.push(
      `You only stayed within 200 calories of your goal on ${consistency}% of days this month. More consistency may help with results.`,
    )
  }

  // Goal alignment
  if (avgDailyCalories > 0) {
    const goalDifference = avgDailyCalories - 2000 // Default goal

    if (Math.abs(goalDifference) > 300) {
      if (goalDifference > 0) {
        insights.push(
          `Your monthly average of ${avgDailyCalories} calories is significantly above your goal of 2000 calories.`,
        )
      } else {
        insights.push(
          `Your monthly average of ${avgDailyCalories} calories is significantly below your goal of 2000 calories.`,
        )
      }
    }
  }

  // If no insights, add a default one
  if (insights.length === 0) {
    insights.push("Your monthly eating patterns are consistent and well-aligned with your goals.")
  }

  return insights
}

// Calculate goal progress
export function calculateGoalProgress(foods: Food[], goals: any) {
  const today = new Date()
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(today.getDate() - 7)
  const oneMonthAgo = new Date(today)
  oneMonthAgo.setDate(today.getDate() - 30)

  // Filter foods for different time periods
  const foodsForToday = foods.filter(
    (food) =>
      food.time.getDate() === today.getDate() &&
      food.time.getMonth() === today.getMonth() &&
      food.time.getFullYear() === today.getFullYear(),
  )

  const foodsForWeek = foods.filter((food) => food.time >= oneWeekAgo && food.time <= today)

  const foodsForMonth = foods.filter((food) => food.time >= oneMonthAgo && food.time <= today)

  // Calculate daily progress
  const dailyProgress = {
    calories: foodsForToday.reduce((sum, food) => sum + food.calories, 0),
    meals: foodsForToday.length,
    water: Math.round(Math.random() * goals.daily.water), // Mock data for water intake
    protein: Math.round(
      foodsForToday.reduce((sum, food) => sum + (food.name.toLowerCase().includes("protein") ? 20 : 10), 0),
    ), // Mock data for protein
  }

  // Calculate weekly progress
  const weeklyProgress = {
    avgCalories:
      foodsForWeek.length > 0 ? Math.round(foodsForWeek.reduce((sum, food) => sum + food.calories, 0) / 7) : 0,
    exerciseDays: Math.round(Math.random() * goals.weekly.exerciseDays), // Mock data for exercise
    mealPrep: Math.round(Math.random() * goals.weekly.mealPrep), // Mock data for meal prep
    sugarLimit: Math.round(Math.random() * goals.weekly.sugarLimit), // Mock data for sugar limit
  }

  // Calculate monthly progress
  const monthlyProgress = {
    weightChange: (Math.random() * 2 - 1) * goals.monthly.weightChange, // Mock data for weight change
    consistentDays: Math.round(Math.random() * goals.monthly.consistentDays), // Mock data for consistent days
    cheatMeals: Math.round(Math.random() * goals.monthly.cheatMeals), // Mock data for cheat meals
    avgProtein: Math.round(Math.random() * goals.monthly.avgProtein), // Mock data for average protein
  }

  return {
    daily: dailyProgress,
    weekly: weeklyProgress,
    monthly: monthlyProgress,
  }
}

