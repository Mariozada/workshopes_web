import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Search, Filter, Calendar, User, Mail, Phone, MapPin, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { bookingService } from '../../services/bookingService';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminBookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [workshopFilter, setWorkshopFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const queryClient = useQueryClient();

  // Fetch all bookings
  const { data: bookings, isLoading, error } = useQuery(
    ['admin-bookings', searchTerm, statusFilter, workshopFilter, dateFilter],
    () => bookingService.getAllBookings({
      search: searchTerm,
      status: statusFilter,
      workshop: workshopFilter,
      date: dateFilter
    }),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );

  // Update booking status mutation
  const updateStatusMutation = useMutation(
    ({ bookingId, status }) => bookingService.updateBookingStatus(bookingId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-bookings');
        toast.success('Booking status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update booking status');
      },
    }
  );

  // Cancel booking mutation
  const cancelBookingMutation = useMutation(bookingService.cancelBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-bookings');
      toast.success('Booking cancelled successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const handleStatusUpdate = (bookingId, status) => {
    updateStatusMutation.mutate({ bookingId, status });
  };

  const handleCancelBooking = (bookingId, userEmail, workshopTitle) => {
    if (window.confirm(`Cancel booking for ${userEmail} in "${workshopTitle}"?`)) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.workshop_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesWorkshop = !workshopFilter || booking.workshop_title?.toLowerCase().includes(workshopFilter.toLowerCase());
    const matchesDate = !dateFilter || booking.booking_date?.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesWorkshop && matchesDate;
  }) || [];

  // Get unique workshops for filter
  const uniqueWorkshops = [...new Set(bookings?.map(b => b.workshop_title).filter(Boolean))] || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="mt-2 text-gray-600">
          Monitor and manage all workshop bookings
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Confirmed Bookings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {bookings?.filter(b => b.status === 'confirmed').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cancelled Bookings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {bookings?.filter(b => b.status === 'cancelled').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Bookings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {bookings?.filter(b => b.status === 'completed').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${bookings?.filter(b => b.status === 'confirmed' || b.status === 'completed')
                              .reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0)
                              .toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user or workshop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Workshop Filter */}
          <select
            value={workshopFilter}
            onChange={(e) => setWorkshopFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Workshops</option>
            {uniqueWorkshops.map(workshop => (
              <option key={workshop} value={workshop}>{workshop}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-500">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Failed to load bookings. Please try again.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredBookings.length === 0 ? (
              <li className="p-8 text-center text-gray-500">
                No bookings found matching your criteria.
              </li>
            ) : (
              filteredBookings.map((booking) => (
                <li key={booking.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.workshop_title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{booking.user_name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{booking.user_email}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{new Date(booking.workshop_date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{booking.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          <span>${booking.price}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Booked: {new Date(booking.booking_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {booking.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            disabled={updateStatusMutation.isLoading}
                            className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50"
                          >
                            Mark Completed
                          </button>
                          
                          <button
                            onClick={() => handleCancelBooking(booking.id, booking.user_email, booking.workshop_title)}
                            disabled={cancelBookingMutation.isLoading}
                            className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                          >
                            Cancel Booking
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          disabled={updateStatusMutation.isLoading}
                          className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                        >
                          Restore Booking
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
