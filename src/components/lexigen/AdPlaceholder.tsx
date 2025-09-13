
"use client";

import { Card } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export function AdPlaceholder() {
  return (
    <Card className="w-full flex items-center justify-center h-24 bg-muted/30 border-dashed my-6">
      <div className="text-center text-muted-foreground">
        <Megaphone className="h-6 w-6 mx-auto mb-1" />
        <p className="text-sm font-semibold">Advertisement</p>
      </div>
    </Card>
  );
}
