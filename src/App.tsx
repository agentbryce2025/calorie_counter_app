import React, { useState } from 'react';
import './App.css';
import CalorieChart from './components/CalorieChart';
import FoodEntryForm from './components/FoodEntryForm';
import CalorieTable from './components/CalorieTable';

// Dummy data for calorie tracking
const initialData = [
  { id: 1, day: "Monday", calories: 2100, goal: 2000 },
  { id: 2, day: "Tuesday", calories: 1900, goal: 2000 },
  { id: 3, day: "Wednesday", calories: 2200, goal: 2000 },
  { id: 4, day: "Thursday", calories: 1850, goal: 2000 },
  { id: 5, day: "Friday", calories: 2050, goal: 2000 },
  { id: 6, day: "Saturday", calories: 2300, goal: 2000 },
  { id: 7, day: "Sunday", calories: 1950, goal: 2000 },
];

interface FoodEntry {
  id: number;
  name: string;
  calories: number;
  date: Date;
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [calorieData, setCalorieData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("daily");
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  const handleAddFood = (foodName: string, calories: number) => {
    const newEntry: FoodEntry = {
      id: Date.now(),
      name: foodName,
      calories: calories,
      date: new Date()
    };
    
    setFoodEntries([newEntry, ...foodEntries]);
    
    // Update the current day's calories in the chart data
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const updatedData = calorieData.map(item => {
      if (item.day === today) {
        return {
          ...item,
          calories: item.calories + calories
        };
      }
      return item;
    });
    
    setCalorieData(updatedData);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calorie Counter</h1>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'daily' 
                ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') 
                : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'weekly' 
                ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') 
                : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'monthly' 
                ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') 
                : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
          </div>

          <div className={`h-64 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
            <CalorieChart data={calorieData} darkMode={darkMode} />
          </div>
        </div>

        <FoodEntryForm darkMode={darkMode} onAddFood={handleAddFood} />
        <CalorieTable data={calorieData} darkMode={darkMode} />
        
        {foodEntries.length > 0 && (
          <div className={`mt-6 rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
            <h2 className="text-xl font-bold mb-4">Food Log</h2>
            <div className={`overflow-x-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg`}>
              <table className="min-w-full">
                <thead>
                  <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                    <th className="py-2 px-4 text-left">Food</th>
                    <th className="py-2 px-4 text-left">Calories</th>
                    <th className="py-2 px-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {foodEntries.map(entry => (
                    <tr key={entry.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                      <td className="py-2 px-4">{entry.name}</td>
                      <td className="py-2 px-4">{entry.calories}</td>
                      <td className="py-2 px-4">{entry.date.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
