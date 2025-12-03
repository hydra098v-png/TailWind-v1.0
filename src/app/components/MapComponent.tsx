'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Types
type Alert = {
  id: string;
  type: string;
  title: string;
  location: string;
  distance: string;
  time: string;
  description: string;
  severity: string;
  verified: boolean;
  icon: string;
  lat?: number;
  lng?: number;
};

type SafeZone = {
  id: string;
  name: string;
  type: string;
  distance: string;
  open: boolean;
  lat?: number;
  lng?: number;
};

type UserLocation = {
  lat: number;
  lng: number;
  accuracy?: number;
};

type MapComponentProps = {
  center: [number, number];
  zoom: number;
  alerts: Alert[];
  safeZones: SafeZone[];
  userLocation: UserLocation;
  onMarkerClick?: (id: string, type: 'alert' | 'safezone') => void;
};

// Add some randomness to the alert and safe zone positions for demo purposes
const addRandomOffset = (coord: number, maxOffset = 0.01): number => {
  return coord + (Math.random() * maxOffset * 2 - maxOffset);
};

const MapComponent = forwardRef(({
  center,
  zoom = 14,
  alerts = [],
  safeZones = [],
  userLocation,
  onMarkerClick,
}: MapComponentProps, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control with position
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  // Update map center and zoom when props change
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView(center, zoom);
  }, [center, zoom]);

  // Add/update user location marker
  const updateUserLocation = useCallback((location: UserLocation) => {
    if (!mapRef.current) return;

    const { lat, lng, accuracy } = location;
    const userIcon = L.divIcon({
      html: `
        <div class="relative">
          <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Update or create user marker
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([lat, lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLatLng([lat, lng]);
    }

    // Update or create accuracy circle
    if (accuracy) {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle([lat, lng], {
          radius: accuracy,
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          color: '#3b82f6',
          weight: 1,
        }).addTo(mapRef.current);
      } else {
        accuracyCircleRef.current.setLatLng([lat, lng]).setRadius(accuracy);
      }
    }

    // Fit map to show user location and accuracy circle
    if (accuracy) {
      const bounds = L.latLng([lat, lng]).toBounds(accuracy * 2);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      mapRef.current.setView([lat, lng], 15);
    }
  }, []);

  // Update user location when it changes
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    updateUserLocation(userLocation);
  }, [userLocation, updateUserLocation]);

  // Add/update alert markers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const newMarkers: { [key: string]: L.Marker } = {};

    // Process alerts
    alerts.forEach(alert => {
      const alertId = `alert-${alert.id}`;
      const lat = alert.lat || addRandomOffset(userLocation.lat, 0.02);
      const lng = alert.lng || addRandomOffset(userLocation.lng, 0.02);

      // Create popup content
      const popupContent = `
        <div class="w-48">
          <div class="flex items-center mb-2">
            <span class="text-2xl mr-2">${alert.icon}</span>
            <div>
              <h4 class="font-medium text-gray-900">${alert.title}</h4>
              <p class="text-xs text-gray-500">${alert.location} • ${alert.distance}</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 mb-2">${alert.description}</p>
          <div class="flex justify-between items-center text-xs text-gray-500">
            <span>${alert.time}</span>
            <span class="px-2 py-0.5 rounded-full ${
              alert.severity === 'high' ? 'bg-red-100 text-red-800' :
              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }">
              ${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
            </span>
          </div>
        </div>
      `;

      // Create or update marker
      if (markersRef.current[alertId]) {
        markersRef.current[alertId].setLatLng([lat, lng]);
        markersRef.current[alertId].setPopupContent(popupContent);
      } else {
        const icon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-8 h-8 rounded-full ${
                alert.severity === 'high' ? 'bg-red-500' :
                alert.severity === 'medium' ? 'bg-yellow-500' :
                'bg-blue-500'
              } text-white flex items-center justify-center text-lg">
                ${alert.icon}
              </div>
              <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                alert.severity === 'high' ? 'bg-red-700' :
                alert.severity === 'medium' ? 'bg-yellow-700' :
                'bg-blue-700'
              } border-2 border-white"></div>
            </div>
          `,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([lat, lng], { icon })
          .bindPopup(popupContent)
          .addTo(map);

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(alert.id, 'alert'));
        }

        newMarkers[alertId] = marker;
      }
    });

    // Process safe zones
    safeZones.forEach(zone => {
      const zoneId = `zone-${zone.id}`;
      const lat = zone.lat || addRandomOffset(userLocation.lat + 0.01, 0.015);
      const lng = zone.lng || addRandomOffset(userLocation.lng + 0.01, 0.015);

      // Create popup content
      const popupContent = `
        <div class="w-48">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
              ${
                zone.type === 'police' ? '👮' :
                zone.type === 'hospital' ? '🏥' :
                zone.type === 'embassy' ? '🏛️' : 'ℹ️'
              }
            </div>
            <div>
              <h4 class="font-medium text-gray-900">${zone.name}</h4>
              <p class="text-xs text-gray-500">${zone.distance} • ${zone.open ? 'Open' : 'Closed'}</p>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <button class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
              Directions
            </button>
            <button class="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded hover:bg-gray-100">
              Call
            </button>
          </div>
        </div>
      `;

      // Create or update marker
      if (markersRef.current[zoneId]) {
        markersRef.current[zoneId].setLatLng([lat, lng]);
        markersRef.current[zoneId].setPopupContent(popupContent);
      } else {
        const icon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-white border-2 ${
                zone.open ? 'border-green-500' : 'border-gray-400'
              } flex items-center justify-center text-xl">
                ${
                  zone.type === 'police' ? '👮' :
                  zone.type === 'hospital' ? '🏥' :
                  zone.type === 'embassy' ? '🏛️' : 'ℹ️'
                }
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                zone.open ? 'bg-green-500' : 'bg-gray-400'
              } border-2 border-white flex items-center justify-center">
                <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                  <path d="M2.5 0l-1.5 1.5 3 3-3 3 1.5 1.5 3-3 3 3 1.5-1.5-3-3 3-3-1.5-1.5-3 3-3-3z" />
                </svg>
              </div>
            </div>
          `,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([lat, lng], { icon })
          .bindPopup(popupContent)
          .addTo(map);

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(zone.id, 'safezone'));
        }

        newMarkers[zoneId] = marker;
      }
    });

    // Remove old markers that are no longer in the data
    Object.keys(markersRef.current).forEach(id => {
      if (!newMarkers[id] && markersRef.current[id]) {
        map.removeLayer(markersRef.current[id]);
      }
    });

    markersRef.current = { ...newMarkers };
  }, [alerts, safeZones, userLocation, onMarkerClick]);

  // Expose map methods via ref
  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
    flyTo: (lat: number, lng: number, zoom?: number) => {
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], zoom || mapRef.current.getZoom());
      }
    },
    fitBounds: (bounds: L.LatLngBounds, padding?: L.Point | [number, number]) => {
      if (mapRef.current) {
        mapRef.current.fitBounds(bounds, { padding });
      }
    },
  }));

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[300px] bg-gray-100"
      style={{ minHeight: '300px' }}
    />
  );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;
