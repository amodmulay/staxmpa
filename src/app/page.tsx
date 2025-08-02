
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, BarChart, Settings, GitBranch } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">StaxMap</span>
          </Link>
          <nav className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/loading">Launch App</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center py-20 sm:py-24">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
              Visualize Your Technology Landscape
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              StaxMap helps you create, manage, and share dynamic technology radars.
              Map your tools, platforms, and frameworks with clarity and confidence.
            </p>
            <Button size="lg" asChild>
              <Link href="/loading">Get Started for Free</Link>
            </Button>
          </section>

          {/* Features Section */}
          <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BarChart className="h-10 w-10 mb-4 text-primary" />}
                title="Dynamic Radar"
                description="Add, remove, and drag-and-drop topics across different assessment rings like Adopt, Trial, Assess, and Hold."
              />
              <FeatureCard
                icon={<Settings className="h-10 w-10 mb-4 text-primary" />}
                title="Fully Customizable"
                description="Configure regions, apply themes, and customize colors to match your brand identity perfectly."
              />
              <FeatureCard
                icon={<GitBranch className="h-10 w-10 mb-4 text-primary" />}
                title="Share & Export"
                description="Capture high-resolution screenshots of your radar for presentations, documentation, or sharing with your team."
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex items-center justify-between py-6 max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StaxMap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
