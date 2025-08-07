
"use client";

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Region, Topic } from '@/types/lexigen';

interface DraggableTopicItemProps {
  topic: Topic;
  region?: Region;
  topicDotColor?: string;
}

const TOPIC_LABEL_OFFSET_Y = 18;
const TOPIC_DOT_RADIUS = 6;

export function DraggableTopicItem({
  topic,
  region,
  topicDotColor,
}: DraggableTopicItemProps) {

  const dotFillColor = topicDotColor || 'hsl(var(--primary))';

  return (
      <g className="group">
        <TooltipProvider>
            <Tooltip>
            <TooltipTrigger asChild>
                <g className="cursor-grab active:cursor-grabbing">
                <circle r={TOPIC_DOT_RADIUS * 1.5} fill={dotFillColor} style={{ filter: 'url(#glow)' }} opacity="0.5" />
                <circle r={TOPIC_DOT_RADIUS} fill={dotFillColor} stroke="hsl(var(--background))" strokeWidth="1.5" />
                <circle r={TOPIC_DOT_RADIUS / 2} fill={region?.color.startsWith('hsl(0, 0%, 20%)') || region?.color.startsWith('hsla(0, 0%, 20%)') ? 'hsl(var(--background))' : 'hsl(var(--primary-foreground))'} />
                </g>
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-semibold">{topic.name}</p>
                <p className="text-sm text-muted-foreground">Region: {region?.name}</p>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <text
          x={0}
          y={TOPIC_LABEL_OFFSET_Y}
          textAnchor="middle"
          fontSize="10"
          fill={region?.textColor || "hsl(var(--foreground))"}
          className="font-medium select-none pointer-events-none"
        >
          {topic.name}
        </text>
      </g>
  );
}
