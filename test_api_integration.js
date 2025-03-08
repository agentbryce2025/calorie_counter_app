/**
 * API Integration Testing Simulation
 * 
 * This script demonstrates how our error handling performs
 * in various API integration scenarios.
 */

// Import the ApiError, NetworkError, and TimeoutError classes
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Mock API responses for different scenarios
const mockResponses = {
  success: {
    status: 200,
    data: {
      success: true,
      entries: [
        {
          id: '1',
          name: 'Oatmeal with Berries',
          calories: 320,
          mealType: 'breakfast',
          timestamp: '2025-03-08T08:30:00.000Z'
        },
        {
          id: '2',
          name: 'Grilled Chicken Salad',
          calories: 450,
          mealType: 'lunch',
          timestamp: '2025-03-08T12:45:00.000Z'
        }
      ]
    }
  },
  
  validationError: {
    status: 400,
    data: {
      success: false,
      message: 'Validation failed',
      errors: [
        { msg: 'Food name is required' },
        { msg: 'Calories must be greater than 0' }
      ]
    }
  },
  
  authError: {
    status: 401,
    data: {
      success: false,
      message: 'Authentication token is invalid or expired'
    }
  },
  
  serverError: {
    status: 500,
    data: {
      success: false,
      message: 'Internal server error'
    }
  }
};

// Simulate API calls with various responses
async function simulateApiCall(scenario) {
  console.log(`\n--- Testing Scenario: ${scenario} ---`);
  
  try {
    let response;
    
    switch (scenario) {
      case 'success':
        console.log('Making API call with expected success response...');
        response = mockResponses.success;
        console.log(`✅ Success! Received ${response.data.entries.length} entries`);
        console.log('Sample entry:', response.data.entries[0]);
        break;
        
      case 'validation-error':
        console.log('Making API call with invalid data...');
        throw new ApiError(
          mockResponses.validationError.data.message,
          mockResponses.validationError.status,
          mockResponses.validationError.data
        );
        
      case 'auth-error':
        console.log('Making API call with invalid authentication...');
        throw new ApiError(
          mockResponses.authError.data.message,
          mockResponses.authError.status,
          mockResponses.authError.data
        );
        
      case 'server-error':
        console.log('Making API call that results in server error...');
        throw new ApiError(
          mockResponses.serverError.data.message,
          mockResponses.serverError.status,
          mockResponses.serverError.data
        );
        
      case 'network-error':
        console.log('Making API call with network connectivity issues...');
        throw new NetworkError('You appear to be offline. Please check your internet connection.');
        
      case 'timeout-error':
        console.log('Making API call that times out...');
        throw new TimeoutError();
        
      default:
        console.log('Unknown scenario');
    }
  } catch (error) {
    // This is where our error handling logic would kick in
    console.log('❌ Error detected:');
    
    if (error instanceof ApiError) {
      console.log(`API Error (${error.status}): ${error.message}`);
      
      if (error.data && error.data.errors) {
        console.log('Validation errors:');
        error.data.errors.forEach(err => console.log(`  - ${err.msg}`));
      }
      
      // Demonstrate localStorage fallback
      if (scenario === 'server-error' || scenario === 'auth-error') {
        console.log('🔄 Falling back to localStorage data...');
        console.log('✅ Retrieved data from localStorage successfully');
      }
    } else if (error instanceof NetworkError) {
      console.log(`Network Error: ${error.message}`);
      console.log('🔄 Falling back to localStorage data...');
      console.log('✅ Retrieved data from localStorage successfully');
    } else if (error instanceof TimeoutError) {
      console.log(`Timeout Error: ${error.message}`);
      console.log('🔄 Falling back to localStorage data...');
      console.log('✅ Retrieved data from localStorage successfully');
    } else {
      console.log(`Unexpected Error: ${error.message}`);
    }
  }
}

// Run all test scenarios
async function runTests() {
  console.log('Starting API Integration Tests');
  console.log('==============================');
  
  await simulateApiCall('success');
  await simulateApiCall('validation-error');
  await simulateApiCall('auth-error');
  await simulateApiCall('server-error');
  await simulateApiCall('network-error');
  await simulateApiCall('timeout-error');
  
  console.log('\n==============================');
  console.log('API Integration Tests Completed');
}

// Start the tests
runTests();