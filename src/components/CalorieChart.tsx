import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { format } from 'date-fns';

interface CalorieItem {
  id: number;
  day: string | number;
  date?: Date;
  calories: number;
  goal: number;
}

interface CalorieChartProps {
  data: CalorieItem[];
  darkMode: boolean;
  xAxisKey?: string;
}

const CustomTooltip = ({ active, payload, label, darkMode }: TooltipProps<ValueType, NameType> & { darkMode: boolean }) => {
  if (active && payload && payload.length) {
    const calories = payload[0].value as number;
    const goal = payload[1].value as number;
    const difference = goal - calories;
    
    return (
      <div className={`p-3 rounded shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <p className="font-bold mb-1">{label}</p>
        <p className="text-sm">
          <span className="font-medium">Calories:</span> {calories}
        </p>
        <p className="text-sm">
          <span className="font-medium">Goal:</span> {goal}
        </p>
        <p className={`text-sm mt-1 ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {difference >= 0 
            ? `${difference} under target` 
            : `${Math.abs(difference)} over target`}
        </p>
      </div>
    );
  }

  return null;
};

const CalorieChart = ({ data, darkMode, xAxisKey = "day" }: CalorieChartProps) => {
  // Format the data for display if it's a date-based chart
  const formattedData = data.map(item => {
    if (item.date) {
      return {
        ...item,
        formattedDay: typeof item.day === 'number' 
          ? format(item.date, 'd') // Just the day number for monthly view
          : item.day
      };
    }
    return item;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={formattedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
        <XAxis 
          dataKey={item => item.formattedDay || item[xAxisKey]} 
          stroke={darkMode ? "#f9fafb" : "#111827"}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke={darkMode ? "#f9fafb" : "#111827"}
        />
        <Tooltip 
          content={<CustomTooltip darkMode={darkMode} />}
        />
        <Legend />
        <Bar 
          dataKey="calories" 
          fill="#3b82f6" 
          name="Calories" 
          animationDuration={1000}
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="goal" 
          fill="#10b981" 
          name="Goal" 
          animationDuration={1000}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CalorieChart;