
import { AppHeader } from '@/components/lexigen/AppHeader';

export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow w-full">
            {children}
        </main>
    </div>
  );
}
