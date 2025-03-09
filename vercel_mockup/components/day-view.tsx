"use client"

import { useState } from "react"
import { FoodEntry } from "@/components/food-entry"

// Hours to display in the day view (from 5 AM to 11 PM)
const HOURS = Array.from({ length: 19 }, (_, i) => i + 5)

type Food = {
  id: string
  name: string
  calories: number
  time: Date
  description: string
}

interface DayViewProps {
  date: Date
  foods: Food[]
  onDeleteFood: (id: string) => void
}

export function DayView({ date, foods, onDeleteFood }: DayViewProps) {
  const [expandedHours, setExpandedHours] = useState<number[]>([])

  // Toggle expanded state for an hour
  const toggleHourExpanded = (hour: number) => {
    if (expandedHours.includes(hour)) {
      setExpandedHours(expandedHours.filter((h) => h !== hour))
    } else {
      setExpandedHours([...expandedHours, hour])
    }
  }

  // Get foods for a specific hour
  const getFoodsForHour = (hour: number) => {
    return foods.filter((food) => food.time.getHours() === hour)
  }

  // Check if there are foods for a specific hour
  const hasFoodsForHour = (hour: number) => {
    return getFoodsForHour(hour).length > 0
  }

  // Format hour for display (12-hour format with AM/PM)
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
  }

  // Calculate total calories for an hour
  const getCaloriesForHour = (hour: number) => {
    return getFoodsForHour(hour).reduce((sum, food) => sum + food.calories, 0)
  }

  return (
    <div className="day-view">
      {/* Time slots */}
      <div className="time-slots">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className={`time-slot ${hasFoodsForHour(hour) ? "has-foods" : ""} ${expandedHours.includes(hour) ? "expanded" : ""}`}
          >
            <div className="time-slot-header" onClick={() => hasFoodsForHour(hour) && toggleHourExpanded(hour)}>
              <div className="time-label">{formatHour(hour)}</div>
              {hasFoodsForHour(hour) && (
                <div className="food-indicator">
                  <div className="food-names">
                    {getFoodsForHour(hour).map((food, index) => (
                      <span key={food.id} className="food-name">
                        {index > 0 && ", "}
                        {food.name.split(" - ")[1] || food.name}
                      </span>
                    ))}
                  </div>
                  <span className="food-calories">{getCaloriesForHour(hour)} cal</span>
                </div>
              )}
            </div>

            {/* Food entries for this hour */}
            {expandedHours.includes(hour) && (
              <div className="food-entries">
                {getFoodsForHour(hour).map((food) => (
                  <FoodEntry key={food.id} food={food} onDelete={() => onDeleteFood(food.id)} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .day-view {
          height: 600px;
          overflow-y: auto;
          padding: 0.5rem;
        }
        
        .time-slots {
          display: flex;
          flex-direction: column;
        }
        
        .time-slot {
          border-top: 1px solid hsl(var(--border));
          padding: 0.5rem 0;
        }
        
        .time-slot:last-child {
          border-bottom: 1px solid hsl(var(--border));
        }
        
        .time-slot.has-foods {
          background-color: hsl(var(--secondary) / 0.3);
          cursor: pointer;
        }
        
        .time-slot.has-foods:hover {
          background-color: hsl(var(--secondary) / 0.5);
        }
        
        .time-slot.expanded {
          background-color: hsl(var(--secondary) / 0.7);
        }
        
        .time-slot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
        }
        
        .time-label {
          font-weight: 500;
          width: 70px;
        }
        
        .food-indicator {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex: 1;
          margin-left: 1rem;
          overflow: hidden;
        }

        .food-names {
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          text-align: right;
        }

        .food-name {
          font-weight: 500;
        }

        .food-calories {
          font-weight: 600;
          color: hsl(var(--primary));
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        .food-entries {
          padding: 0.5rem 1rem 0.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  )
}

