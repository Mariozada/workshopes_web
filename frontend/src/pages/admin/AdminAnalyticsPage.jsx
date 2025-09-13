import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const AdminAnalyticsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics & Reports</h1>
        <p className="text-lg text-gray-600">
          View detailed analytics and generate reports.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Analytics Dashboard Coming Soon
        </h3>
        <p className="text-gray-600">
          This feature is under development. You'll be able to view detailed analytics here.
        </p>
      </div>
    </div>
  );
};
