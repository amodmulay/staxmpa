
import { AppHeader } from '@/components/lexigen/AppHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radar Builder - StaxMap',
  description: 'The main application for creating, editing, and visualizing your interactive technology radar. Drag and drop topics, customize regions, and export your final radar.',
  robots: 'noindex, nofollow', // Discourage search engines from indexing the tool itself
};


export default function RadarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow w-full max-w-7xl mx-auto p-4">
            {children}
        </main>
    </div>
  );
}
