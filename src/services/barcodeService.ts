// This is a simplified barcode service for demonstration
// In a real app, you would integrate with a food database API
// like Open Food Facts API: https://world.openfoodfacts.org/data

// Mock barcode database for demonstration purposes
const mockBarcodeDatabase: Record<string, {
  name: string;
  calories: number;
  carbs?: number;
  protein?: number;
  fat?: number;
}> = {
  '0737628064502': {
    name: 'KIND Bar, Nuts & Spices, Dark Chocolate Nuts & Sea Salt',
    calories: 200,
    carbs: 16,
    protein: 6,
    fat: 15
  },
  '0011110038364': {
    name: 'Organic Banana',
    calories: 105,
    carbs: 27,
    protein: 1.3,
    fat: 0.4
  },
  '0049000042566': {
    name: 'Coca-Cola, 12 fl oz',
    calories: 140,
    carbs: 39,
    protein: 0,
    fat: 0
  },
  '0028400040112': {
    name: 'Doritos Nacho Cheese',
    calories: 150,
    carbs: 18,
    protein: 2,
    fat: 8
  },
  '0038000138416': {
    name: 'Kellogg\'s Frosted Flakes',
    calories: 130,
    carbs: 31,
    protein: 1,
    fat: 0
  },
  '0884912129161': {
    name: 'Halo Top, Chocolate Ice Cream',
    calories: 280,
    carbs: 48,
    protein: 20,
    fat: 8
  }
};

/**
 * Look up a product by its barcode
 * @param barcode The product barcode
 * @returns The product information or null if not found
 */
export const lookupBarcode = async (barcode: string) => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Check our mock database
  if (mockBarcodeDatabase[barcode]) {
    return {
      success: true,
      product: {
        ...mockBarcodeDatabase[barcode],
        barcode
      }
    };
  }
  
  // In a real app, you would call an actual API here if not found in the local database
  // For example: 
  // const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  // const data = await response.json();
  // if (data.status === 1) { ... }
  
  return {
    success: false,
    error: 'Product not found in database'
  };
};

export default {
  lookupBarcode
};