import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';
import { workshopAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  formatDate, 
  formatTime, 
  formatCurrency, 
  getStatusColor, 
  getWorkshopStatus,
  debounce 
} from '../utils/helpers';

export const WorkshopsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Get current filters from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const dateFrom = searchParams.get('date_from') || '';
  const dateTo = searchParams.get('date_to') || '';

  // Fetch workshops
  const { data: workshopsData, isLoading, error } = useQuery(
    ['workshops', {
      page: currentPage,
      category: currentCategory,
      search: currentSearch,
      date_from: dateFrom,
      date_to: dateTo,
      limit: 12
    }],
    () => workshopAPI.getWorkshops({
      page: currentPage,
      category: currentCategory,
      search: currentSearch,
      date_from: dateFrom,
      date_to: dateTo,
      limit: 12
    }),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Fetch categories for filter
  const { data: categoriesData } = useQuery(
    'workshop-categories',
    () => workshopAPI.getCategories(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const workshops = workshopsData?.data?.workshops || [];
  const pagination = workshopsData?.data?.pagination || {};
  const categories = categoriesData?.data?.categories || [];

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce((value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set('search', value);
      } else {
        newParams.delete('search');
      }
      newParams.delete('page'); // Reset to first page
      setSearchParams(newParams);
    }, 500),
    [searchParams, setSearchParams]
  );

  React.useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const changePage = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const hasActiveFilters = currentCategory || currentSearch || dateFrom || dateTo;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600">Failed to load workshops. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Workshops</h1>
        <p className="text-lg text-gray-600">
          Discover amazing workshops to enhance your skills and knowledge.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="btn btn-ghost flex items-center text-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={currentCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="input w-full"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => updateFilter('date_from', e.target.value)}
                className="input w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => updateFilter('date_to', e.target.value)}
                className="input w-full"
                min={dateFrom || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {pagination.total_items ? (
            <>
              Showing {pagination.total_items} workshop{pagination.total_items !== 1 ? 's' : ''}
              {currentSearch && (
                <span className="font-medium"> for "{currentSearch}"</span>
              )}
            </>
          ) : (
            'No workshops found'
          )}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Workshops Grid */}
      {!isLoading && workshops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {workshops.map((workshop) => {
            const status = getWorkshopStatus(workshop);
            return (
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
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(workshop.price)}
                      </span>
                    </div>
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
                      {workshop.available_seats} of {workshop.max_capacity} seats available
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
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && workshops.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workshops found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or search terms.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 btn btn-primary"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => changePage(pagination.current_page - 1)}
              disabled={!pagination.current_page || pagination.current_page <= 1}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => changePage(pagination.current_page + 1)}
              disabled={!pagination.current_page || pagination.current_page >= pagination.total_pages}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{pagination.current_page}</span> of{' '}
                <span className="font-medium">{pagination.total_pages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => changePage(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.current_page - 2) + i;
                  if (pageNum > pagination.total_pages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => changePage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === pagination.current_page
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => changePage(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.total_pages}
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
