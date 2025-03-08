import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FoodEntryForm from './FoodEntryForm';

describe('FoodEntryForm Component', () => {
  const mockAddFood = jest.fn();
  
  beforeEach(() => {
    mockAddFood.mockClear();
  });
  
  test('renders food entry form', () => {
    render(<FoodEntryForm darkMode={false} onAddFood={mockAddFood} />);
    
    expect(screen.getByText('Add Food Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Food Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Calories')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Food' })).toBeInTheDocument();
  });
  
  test('submits form with valid data', () => {
    render(<FoodEntryForm darkMode={false} onAddFood={mockAddFood} />);
    
    const foodNameInput = screen.getByLabelText('Food Name');
    const caloriesInput = screen.getByLabelText('Calories');
    const submitButton = screen.getByRole('button', { name: 'Add Food' });
    
    fireEvent.change(foodNameInput, { target: { value: 'Banana' } });
    fireEvent.change(caloriesInput, { target: { value: '105' } });
    fireEvent.click(submitButton);
    
    expect(mockAddFood).toHaveBeenCalledWith('Banana', 105);
  });
  
  test('does not submit with empty fields', () => {
    render(<FoodEntryForm darkMode={false} onAddFood={mockAddFood} />);
    
    const submitButton = screen.getByRole('button', { name: 'Add Food' });
    fireEvent.click(submitButton);
    
    expect(mockAddFood).not.toHaveBeenCalled();
  });
  
  test('clears inputs after submission', () => {
    render(<FoodEntryForm darkMode={false} onAddFood={mockAddFood} />);
    
    const foodNameInput = screen.getByLabelText('Food Name');
    const caloriesInput = screen.getByLabelText('Calories');
    const submitButton = screen.getByRole('button', { name: 'Add Food' });
    
    fireEvent.change(foodNameInput, { target: { value: 'Apple' } });
    fireEvent.change(caloriesInput, { target: { value: '95' } });
    fireEvent.click(submitButton);
    
    expect(foodNameInput).toHaveValue('');
    expect(caloriesInput).toHaveValue('');
  });
});