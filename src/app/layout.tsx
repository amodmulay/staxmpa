
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

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
            {children}
            <footer className="text-center p-4 text-sm text-muted-foreground border-t">
              StaxMap &copy; {new Date().getFullYear()}
            </footer>
            <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
