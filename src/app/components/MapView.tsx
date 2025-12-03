// src/app/components/MapView.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const createMap = () => {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
  
  return L;
};

const MapView = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || isInitialized.current) return;

    const L = createMap();
    if (!L) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([51.505, -0.09], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add zoom control
      L.control.zoom({
        position: 'topright'
      }).addTo(mapRef.current);

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapRef.current?.setView([latitude, longitude], 15);
            
            // Add marker at user's location
            L.marker([latitude, longitude], {
              icon: L.divIcon({
                html: `
                  <div class="relative">
                    <div class="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                    <div class="relative flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                  </div>
                `,
                className: 'custom-marker',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              })
            })
            .addTo(mapRef.current)
            .bindPopup('Your location')
            .openPopup();
          },
          (error) => {
            console.error('Error getting location:', error);
            // Default to a known location
            const defaultLocation: [number, number] = [51.505, -0.09];
            mapRef.current?.setView(defaultLocation, 13);
            L.marker(defaultLocation, {
              icon: L.divIcon({
                html: `
                  <div class="relative">
                    <div class="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                    <div class="relative flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                  </div>
                `,
                className: 'custom-marker',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              })
            })
            .addTo(mapRef.current)
            .bindPopup('Default location')
            .openPopup();
          }
        );
      }

      // Handle window resize
      const handleResize = () => {
        mapRef.current?.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      isInitialized.current = true;
      setIsLoading(false);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        isInitialized.current = false;
      };
    }
  }, []);

  return (
    <div className="h-full w-full">
      <div 
        ref={mapContainerRef} 
        className="h-[calc(100vh-200px)] w-full rounded-lg border-2 border-blue-200 shadow-sm"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;