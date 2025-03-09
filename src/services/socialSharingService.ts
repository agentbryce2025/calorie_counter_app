import { FoodEntry } from '../hooks/useFoodEntries';

export interface ShareOptions {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy';
  content?: string;
  url?: string;
  hashtags?: string[];
  title?: string;
}

/**
 * Social Sharing Service
 * 
 * Provides functionality to share app content to various social platforms.
 */
class SocialSharingService {
  /**
   * Generate sharable content from food entries
   */
  generateContentFromEntries(entries: FoodEntry[], period: 'day' | 'week' | 'month'): string {
    if (!entries || entries.length === 0) {
      return 'No food entries to share';
    }

    const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
    const totalProtein = entries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
    const totalCarbs = entries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
    const totalFat = entries.reduce((sum, entry) => sum + (entry.fat || 0), 0);

    // Format the date range
    const dates = entries.map(entry => new Date(entry.date));
    const startDate = new Date(Math.min(...dates.map(d => d.getTime()))).toLocaleDateString();
    const endDate = new Date(Math.max(...dates.map(d => d.getTime()))).toLocaleDateString();
    const dateRange = startDate === endDate ? startDate : `${startDate} to ${endDate}`;

    return `Check out my ${period} nutrition summary from ${dateRange}!
🔥 Total Calories: ${totalCalories}
🥩 Protein: ${totalProtein}g
🍞 Carbs: ${totalCarbs}g
🥑 Fat: ${totalFat}g
Tracked with Calorie Counter App`;
  }

  /**
   * Generate a sharable summary for meal plans
   */
  generateMealPlanContent(planName: string, totalCalories: number, days: number): string {
    return `I created a ${days}-day meal plan "${planName}" with ${totalCalories} total calories using Calorie Counter App!`;
  }

  /**
   * Share content to a social platform
   */
  async share(options: ShareOptions): Promise<{ success: boolean; message: string }> {
    const { platform, content, url, hashtags, title } = options;
    const shareUrl = url || window.location.href;
    const shareContent = encodeURIComponent(content || '');
    const shareHashtags = hashtags ? hashtags.join(',') : 'caloriecounter,nutrition,healthyeating';
    const shareTitle = encodeURIComponent(title || 'Calorie Counter App');

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${shareContent}&url=${shareUrl}&hashtags=${shareHashtags}`,
          '_blank'
        );
        return { success: true, message: 'Shared to Twitter' };

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareContent}`,
          '_blank'
        );
        return { success: true, message: 'Shared to Facebook' };

      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
          '_blank'
        );
        return { success: true, message: 'Shared to LinkedIn' };

      case 'email':
        window.location.href = `mailto:?subject=${shareTitle}&body=${shareContent}%0A%0A${shareUrl}`;
        return { success: true, message: 'Email client opened' };

      case 'copy':
        try {
          await navigator.clipboard.writeText(`${content}\n\n${shareUrl}`);
          return { success: true, message: 'Copied to clipboard' };
        } catch (error) {
          console.error('Failed to copy text: ', error);
          return { success: false, message: 'Failed to copy to clipboard' };
        }

      default:
        return { success: false, message: 'Invalid sharing platform' };
    }
  }

  /**
   * Check if Web Share API is available in the current browser
   */
  isNativeShareAvailable(): boolean {
    return navigator.share !== undefined;
  }

  /**
   * Use the native Web Share API if available
   */
  async nativeShare(options: { title: string; text: string; url: string }): Promise<{ success: boolean; message: string }> {
    if (!this.isNativeShareAvailable()) {
      return { success: false, message: 'Native sharing not available' };
    }

    try {
      await navigator.share(options);
      return { success: true, message: 'Content shared successfully' };
    } catch (error) {
      console.error('Error sharing:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Share operation failed or was cancelled'
      };
    }
  }
}

export const socialSharingService = new SocialSharingService();
export default socialSharingService;