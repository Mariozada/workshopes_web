import React from 'react';
import { useQuery } from 'react-query';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers';

export const AdminDashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useQuery(
    'admin-dashboard',
    () => adminAPI.getDashboard(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const dashboard = dashboardData?.data;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">
            Failed to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">
          Overview of your workshop booking system.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboard?.statistics?.total_users || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Workshops</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboard?.statistics?.total_workshops || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboard?.statistics?.total_bookings || 0}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(dashboard?.statistics?.total_revenue || 0)}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <button className="btn btn-outline btn-sm">View All</button>
              </div>

              <div className="space-y-4">
                {dashboard?.recent_bookings?.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{booking.title}</p>
                      <p className="text-sm text-gray-600">
                        {booking.first_name} {booking.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(booking.booking_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(booking.date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(booking.start_time)}
                      </p>
                    </div>
                  </div>
                ))}

                {(!dashboard?.recent_bookings || dashboard.recent_bookings.length === 0) && (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No recent bookings</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Workshops */}
            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Workshops</h2>
                <button className="btn btn-outline btn-sm">Manage</button>
              </div>

              <div className="space-y-4">
                {dashboard?.upcoming_workshops?.slice(0, 5).map((workshop) => (
                  <div key={workshop.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{workshop.title}</p>
                      <p className="text-sm text-gray-600">
                        Instructor: {workshop.instructor}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(workshop.date)} at {formatTime(workshop.start_time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {workshop.current_bookings}/{workshop.max_capacity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {workshop.available_seats} available
                      </p>
                    </div>
                  </div>
                ))}

                {(!dashboard?.upcoming_workshops || dashboard.upcoming_workshops.length === 0) && (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No upcoming workshops</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
