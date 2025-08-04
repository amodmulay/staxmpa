
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground hidden sm:block">StaxMap</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
