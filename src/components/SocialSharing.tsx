import React, { useState } from 'react';
import { FoodEntry } from '../hooks/useFoodEntries';
import socialSharingService, { ShareOptions } from '../services/socialSharingService';

// Icons for social platforms
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

interface SocialSharingProps {
  foodEntries?: FoodEntry[];
  period?: 'day' | 'week' | 'month';
  customContent?: string;
  url?: string;
  title?: string;
  hashtags?: string[];
  className?: string;
  showLabel?: boolean;
  mealPlan?: {
    name: string;
    totalCalories: number;
    days: number;
  };
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  foodEntries,
  period = 'day',
  customContent,
  url,
  title,
  hashtags,
  className = '',
  showLabel = true,
  mealPlan,
}) => {
  const [shareResult, setShareResult] = useState<{success: boolean; message: string} | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const generateContent = (): string => {
    if (customContent) return customContent;
    
    if (mealPlan) {
      return socialSharingService.generateMealPlanContent(
        mealPlan.name, 
        mealPlan.totalCalories, 
        mealPlan.days
      );
    }
    
    if (foodEntries) {
      return socialSharingService.generateContentFromEntries(foodEntries, period);
    }
    
    return 'Check out this awesome calorie counter app!';
  };

  const handleShare = async (platform: ShareOptions['platform']) => {
    const content = generateContent();
    const result = await socialSharingService.share({
      platform,
      content,
      url,
      hashtags,
      title
    });
    
    setShareResult(result);
    setIsDropdownOpen(false);
    
    // Reset the share result message after 3 seconds
    setTimeout(() => {
      setShareResult(null);
    }, 3000);
  };

  const handleNativeShare = async () => {
    const content = generateContent();
    const result = await socialSharingService.nativeShare({
      title: title || 'Calorie Counter App',
      text: content,
      url: url || window.location.href
    });
    
    setShareResult(result);
    
    // Reset the share result message after 3 seconds
    setTimeout(() => {
      setShareResult(null);
    }, 3000);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`relative ${className}`}>
      {shareResult && (
        <div className={`text-sm px-3 py-2 rounded-md mb-2 ${
          shareResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {shareResult.message}
        </div>
      )}

      {socialSharingService.isNativeShareAvailable() ? (
        <button
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {showLabel && <span>Share</span>}
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {showLabel && <span>Share</span>}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2 text-blue-400"><TwitterIcon /></span>
                Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2 text-blue-600"><FacebookIcon /></span>
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2 text-blue-800"><LinkedInIcon /></span>
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('email')}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2 text-gray-600"><EmailIcon /></span>
                Email
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2 text-gray-600"><CopyIcon /></span>
                Copy Link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialSharing;