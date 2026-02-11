import { useTheme } from '../../context/ThemeContext';

interface StarRatingProps {
  rating: number; // 0-5, can be decimal like 4.2
  totalReviews?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  rating, 
  totalReviews, 
  size = 'medium', 
  showCount = true,
  interactive = false,
  onRatingChange 
}: StarRatingProps) {
  const { darkMode } = useTheme();
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };
  
  const sizeClass = sizeClasses[size];
  
  const renderStar = (index: number) => {
    const starValue = index + 1;
    const fillPercentage = Math.min(Math.max((rating - index) * 100, 0), 100);
    
    return (
      <button
        key={index}
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(starValue)}
        className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
      >
        {/* Background (empty) star */}
        <svg
          className={`${sizeClass} ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        
        {/* Filled star overlay */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <svg
            className={`${sizeClass} text-primary`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </button>
    );
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      
      {showCount && totalReviews !== undefined && (
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {rating > 0 ? (
            <>
              ({rating.toFixed(1)}) · {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </>
          ) : (
            'Be the first to review'
          )}
        </span>
      )}
    </div>
  );
}
