import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FoodEntry } from '../hooks/useFoodEntries';

interface NutritionChartProps {
  foodEntries: FoodEntry[];
  darkMode: boolean;
}

interface NutrientData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const NUTRIENTS = ['carbs', 'protein', 'fat'];
const NUTRIENT_LABELS = {
  carbs: 'Carbohydrates',
  protein: 'Protein',
  fat: 'Fat'
};

const NutritionChart: React.FC<NutritionChartProps> = ({ foodEntries, darkMode }) => {
  // Calculate total nutrients
  const calculateNutrients = () => {
    const totals = {
      carbs: 0,
      protein: 0,
      fat: 0
    };

    foodEntries.forEach(entry => {
      // Some entries might not have all nutrient data
      if (entry.carbs) totals.carbs += entry.carbs;
      if (entry.protein) totals.protein += entry.protein;
      if (entry.fat) totals.fat += entry.fat;
    });

    // Convert to array format for the pie chart
    return NUTRIENTS.map((nutrient, index) => ({
      name: NUTRIENT_LABELS[nutrient as keyof typeof NUTRIENT_LABELS],
      value: totals[nutrient as keyof typeof totals],
      color: COLORS[index % COLORS.length]
    })).filter(item => item.value > 0); // Only show nutrients with values
  };

  const data = calculateNutrients();
  
  // Calculate total calories from macronutrients
  const calculateMacroCalories = () => {
    const carbItem = data.find(item => item.name === NUTRIENT_LABELS.carbs);
    const proteinItem = data.find(item => item.name === NUTRIENT_LABELS.protein);
    const fatItem = data.find(item => item.name === NUTRIENT_LABELS.fat);
    
    const caloriesFromCarbs = carbItem ? carbItem.value * 4 : 0;
    const caloriesFromProtein = proteinItem ? proteinItem.value * 4 : 0;
    const caloriesFromFat = fatItem ? fatItem.value * 9 : 0;
    
    return {
      carbs: caloriesFromCarbs,
      protein: caloriesFromProtein,
      fat: caloriesFromFat,
      total: caloriesFromCarbs + caloriesFromProtein + caloriesFromFat
    };
  };

  const calorieData = calculateMacroCalories();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const macroName = item.name.toLowerCase();
      const caloriesPerGram = macroName === 'fat' ? 9 : 4;
      const caloriesFromMacro = item.value * caloriesPerGram;
      const percentOfTotalCalories = calorieData.total > 0 
        ? Math.round((caloriesFromMacro / calorieData.total) * 100) 
        : 0;

      return (
        <div className={`p-3 rounded shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <p className="font-bold mb-1">{item.name}</p>
          <p className="text-sm"><span className="font-medium">Amount:</span> {item.value}g</p>
          <p className="text-sm"><span className="font-medium">Calories:</span> {caloriesFromMacro}</p>
          <p className="text-sm"><span className="font-medium">% of calories:</span> {percentOfTotalCalories}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className={`flex items-center justify-center h-full ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No nutritional data available
        </div>
      )}
    </div>
  );
};

export default NutritionChart;