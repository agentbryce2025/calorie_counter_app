import React, { useState, useEffect, useCallback } from 'react';
import voiceInputService, { FoodEntityExtraction } from '../services/voiceInputService';

interface VoiceInputButtonProps {
  onVoiceInput: (data: FoodEntityExtraction) => void;
  isListening?: boolean;
  onListeningChange?: (isListening: boolean) => void;
  className?: string;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onVoiceInput,
  isListening: externalIsListening,
  onListeningChange,
  className = ''
}) => {
  // Use internal state if no external state is provided
  const [internalIsListening, setInternalIsListening] = useState(false);
  
  // Determine which listening state to use
  const isListening = externalIsListening !== undefined ? externalIsListening : internalIsListening;
  
  // Handle the state change
  const setIsListening = useCallback((value: boolean) => {
    if (externalIsListening === undefined) {
      setInternalIsListening(value);
    }
    if (onListeningChange) {
      onListeningChange(value);
    }
  }, [externalIsListening, onListeningChange]);
  
  // Check if voice input is supported
  const [isSupported, setIsSupported] = useState(false);
  
  // Initialize on mount
  useEffect(() => {
    setIsSupported(voiceInputService.isSupported());
  }, []);
  
  // Handle starting voice recognition
  const startListening = () => {
    if (!isSupported) return;
    
    voiceInputService.start({
      continuous: false,
      interimResults: true,
      lang: 'en-US',
      onStart: () => {
        setIsListening(true);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onResult: (result, isFinal) => {
        if (isFinal) {
          // Parse the result and extract food entry data
          const extractedData = voiceInputService.parseVoiceInput(result);
          onVoiceInput(extractedData);
          voiceInputService.stop();
        }
      },
      onError: (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      }
    });
  };
  
  // Handle stopping voice recognition
  const stopListening = () => {
    if (!isSupported) return;
    voiceInputService.stop();
    setIsListening(false);
  };
  
  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        voiceInputService.stop();
      }
    };
  }, [isListening]);
  
  // If voice input is not supported, show a disabled button
  if (!isSupported) {
    return (
      <button
        className={`bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed ${className}`}
        disabled
        title="Voice input is not supported in this browser"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
        Voice Input
      </button>
    );
  }
  
  return (
    <button
      className={`${
        isListening 
          ? 'bg-red-600 hover:bg-red-700' 
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white px-4 py-2 rounded-lg transition-colors ${className}`}
      onClick={toggleListening}
      title={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
      </svg>
      {isListening ? 'Listening...' : 'Voice Input'}
      
      {/* Animated microphone icon when listening */}
      {isListening && (
        <span className="ml-2 inline-flex">
          <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
          <span className="relative rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceInputButton;