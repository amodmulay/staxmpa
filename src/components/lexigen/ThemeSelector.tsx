
"use client";

import type * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ThemeDefinition } from '@/types/lexigen';
import { Label } from '@/components/ui/label';
import { Paintbrush } from 'lucide-react';

interface ThemeSelectorProps {
  themes: ThemeDefinition[];
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeSelector({ themes, selectedThemeId, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center text-sm font-medium">
        <Paintbrush className="mr-2 h-4 w-4" />
        Select Theme
      </Label>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant={selectedThemeId === theme.id ? 'default' : 'outline'}
            onClick={() => onSelectTheme(theme.id)}
            className="w-full justify-start text-left px-3 py-2 h-auto"
            size="sm"
          >
            {theme.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
