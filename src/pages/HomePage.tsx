import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Rev-Cloud-JTBD
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Visualize and analyze your Jobs-to-be-Done journey with interactive mapping, 
            team filtering, and AI-powered insights.
          </p>
          
          {/* AI Search Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🤖 Ask About Your Journey
            </h2>
            <p className="text-gray-600 mb-6">
              Ask natural language questions about job performers, micro jobs, or journey stages
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., 'Which job performers are involved in contract management?' or 'Show me all micro jobs in the performance management stage'"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              💡 Try asking about specific teams, job performers, or process stages
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            to="/map"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
            <p className="text-gray-600">
              Explore your end-to-end journey with dynamic filtering and team highlighting
            </p>
          </Link>

          <Link
            to="/table"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Table View</h3>
            <p className="text-gray-600">
              Browse and edit your micro jobs in a structured table format
            </p>
          </Link>

          <Link
            to="/taxonomy"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Performers</h3>
            <p className="text-gray-600">
              Manage your taxonomy of job performers and their relationships
            </p>
          </Link>
        </div>

        {/* CSV Import Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            📄 Import Your Journey Data
          </h2>
          <p className="text-gray-600 mb-6">
            Upload a CSV file to create or update your journey map. Your data will be processed 
            and you can then customize connections and performer assignments.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your CSV file here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports: job_domain_stage, main_job, micro_job, job_performers, descriptions, product_team
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to="/map"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Sample Journey Map
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;