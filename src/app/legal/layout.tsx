
import { AppHeader } from '@/components/lexigen/AppHeader';

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    {children}
                </article>
            </div>
        </main>
    </div>
  );
}
