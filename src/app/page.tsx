'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from './components/Layout';
import { 
  MapPin, 
  Compass, 
  Shield, 
  Languages, 
  Map, 
  Utensils, 
  Bus, 
  Globe, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Type for our view types
type ViewType = 'home' | 'ar' | 'translator' | 'local-feed' | 'safety' | 'transport' | 'food' | 'planner' | 'profile';

// Feature cards data
const features = [
  {
    id: 'ar',
    title: 'AR Smart Navigation',
    description: 'Navigate with augmented reality directions overlaid on the real world',
    icon: Compass,
    color: 'from-purple-500 to-blue-500',
    link: '/ar'
  },
  {
    id: 'translator',
    title: 'Instant Translator',
    description: 'Translate text, speech, and images in real-time',
    icon: Languages,
    color: 'from-green-500 to-teal-500',
    link: '/translator'
  },
  {
    id: 'local-feed',
    title: 'Local Info Feed',
    description: 'Discover hidden gems and local insights from residents',
    icon: Globe,
    color: 'from-yellow-500 to-orange-500',
    link: '/local-feed'
  },
  {
    id: 'safety',
    title: 'Safety Radar',
    description: 'Real-time safety alerts and emergency assistance',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    link: '/safety'
  },
  {
    id: 'transport',
    title: 'Transport Genius',
    description: 'Smart routing and real-time transit information',
    icon: Bus,
    color: 'from-blue-500 to-cyan-500',
    link: '/transport'
  },
  {
    id: 'food',
    title: 'Clean Food Finder',
    description: 'Find restaurants with dietary options and hygiene ratings',
    icon: Utensils,
    color: 'from-emerald-500 to-green-500',
    link: '/food'
  },
  {
    id: 'planner',
    title: 'AI Trip Planner',
    description: 'Personalized itinerary generator with smart suggestions',
    icon: Map,
    color: 'from-indigo-500 to-purple-500',
    link: '/planner'
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Manage your preferences and saved places',
    icon: MapPin,
    color: 'from-gray-500 to-blue-500',
    link: '/profile'
  }
];

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('home');

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      <div className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Your Ultimate Travel Companion
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the world with confidence using our all-in-one travel assistant. 
            From navigation to translation, we've got you covered.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link 
              href="/planner" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Plan Your Trip
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
            <Link 
              href="/local-feed" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Explore Local
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature) => (
              <Link 
                href={feature.link} 
                key={feature.id}
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                onClick={() => setActiveView(feature.id as ViewType)}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="ml-4 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  {feature.description}
                </p>
                <span 
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <ChevronRight className="h-6 w-6" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-700 rounded-2xl mx-4 sm:mx-6 lg:mx-8 overflow-hidden">
          <div className="px-6 py-16 sm:p-16 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to explore?
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-6 text-blue-100">
                Download our mobile app to access all features on the go and get real-time updates during your travels.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:ml-8">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
                >
                  Download App
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 bg-opacity-25 px-5 py-3 text-base font-medium text-white hover:bg-opacity-30"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
