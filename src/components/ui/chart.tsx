import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Actual implementation of CalorieChart
export const CalorieChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} cal`}
          />
          <Tooltip 
            formatter={(value) => [`${value} calories`, 'Calories']}
            contentStyle={{ 
              backgroundColor: 'var(--tooltip-bg, #f8fafc)',
              border: '1px solid var(--tooltip-border, #e2e8f0)',
              borderRadius: '6px',
              fontSize: '12px' 
            }}
          />
          <Bar 
            dataKey="calories" 
            fill="var(--bar-fill, #3b82f6)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};