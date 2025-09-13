import React from 'react';
import { BookOpen, Download } from 'lucide-react';

export const AdminBookingsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Bookings</h1>
            <p className="text-lg text-gray-600">
              View and manage all workshop bookings.
            </p>
          </div>
          <button className="btn btn-primary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border p-8 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Booking Management Coming Soon
        </h3>
        <p className="text-gray-600">
          This feature is under development. You'll be able to manage all bookings here.
        </p>
      </div>
    </div>
  );
};
