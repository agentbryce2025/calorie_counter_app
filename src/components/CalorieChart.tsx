import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CalorieItem {
  id: number;
  day: string;
  calories: number;
  goal: number;
}

interface CalorieChartProps {
  data: CalorieItem[];
  darkMode: boolean;
}

const CalorieChart = ({ data, darkMode }: CalorieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
        <XAxis 
          dataKey="day" 
          stroke={darkMode ? "#f9fafb" : "#111827"}
        />
        <YAxis 
          stroke={darkMode ? "#f9fafb" : "#111827"}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
            color: darkMode ? "#f9fafb" : "#111827",
            border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb"
          }}
        />
        <Legend />
        <Bar 
          dataKey="calories" 
          fill="#3b82f6" 
          name="Calories" 
        />
        <Bar 
          dataKey="goal" 
          fill="#10b981" 
          name="Goal" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CalorieChart;