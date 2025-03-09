import React, { useState, useEffect } from 'react';
import MealPlanForm from './MealPlanForm';
import MealPlanList from './MealPlanList';
import MealPlanDetail from './MealPlanDetail';
import { MealPlanFormData, MealItem } from './MealPlanForm';

enum MealPlanningView {
  LIST = 'list',
  CREATE = 'create',
  EDIT = 'edit',
  DETAIL = 'detail'
}

const MealPlanning: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlanFormData[]>([]);
  const [currentView, setCurrentView] = useState<MealPlanningView>(MealPlanningView.LIST);
  const [selectedPlan, setSelectedPlan] = useState<MealPlanFormData | null>(null);
  
  // Load meal plans from localStorage on component mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('mealPlans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        
        // Convert date strings back to Date objects
        const plansWithDates = parsedPlans.map((plan: any) => ({
          ...plan,
          startDate: new Date(plan.startDate),
          endDate: new Date(plan.endDate)
        }));
        
        setMealPlans(plansWithDates);
      } catch (error) {
        console.error('Error parsing meal plans:', error);
      }
    }
  }, []);
  
  // Save meal plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mealPlans', JSON.stringify(mealPlans));
  }, [mealPlans]);
  
  const handleCreatePlan = (newPlan: MealPlanFormData) => {
    setMealPlans(prevPlans => [...prevPlans, newPlan]);
    setCurrentView(MealPlanningView.LIST);
  };
  
  const handleUpdatePlan = (updatedPlan: MealPlanFormData) => {
    setMealPlans(prevPlans => 
      prevPlans.map(plan => 
        // Identify the plan by its title and start date (assuming they form a unique identifier)
        plan.title === selectedPlan?.title && 
        plan.startDate.getTime() === selectedPlan?.startDate.getTime()
          ? updatedPlan
          : plan
      )
    );
    setCurrentView(MealPlanningView.DETAIL);
    setSelectedPlan(updatedPlan);
  };
  
  const handleDeletePlan = (planId: string) => {
    // planId is a composite of title + startDate string
    setMealPlans(prevPlans => 
      prevPlans.filter(plan => plan.title + plan.startDate.toString() !== planId)
    );
  };
  
  const handleEditPlan = (plan: MealPlanFormData) => {
    setSelectedPlan(plan);
    setCurrentView(MealPlanningView.EDIT);
  };
  
  const handleViewPlan = (plan: MealPlanFormData) => {
    setSelectedPlan(plan);
    setCurrentView(MealPlanningView.DETAIL);
  };
  
  const renderView = () => {
    switch (currentView) {
      case MealPlanningView.CREATE:
        return <MealPlanForm onSubmit={handleCreatePlan} />;
      
      case MealPlanningView.EDIT:
        return selectedPlan ? (
          <MealPlanForm onSubmit={handleUpdatePlan} initialData={selectedPlan} />
        ) : null;
      
      case MealPlanningView.DETAIL:
        return selectedPlan ? (
          <MealPlanDetail 
            plan={selectedPlan} 
            onBack={() => setCurrentView(MealPlanningView.LIST)}
            onEdit={handleEditPlan}
          />
        ) : null;
      
      case MealPlanningView.LIST:
      default:
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Meal Plans</h2>
              <button
                onClick={() => setCurrentView(MealPlanningView.CREATE)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Create New Plan
              </button>
            </div>
            
            <MealPlanList 
              mealPlans={mealPlans} 
              onEditPlan={handleEditPlan} 
              onDeletePlan={handleDeletePlan}
              onViewPlan={handleViewPlan}
            />
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderView()}
    </div>
  );
};

export default MealPlanning;