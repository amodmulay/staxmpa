
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/lexigen/AppHeader';

export const metadata: Metadata = {
  title: 'StaxMap - Visualize Your Technology Landscape',
  description: 'Create, customize, and share interactive technology radars with StaxMap.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-grow w-full max-w-7xl mx-auto p-4">
              {children}
            </main>
            <footer className="text-center p-4 text-sm text-muted-foreground border-t">
              StaxMap &copy; {new Date().getFullYear()}
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

    