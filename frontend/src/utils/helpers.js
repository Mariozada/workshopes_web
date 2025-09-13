import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isToday, isTomorrow, isPast, isFuture } from 'date-fns';

// Utility function to combine classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (date, formatString = 'PPP') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

// Format time
export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, 'h:mm a');
};

// Format date time
export const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const [hours, minutes] = time.split(':');
  dateObj.setHours(parseInt(hours), parseInt(minutes));
  return format(dateObj, 'PPP p');
};

// Get relative date description
export const getRelativeDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isPast(dateObj)) return 'Past';
  if (isFuture(dateObj)) return format(dateObj, 'MMM d, yyyy');
  
  return format(dateObj, 'MMM d, yyyy');
};

// Helper: build a Date at the workshop's start time from date + time
const getWorkshopStartDate = (date, time) => {
  if (!date) return null;
  const base = typeof date === 'string' ? parseISO(date) : new Date(date);
  if (!time) return base;
  const [h, m] = time.split(':');
  base.setHours(parseInt(h || '0', 10), parseInt(m || '0', 10), 0, 0);
  return base;
};

// Check if workshop is bookable
export const isWorkshopBookable = (workshop) => {
  if (!workshop) return false;
  const start = getWorkshopStartDate(workshop.date, workshop.start_time);
  if (!start || isNaN(start.getTime())) return false;
  const now = new Date();
  return (
    workshop.status === 'active' &&
    start > now &&
    Number(workshop.current_bookings || 0) < Number(workshop.max_capacity || 0)
  );
};

// Get workshop status
export const getWorkshopStatus = (workshop) => {
  if (!workshop) return 'unknown';
  const start = getWorkshopStartDate(workshop.date, workshop.start_time);
  if (!start || isNaN(start.getTime())) return 'unknown';
  const now = new Date();

  if (workshop.status === 'cancelled') return 'cancelled';
  if (start < now) return 'completed';
  if (Number(workshop.current_bookings || 0) >= Number(workshop.max_capacity || 0)) return 'full';
  if (start <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) return 'upcoming';
  return 'available';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    full: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate pagination info
export const getPaginationInfo = (currentPage, totalPages, itemsPerPage, totalItems) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    startItem,
    endItem,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Generate slug from title
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Calculate capacity percentage
export const getCapacityPercentage = (current, max) => {
  if (!max || max === 0) return 0;
  return Math.round((current / max) * 100);
};

// Format duration
export const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) {
    return `${diffMinutes}m`;
  } else if (diffMinutes === 0) {
    return `${diffHours}h`;
  } else {
    return `${diffHours}h ${diffMinutes}m`;
  }
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};
