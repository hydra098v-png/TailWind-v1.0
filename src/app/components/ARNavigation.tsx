'use client';

import { useEffect, useRef, useState } from 'react';
import { Compass, MapPin, Navigation, X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import A-Frame and AR.js with SSR disabled
const ARView = dynamic(
  () => {
    if (typeof window !== 'undefined') {
      return import('aframe');
    }
    return Promise.resolve(() => null);
  },
  { ssr: false }
);

const AR = dynamic(
  () => {
    if (typeof window !== 'undefined') {
      return import('aframe-ar');
    }
    return Promise.resolve(() => null);
  },
  { ssr: false }
);

export default function ARNavigation() {
  const arSceneRef = useRef<HTMLDivElement>(null);
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Eiffel Tower', 'Colosseum', 'Statue of Liberty', 'Great Wall of China'
  ]);

  // Check for WebXR support
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      // @ts-ignore
      navigator.xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setIsARSupported(supported);
      }).catch(() => {
        setIsARSupported(false);
      });
    } else {
      setIsARSupported(false);
    }
  }, []);

  // Initialize AR scene when component mounts
  useEffect(() => {
    if (arSceneRef.current && isARSupported) {
      // Clean up any existing scene
      while (arSceneRef.current.firstChild) {
        arSceneRef.current.removeChild(arSceneRef.current.firstChild);
      }

      // Create new scene
      const scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false;');
      scene.setAttribute('renderer', 'antialias: true; alpha: true;');
      scene.setAttribute('vr-mode-ui', 'enabled: false');
      
      // Add camera
      const camera = document.createElement('a-entity');
      camera.setAttribute('camera', '');
      camera.setAttribute('position', '0 1.6 0');
      scene.appendChild(camera);

      // Add AR cursor
      const cursor = document.createElement('a-cursor');
      cursor.setAttribute('rayOrigin', 'mouse');
      scene.appendChild(cursor);

      // Add a simple marker
      const marker = document.createElement('a-marker');
      marker.setAttribute('type', 'pattern');
      marker.setAttribute('url', 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro');
      marker.setAttribute('emitevents', 'true');
      marker.setAttribute('cursor', 'rayOrigin: mouse');
      
      // Add a box to the marker
      const box = document.createElement('a-box');
      box.setAttribute('position', '0 0.5 0');
      box.setAttribute('material', 'opacity: 0.5; side: double; color: #4F46E5');
      box.setAttribute('shadow', '');
      marker.appendChild(box);
      
      // Add navigation arrow
      const arrow = document.createElement('a-entity');
      arrow.setAttribute('position', '0 1 0');
      arrow.setAttribute('rotation', '0 0 0');
      arrow.setAttribute('gltf-model', 'url(https://arjs-cors-proxy.herokuapp.com/https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf)');
      arrow.setAttribute('scale', '0.5 0.5 0.5');
      arrow.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 10000');
      marker.appendChild(arrow);
      
      scene.appendChild(marker);
      
      // Add light
      const light = document.createElement('a-light');
      light.setAttribute('type', 'ambient');
      light.setAttribute('color', '#FFF');
      light.setAttribute('intensity', '0.5');
      scene.appendChild(light);
      
      const directionalLight = document.createElement('a-light');
      directionalLight.setAttribute('type', 'directional');
      directionalLight.setAttribute('color', '#FFF');
      directionalLight.setAttribute('intensity', '0.6');
      directionalLight.setAttribute('position', '1 1 1');
      scene.appendChild(directionalLight);
      
      arSceneRef.current.appendChild(scene);
      
      return () => {
        if (arSceneRef.current) {
          while (arSceneRef.current.firstChild) {
            arSceneRef.current.removeChild(arSceneRef.current.firstChild);
          }
        }
      };
    }
  }, [isARSupported]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      // In a real app, this would trigger navigation to the destination
      console.log(`Navigating to: ${destination}`);
      setShowSearch(false);
    }
  };

  if (isARSupported === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-sm mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking AR capabilities...</p>
        </div>
      </div>
    );
  }

  if (!isARSupported) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AR Not Supported</h3>
          <p className="text-gray-600 mb-4">
            Your device or browser doesn't support WebXR with AR features. 
            Please try on a compatible mobile device with AR support.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* AR Scene */}
      <div 
        ref={arSceneRef} 
        className="absolute inset-0 w-full h-full z-0"
        style={{ display: showSearch ? 'none' : 'block' }}
      ></div>
      
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            aria-label={showSearch ? 'Close search' : 'Search destination'}
          >
            {showSearch ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <MapPin className="h-6 w-6 text-blue-600" />
            )}
          </button>
          
          <div className="flex space-x-2">
            <button 
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
              aria-label="Toggle flashlight"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                />
              </svg>
            </button>
            
            <button 
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
              aria-label="Toggle compass"
            >
              <Compass className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Panel */}
      {showSearch && (
        <div className="absolute inset-0 z-20 bg-white p-6 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Where to?</h2>
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for a destination..."
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Navigation className="h-5 w-5" />
                </button>
              </div>
            </form>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Popular Destinations</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDestination(suggestion);
                      // In a real app, this would start navigation
                      setShowSearch(false);
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                AR Navigation Tips
              </h4>
              <p className="text-sm text-blue-700">
                Point your camera at your surroundings to see navigation cues overlaid on the real world. 
                Follow the arrows and distance indicators to reach your destination.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      {!showSearch && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Next turn</p>
                <p className="font-medium">In 200m, turn right</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Arrival in</p>
                  <p className="font-medium">8 min • 1.2 km</p>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  End Navigation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
