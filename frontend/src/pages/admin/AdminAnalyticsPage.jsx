import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Award, 
  Activity,
  Download,
  Filter
} from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30');
  const [exportType, setExportType] = useState('');

  // Mock analytics data - replace with actual API calls
  const { data: analytics, isLoading } = useQuery(
    ['analytics', dateRange],
    async () => {
      // This would be replaced with actual API calls
      return {
        overview: {
          totalWorkshops: 25,
          totalBookings: 180,
          totalRevenue: 18450.00,
          totalUsers: 142,
          completionRate: 87.5,
          cancellationRate: 8.3
        },
        workshopStats: [
          { name: 'React.js Fundamentals', bookings: 25, revenue: 2475 },
          { name: 'UI/UX Design Principles', bookings: 20, revenue: 2980 },
          { name: 'Digital Marketing Strategy', bookings: 30, revenue: 5970 },
          { name: 'Node.js Backend Development', bookings: 15, revenue: 3735 },
          { name: 'Python for Data Science', bookings: 16, revenue: 4784 }
        ],
        categoryStats: [
          { category: 'Technology', workshops: 8, bookings: 76, revenue: 11234 },
          { category: 'Design', workshops: 5, bookings: 38, revenue: 5462 },
          { category: 'Business', workshops: 6, bookings: 34, revenue: 6089 },
          { category: 'Marketing', workshops: 4, bookings: 22, revenue: 4378 },
          { category: 'Personal Development', workshops: 2, bookings: 10, revenue: 890 }
        ],
        monthlyData: [
          { month: 'Jan', bookings: 45, revenue: 4500 },
          { month: 'Feb', bookings: 52, revenue: 5200 },
          { month: 'Mar', bookings: 38, revenue: 3800 },
          { month: 'Apr', bookings: 61, revenue: 6100 },
          { month: 'May', bookings: 48, revenue: 4800 },
          { month: 'Jun', bookings: 55, revenue: 5500 }
        ],
        topInstructors: [
          { name: 'Sarah Johnson', workshops: 5, bookings: 87, rating: 4.9 },
          { name: 'Michael Chen', workshops: 4, bookings: 65, rating: 4.8 },
          { name: 'Emily Rodriguez', workshops: 3, bookings: 52, rating: 4.7 },
          { name: 'David Kim', workshops: 4, bookings: 48, rating: 4.6 }
        ]
      };
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleExport = (type) => {
    // Mock export functionality
    const data = {
      csv: 'data:text/csv;charset=utf-8,Workshop,Bookings,Revenue\\nReact.js,25,2475\\n...',
      pdf: 'data:application/pdf;base64,JVBERi0xLjQK...',
      excel: 'data:application/vnd.ms-excel;base64,UEsDBBQABgAI...'
    };
    
    const element = document.createElement('a');
    element.setAttribute('href', data[type] || data.csv);
    element.setAttribute('download', `analytics-report.${type}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights into your workshop performance
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          
          <div className="relative">
            <select
              value={exportType}
              onChange={(e) => {
                if (e.target.value) {
                  handleExport(e.target.value);
                  setExportType('');
                }
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Export Data</option>
              <option value="csv">Export as CSV</option>
              <option value="pdf">Export as PDF</option>
              <option value="excel">Export as Excel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Workshops
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview.totalWorkshops}
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
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Bookings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview.totalBookings}
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
                    ${analytics?.overview.totalRevenue?.toLocaleString()}
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
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completion Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.overview.completionRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Workshops */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Workshops</h3>
          <div className="space-y-4">
            {analytics?.workshopStats.map((workshop, index) => (
              <div key={workshop.name} className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {workshop.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {workshop.bookings} bookings • ${workshop.revenue}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance by Category</h3>
          <div className="space-y-4">
            {analytics?.categoryStats.map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{category.category}</p>
                  <p className="text-sm text-gray-500">
                    {category.workshops} workshops • {category.bookings} bookings
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${category.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics?.monthlyData.map((month, index) => {
                const prevMonth = analytics.monthlyData[index - 1];
                const growth = prevMonth ? 
                  ((month.bookings - prevMonth.bookings) / prevMonth.bookings * 100).toFixed(1) : 
                  0;
                
                return (
                  <tr key={month.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${month.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        growth > 0 ? 'bg-green-100 text-green-800' : 
                        growth < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {growth > 0 ? '+' : ''}{growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Instructors */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Instructors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics?.topInstructors.map((instructor) => (
            <div key={instructor.name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{instructor.name}</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Award className="h-3 w-3 mr-1" />
                  {instructor.rating}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <p>{instructor.workshops} workshops</p>
                <p>{instructor.bookings} total bookings</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
