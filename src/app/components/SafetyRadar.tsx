'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Shield, Bell, MapPin, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import dynamic from 'next/dynamic';

// Mock data for safety alerts
const mockAlerts = [
  {
    id: '1',
    type: 'warning', // 'warning', 'danger', 'info'
    title: 'Pickpocket Alert',
    location: 'Old Town Square',
    distance: '0.8 km away',
    time: '30 min ago',
    description: 'Increased reports of pickpocketing in this area. Keep your belongings secure.',
    severity: 'medium',
    verified: true,
    icon: '👛',
  },
  {
    id: '2',
    type: 'danger',
    title: 'Construction Work',
    location: 'Charles Bridge',
    distance: '1.2 km away',
    time: '2 hours ago',
    description: 'Major construction work causing delays. Sidewalks partially closed.',
    severity: 'high',
    verified: true,
    icon: '🚧',
  },
  {
    id: '3',
    type: 'info',
    title: 'Public Transport Strike',
    location: 'City Center',
    distance: '3.5 km away',
    time: '5 hours ago',
    description: 'Public transport services may be limited. Plan alternative routes.',
    severity: 'low',
    verified: false,
    icon: '🚇',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Weather Alert',
    location: 'Prague Area',
    distance: 'Nearby',
    time: '1 day ago',
    description: 'Heavy rain expected. Possible flooding in low-lying areas.',
    severity: 'medium',
    verified: true,
    icon: '🌧️',
  },
];

// Mock data for safe zones
const safeZones = [
  { id: 'z1', name: 'Tourist Information Center', type: 'info', distance: '0.3 km', open: true },
  { id: 'z2', name: 'Police Station', type: 'police', distance: '0.7 km', open: true },
  { id: 'z3', name: 'Hospital', type: 'hospital', distance: '2.1 km', open: true },
  { id: 'z4', name: 'US Embassy', type: 'embassy', distance: '3.0 km', open: false },
];

// Mock data for emergency contacts
const emergencyContacts = [
  { id: 'e1', name: 'Emergency', number: '112', type: 'emergency' },
  { id: 'e2', name: 'Police', number: '158', type: 'police' },
  { id: 'e3', name: 'Ambulance', number: '155', type: 'ambulance' },
  { id: 'e4', name: 'Fire Department', number: '150', type: 'fire' },
];

// Mock user location
const userLocation = {
  lat: 50.0875,
  lng: 14.4214,
  accuracy: 50, // meters
};

// Mock function to get user's location
const getUserLocation = (): Promise<{ lat: number; lng: number; accuracy: number }> => {
  return new Promise((resolve) => {
    // In a real app, this would use the browser's Geolocation API
    setTimeout(() => {
      resolve(userLocation);
    }, 1000);
  });
};

// Dynamic import for the map to avoid SSR issues
const MapWithNoSSR = dynamic<{
  center: [number, number];
  zoom: number;
  alerts: any[];
  safeZones: any[];
  userLocation: { lat: number; lng: number; accuracy?: number };
  ref?: React.RefObject<any>;
}>(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 flex items-center justify-center">Loading map...</div>,
});

const SafetyRadar = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [activeTab, setActiveTab] = useState<'alerts' | 'safezones' | 'emergency'>('alerts');
  const [userLocationState, setUserLocation] = useState<{lat: number, lng: number, accuracy: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef<any>(null);

  // Get user's location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true);
        const location = await getUserLocation();
        setUserLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
        // Fallback to default location (Prague)
        setUserLocation(userLocation);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleAlertPress = (alertId: string) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  const handleCallEmergency = (number: string) => {
    // In a real app, this would initiate a phone call
    alert(`Calling ${number}...`);
  };

  const handleShareLocation = () => {
    // In a real app, this would share the user's location with emergency contacts
    if (navigator.share) {
      navigator.share({
        title: 'My Current Location',
        text: `I'm at this location. Coordinates: ${userLocationState?.lat}, ${userLocationState?.lng}`,
        url: `https://www.google.com/maps?q=${userLocationState?.lat},${userLocationState?.lng}`,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Web Share API not supported in your browser.');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    
    switch (severity) {
      case 'high':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>High</span>;
      case 'medium':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Medium</span>;
      default:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Low</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading safety information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            Safety Radar
          </h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowMap(!showMap)}
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
              aria-label={showMap ? 'Hide map' : 'Show map'}
            >
              <MapPin className="h-5 w-5" />
            </button>
            <button 
              onClick={handleShareLocation}
              className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
              aria-label="Share my location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Map View */}
        {showMap && userLocationState && (
          <div className="h-64 mb-6 rounded-xl overflow-hidden border border-gray-200">
            <div className="h-full w-full">
              <MapWithNoSSR 
                center={[userLocationState.lat, userLocationState.lng]} 
                zoom={14}
                alerts={mockAlerts}
                safeZones={safeZones}
                userLocation={userLocationState}
                ref={mapRef}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Alerts
              {alerts.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {alerts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('safezones')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'safezones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Safe Zones
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'emergency'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Emergency
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No active alerts</h3>
                  <p className="mt-1 text-sm text-gray-500">Your area appears to be safe.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`border rounded-lg overflow-hidden ${
                      alert.type === 'danger' ? 'border-red-200 bg-red-50' :
                      alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <button
                      className="w-full text-left p-4 flex items-start"
                      onClick={() => handleAlertPress(alert.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          alert.type === 'danger' ? 'bg-red-100' :
                          alert.type === 'warning' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <span className="text-xl">{alert.icon}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 h-4 w-4 mr-1" />
                          <span>{alert.location} • {alert.distance} • {alert.time}</span>
                        </div>
                        {(expandedAlert === alert.id) && (
                          <p className="mt-2 text-sm text-gray-700">{alert.description}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        {expandedAlert === alert.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {expandedAlert === alert.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
                        <div className="flex space-x-3">
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Get Directions
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Avoid Area
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Save
                          </button>
                        </div>
                        {!alert.verified && (
                          <p className="mt-2 text-xs text-gray-500 flex items-center">
                            <svg className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            This alert hasn't been verified by local authorities yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'safezones' && (
            <div className="space-y-4">
              {safeZones.map((zone) => (
                <div key={zone.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {zone.type === 'police' ? (
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          ) : zone.type === 'hospital' ? (
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          ) : zone.type === 'embassy' ? (
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                          ) : (
                            <Info className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{zone.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 h-4 w-4 mr-1" />
                          <span>{zone.distance} • {zone.open ? 'Open Now' : 'Closed'}</span>
                        </div>
                        <div className="mt-3 flex space-x-3">
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Directions
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Emergency Services</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    In case of emergency, contact the local authorities immediately.
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            contact.type === 'emergency' ? 'bg-red-100' :
                            contact.type === 'police' ? 'bg-blue-100' :
                            contact.type === 'ambulance' ? 'bg-white border-2 border-red-500' :
                            'bg-orange-100'
                          }`}>
                            {contact.type === 'emergency' ? (
                              <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : contact.type === 'police' ? (
                              <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                              </svg>
                            ) : contact.type === 'ambulance' ? (
                              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            ) : (
                              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-500 truncate">{contact.number}</p>
                        </div>
                        <button
                          onClick={() => handleCallEmergency(contact.number)}
                          className="ml-auto inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Call Now
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900">Your Emergency Contacts</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Add your emergency contacts to quickly reach out to your loved ones in case of an emergency.
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Emergency Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      In case of a life-threatening emergency, always call the local emergency number first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => handleCallEmergency('112')}
          className="p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SafetyRadar;
