// Define the types for our voice recognition service
export interface VoiceInputOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
  onResult?: (result: string, isFinal: boolean) => void;
  onError?: (error: SpeechRecognitionError) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface SpeechRecognitionError {
  error: string;
  message: string;
}

export interface FoodEntityExtraction {
  foodName?: string;
  calories?: number;
  mealType?: string;
  quantity?: number;
  unit?: string;
}

// Declare the SpeechRecognition type for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart: () => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Interface for our voice recognition service
export interface VoiceRecognitionService {
  isSupported(): boolean;
  start(options?: VoiceInputOptions): void;
  stop(): void;
  abort(): void;
  isListening(): boolean;
  parseVoiceInput(text: string): FoodEntityExtraction;
}

// Implementation of the voice recognition service
class VoiceInputService implements VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private listening: boolean = false;
  private options: VoiceInputOptions = {
    continuous: true,
    interimResults: true,
    lang: 'en-US',
    maxAlternatives: 1
  };

  constructor() {
    // Check for browser support and initialize
    if (this.isSupported()) {
      const SpeechRecognition = window.SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
    }
  }

  // Check if the browser supports speech recognition
  isSupported(): boolean {
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  // Start voice recognition with the given options
  start(options?: VoiceInputOptions): void {
    if (!this.recognition) {
      if (options?.onError) {
        options.onError({
          error: 'not-supported',
          message: 'Speech recognition is not supported in this browser.'
        });
      }
      return;
    }

    // Merge user options with defaults
    this.options = { ...this.options, ...options };
    
    // Configure the recognition instance
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = this.options.interimResults || false;
    this.recognition.lang = this.options.lang || 'en-US';
    this.recognition.maxAlternatives = this.options.maxAlternatives || 1;
    
    // Set up event handlers
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const resultIndex = event.resultIndex;
      const result = event.results[resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      if (this.options.onResult) {
        this.options.onResult(transcript, isFinal);
      }
    };
    
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.options.onError) {
        this.options.onError({
          error: event.error,
          message: event.message
        });
      }
    };
    
    this.recognition.onstart = () => {
      this.listening = true;
      if (this.options.onStart) {
        this.options.onStart();
      }
    };
    
    this.recognition.onend = () => {
      this.listening = false;
      if (this.options.onEnd) {
        this.options.onEnd();
      }
    };
    
    // Start listening
    this.recognition.start();
  }

  // Stop voice recognition
  stop(): void {
    if (this.recognition && this.listening) {
      this.recognition.stop();
      this.listening = false;
    }
  }

  // Abort voice recognition
  abort(): void {
    if (this.recognition && this.listening) {
      this.recognition.abort();
      this.listening = false;
    }
  }

  // Check if the service is currently listening
  isListening(): boolean {
    return this.listening;
  }

  // Parse the voice input into structured food entry data
  parseVoiceInput(text: string): FoodEntityExtraction {
    // This is a simple rule-based parser
    // In a production app, you might want to use a more sophisticated NLP approach
    const result: FoodEntityExtraction = {};
    
    // Convert to lowercase for easier matching
    const lowerText = text.toLowerCase();
    
    // Extract meal type
    const mealTypePatterns = {
      breakfast: /breakfast|morning meal|early meal/i,
      lunch: /lunch|midday meal|noon meal/i,
      dinner: /dinner|evening meal|supper/i,
      snack: /snack|treat|nibble/i
    };
    
    for (const [mealType, pattern] of Object.entries(mealTypePatterns)) {
      if (pattern.test(lowerText)) {
        result.mealType = mealType;
        break;
      }
    }
    
    // Extract quantity and unit
    const quantityMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(grams|cups|ounces|oz|g|servings|serving|pieces|piece)/i);
    if (quantityMatch) {
      result.quantity = parseFloat(quantityMatch[1]);
      result.unit = quantityMatch[2].toLowerCase();
    }
    
    // Extract calories
    const caloriesMatch = lowerText.match(/(\d+)\s*calories/i);
    if (caloriesMatch) {
      result.calories = parseInt(caloriesMatch[1], 10);
    }
    
    // Extract food name (this is a simple approach)
    // Remove phrases like "add", "i ate", etc.
    let processedText = lowerText
      .replace(/^add\s+|^i ate\s+|^i had\s+|^i consumed\s+|^record\s+|^log\s+|^enter\s+/i, '')
      .replace(/\s+for breakfast|\s+for lunch|\s+for dinner|\s+for snack/i, '');
    
    // Remove the already extracted parts (mealType, calories, quantity)
    if (result.mealType) {
      const mealType = result.mealType as keyof typeof mealTypePatterns;
      processedText = processedText.replace(mealTypePatterns[mealType], '');
    }
    
    if (caloriesMatch) {
      processedText = processedText.replace(/\d+\s*calories/i, '');
    }
    
    if (quantityMatch) {
      processedText = processedText.replace(/\d+(?:\.\d+)?\s*(grams|cups|ounces|oz|g|servings|serving|pieces|piece)/i, '');
    }
    
    // Clean up remaining text for food name
    processedText = processedText.trim()
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ');
    
    if (processedText) {
      result.foodName = processedText;
    }
    
    return result;
  }
}

// Create and export a singleton instance
const voiceInputService = new VoiceInputService();
export default voiceInputService;