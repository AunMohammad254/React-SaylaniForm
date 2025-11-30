import { memo } from 'react';

/**
 * Reusable loading spinner component
 * Optimized with React.memo for performance
 */

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
};

const COLORS = {
  primary: 'border-green-200 border-t-green-600',
  secondary: 'border-gray-200 border-t-gray-600',
  white: 'border-white/30 border-t-white',
};

function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = '',
  label = 'Loading...',
  showLabel = false,
}) {
  const sizeClasses = SIZES[size] || SIZES.md;
  const colorClasses = COLORS[color] || COLORS.primary;

  return (
    <div 
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={label}
    >
      <div 
        className={`
          ${sizeClasses}
          ${colorClasses}
          rounded-full
          animate-spin
        `}
        aria-hidden="true"
      />
      {showLabel && (
        <span className="text-sm text-gray-600 animate-pulse">
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Full page loading overlay
 */
function LoadingOverlay({ message = 'Loading...', blur = true }) {
  return (
    <div 
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white/80
        ${blur ? 'backdrop-blur-sm' : ''}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-message"
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-xl">
        <LoadingSpinner size="lg" />
        <p 
          id="loading-message" 
          className="text-gray-700 font-medium"
        >
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Skeleton loading placeholder
 */
function Skeleton({ 
  className = '', 
  variant = 'rect',
  width,
  height,
  count = 1,
}) {
  const baseClasses = 'skeleton bg-gray-200 animate-pulse';
  
  const variantClasses = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div 
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Card skeleton for loading states
 */
function CardSkeleton({ className = '' }) {
  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 ${className}`}
      aria-hidden="true"
    >
      <Skeleton variant="rect" height="1.5rem" width="60%" className="mb-4" />
      <Skeleton variant="text" count={3} className="mb-2" />
      <div className="flex gap-4 mt-6">
        <Skeleton variant="rect" height="2.5rem" width="6rem" />
        <Skeleton variant="rect" height="2.5rem" width="6rem" />
      </div>
    </div>
  );
}

/**
 * Form skeleton for loading states
 */
function FormSkeleton({ fields = 6 }) {
  return (
    <div className="space-y-6" aria-hidden="true">
      <Skeleton variant="rect" height="2rem" width="40%" className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rect" height="2.75rem" />
          </div>
        ))}
      </div>
      <Skeleton variant="rect" height="3rem" className="mt-8" />
    </div>
  );
}

// Memoize components for performance
const MemoizedLoadingSpinner = memo(LoadingSpinner);
const MemoizedLoadingOverlay = memo(LoadingOverlay);
const MemoizedSkeleton = memo(Skeleton);
const MemoizedCardSkeleton = memo(CardSkeleton);
const MemoizedFormSkeleton = memo(FormSkeleton);

export {
  MemoizedLoadingSpinner as LoadingSpinner,
  MemoizedLoadingOverlay as LoadingOverlay,
  MemoizedSkeleton as Skeleton,
  MemoizedCardSkeleton as CardSkeleton,
  MemoizedFormSkeleton as FormSkeleton,
};

export default MemoizedLoadingSpinner;
