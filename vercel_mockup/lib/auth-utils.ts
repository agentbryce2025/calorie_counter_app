// This is a mock authentication library
// In a real application, this would be replaced with a proper authentication system

type User = {
  id: string
  name: string
  email: string
}

// Mock user store
let currentUser: User | null = null

// Simple delay function to simulate network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Login function
export async function login(email: string, password: string): Promise<User> {
  // Simulate API call
  await delay(1500)

  // For demo purposes, any email with a valid format and password length will work
  if (password.length < 6) {
    throw new Error("Invalid credentials")
  }

  // Create a mock user
  const user: User = {
    id: "user_" + Math.random().toString(36).substring(2, 9),
    name: email.split("@")[0],
    email,
  }

  // Set the current user
  currentUser = user

  // Save to localStorage
  localStorage.setItem("calorieTrackerUser", JSON.stringify(user))

  return user
}

// Signup function
export async function signup(name: string, email: string, password: string): Promise<User> {
  // Simulate API call
  await delay(2000)

  // Create a mock user
  const user: User = {
    id: "user_" + Math.random().toString(36).substring(2, 9),
    name,
    email,
  }

  // Set the current user
  currentUser = user

  // Save to localStorage
  localStorage.setItem("calorieTrackerUser", JSON.stringify(user))

  return user
}

// OAuth login function
export async function loginWithProvider(provider: string): Promise<User> {
  // Simulate API call
  await delay(1000)

  // Create a mock user based on the provider
  const user: User = {
    id: "user_" + Math.random().toString(36).substring(2, 9),
    name: provider === "google" ? "Google User" : "GitHub User",
    email: provider === "google" ? "user@gmail.com" : "user@github.com",
  }

  // Set the current user
  currentUser = user

  // Save to localStorage
  localStorage.setItem("calorieTrackerUser", JSON.stringify(user))

  return user
}

// Logout function
export async function logout(): Promise<void> {
  // Simulate API call
  await delay(500)

  // Clear the current user
  currentUser = null

  // Remove from localStorage
  localStorage.removeItem("calorieTrackerUser")
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  // If we already have a current user, return it
  if (currentUser) {
    return currentUser
  }

  // Otherwise, check localStorage
  const storedUser = localStorage.getItem("calorieTrackerUser")
  if (storedUser) {
    currentUser = JSON.parse(storedUser)
    return currentUser
  }

  // No user found
  return null
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

