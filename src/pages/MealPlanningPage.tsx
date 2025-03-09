import React from 'react';
import { MealPlanning } from '../components/MealPlanning';

const MealPlanningPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meal Planning</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage your meal plans to help you reach your nutritional goals.
            </p>
          </div>
          
          <MealPlanning />
        </div>
      </div>
    </div>
  );
};

export default MealPlanningPage;