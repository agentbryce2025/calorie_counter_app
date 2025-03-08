import React from 'react';
import * as Progress from '@radix-ui/react-progress';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <Progress.Root 
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full w-full h-4 ${className || ''}`}
      value={percentage}
    >
      <Progress.Indicator
        className={`h-full transition-transform duration-300 ease-in-out rounded-full ${
          percentage > 100 
            ? 'bg-red-500 dark:bg-red-600' 
            : 'bg-blue-500 dark:bg-blue-600'
        }`}
        style={{ width: `${percentage}%` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;