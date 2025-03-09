"use client"

import { useState } from "react"
import { Plus, Mic, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AddFoodButtonProps {
  onAddFood: (food: {
    name: string
    calories: number
    time: Date
    description: string
  }) => void
  selectedDate: Date
}

export function AddFoodButton({ onAddFood, selectedDate }: AddFoodButtonProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  })
  const [isListening, setIsListening] = useState(false)
  const [description, setDescription] = useState("")

  // Handle voice input
  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        processNaturalLanguageInput(transcript)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert("Speech recognition is not supported in your browser.")
    }
  }

  // Process natural language input
  const processNaturalLanguageInput = (text: string) => {
    // Very simple NLP - in a real app, you'd use a more sophisticated approach
    // This is just a basic example

    // Try to extract food name
    const foodName = text.replace(/I ate|I had|ate|had|consumed/gi, "").trim()

    // Auto-populate calories based on mock data
    const calorieEstimate = getMockCalories(foodName)

    setName(foodName)
    setCalories(calorieEstimate.toString())
    setDescription(text)
  }

  // Mock function to simulate getting calories from an API or algorithm
  const getMockCalories = (foodName: string): number => {
    const lowerCaseFood = foodName.toLowerCase()

    // Mock database of foods and calories
    const foodDatabase: Record<string, number> = {
      apple: 95,
      banana: 105,
      orange: 62,
      pizza: 285,
      "slice of pizza": 285,
      burger: 550,
      hamburger: 550,
      cheeseburger: 650,
      salad: 150,
      "caesar salad": 220,
      chicken: 335,
      "chicken breast": 165,
      rice: 200,
      "cup of rice": 200,
      pasta: 220,
      spaghetti: 220,
      sandwich: 350,
      "turkey sandwich": 320,
      bagel: 245,
      "cream cheese": 100,
      "bagel with cream cheese": 345,
      yogurt: 150,
      "greek yogurt": 120,
      oatmeal: 150,
      cereal: 180,
      milk: 120,
      coffee: 5,
      latte: 120,
      cappuccino: 110,
      muffin: 340,
      donut: 250,
      cookie: 150,
      chocolate: 210,
      "ice cream": 270,
      steak: 420,
      salmon: 280,
      tuna: 180,
      eggs: 140,
      "two eggs": 140,
      toast: 75,
      "avocado toast": 190,
      "protein shake": 170,
      smoothie: 210,
      "fruit smoothie": 210,
      "protein bar": 180,
      "energy bar": 200,
      nuts: 170,
      almonds: 170,
      "handful of almonds": 170,
      chips: 160,
      "french fries": 365,
      soda: 150,
      beer: 150,
      wine: 120,
      "glass of wine": 120,
    }

    // Try to find an exact match
    for (const [food, calories] of Object.entries(foodDatabase)) {
      if (lowerCaseFood.includes(food)) {
        return calories
      }
    }

    // If no match found, generate a random but reasonable calorie count
    // This simulates an AI algorithm making an educated guess
    const baseCalories = 200
    const randomVariation = Math.floor(Math.random() * 300) - 100 // -100 to +200
    return Math.max(50, baseCalories + randomVariation)
  }

  const handleSubmit = () => {
    // Create a new Date object from the selected date
    const dateTime = new Date(selectedDate)

    // Parse the time input and set the hours and minutes
    const [hours, minutes] = time.split(":").map(Number)
    dateTime.setHours(hours, minutes)

    // Ensure we have calories (either from natural language processing or default)
    const calorieValue = Number.parseInt(calories) || getMockCalories(name)

    onAddFood({
      name,
      calories: calorieValue,
      time: dateTime,
      description,
    })

    // Reset form
    setInput("")
    setName("")
    setCalories("")
    setDescription("")
    setOpen(false)
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Food Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Textarea
                placeholder="Describe what you ate in natural language..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  processNaturalLanguageInput(e.target.value)
                }}
                className="flex-1"
              />
              <Button
                variant={isListening ? "destructive" : "secondary"}
                size="icon"
                onClick={isListening ? () => setIsListening(false) : startListening}
                type="button"
              >
                {isListening ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    // Still calculate calories in the background
                    setCalories(getMockCalories(e.target.value).toString())
                  }}
                  placeholder="e.g., Apple, Pizza"
                />
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any details about this meal..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

