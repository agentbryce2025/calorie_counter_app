interface ProgressBarProps {
  current: number
  max: number
}

export function ProgressBar({ current, max }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((current / max) * 100))

  // Determine color based on percentage
  let colorClass = "bg-green-500"
  if (percentage > 85) {
    colorClass = "bg-yellow-500"
  }
  if (percentage >= 100) {
    colorClass = "bg-red-500"
  }

  return (
    <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
      <div
        className={`h-full ${colorClass} transition-all duration-500 ease-in-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

