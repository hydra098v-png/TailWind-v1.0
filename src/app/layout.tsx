import { MapPin, Shield, MessageSquare, Compass, CalendarDays } from 'lucide-react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelSafe - Your Travel Companion",
  description: "A travel assistant app with AR navigation and safety features",
  other: {
    'aframe': '1.4.2',
    'aframe-ar': '^1.0.0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://aframe.io/releases/1.4.2/aframe.min.js" async></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js" async></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
// Update the navigation array
const navigation = [
  { name: 'Map View', icon: MapPin, view: 'map' as ViewType },
  { name: 'AR Navigation', icon: Compass, view: 'ar' as ViewType },
  { name: 'Safety Reports', icon: Shield, view: 'safety' as ViewType },
  { name: 'Travel Planner', icon: CalendarDays, view: 'planner' as ViewType },
  { name: 'Travel Assistant', icon: MessageSquare, view: 'chat' as ViewType },
];