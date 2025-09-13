import React from 'react';
import { Calendar, Plus } from 'lucide-react';

export const AdminWorkshopsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Workshops</h1>
            <p className="text-lg text-gray-600">
              Create, edit, and manage your workshops.
            </p>
          </div>
          <button className="btn btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Workshop
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Workshop Management Coming Soon
        </h3>
        <p className="text-gray-600">
          This feature is under development. You'll be able to manage workshops here.
        </p>
      </div>
    </div>
  );
};
