import React from 'react';

interface CalorieItem {
  id: number;
  day: string;
  calories: number;
  goal: number;
}

interface CalorieTableProps {
  data: CalorieItem[];
  darkMode: boolean;
}

const CalorieTable = ({ data, darkMode }: CalorieTableProps) => {
  return (
    <div className={`mt-6 rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
      <h2 className="text-xl font-bold mb-4">Recent Entries</h2>
      <div className={`overflow-x-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg`}>
        <table className="min-w-full">
          <thead>
            <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
              <th className="py-2 px-4 text-left">Day</th>
              <th className="py-2 px-4 text-left">Calories</th>
              <th className="py-2 px-4 text-left">Goal</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <td className="py-2 px-4">{item.day}</td>
                <td className="py-2 px-4">{item.calories}</td>
                <td className="py-2 px-4">{item.goal}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.calories <= item.goal 
                      ? 'bg-green-500 bg-opacity-20 text-green-500' 
                      : 'bg-red-500 bg-opacity-20 text-red-500'
                  }`}>
                    {item.calories <= item.goal ? 'Within Goal' : 'Exceeded'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalorieTable;