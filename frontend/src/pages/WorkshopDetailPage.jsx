import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  ArrowLeft,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { workshopAPI, bookingAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  formatDate, 
  formatTime, 
  formatCurrency, 
  formatDuration,
  getWorkshopStatus,
  getStatusColor,
  isWorkshopBookable 
} from '../utils/helpers';

export const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [bookingNotes, setBookingNotes] = useState('');

  // Fetch workshop details
  const { data: workshopData, isLoading, error } = useQuery(
    ['workshop', id],
    () => workshopAPI.getWorkshop(id),
    {
      enabled: !!id,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Book workshop mutation
  const bookWorkshopMutation = useMutation(
    (bookingData) => bookingAPI.createBooking(bookingData),
    {
      onSuccess: () => {
        toast.success('Workshop booked successfully!');
        queryClient.invalidateQueries(['workshop', id]);
        queryClient.invalidateQueries('user-bookings');
        setBookingNotes('');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to book workshop';
        toast.error(message);
      },
    }
  );

  const workshop = workshopData?.data?.workshop;

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/workshops/${id}` } } });
      return;
    }

    if (!isWorkshopBookable(workshop)) {
      toast.error('This workshop is not available for booking');
      return;
    }

    bookWorkshopMutation.mutate({
      workshop_id: parseInt(id),
      notes: bookingNotes.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Workshop Not Found</h1>
          <p className="text-gray-600 mb-8">
            The workshop you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/workshops')}
            className="btn btn-primary"
          >
            Browse All Workshops
          </button>
        </div>
      </div>
    );
  }

  const status = getWorkshopStatus(workshop);
  const canBook = isWorkshopBookable(workshop);
  const userHasBooked = workshop.user_has_booked;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Workshop Image */}
        {workshop.image_url && (
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={workshop.image_url}
              alt={workshop.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {workshop.category || 'Workshop'}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(workshop.price)}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {workshop.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-4">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">Instructor: {workshop.instructor}</span>
            </div>
          </div>

          {/* Workshop Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{formatDate(workshop.date)}</p>
                  <p className="text-sm text-gray-500">Date</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatTime(workshop.start_time)} - {formatTime(workshop.end_time)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Duration: {formatDuration(workshop.start_time, workshop.end_time)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{workshop.location}</p>
                  <p className="text-sm text-gray-500">Location</p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {workshop.available_seats} of {workshop.max_capacity} seats available
                  </p>
                  <p className="text-sm text-gray-500">
                    {workshop.current_bookings} already booked
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Workshop</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {workshop.description}
              </p>
            </div>
          </div>

          {/* Booking Section */}
          <div className="border-t pt-8">
            {userHasBooked ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-green-900">
                      You're registered for this workshop!
                    </h3>
                    <p className="text-green-700 mt-1">
                      We look forward to seeing you there. Check your booking details in{' '}
                      <button
                        onClick={() => navigate('/my-bookings')}
                        className="font-medium underline hover:no-underline"
                      >
                        My Bookings
                      </button>
                      .
                    </p>
                  </div>
                </div>
              </div>
            ) : canBook ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Book This Workshop</h3>
                
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Any special requirements or questions?"
                        rows={3}
                        className="input w-full"
                      />
                    </div>
                    
                    <button
                      onClick={handleBooking}
                      disabled={bookWorkshopMutation.isLoading}
                      className="btn btn-primary w-full md:w-auto flex items-center justify-center"
                    >
                      {bookWorkshopMutation.isLoading ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          Booking...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Book Now - {formatCurrency(workshop.price)}
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Sign in to book this workshop
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Create an account or sign in to secure your spot in this workshop.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate('/login', { 
                          state: { from: { pathname: `/workshops/${id}` } } 
                        })}
                        className="btn btn-primary"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate('/register')}
                        className="btn btn-outline"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  {status === 'full' ? 'Workshop Full' : 
                   status === 'completed' ? 'Workshop Completed' : 
                   status === 'cancelled' ? 'Workshop Cancelled' : 
                   'Booking Unavailable'}
                </h3>
                <p className="text-red-700">
                  {status === 'full' ? 'This workshop has reached maximum capacity.' :
                   status === 'completed' ? 'This workshop has already taken place.' :
                   status === 'cancelled' ? 'This workshop has been cancelled.' :
                   'This workshop is not available for booking at this time.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
