import { ForwardedRef } from 'react';
import { Map as LeafletMap, LatLngBounds } from 'leaflet';

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

declare const MapComponent: React.ForwardRefExoticComponent<{
  center: [number, number];
  zoom: number;
  alerts: Alert[];
  safeZones: SafeZone[];
  userLocation: UserLocation;
  onMarkerClick?: (id: string, type: 'alert' | 'safezone') => void;
  ref?: ForwardedRef<{
    getMap: () => LeafletMap | null;
    flyTo: (lat: number, lng: number, zoom?: number) => void;
    fitBounds: (bounds: LatLngBounds, padding?: any) => void;
  }>;
}>;

export default MapComponent;
