'use client';

import { useState } from 'react';
import { AlertCircle, MapPin, Clock, User, Plus, AlertTriangle } from 'lucide-react';

interface SafetyReport {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  reportedBy: string;
}

const SafetyReports = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState<Omit<SafetyReport, 'id' | 'timestamp' | 'reportedBy'>>({ 
    title: '',
    description: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    severity: 'medium'
  });

  // Mock data - in a real app, this would come from an API
  const [reports, setReports] = useState<SafetyReport[]>([
    {
      id: '1',
      title: 'Broken street light',
      description: 'Street light not working near the park entrance, making it very dark at night.',
      location: {
        lat: 51.505,
        lng: -0.09,
        address: '123 Park Lane, London'
      },
      severity: 'medium',
      timestamp: new Date('2023-11-15T14:30:00'),
      reportedBy: 'Jane D.'
    },
    {
      id: '2',
      title: 'Slippery sidewalk',
      description: 'Sidewalk is very slippery when wet near the bus stop.',
      location: {
        lat: 51.51,
        lng: -0.1,
        address: '456 Main St, London'
      },
      severity: 'low',
      timestamp: new Date('2023-11-16T09:15:00'),
      reportedBy: 'John S.'
    },
    {
      id: '3',
      title: 'Aggressive dog in the park',
      description: 'Unleashed dog showing aggressive behavior towards people in the park.',
      location: {
        lat: 51.503,
        lng: -0.12,
        address: 'Central Park, London'
      },
      severity: 'high',
      timestamp: new Date('2023-11-17T16:45:00'),
      reportedBy: 'Alex M.'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewReport(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setNewReport(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const newReportEntry: SafetyReport = {
        ...newReport,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        reportedBy: 'Current User' // In a real app, this would be the logged-in user
      };
      
      setReports([newReportEntry, ...reports]);
      setNewReport({ 
        title: '',
        description: '',
        location: {
          lat: 0,
          lng: 0,
          address: ''
        },
        severity: 'medium'
      });
      setShowReportForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Safety Reports</h2>
        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showReportForm ? 'Cancel' : 'New Report'}
        </button>
      </div>

      {showReportForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Submit a Safety Concern</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={newReport.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={newReport.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Provide more details about the safety concern..."
                />
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={newReport.severity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option value="low">Low - Minor concern</option>
                  <option value="medium">Medium - Concerning</option>
                  <option value="high">High - Immediate attention needed</option>
                </select>
              </div>

              <div>
                <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  required
                  value={newReport.location.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Address or description of the location"
                />
              </div>

              {/* In a real app, you would have a map component here to select the location */}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No safety reports yet</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first to report a safety concern in your area.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowReportForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Report
              </button>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {report.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                    </span>
                  </div>
                  <div className="mt-1 max-w-2xl text-sm text-gray-500">
                    <p>{report.description}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {report.location.address}
                    </div>
                    <div className="flex items-center">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {report.timestamp.toLocaleDateString()} at {report.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="flex items-center">
                      <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {report.reportedBy}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SafetyReports;
