import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, isValid } from 'date-fns';
import { FoodEntry } from '../hooks/useFoodEntries';

interface TrendsChartProps {
  foodEntries: FoodEntry[];
  darkMode: boolean;
  days?: number;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ foodEntries, darkMode, days = 14 }) => {
  // Prepare data for the chart
  const prepareChartData = () => {
    // Create a map to store daily totals
    const dailyMap = new Map();
    
    // Get the date range
    const today = new Date();
    const startDate = subDays(today, days - 1);
    
    // Initialize the daily map with all dates in the range
    for (let i = 0; i < days; i++) {
      const currentDate = subDays(today, i);
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      dailyMap.set(dateKey, { 
        date: new Date(dateKey),
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        entryCount: 0
      });
    }
    
    // Aggregate food entries by day
    foodEntries.forEach(entry => {
      if (entry.timestamp && isValid(new Date(entry.timestamp))) {
        const entryDate = new Date(entry.timestamp);
        const dateKey = format(entryDate, 'yyyy-MM-dd');
        
        // Only include entries within our date range
        if (dailyMap.has(dateKey)) {
          const dayData = dailyMap.get(dateKey);
          dayData.calories += entry.calories || 0;
          dayData.carbs += entry.carbs || 0;
          dayData.protein += entry.protein || 0;
          dayData.fat += entry.fat || 0;
          dayData.entryCount += 1;
          dailyMap.set(dateKey, dayData);
        }
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(dailyMap.entries())
      .map(([dateKey, data]) => ({
        dateKey,
        displayDate: format(data.date, 'MMM d'),
        ...data
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const chartData = prepareChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <p className="font-bold mb-1">{data.displayDate}</p>
          <p className="text-sm"><span className="font-medium">Calories:</span> {data.calories}</p>
          {data.carbs > 0 && (
            <p className="text-sm"><span className="font-medium">Carbs:</span> {data.carbs}g</p>
          )}
          {data.protein > 0 && (
            <p className="text-sm"><span className="font-medium">Protein:</span> {data.protein}g</p>
          )}
          {data.fat > 0 && (
            <p className="text-sm"><span className="font-medium">Fat:</span> {data.fat}g</p>
          )}
          <p className="text-sm mt-1"><span className="font-medium">Food entries:</span> {data.entryCount}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
          <XAxis 
            dataKey="displayDate" 
            stroke={darkMode ? "#f9fafb" : "#111827"}
          />
          <YAxis 
            stroke={darkMode ? "#f9fafb" : "#111827"}
            yAxisId="left"
          />
          <YAxis 
            stroke={darkMode ? "#f9fafb" : "#111827"}
            yAxisId="right" 
            orientation="right"
            domain={[0, 'dataMax + 10']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="calories" 
            stroke="#3b82f6" 
            activeDot={{ r: 8 }} 
            name="Calories"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="carbs" 
            stroke="#10b981" 
            name="Carbs (g)"
            dot={{ r: 2 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="protein" 
            stroke="#f59e0b" 
            name="Protein (g)"
            dot={{ r: 2 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="fat" 
            stroke="#ef4444" 
            name="Fat (g)"
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChart;