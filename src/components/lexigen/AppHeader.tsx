import { BrainCircuit } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <BrainCircuit className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-semibold text-foreground">StaxMap</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
