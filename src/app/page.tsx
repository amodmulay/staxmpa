import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, Palette, MousePointerClick, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Radar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">RadarMap</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/radar">
                <Button>Go to App</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-1 gap-10 items-center py-20 md:py-24">
          <div className="flex flex-col items-start space-y-4 ps-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter">
              Visualize Your Tech Landscape
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              StaxMap helps you create beautiful, interactive technology radars to map out topics, assess their maturity, and guide your strategy. Effortlessly build, customize, and share your vision.
            </p>
            <Link href="/radar">
              <Button size="lg" className="mt-4">
                Create Your Radar Now
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

        </section>

        {/* Features Section */}
        <section id="features" className="container py-20 md:py-24 bg-muted/50 rounded-lg">
          <div className="mx-auto flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features, Simple Interface</h2>
            <p className="max-w-2xl text-muted-foreground">
              Everything you need to build a comprehensive technology radar, without the complexity.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Dynamic Radars</CardTitle>
                <Radar className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Add topics and regions on-the-fly. The radar updates in real-time as you build it.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Customizable Themes</CardTitle>
                <Palette className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Choose from multiple themes or customize colors to match your brand identity perfectly.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Interactive Elements</CardTitle>
                <MousePointerClick className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Drag and drop topics to fine-tune their position within the radar for precise mapping.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sample Radars Section */}
        <section className="container py-20 md:py-24">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">See What You Can Create</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Sample Radar 1"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="data visualization"
              />
              <p className="mt-4 text-muted-foreground font-semibold">Frontend Technologies Radar</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Sample Radar 2"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="infographic chart"
              />
              <p className="mt-4 text-muted-foreground font-semibold">Cloud & DevOps Tools Radar</p>
            </div>
          </div>
        </section>

        {/* Google Apps Integration Section */}
        <section className="container py-20 md:py-24">
            <Card className="bg-primary/5 border-primary/20 text-center p-8 md:p-12">
                 <h2 className="text-3xl font-bold text-primary">Integrate with Google Workspace</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Seamlessly connect StaxMap with your Google account. Future updates will allow you to export radars to Google Slides, save data in Google Sheets, and more.
                 </p>
                 <div className="mt-6">
                    <Button variant="secondary" disabled>Coming Soon</Button>
                 </div>
            </Card>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex items-center justify-between py-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StaxMap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
