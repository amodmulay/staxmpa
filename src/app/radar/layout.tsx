
import { AppHeader } from '@/components/lexigen/AppHeader';

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
