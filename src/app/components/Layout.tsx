'use client';

import { ReactNode, useState } from 'react';
import { 
  MapPin, 
  Compass, 
  Shield, 
  MessageSquare, 
  Menu, 
  X, 
  Languages, 
  Map, 
  Utensils, 
  Bus, 
  Plane, 
  Globe, 
  Info,
  Home,
  User,
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ViewType = 'home' | 'ar' | 'translator' | 'local-feed' | 'safety' | 'transport' | 'food' | 'planner' | 'profile';

interface LayoutProps {
  children: ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export default function Layout({ children, activeView, setActiveView }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Home', icon: Home, view: 'home' as ViewType },
    { name: 'AR Navigation', icon: Compass, view: 'ar' as ViewType },
    { name: 'Translator', icon: Languages, view: 'translator' as ViewType },
    { name: 'Local Feed', icon: MessageSquare, view: 'local-feed' as ViewType },
    { name: 'Safety Radar', icon: Shield, view: 'safety' as ViewType },
    { name: 'Transport', icon: Bus, view: 'transport' as ViewType },
    { name: 'Food Finder', icon: Utensils, view: 'food' as ViewType },
    { name: 'Trip Planner', icon: Map, view: 'planner' as ViewType },
    { name: 'Profile', icon: User, view: 'profile' as ViewType },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 shadow-md">
          <div className="flex items-center space-x-2">
            <Compass className="h-6 w-6" />
            <h1 className="text-xl font-bold">TravelCompanion</h1>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-20 transition-opacity" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">TravelCompanion</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={`/${item.view === 'home' ? '' : item.view}`}
                  onClick={() => {
                    setActiveView(item.view);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    activeView === item.view 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      activeView === item.view ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`} 
                    aria-hidden="true" 
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-center text-xs text-gray-500">
              <p>TravelCompanion v1.0</p>
              <p className="mt-1"> {new Date().getFullYear()} All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:shadow-xl">
        <div className="flex h-16 flex-shrink-0 items-center px-6">
          <div className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">TravelCompanion</h1>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto border-t border-gray-200">
          <nav className="flex-1 space-y-1 bg-white px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={`/${item.view === 'home' ? '' : item.view}`}
                onClick={() => setActiveView(item.view)}
                className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeView === item.view 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    activeView === item.view ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`} 
                  aria-hidden="true" 
                />
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </nav>
          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-center text-xs text-gray-500">
              <p>TravelCompanion v1.0</p>
              <p className="mt-1"> {new Date().getFullYear()} All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between bg-white px-4 shadow-sm lg:px-6">
          <h1 className="text-lg font-semibold text-gray-800">
            {navigation.find(item => item.view === activeView)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
              <span className="sr-only">Notifications</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex items-center">
              <Image 
                src="/images/logo.png"
                alt="TravelSafe Logo"
                width={112}
                height={28}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
