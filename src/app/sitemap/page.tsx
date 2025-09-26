
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import { AppHeader } from '@/components/lexigen/AppHeader';

export const metadata: Metadata = {
  title: 'Sitemap - StaxMap',
  description: 'Navigate through all the pages available on StaxMap. Find links to the homepage, radar tool, and our educational content on technology radars.',
};

const sitemapLinks = [
    { href: '/', title: 'Home', description: 'The main landing page for StaxMap.' },
    { href: '/radar', title: 'Radar Tool', description: 'The interactive application for creating and managing your technology radar.' },
    { href: '/learn', title: 'Learn About Radars', description: 'An educational guide on the concepts and benefits of technology radars.' },
    { href: '/sitemap.xml', title: 'XML Sitemap', description: 'The machine-readable sitemap for search engine crawlers.' },
];

export default function SitemapPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Sitemap</h1>
                    <p className="mt-4 text-xl text-muted-foreground">
                    A complete guide to the pages on StaxMap.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Map className="text-primary" />
                            Main Pages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {sitemapLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="block p-4 rounded-lg hover:bg-muted" target={link.href.endsWith('.xml') ? '_blank' : undefined}>
                                        <h3 className="font-semibold text-lg text-primary">{link.title}</h3>
                                        <p className="text-muted-foreground text-sm">{link.description}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
