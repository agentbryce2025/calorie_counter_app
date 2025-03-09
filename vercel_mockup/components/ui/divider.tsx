import type React from "react"
import { cn } from "@/lib/utils"

interface DividerProps {
  children?: React.ReactNode
  className?: string
}

export function Divider({ children, className }: DividerProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="flex-grow border-t border-muted"></div>
      {children && <div className="mx-3 flex-shrink text-xs text-muted-foreground">{children}</div>}
      <div className="flex-grow border-t border-muted"></div>
    </div>
  )
}

