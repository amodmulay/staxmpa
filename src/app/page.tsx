
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Cog, Filter, ImageDown, MousePointerClick, Palette, Rows3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/lexigen/LandingHeader';

const features = [
  {
    icon: <Rows3 className="h-8 w-8 text-primary" />,
    title: 'Dynamic Radar Creation',
    description: 'Add and remove concentric regions like "Adopt" or "Assess" to structure your radar exactly how you need it.',
  },
  {
    icon: <MousePointerClick className="h-8 w-8 text-primary" />,
    title: 'Interactive Visualization',
    description: 'Drag-and-drop topics directly on the radar to change their position or move them between regions in real-time.',
  },
  {
    icon: <Palette className="h-8 w-8 text-primary" />,
    title: 'Theming & Customization',
    description: 'Switch between themes or customize region colors to match your brand. Your radar, your style.',
  },
  {
    icon: <ImageDown className="h-8 w-8 text-primary" />,
    title: 'Screenshot Capture',
    description: 'Export a high-resolution PNG of your radar for presentations, documentation, or sharing with your team.',
  },
  {
    icon: <Filter className="h-8 w-8 text-primary" />,
    title: 'Filtering & Searching',
    description: 'Instantly find any topic in the list with powerful search and region-based filtering capabilities.',
  },
  {
    icon: <Cog className="h-8 w-8 text-primary" />,
    title: 'Real-time Topic Management',
    description: 'Add new topics to any region and see them appear instantly on the radar. Keep your landscape up to date with ease.',
  },
];

const rotatingPhrases = [
  'Map Your Technology\'s Future',
  'Align Teams with Strategic Clarity',
  'Drive Innovation, One Decision at a Time',
];

export default function LandingPage() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % rotatingPhrases.length);
    }, 3000); // Change phrase every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight rainbow-shimmer animate-shimmer py-1">
                Visualize Your Technology Landscape
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                StaxMap helps you create, manage, and share interactive technology radars. Map your tools, platforms, and frameworks with clarity and confidence.
              </p>
              <div className="mt-4">
                <Button asChild size="lg">
                  <Link href="/radar">
                    Launch Radar <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-6 h-10 text-center font-semibold text-xl md:text-2xl overflow-hidden">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${currentPhraseIndex * 2.5}rem)`}}
                >
                  {rotatingPhrases.map((phrase, index) => (
                    <div key={index} className="h-10 flex items-center justify-center">
                      <span className="text-gradient">{phrase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-28 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Packed with Powerful Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to build a clear and actionable technology radar for your team.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 [perspective:1000px]">
              {features.map((feature, index) => (
                <div key={index} className="glow-container group">
                  <div className="flex flex-col items-start p-6 bg-card rounded-lg border shadow-sm h-full transition-transform duration-300 ease-in-out group-hover:rotate-y-2">
                    <div className="bg-primary/10 p-3 rounded-full mb-4 border border-primary/20">
                      {React.cloneElement(feature.icon, { className: 'h-6 w-6 text-primary'})}
                    </div>
                    <h3 className="text-xl font-semibold mt-2">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
