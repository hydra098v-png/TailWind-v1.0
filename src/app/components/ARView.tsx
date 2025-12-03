'use client';

import { useEffect, useRef, useState } from 'react';

export default function ARView() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sceneRef.current) return;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initAR = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load required scripts
        await Promise.all([
          loadScript('https://aframe.io/releases/1.4.0/aframe.min.js'),
          loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js')
        ]);

        // Clean up any existing scene
        while (sceneRef.current?.firstChild) {
          sceneRef.current.removeChild(sceneRef.current.firstChild);
        }

        // Create AR scene
        const scene = document.createElement('a-scene');
        scene.setAttribute('vr-mode-ui', 'enabled: false');
        scene.setAttribute('renderer', 'antialias: true; alpha: true');
        scene.setAttribute('arjs', 'trackingMethod: best; sourceType: webcam; debugUIEnabled: false;');

        // Add camera
        const camera = document.createElement('a-camera');
        camera.setAttribute('gps-camera', 'gpsMinDistance: 5;');
        scene.appendChild(camera);

        // Add a simple box as a marker
        const box = document.createElement('a-box');
        box.setAttribute('position', '0 0.5 -2');
        box.setAttribute('rotation', '0 45 0');
        box.setAttribute('color', '#4CC3D9');
        scene.appendChild(box);

        sceneRef.current.appendChild(scene);
        setIsLoading(false);
      } catch (err) {
        console.error('AR initialization error:', err);
        setError('Failed to initialize AR. Please try again.');
        setIsLoading(false);
      }
    };

    initAR();

    // Cleanup
    return () => {
      if (sceneRef.current) {
        while (sceneRef.current.firstChild) {
          sceneRef.current.removeChild(sceneRef.current.firstChild);
        }
      }
    };
  }, []);

  if (error) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[70vh] w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-10">
          <p>Initializing AR...</p>
        </div>
      )}
      <div 
        ref={sceneRef} 
        className="absolute inset-0 bg-black rounded-lg overflow-hidden"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}