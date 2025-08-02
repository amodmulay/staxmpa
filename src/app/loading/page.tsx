
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

const wittyMessages = [
  "Reticulating splines...",
  "Calibrating the tech-o-meter...",
  "Warming up the flux capacitor...",
  "Assembling pixels...",
  "Polishing the radar dish...",
  "Aligning cosmic rays...",
  "Gauging techno-entropy...",
];

export default function LoadingPage() {
  const router = useRouter();
  const [message, setMessage] = useState(wittyMessages[0]);

  useEffect(() => {
    // Navigate to the radar page after a delay
    const timer = setTimeout(() => {
      router.push('/radar');
    }, 2000);

    // Cycle through witty messages
    const messageInterval = setInterval(() => {
      setMessage(wittyMessages[Math.floor(Math.random() * wittyMessages.length)]);
    }, 500);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(timer);
      clearInterval(messageInterval);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex items-center space-x-4">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
            <p className="text-2xl font-semibold">Preparing Your Radar</p>
            <p className="text-lg text-muted-foreground transition-opacity duration-300">{message}</p>
        </div>
      </div>
    </div>
  );
}
