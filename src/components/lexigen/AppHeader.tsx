
import Link from 'next/link';
import { BrainCircuit, Eye } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground hidden sm:block">StaxMap</h1>
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
              <Link href="/radar">
                <Eye className="mr-2 h-4 w-4" />
                View Radar
              </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
