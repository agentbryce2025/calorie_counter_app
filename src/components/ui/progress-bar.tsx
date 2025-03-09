import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  // Determine color based on percentage
  let colorClass = "bg-green-500"; // Default green
  
  if (percentage > 85) {
    colorClass = "bg-yellow-500";
  }
  
  if (percentage >= 100) {
    colorClass = "bg-red-500";
  }
  
  return (
    <Progress.Root 
      className={cn(
        "relative overflow-hidden bg-secondary rounded-full w-full h-4 shadow-sm",
        className
      )}
      value={percentage}
    >
      <Progress.Indicator
        className={cn(
          "h-full w-full transition-all duration-500 ease-in-out rounded-full",
          colorClass
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;