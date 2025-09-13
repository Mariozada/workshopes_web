import React from 'react';
import { cn } from '../utils/helpers';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'loading-spinner',
          sizeClasses[size]
        )}
      />
    </div>
  );
};
