
"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as React from 'react';

export function Sidebar({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) {
    return (
        <Card className={cn("h-full w-full overflow-y-auto hidden md:block", className)}>
            {children}
        </Card>
    );
}
