
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Cog, Filter, ImageDown, MousePointerClick, Palette, Rows3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/lexigen/LandingHeader';

const words = ["Technology", "Strategy", "Organisation", "Product", "Ecosystem"];

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


export default function LandingPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      setAnimationKey(prevKey => prevKey + 1);
    }, 2500); // Change word every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <BrainCircuit className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Visualize Your{' '}
                <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
                  <span className="opacity-0">{words[0]}</span>
                  <span
                    key={animationKey}
                    className="animate-word-cycle absolute left-0 top-0"
                  >
                    {words[currentWordIndex]}
                  </span>
                </span>
                <br />
                 Landscape
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                StaxMap helps you create, manage, and share interactive technology radars. Map your tools, platforms, and frameworks with clarity and confidence.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/loading">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-28 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Packed with Powerful Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to build a clear and actionable technology radar for your team.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-start p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
