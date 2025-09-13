
import Link from 'next/link';
import { BrainCircuit, Coffee } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/button';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground hidden sm:block">StaxMap</h1>
        </Link>
        <div className="flex items-center gap-4">
           <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="https://www.buymeacoffee.com/your-username" target="_blank">
              <Coffee className="mr-2 h-4 w-4" />
              Buy Me a Coffee
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
