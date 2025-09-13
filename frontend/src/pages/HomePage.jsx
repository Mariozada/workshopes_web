import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Calendar, Users, MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import { workshopAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatDate, formatTime, formatCurrency } from '../utils/helpers';

export const HomePage = () => {
  // Fetch featured workshops
  const { data: workshopsData, isLoading } = useQuery(
    'featured-workshops',
    () => workshopAPI.getWorkshops({ limit: 6, status: 'active' }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const featuredWorkshops = workshopsData?.data?.workshops || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-yellow-300">Workshops</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Join expert-led workshops and enhance your skills. 
              From technology to arts, find the perfect learning experience for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/workshops"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-primary-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
              >
                Browse Workshops
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white border-2 border-white hover:bg-white hover:text-primary-700 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose WorkshopHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make learning accessible, engaging, and rewarding for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals and experienced practitioners 
                who are passionate about sharing their knowledge.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600">
                Choose from workshops that fit your schedule. Weekend sessions, 
                evening classes, and intensive workshops available.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Hands-on Learning
              </h3>
              <p className="text-gray-600">
                Practical, project-based workshops that give you real skills 
                you can apply immediately in your work or personal projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workshops Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Workshops
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular workshops and start your learning journey today.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredWorkshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {workshop.image_url && (
                    <img
                      src={workshop.image_url}
                      alt={workshop.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {workshop.category || 'Workshop'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(workshop.price)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {workshop.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {workshop.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(workshop.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(workshop.start_time)} - {formatTime(workshop.end_time)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {workshop.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        {workshop.available_seats} seats available
                      </div>
                    </div>

                    <Link
                      to={`/workshops/${workshop.id}`}
                      className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/workshops"
              className="inline-flex items-center px-8 py-3 text-lg font-medium text-primary-600 border-2 border-primary-600 hover:bg-primary-600 hover:text-white rounded-lg transition-colors"
            >
              View All Workshops
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of learners who are already advancing their skills 
            through our workshops. Create your account today and book your first workshop.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-primary-600 bg-white hover:bg-gray-50 rounded-lg transition-colors"
          >
            Create Free Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
