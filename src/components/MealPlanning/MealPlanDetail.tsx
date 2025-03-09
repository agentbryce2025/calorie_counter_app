import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { MealPlanFormData, MealItem } from './MealPlanForm';

interface MealPlanDetailProps {
  plan: MealPlanFormData;
  onBack: () => void;
  onEdit: (plan: MealPlanFormData) => void;
}

const MealPlanDetail: React.FC<MealPlanDetailProps> = ({ plan, onBack, onEdit }) => {
  // Group meals by day
  const mealsByDay = useMemo(() => {
    const grouped: Record<string, MealItem[]> = {};
    
    // Sort meals by day and meal type
    const sortedMeals = [...plan.meals].sort((a, b) => {
      // First sort by day
      const dayComparison = a.day.localeCompare(b.day);
      if (dayComparison !== 0) return dayComparison;
      
      // Then sort by meal type (breakfast, lunch, dinner, snack)
      const mealTypeOrder = {
        breakfast: 0,
        lunch: 1, 
        dinner: 2,
        snack: 3
      };
      
      return mealTypeOrder[a.mealType] - mealTypeOrder[b.mealType];
    });
    
    // Group by day
    sortedMeals.forEach((meal) => {
      if (!grouped[meal.day]) {
        grouped[meal.day] = [];
      }
      grouped[meal.day].push(meal);
    });
    
    return grouped;
  }, [plan.meals]);
  
  // Calculate nutritional totals
  const nutritionTotals = useMemo(() => {
    return plan.meals.reduce(
      (totals, meal) => {
        return {
          calories: totals.calories + meal.calories,
          protein: totals.protein + meal.protein,
          carbs: totals.carbs + meal.carbs,
          fat: totals.fat + meal.fat
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [plan.meals]);
  
  // Calculate average daily values
  const uniqueDaysCount = Object.keys(mealsByDay).length;
  const dailyAverages = useMemo(() => {
    if (!uniqueDaysCount) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return {
      calories: Math.round(nutritionTotals.calories / uniqueDaysCount),
      protein: Math.round(nutritionTotals.protein / uniqueDaysCount),
      carbs: Math.round(nutritionTotals.carbs / uniqueDaysCount),
      fat: Math.round(nutritionTotals.fat / uniqueDaysCount)
    };
  }, [nutritionTotals, uniqueDaysCount]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{plan.title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Back
            </button>
            <button
              onClick={() => onEdit(plan)}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Edit Plan
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-6">
          <div className="md:mr-6 mb-2 md:mb-0">
            <span className="font-medium">Date Range:</span>{' '}
            {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
          </div>
          <div>
            <span className="font-medium">Total Days:</span> {uniqueDaysCount}
          </div>
        </div>
        
        {plan.description && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{plan.description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Total Nutrition</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Calories</div>
                <div className="font-bold text-gray-800 text-xl">{nutritionTotals.calories}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Protein</div>
                <div className="font-bold text-gray-800 text-xl">{nutritionTotals.protein}g</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Carbs</div>
                <div className="font-bold text-gray-800 text-xl">{nutritionTotals.carbs}g</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Fat</div>
                <div className="font-bold text-gray-800 text-xl">{nutritionTotals.fat}g</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Daily Average</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Calories</div>
                <div className="font-bold text-gray-800 text-xl">{dailyAverages.calories}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Protein</div>
                <div className="font-bold text-gray-800 text-xl">{dailyAverages.protein}g</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Carbs</div>
                <div className="font-bold text-gray-800 text-xl">{dailyAverages.carbs}g</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Fat</div>
                <div className="font-bold text-gray-800 text-xl">{dailyAverages.fat}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Daily Meal Plans</h3>
        
        {Object.entries(mealsByDay).map(([day, meals]) => {
          // Calculate daily totals
          const dailyTotals = meals.reduce(
            (totals, meal) => {
              return {
                calories: totals.calories + meal.calories,
                protein: totals.protein + meal.protein,
                carbs: totals.carbs + meal.carbs,
                fat: totals.fat + meal.fat
              };
            },
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );
          
          return (
            <div key={day} className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-800">
                  {format(new Date(day), 'EEEE, MMMM d, yyyy')}
                </h4>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Daily Total:</span> {dailyTotals.calories} calories
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {meals.map((meal) => (
                  <div key={meal.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="mb-3 md:mb-0">
                        <div className="flex items-center mb-2">
                          <span className="inline-block w-20 capitalize font-medium text-gray-700">
                            {meal.mealType}
                          </span>
                          <h5 className="text-xl font-medium text-gray-900 ml-2">{meal.name}</h5>
                        </div>
                        
                        {meal.notes && (
                          <p className="text-gray-600 text-sm ml-[88px]">{meal.notes}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Calories</div>
                          <div className="font-medium">{meal.calories}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Protein</div>
                          <div className="font-medium">{meal.protein}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Carbs</div>
                          <div className="font-medium">{meal.carbs}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Fat</div>
                          <div className="font-medium">{meal.fat}g</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Total Calories</div>
                    <div className="font-medium text-gray-800">{dailyTotals.calories}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Total Protein</div>
                    <div className="font-medium text-gray-800">{dailyTotals.protein}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Total Carbs</div>
                    <div className="font-medium text-gray-800">{dailyTotals.carbs}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Total Fat</div>
                    <div className="font-medium text-gray-800">{dailyTotals.fat}g</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanDetail;