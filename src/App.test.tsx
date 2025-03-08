import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

test('renders Calorie Tracker header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Calorie Tracker/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders dark mode toggle button', () => {
  render(<App />);
  const darkModeButton = screen.getByRole('button', { name: /Switch to light mode|Switch to dark mode/i });
  expect(darkModeButton).toBeInTheDocument();
});

test('renders Add Food form', () => {
  render(<App />);
  const addFoodHeading = screen.getByText(/Add Food Item/i);
  expect(addFoodHeading).toBeInTheDocument();
});
