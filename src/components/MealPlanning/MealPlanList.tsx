import React from 'react';
import { format } from 'date-fns';
// Use types from MealPlanForm instead
import { MealPlanFormData } from './MealPlanForm';

interface MealPlanListProps {
  mealPlans: MealPlanFormData[];
  onEditPlan: (plan: MealPlanFormData) => void;
  onDeletePlan: (planId: string) => void;
  onViewPlan: (plan: MealPlanFormData) => void;
}

const MealPlanList: React.FC<MealPlanListProps> = ({ 
  mealPlans, 
  onEditPlan, 
  onDeletePlan, 
  onViewPlan 
}) => {
  if (mealPlans.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Meal Plans</h3>
        <p className="text-gray-500 mb-4">You haven't created any meal plans yet.</p>
        <p className="text-gray-500">Create a new meal plan to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {mealPlans.map((plan) => {
        // Calculate total calories for the plan
        const totalCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);
        
        // Count unique days in the plan
        const uniqueDays = new Set(plan.meals.map(meal => meal.day)).size;
        
        return (
          <div 
            key={plan.title + plan.startDate.toString()} 
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h3>
              
              <div className="text-sm text-gray-500 mb-4">
                {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
              </div>
              
              {plan.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(new Set(plan.meals.map(meal => meal.mealType))).map(mealType => (
                  <span 
                    key={mealType} 
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Total Meals</div>
                  <div className="font-bold text-gray-700">{plan.meals.length}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Days</div>
                  <div className="font-bold text-gray-700">{uniqueDays}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded col-span-2">
                  <div className="text-sm text-gray-500">Total Calories</div>
                  <div className="font-bold text-gray-700">{totalCalories}</div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
              <button 
                onClick={() => onViewPlan(plan)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View Details
              </button>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => onEditPlan(plan)}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                >
                  Edit
                </button>
                
                <button 
                  onClick={() => onDeletePlan(plan.title + plan.startDate.toString())}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MealPlanList;