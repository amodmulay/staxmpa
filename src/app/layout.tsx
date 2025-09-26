
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export const metadata: Metadata = {
  title: 'StaxMap - Visualize Your Technology Landscape',
  description: 'Create, customize, and share interactive technology radars with StaxMap. Learn how to map your tools, platforms, and frameworks for strategic decision-making.',
  keywords: 'technology radar, tech radar, visualize tech stack, tech strategy, StaxMap, adopt, trial, assess, hold',
  authors: [{ name: 'StaxMap Team' }],
  creator: 'StaxMap',
  publisher: 'StaxMap',
  robots: 'index, follow',
  other: {
    'google-adsense-account': 'ca-pub-2123835135599458',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2123835135599458"
     crossOrigin="anonymous"></script>
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <div className="flex-grow flex flex-col">
              {children}
            </div>
            <footer className="bg-muted text-muted-foreground border-t">
              <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="h-7 w-7 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">StaxMap</h3>
                  </div>
                  <p className="text-sm">Visualize your technology landscape. Create, manage, and share interactive technology radars with clarity and confidence.</p>
                  <p className="text-xs mt-4">&copy; {new Date().getFullYear()} StaxMap. All rights reserved.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Navigate</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/" className="hover:text-primary hover:underline underline-offset-4">Home</Link></li>
                    <li><Link href="/radar" className="hover:text-primary hover:underline underline-offset-4">Launch Radar</Link></li>
                    <li><Link href="/learn" className="hover:text-primary hover:underline underline-offset-4">Learn About Radars</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/sitemap" className="hover:text-primary hover:underline underline-offset-4">Sitemap</Link></li>
                    <li><a href="https://www.thoughtworks.com/en-de/radar" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline underline-offset-4">Thoughtworks Radar</a></li>
                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline underline-offset-4">GitHub (Coming Soon)</a></li>
                  </ul>
                </div>
              </div>
            </footer>
            <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
