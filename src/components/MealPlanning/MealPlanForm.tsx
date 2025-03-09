import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

interface MealPlanFormProps {
  onSubmit: (data: MealPlanFormData) => void;
  initialData?: MealPlanFormData;
}

export interface MealPlanFormData {
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  meals: MealItem[];
}

export interface MealItem {
  id: string;
  day: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
}

const MealPlanForm: React.FC<MealPlanFormProps> = ({ onSubmit, initialData }) => {
  const [meals, setMeals] = useState<MealItem[]>(initialData?.meals || []);
  const { register, handleSubmit, control, formState: { errors } } = useForm<MealPlanFormData>({
    defaultValues: initialData || {
      title: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      description: '',
      meals: []
    }
  });

  const [mealForm, setMealForm] = useState({
    day: format(new Date(), 'yyyy-MM-dd'),
    mealType: 'breakfast' as const,
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: ''
  });

  const handleMealFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMealForm(prev => ({
      ...prev,
      [name]: name === 'calories' || name === 'protein' || name === 'carbs' || name === 'fat' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const addMeal = () => {
    const newMeal: MealItem = {
      ...mealForm,
      id: `meal-${Date.now()}`
    };
    
    setMeals(prev => [...prev, newMeal]);
    
    // Reset form
    setMealForm({
      day: format(new Date(), 'yyyy-MM-dd'),
      mealType: 'breakfast' as const,
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      notes: ''
    });
  };

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
  };

  const handleFormSubmit = (data: Omit<MealPlanFormData, 'meals'>) => {
    onSubmit({
      ...data,
      meals
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Meal Plan</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Plan Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            id="title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="startDate">
              Start Date
            </label>
            <Controller
              control={control}
              name="startDate"
              rules={{ required: 'Start date is required' }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="endDate">
              End Date
            </label>
            <Controller
              control={control}
              name="endDate"
              rules={{ required: 'End date is required' }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="description"
            rows={3}
          />
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Add Meals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="day">
                Day
              </label>
              <input
                type="date"
                id="day"
                name="day"
                value={mealForm.day}
                onChange={handleMealFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="mealType">
                Meal Type
              </label>
              <select
                id="mealType"
                name="mealType"
                value={mealForm.mealType}
                onChange={handleMealFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Meal Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={mealForm.name}
              onChange={handleMealFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="calories">
                Calories
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={mealForm.calories}
                onChange={handleMealFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="protein">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={mealForm.protein}
                onChange={handleMealFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="carbs">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={mealForm.carbs}
                onChange={handleMealFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="fat">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={mealForm.fat}
                onChange={handleMealFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={mealForm.notes}
              onChange={handleMealFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          
          <button
            type="button"
            onClick={addMeal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Meal
          </button>
        </div>
        
        {meals.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Planned Meals</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meal Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Macros
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {meals.map((meal) => (
                    <tr key={meal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {meal.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {meal.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {meal.calories}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeMeal(meal.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <button
            type="submit"
            className="w-full md:w-auto bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save Meal Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default MealPlanForm;