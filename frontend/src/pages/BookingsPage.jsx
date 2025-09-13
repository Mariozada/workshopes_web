import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';
import { bookingAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  formatDate, 
  formatTime, 
  formatCurrency,
  getStatusColor 
} from '../utils/helpers';

export const BookingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: bookingsData, isLoading, error } = useQuery(
    ['user-bookings', { page: currentPage, status: statusFilter }],
    () => bookingAPI.getUserBookings({ 
      page: currentPage, 
      status: statusFilter || undefined,
      limit: 10 
    }),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );

  const bookings = bookingsData?.data?.bookings || [];
  const pagination = bookingsData?.data?.pagination || {};

  const statusOptions = [
    { value: '', label: 'All Bookings' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
  ];

  const clearFilter = () => {
    setStatusFilter('');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading bookings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Failed to load your bookings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
        <p className="text-lg text-gray-600">
          View and manage your workshop bookings.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {statusFilter && (
              <button
                onClick={clearFilter}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </button>
            )}
          </div>

          <div className="text-sm text-gray-600">
            {pagination.total_items || 0} booking{pagination.total_items !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Bookings List */}
      {!isLoading && bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(booking.date)}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{booking.location}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Instructor: {booking.instructor}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Booked on {formatDate(booking.booking_date)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(booking.price)}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end space-y-2">
                  {booking.can_cancel && booking.status === 'confirmed' && (
                    <button className="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50">
                      Cancel Booking
                    </button>
                  )}
                  
                  <button className="btn btn-ghost btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && bookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter 
              ? `No ${statusFilter} bookings found. Try changing the filter.`
              : "You haven't booked any workshops yet."
            }
          </p>
          {!statusFilter && (
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/workshops'}
                className="btn btn-primary"
              >
                Browse Workshops
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
              disabled={currentPage >= pagination.total_pages}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{pagination.total_pages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {currentPage}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                  disabled={currentPage >= pagination.total_pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
