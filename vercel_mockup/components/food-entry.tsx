"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FoodEntryProps {
  food: {
    id: string
    name: string
    calories: number
    time: Date
    description: string
  }
  onDelete: () => void
}

export function FoodEntry({ food, onDelete }: FoodEntryProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-border flex justify-between items-center">
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{food.name}</h3>
            <p className="text-xs text-muted-foreground">
              {food.time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span className="font-semibold text-primary">{food.calories} cal</span>
        </div>
        {food.description && <p className="text-xs mt-1 text-muted-foreground line-clamp-1">{food.description}</p>}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="ml-2 text-muted-foreground hover:text-destructive h-8 w-8"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete food entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {food.name} from your food log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

